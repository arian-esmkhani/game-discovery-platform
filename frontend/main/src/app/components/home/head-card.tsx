'use client'

import { Card, CardProps } from "@/app/ui/card";
import { InfiniteSlider } from "../../ui/carousel";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useGame } from "@/app/hooks/use-game";
import { GameForTrandSliderDto } from "@/app/types/game";
import { useRouter } from "next/navigation";

export function HeadCard() {
    const [games, setGames] = useState<GameForTrandSliderDto[]>([]);
    const [hasData, setHasData] = useState(false);
    const { loading, getGameForTrendSlider } = useGame();
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [hasDes, setHasDes] = useState(window.innerWidth >= 768);
    const router = useRouter();

    useEffect(() => {
        const handleResize = () => {
        if (window.innerWidth < 1280) {
            setHasDes(false);
        } else {
            setHasDes(true);
        }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchGames = async () => {
            const data = await getGameForTrendSlider();
            if (data && data.length > 0) {
                setGames(data);
                setHasData(true);
            } else {
                setHasData(true);
            }
        };
        
        fetchGames();
    }, [getGameForTrendSlider]);
    
    const cardItems = useMemo(() => {
        return games.map((game) => ({
            imgSrc: game.imageUrl,
            imgAlt: game.name,
            title: game.name,
            variant: "outlined" as const,
            tone: "secondary" as const,
            className: "rounded-4xl",
            onClick: () => router.push(`/components/${game.id.toString()}/game-information`),
            gameData: game,
        }));
    }, [games, router]);
    
    const handleActiveSlideChange = useCallback((activeSlide: CardProps & { gameData?: GameForTrandSliderDto }, index: number) => {
        setActiveSlideIndex(index);
    }, []);
    
    const activeGame = useMemo(() => {
        if (games.length === 0) return null;
        return games[activeSlideIndex];
    }, [games, activeSlideIndex]);
    
    if (!hasData && loading) {
        return (
            <div className="flex justify-center items-center h-[600px]">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }
    
    if (!activeGame || games.length === 0) {
        return null;
    }

    return(
        <Card
            as="section"
            imgSrc={activeGame.imageUrl}
            imgAlt={activeGame.name}
            imgHeight={1000}
            imgWidth={1300}
            size="xl"
            variant="elevated"
            tone="primary"
            className="rounded-b-[6rem]"
            imageChildren={
                <div>
                    <div className="mt-[2vh] text-slate-500">
                        <div className="w-[30%] md:w-[30%] lg:w-[40%] ml-[14vw] md:ml-[48vw]">
                            <span className="pl-7 text-2">Trend Games</span>
                            <InfiniteSlider 
                                items={cardItems}
                                showNavigation={false}           
                                autoplay={true}
                                onActiveSlideChange={handleActiveSlideChange}
                                showActiveCard={true}
                                align="center"
                                className="mt-2"
                            />
                        </div>
                    </div>            
                    <div className="ml-[3.4vw] w-290 bg-black/10">
                        <h2 className="text-1 md:text-7 xl:text-[1.2vw] font-semibold tracking-wide text-shadow-lg/90 bg-linear-to-r from-rose-800 to-rose-600 bg-clip-text text-transparent">
                            {activeGame.name}
                        </h2>
                        {hasDes &&
                            <span className="text-[0.9vw] font-stretch-expanded tracking-tight text-shadow-lg/90 whitespace-pre-wrap break-word text-slate-500 ">
                                {activeGame.description}
                            </span>
                        }
                    </div>
                </div>        
            }
        />
    );
}