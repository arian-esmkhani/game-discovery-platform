import { cn } from "../lib/utils";


export interface LinkProps {
    className?: string
}

export function Links({className}:LinkProps) {
    return(
        <div className={cn('text-center space-y-6 max-w-2xl', [className])}>
            <h5 className="text-lg font-light text-gray-300 tracking-wide">Trusted Sources</h5>
            <span className="grid grid-cols-3 gap-6 text-sm">
                {[
                    { name: "VGDL", href: "https://vgdl.ir/" },
                    { name: "Par30 Games", href: "https://par30games.net" },
                    { name: "GameUp", href: "https://gameup.ir/" },
                    { name: "Downloadha", href: "https://www.downloadha.com" },
                    { name: "Gold Team", href: "https://gold-team.org/" },
                    { name: "Magbaazi", href: "https://www.magbaazi.ir/" }
                ].map((source, index) => (
                    <a
                        key={index}
                        href={source.href}
                        className="group relative py-3 px-4 rounded-lg border border-gray-800 hover:border-cyan-400/30 transition-all duration-300 hover:bg-cyan-400/5"
                    >
                <span className="text-gray-400 group-hover:text-cyan-300 transition-colors duration-300">
                    {source.name}
                </span>
                    <div className="absolute inset-0 rounded-lg bg-linear-to-r from-cyan-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </a>
                ))}
            </span>
        </div>
    )
}