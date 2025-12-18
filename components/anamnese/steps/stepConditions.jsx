"use client";
import { useWatch } from "react-hook-form";
import CheckList from "../fields/checkList";
import TextField from "../fields/textField";

export default function StepConditions() {
    const otherDiseases = useWatch({ name: "otherDiseases" });

    return (
        <div className="space-y-4">
            <CheckList
                title="Herz / Kreislauf / Blut"
                items={[
                    { name: "highBloodPressure", label: "Hoher Blutdruck" },
                    { name: "lowBloodPressure", label: "Niedriger Blutdruck" },
                    { name: "heartValveDefect", label: "Herzklappenfehler" },
                    { name: "heartValveReplacement", label: "Herzklappenersatz" },
                    { name: "pacemaker", label: "Herzschrittmacher" },
                    { name: "endocarditis", label: "Endokarditis" },
                    { name: "heartSurgery", label: "Herzoperation" },
                    { name: "severeNeutropenia", label: "Hochgradige Neutropenie" },
                    { name: "coagulationDisorders", label: "Blutgerinnungsstörungen" },
                ]}
            />

            <CheckList
                title="Transplantationen"
                items={[
                    { name: "organTransplant", label: "Organtransplantiert" },
                    { name: "stemCellTransplant", label: "Stammzellentransplantiert" },
                ]}
            />

            <CheckList
                title="Weitere Erkrankungen"
                items={[
                    { name: "asthmaOrLungDisease", label: "Asthma / Lungenerkrankung" },
                    { name: "diabetes", label: "Diabetes / Zuckerkrankheit" },
                    { name: "thyroidDisease", label: "Schilddrüsenerkrankung" },
                    { name: "epilepsy", label: "Anfallsleiden (Epilepsie)" },
                    { name: "nervousSystemDisease", label: "Nervenerkrankung" },
                    { name: "faintingSpells", label: "Ohnmachtsanfälle" },
                    { name: "rheumaArthritis", label: "Rheuma / Arthritis" },
                    { name: "osteoporosis", label: "Osteoporose-Erkrankung" },
                    { name: "kidneyDisease", label: "Nierenerkrankungen" },
                    { name: "cysticFibrosis", label: "Mukoviszidose-Erkrankung" },
                    { name: "drugDependency", label: "Drogenabhängigkeit" },
                    { name: "smoker", label: "Raucher" },
                    { name: "otherDiseases", label: "Sonstige Erkrankungen" },
                ]}
            />

            {otherDiseases && (
                <div className="rounded-xl border border-black/10 p-4">
                    <TextField
                        name="otherDiseasesText"
                        label="Sonstige Erkrankungen – bitte kurz angeben*"
                        placeholder="Kurzbeschreibung"
                    />
                </div>
            )}
        </div>
    );
}
