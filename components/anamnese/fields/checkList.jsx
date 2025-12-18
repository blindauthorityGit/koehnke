"use client";
import CheckboxField from "./checkboxField";

export default function CheckList({ title, items }) {
    return (
        <div className="space-y-3 rounded-xl border border-black/10 p-4">
            {title && <div className="text-sm font-medium">{title}</div>}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {items.map((it) => (
                    <CheckboxField key={it.name} name={it.name} label={it.label} />
                ))}
            </div>
        </div>
    );
}
