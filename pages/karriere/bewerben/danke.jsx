// pages/bewerben/danke.jsx
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function BewerbungDanke() {
    const router = useRouter();
    const { id } = router.query;

    return (
        <>
            <Head>
                <title>Vielen Dank für Ihre Bewerbung</title>
                <meta name="robots" content="noindex,nofollow" />
            </Head>

            <main className="mx-auto max-w-xl px-4 py-20 text-center">
                <h1 className="text-3xl font-semibold text-slate-900">Vielen Dank für Ihre Bewerbung</h1>

                <p className="mt-6 text-base text-slate-600">
                    Wir haben Ihre Bewerbung erhalten und melden uns so bald wie möglich bei Ihnen.
                </p>

                {id ? <p className="mt-4 text-xs text-slate-400">Referenz-ID: {id}</p> : null}

                <div className="mt-10">
                    <Link
                        href="/"
                        className="inline-flex rounded-xl bg-slate-900 px-6 py-3 text-sm font-medium text-white"
                    >
                        Zur Startseite
                    </Link>
                </div>
            </main>
        </>
    );
}
