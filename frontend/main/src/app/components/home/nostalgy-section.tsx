'use client'

import { motion } from "framer-motion"
import { InfiniteSlider } from "../../ui/carousel"
import { useGame } from "@/app/hooks/use-game";
import { useEffect, useMemo, useState } from "react";
import { DataDto } from "@/app/types/game";
import { useRouter } from "next/navigation";

export function NostalgySection() {
    const  { findAllNostalgiaGames } = useGame();
    const [nostalgiaGame, setNostalgiaGame] = useState<DataDto[]>([]);
    const [hasData, setHasData] = useState(false); 
    const router = useRouter();

    useEffect(() => {
            const fetchGames = async () => {
                const data = await findAllNostalgiaGames();
                if (data && data.length > 0) {
                    setNostalgiaGame(data);
                    setHasData(true);
                } else {
                    setHasData(false);
                }
            };
                
            const timeoutId = setTimeout(() => {
                fetchGames();
            }, 3000);
            
            return () => {
                clearTimeout(timeoutId);
            };
    }, [findAllNostalgiaGames])

    const nostalgiaGameCardItems = useMemo(() => {
                return nostalgiaGame.map((game) => ({
                    imgSrc: game.imageUrl,
                    imgAlt: game.name,
                    title: game.name,
                    className: "rounded-4xl",
                    size: "lg" as const,
                    onClick: () => router.push(`/components/${game.id.toString()}/game-information`),
                    gameData: game,
                }));
    }, [nostalgiaGame, router]); 

    if (!hasData) {
        return (
            <div className="flex justify-center items-center h-[600px]">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

return(
    <div className="w-full mx-auto bg-emerald-950/10">
        <motion.section
        initial={{ opacity: 0, y: 65 , scale: 0.85}}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="py-3"> 
            <div className="bg-linear-to-r from-cyan-800/30 via-cyan-900/20 to-black rounded-2xl p-6 mx-4 shadow-2xl shadow-cyan-500/10 border border-cyan-700/30">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-2xl font-bold bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                        Favorite Characters
                    </h4>
                    <span className="text-sm text-cyan-400/70 font-medium">Swipe to explore →</span>
                </div>
                <InfiniteSlider 
                    items={nostalgiaGameCardItems} 
                    className="w-full max-w-[85vw] mx-auto"
                />
            </div>
        </motion.section>
    </div>
)}