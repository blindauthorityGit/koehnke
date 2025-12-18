"use client";
import { useWatch } from "react-hook-form";
import CheckList from "../fields/checkList";
import TextField from "../fields/textField";

export default function StepInfectionTherapy() {
    const otherInf = useWatch({ name: "otherInfectiousDisease" });

    return (
        <div className="space-y-4">
            <CheckList
                title="Infektiöse Erkrankungen"
                items={[
                    { name: "hivAids", label: "HIV-Infektion / Stadium AIDS" },
                    { name: "hepatitisLiverDisease", label: "Lebererkrankung / Hepatitis" },
                    { name: "tuberculosis", label: "Tuberkulose" },
                    { name: "otherInfectiousDisease", label: "Andere Infektionskrankheiten" },
                ]}
            />

            {otherInf && (
                <div className="rounded-xl border border-black/10 p-4">
                    <TextField
                        name="otherInfectiousDiseaseText"
                        label="Andere Infektionskrankheiten – welche?*"
                        placeholder="Kurzbeschreibung"
                    />
                </div>
            )}

            <CheckList
                title="Therapien / Medikamente"
                items={[
                    { name: "bisphosphonates", label: "Nehmen Sie Bisphosphonate?" },
                    { name: "chemoTherapy", label: "Stehen Sie in medikamentöser Chemotherapie?" },
                    { name: "radiationTherapy", label: "Stehen Sie in Strahlentherapie bei Krebserkrankung?" },
                    {
                        name: "highDoseSteroidsOrImmunosuppressants",
                        label: "Nehmen Sie hoch dosierte Steroide / Immunsuppressiva?",
                    },
                ]}
            />
        </div>
    );
}
