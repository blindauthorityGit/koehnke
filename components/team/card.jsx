// components/team/TeamMember.jsx
import Image from "next/image";

export default function TeamMember({ photo, name, role, teaser, alt }) {
    return (
        <div className="flex flex-col items-center text-center gap-4">
            <div className="relative h-44 w-44 md:h-56 md:w-56">
                {photo ? (
                    <Image
                        src={photo}
                        alt={alt || name}
                        fill
                        sizes="(max-width: 768px) 176px, 224px"
                        className="object-contain"
                    />
                ) : null}
            </div>

            <div className="space-y-2 max-w-xs md:max-w-sm">
                <div className="space-y-1">
                    <p className="text-lg md:text-xl font-semibold text-primary-900">{name}</p>
                    {role ? <p className="text-sm md:text-base text-delft/80">{role}</p> : null}
                </div>

                {teaser ? <p className="text-sm md:text-[15px] leading-relaxed text-primary-800/80">{teaser}</p> : null}
            </div>
        </div>
    );
}
