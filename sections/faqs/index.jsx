import FaqItem from "@/components/faqItem";

export default function FaqSection({ faqs = [] }) {
    if (!faqs?.length) return null;

    return (
        <section className="py-14 md:py-20">
            <div className="mx-auto container px-4 md:px-6 lg:px-8">
                {/* Outer rounded card (sehr hell) */}
                <div
                    className="
                        rounded-[44px]
                        bg-[#f6fbff]
                        p-7 md:p-10
                        shadow-[0_18px_55px_rgba(15,23,42,0.10)]
                    "
                >
                    {/* Inner panel (hellblau) */}
                    <div className="overflow-hidden rounded-2xl bg-[#e9f3fb]">
                        {faqs.map((item, idx) => (
                            <FaqItem
                                key={item._key || idx}
                                question={item.question}
                                answer={item.answer}
                                defaultOpen={idx === 0}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
