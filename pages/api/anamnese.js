import { db, FieldValue, storage } from "@/libs/firebase/admin";
import { anamnesisSchema } from "@/libs/anamnese/schema";
import { createAnamnesePdfBuffer } from "@/libs/anamnese/pdf";
import { buildAnamneseEmailHtml, sendAnamneseEmail } from "@/libs/anamnese/email";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ ok: false });

    console.log("BUCKET ENV:", process.env.FIREBASE_STORAGE_BUCKET);

    try {
        const data = anamnesisSchema.parse(req.body);

        // 1) Firestore create (erstmal ohne pdfUrl)
        const baseDoc = {
            ...data,
            status: "submitted",
            createdAt: FieldValue.serverTimestamp(),
            updatedAt: FieldValue.serverTimestamp(),
        };

        const ref = await db.collection("anamnesen").add(baseDoc);
        const id = ref.id;

        // 2) PDF generieren
        const pdfBuffer = await createAnamnesePdfBuffer(data, { docId: id });

        // 3) PDF in Storage hochladen
        const bucket = storage.bucket();
        const filePath = `anamnesen/${id}/anamnese-${id}.pdf`;
        const file = bucket.file(filePath);

        await file.save(pdfBuffer, {
            contentType: "application/pdf",
            resumable: false,
            metadata: {
                cacheControl: "private, max-age=0, no-store",
            },
        });

        // Signierte URL (Download) – 7 Tage z.B.
        const [pdfUrl] = await file.getSignedUrl({
            action: "read",
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        });

        // 4) Firestore Update mit pdfUrl
        await ref.set({ pdfUrl, updatedAt: FieldValue.serverTimestamp() }, { merge: true });

        // 5) Email schicken (HTML + PDF als Attachment optional)
        const to = process.env.ANAMNESE_TO;
        if (!to) throw new Error("Missing ANAMNESE_TO env var");

        const subject = `Online-Anamnese: ${data.lastName || ""} ${data.firstName || ""} (${id})`.trim();
        const html = buildAnamneseEmailHtml(data, { docId: id, pdfUrl });

        await sendAnamneseEmail({
            to,
            subject,
            html,
            attachments: [
                {
                    filename: `anamnese-${id}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        });

        return res.status(200).json({ ok: true, id, pdfUrl });
    } catch (e) {
        console.error("ANAMNESE API ERROR:", e?.message || e);
        return res.status(400).json({ ok: false, error: "BAD_REQUEST" });
    }
}
