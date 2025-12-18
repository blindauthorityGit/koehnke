"use client";
import { useWatch } from "react-hook-form";
import CheckList from "../fields/checkList";
import TextField from "../fields/textField";
import CheckboxField from "../fields/checkboxField";

export default function StepWishes() {
    const wantsConsultation = useWatch({ name: "wantsConsultation" });
    const sourceOther = useWatch({ name: "sourceOther" });

    return (
        <div className="space-y-4">
            <div className="rounded-xl border border-black/10 p-4 space-y-3">
                <CheckboxField name="wantsConsultation" label="Wünschen Sie eine gezielte Beratung?" />
                {wantsConsultation && (
                    <div className="mt-2">
                        <CheckList
                            title="Welche Themen?"
                            items={[
                                { name: "consultationImplants", label: "Implantate" },
                                { name: "consultationBleaching", label: "Bleaching / Zahnaufhellung" },
                                { name: "consultationCeramicGoldInlay", label: "Keramik- bzw. Goldinlay" },
                                { name: "consultationAmalgamReplacement", label: "Amalgamaustausch" },
                                { name: "consultationRootCanal", label: "Wurzelkanalbehandlung" },
                                {
                                    name: "consultationProstheticsCrownsBridges",
                                    label: "Prothetische Versorgung (Kronen/Brücken)",
                                },
                                { name: "consultationOrthodontics", label: "Kieferorthopädie" },
                            ]}
                        />
                    </div>
                )}
            </div>

            <CheckList
                title="Wie sind Sie auf uns aufmerksam geworden?"
                items={[
                    { name: "sourceRecommendation", label: "Empfehlung" },
                    { name: "sourceInternet", label: "Internet" },
                    { name: "sourcePhoneBook", label: "Telefonbuch" },
                    { name: "sourceOther", label: "Sonstiges" },
                ]}
            />

            {sourceOther && (
                <div className="rounded-xl border border-black/10 p-4">
                    <TextField name="sourceOtherText" label="Sonstiges – bitte angeben (optional)" />
                </div>
            )}

            <div className="rounded-xl border border-black/10 p-4">
                <TextField name="usedSearchTerms" label="Welche Suchbegriffe haben Sie verwendet? (optional)" />
            </div>
        </div>
    );
}
