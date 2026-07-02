'use client'

import { motion } from "framer-motion"
import { InfiniteSlider } from "../../ui/carousel"
import { useGame } from "@/app/hooks/use-game";
import { DataDto } from "@/app/types/game";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export function LastSliderSection() {
        const  { findAllSurvivalGames } = useGame();
        const  { findAllShooterGames } = useGame();
        const  { findAllCompanies } = useGame();
        const [companies, setCompanies] = useState<DataDto[]>([]);
        const [survivalGames, setSurvivalGames] = useState<DataDto[]>([]);
        const [shooterGames, setShooterGames] = useState<DataDto[]>([]);
        const [hasData, setHasData] = useState(false);   
        const [hasData2, setHasData2] = useState(false);
        const [hasData3, setHasData3] = useState(false);
        const router = useRouter();
    
        useEffect(() => {
            const fetchGames = async () => {
                const data = await findAllCompanies();
                if (data && data.length > 0) {
                    setCompanies(data);
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
        }, [findAllCompanies]);
    
        useEffect(() => {
            const fetchGames = async () => {
                const data = await findAllSurvivalGames();
                if (data && data.length > 0) {
                    setSurvivalGames(data);
                    setHasData2(true);
                } else {
                    setHasData2(false);
                }
            };
                
            const timeoutId = setTimeout(() => {
                fetchGames();
            }, 3000);
            
            return () => {
                clearTimeout(timeoutId);
            };
        }, [findAllSurvivalGames]);
    
        useEffect(() => {
            const fetchGames = async () => {
                const data = await findAllShooterGames();
                if (data && data.length > 0) {
                    setShooterGames(data);
                    setHasData3(true);
                } else {
                    setHasData3(false);
                }
            };
            const timeoutId = setTimeout(() => {
                fetchGames();
            }, 3000);
            
            return () => {
                clearTimeout(timeoutId);
            };
        }, [findAllShooterGames]);
    
        const companiesCardItems = useMemo(() => {
                return companies.map((companie) => ({
                    imgSrc: companie.imageUrl,
                    imgAlt: companie.name,
                    title: companie.name,
                    variant: "neutral" as const,
                    tone: "secondary" as const,
                    size: "sm" as const,
                    className: "rounded-4xl",
                    gameData: companie,
                }));
        }, [companies]); 
    
        const survivalGamesCardItems = useMemo(() => {
                return survivalGames.map((game) => ({
                    imgSrc: game.imageUrl,
                    imgAlt: game.name,
                    title: game.name,
                    variant: "outlined" as const,
                    className: "rounded-4xl",
                    gameData: game,
                    onClick: () => router.push(`/components/${game.id.toString()}/game-information`),
                }));
        }, [survivalGames, router]); 
    
        const shooterGamesCardItems = useMemo(() => {
                return shooterGames.map((game) => ({
                    imgSrc: game.imageUrl,
                    imgAlt: game.name,
                    title: game.name,
                    variant: "outlined" as const,
                    className: "rounded-4xl",
                    onClick: () => router.push(`/components/${game.id.toString()}/game-information`),
                    gameData: game,
                }));
        }, [shooterGames, router]);
    
        if (!hasData || !hasData2 || !hasData3) {
            return (
                <div className="flex justify-center items-center h-[600px]">
                    <div className="text-xl">Loading...</div>
                </div>
            );
        }

return(
    <motion.section
      initial={{ opacity: 0, y: 65 , scale: 0.85}}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      viewport={{ once: true }}
      className="space-y-8 py-3"> 
        <div className="bg-linear-to-r from-cyan-800/30 via-cyan-900/20 to-black rounded-2xl p-6 mx-4 shadow-2xl shadow-cyan-500/10 border border-cyan-700/30">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    Favorite Companies
                </h4>
                <span className="text-sm text-cyan-400/70 font-medium">Swipe to explore →</span>
            </div>
            <InfiniteSlider 
                items={companiesCardItems} 
                className="w-full max-w-[85vw] mx-auto"
            />
        </div>

        <div className="bg-linear-to-r from-cyan-800/30 via-cyan-900/20 to-black rounded-2xl p-6 mx-4 shadow-2xl shadow-cyan-500/10 border border-cyan-700/30">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    Survival Games
                </h4>
                <span className="text-sm text-cyan-400/70 font-medium">New releases</span>
            </div>
            <InfiniteSlider 
                items={survivalGamesCardItems} 
                className="w-full max-w-[90vw] mx-auto"
            />
        </div>

        <div className="bg-linear-to-r from-cyan-800/30 via-cyan-900/20 to-black rounded-2xl p-6 mx-4 shadow-2xl shadow-cyan-500/10 border border-cyan-700/30">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    Shooter Games
                </h4>
                <span className="text-sm text-cyan-400/70 font-medium">Most popular</span>
            </div>
            <InfiniteSlider 
                items={shooterGamesCardItems} 
                className="w-full max-w-[90vw] mx-auto"
            />
        </div>        
    </motion.section>
)}