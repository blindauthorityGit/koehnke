import { useEffect, useId, useRef, useState } from "react";

export default function FaqItem({ question, answer, defaultOpen = false }) {
    const [open, setOpen] = useState(defaultOpen);
    const [height, setHeight] = useState(0);
    const contentId = useId();
    const innerRef = useRef(null);

    // Höhe messen für smooth height animation
    useEffect(() => {
        if (!innerRef.current) return;

        const el = innerRef.current;
        const measure = () => setHeight(el.scrollHeight);

        measure();

        // Falls Fonts/Resize noch nachladen -> nachziehen
        const ro = new ResizeObserver(measure);
        ro.observe(el);

        return () => ro.disconnect();
    }, []);

    return (
        <div className="border-b border-primary-900/10 last:border-b-0">
            {/* Header Row */}
            <button
                type="button"
                className="
                    w-full flex items-center justify-between gap-6
                    px-8 md:px-12 py-6 
                    text-left
                    bg-white
                    hover:bg-[#e3eff9]
                    transition-colors
                "
                aria-expanded={open}
                aria-controls={contentId}
                onClick={() => setOpen((v) => !v)}
            >
                <span className="text-[15px] md:text-lg font-semibold text-primary-900">{question}</span>

                {/* Chevron */}
                <span
                    className={`
                        shrink-0
                        h-10 w-10 rounded-full
                        grid place-items-center
                        transition-transform duration-300
                        ${open ? "rotate-180" : "rotate-0"}
                    `}
                    aria-hidden="true"
                >
                    {/* kleines, sauberes chevron (SVG) */}
                    <svg width="18" height="18" viewBox="0 0 24 24" className="text-[#0b2c1a]">
                        <path
                            d="M6 15l6-6 6 6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </button>

            {/* Animated Content */}
            <div
                id={contentId}
                className="overflow-hidden bg-[#eef6fc]"
                style={{
                    height: open ? height : 0,
                    transition: "height 320ms cubic-bezier(0.16, 0.6, 0.25, 1)",
                }}
            >
                <div
                    ref={innerRef}
                    className={`
                         md:px-10 py-6
                        text-[14.5px] md:text-[15.5px]
                        leading-relaxed tracking-wide px-8
                        text-delft
                        transition-opacity duration-300
                        ${open ? "opacity-100" : "opacity-0"}
                    `}
                >
                    {answer}
                </div>
            </div>
        </div>
    );
}
