'use client'

import { useGame } from "@/app/hooks/use-game";
import { InfiniteSlider } from "../../ui/carousel"
import { useEffect, useMemo, useState } from "react";
import { DataDto } from "@/app/types/game";
import { useRouter } from "next/navigation";

export function FirstSliderSection() {
    const  { findAllNewGames } = useGame();
    const  { findAllSuggestedGames } = useGame();
    const  { findAllCharacters } = useGame();
    const [characters, setCharacters] = useState<DataDto[]>([]);
    const [newgames, setNewGames] = useState<DataDto[]>([]);
    const [suggestedgames, setSuggestedGames] = useState<DataDto[]>([]);
    const [hasData, setHasData] = useState(false);   
    const [hasData2, setHasData2] = useState(false);
    const [hasData3, setHasData3] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        const fetchGames = async () => {
            const data = await findAllCharacters();
            if (data && data.length > 0) {
                setCharacters(data);
                setHasData(true);
            } else {
                setHasData(false);
            }
        };
            
        fetchGames();
    }, [findAllCharacters]);

    useEffect(() => {
        const fetchGames = async () => {
            const data = await findAllNewGames();
            if (data && data.length > 0) {
                setNewGames(data);
                setHasData2(true);
            } else {
                setHasData2(false);
            }
        };
            
        fetchGames();
    }, [findAllNewGames]);

    useEffect(() => {
        const fetchGames = async () => {
            const data = await findAllSuggestedGames();
            if (data && data.length > 0) {
                setSuggestedGames(data);
                setHasData3(true);
            } else {
                setHasData3(false);
            }
        };

        const timeoutId = setTimeout(() => {
                fetchGames();
            }, 500);
            
            return () => {
                clearTimeout(timeoutId);
        };
    }, [findAllSuggestedGames]);

    const characterCardItems = useMemo(() => {
            return characters.map((character) => ({
                imgSrc: character.imageUrl,
                imgAlt: character.name,
                title: character.name,
                variant: "neutral" as const,
                tone: "secondary" as const,
                size: "sm" as const,
                className: "rounded-4xl",
                gameData: character,
            }));
    }, [characters]); 

    const newGamesCardItems = useMemo(() => {
            return newgames.map((game) => ({
                imgSrc: game.imageUrl,
                imgAlt: game.name,
                title: game.name,
                variant: "outlined" as const,
                className: "rounded-4xl",
                onClick: () => router.push(`/components/${game.id.toString()}/game-information`),
                gameData: game,
            }));
    }, [newgames, router]); 

    const suggestedGamesCardItems = useMemo(() => {
            return suggestedgames.map((game) => ({
                imgSrc: game.imageUrl,
                imgAlt: game.name,
                title: game.name,
                variant: "outlined" as const,
                className: "rounded-4xl",
                onClick: () => router.push(`/components/${game.id.toString()}/game-information`),
                gameData: game,
            }));
    }, [suggestedgames, router]);

    if (!hasData || !hasData2) {
        return (
            <div className="flex justify-center items-center h-[600px]">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

return(
    <section className="space-y-13 py-[10vw] md:py-[5.5vw] xl:py-[3.5vw]">
        <div className="bg-linear-to-r from-cyan-800/30 via-cyan-900/20 to-black rounded-2xl p-6 mx-4 shadow-2xl shadow-cyan-500/10 border border-cyan-700/30">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    Favorite Characters
                </h4>
                <span className="text-sm text-cyan-400/70 font-medium">Swipe to explore →</span>
            </div>
            <InfiniteSlider 
                items={characterCardItems} 
                className="w-full max-w-[85vw] mx-auto"
                slidesToShow={5}
            />
        </div>

        <div className="bg-linear-to-r from-cyan-800/30 via-cyan-900/20 to-black rounded-2xl p-6 mx-4 shadow-2xl shadow-cyan-500/10 border border-cyan-700/30">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    Latestest
                </h4>
                <span className="text-sm text-cyan-400/70 font-medium">New releases</span>
            </div>
            <InfiniteSlider 
                items={newGamesCardItems} 
                className="w-full max-w-[90vw] mx-auto"
            />
        </div>

        <div
        className="bg-linear-to-r from-cyan-800/30 via-cyan-900/20 to-black rounded-2xl p-6 mx-4 shadow-2xl shadow-cyan-500/10 border border-cyan-700/30">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                    Suggested Games
                </h4>
                <span className="text-sm text-cyan-400/70 font-medium">Most popular</span>
            </div>
            <InfiniteSlider 
                items={suggestedGamesCardItems} 
                className="w-full max-w-[90vw] mx-auto"
            />
        </div>        
    </section>
)}