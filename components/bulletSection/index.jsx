import { H2 } from "@/typography/headlines";

export default function BulletSection({ title, items = [], className = "" }) {
    if (!items?.length) return null;

    return (
        <section className={`py-10 md:py-14 ${className}`}>
            <div className="mx-auto max-w-5xl px-4 md:px-6 lg:px-8">
                {title ? <H2 className="text-delft font-thin text-3xl sm:text-4xl md:text-5xl">{title}</H2> : null}

                <ul className="mt-8 space-y-4">
                    {items.map((it, idx) => (
                        <li key={it?._key || idx} className="flex gap-3 text-delft tracking-wide leading-relaxed">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-700" />
                            <span className="text-base md:text-lg">{it?.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
