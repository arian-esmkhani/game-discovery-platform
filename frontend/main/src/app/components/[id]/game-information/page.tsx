"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { InfiniteSlider } from "../../../ui/carousel"
import { Links } from "../.././links"
import { useGame } from "@/app/hooks/use-game"
import { GameDataResponseDto, DataDto, SearchRequestDto } from "@/app/types/game"
import { useParams } from "next/navigation"
import { CategorySelector } from "@/app/ui/categoory-selector"

const genreMap: Record<string, number> = {
    "Survival": 1,
    "Sports": 2,
    "Strategy": 3,
    "Open Word": 4,
    "Shooter": 5
};

export default function Page() {
    const [showContent, setShowContent] = useState(false);
    const [showContent2, setShowContent2] = useState(false);
    const { findGameById } = useGame()
    const [game, setGame] = useState<GameDataResponseDto | null>(null)
    const [hasData, setHasData] = useState(false);
    const params = useParams<{ id: string }>()
    const [searchedGames, setGames] = useState<DataDto[]>([]);
    const { searchGames } = useGame();
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [searchRequestDto, setSearchRequestDto] = useState<Partial<SearchRequestDto>>({});

    useEffect(() => {
        const fetchGame = async () => {
            if (!params?.id) return
            
            try {
                const gameId = Number(params.id)
                const gameData = await findGameById(gameId)
                setGame(gameData)
                setInitialLoadComplete(true);
            } catch (error) {
                console.error("Error fetching game:", error)
            } finally {
                setHasData(true)
            }
        }

        fetchGame()
    }, [params?.id, findGameById])

    useEffect(() => {
        if (initialLoadComplete && game?.gameDataDto.genreName && !searchRequestDto.genreId) {
            const genreId = genreMap[game.gameDataDto.genreName];
            if (genreId) {
                setSearchRequestDto(prev => ({
                    ...prev,
                    genreId: genreId
                }));
            }
        }
    }, [initialLoadComplete, game, searchRequestDto.genreId]);

    const handleGenreSelect = (genreName: string) => {
        const currentGenreId = searchRequestDto.genreId;
        const clickedGenreId = genreMap[genreName];
        const isCurrentlySelected = currentGenreId === clickedGenreId;
        
        if (isCurrentlySelected) {
            setSearchRequestDto(prev => ({
                ...prev,
                genreId: undefined
            }));
        } else {
            if (clickedGenreId) {
                setSearchRequestDto(prev => ({
                    ...prev,
                    genreId: clickedGenreId
                }));
            }
        }
    };

    const getActiveGenreName = () => {
        if (!searchRequestDto.genreId) {
            return game?.gameDataDto.genreName;
        }
        
        return Object.keys(genreMap).find(key => genreMap[key] === searchRequestDto.genreId);
    };

        useEffect(() => {
        const performSearch = async () => {
            try {
                if (searchRequestDto.genreId) {
                    const results = await searchGames(searchRequestDto);
                    setGames(results || []);
                } else {
                    setGames([]);
                }
            } catch (error) {
                console.error("Search error:", error);
                setGames([]);
            }
        };

        if (initialLoadComplete && searchRequestDto.genreId !== undefined) {
            const timeoutId = setTimeout(() => {
                performSearch();
            }, 50);
            
            return () => clearTimeout(timeoutId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchRequestDto.genreId, initialLoadComplete]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50 && !showContent) {
                setShowContent(true);
            }
            if (window.scrollY > 205 && !showContent2) {
                setShowContent2(true);
            }
        };
        
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [showContent, showContent2]);

    const characterCardItems = useMemo(() => {
                return game?.dataDto.map((character) => ({
                    imgSrc: character.imageUrl,
                    imgAlt: character.name,
                    title: character.name,
                    variant: "neutral" as const,
                    tone: "secondary" as const,
                    size: "sm" as const,
                    className: "rounded-4xl",
                    gameData: character,
                }));
    }, [game]);

    const GenreGameCardItems = useMemo(() => {
                return searchedGames.map((game) => ({
                    imgSrc: game.imageUrl,
                    imgAlt: game.name,
                    title: game.name,
                    variant: "neutral" as const,
                    tone: "secondary" as const,
                    size: "sm" as const,
                    className: "rounded-4xl",
                    gameData: game,
                }));
    }, [searchedGames]);

  return (
    <main className="bg-linear-to-b from-gray-900 to-black text-white min-h-screen py-[0.7vw]">
       <section className="w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8">
            <Image
                src={game?.gameDataDto?.imageUrl ?? "/Copilot_20251202_110322.WebP"}
                alt={game?.gameDataDto?.name ?? "No name"}
                width={2000}
                height={500}
                className="w-full h-74 lg:h-[30vw] object-cover brightness-72"
            />
            <div className="absolute top-0 left-0 w-full h-[10vw] bg-linear-to-b from-black to-transparent "></div>
            <div className="absolute bottom-0 left-0 w-full h-[12vw] bg-linear-to-t from-black to-transparent"></div>
            </div>

            {!showContent && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                className="flex justify-center items-center h-[20vh] text-cyan-300 text-2xl font-extrabold tracking-wide"
            >
                Scroll Down to Discover
            </motion.div>
            )}

            {showContent && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2 }}
                className="gap-[3vw] flex flex-col lg:flex-row justify-around"
            >
                <div className="ml-[19vw]">
                <h5 className="text-xl lg:text-[1.64vw] font-bold bg-linear-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2">
                    {game?.gameDataDto.name}
                </h5>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                    <span>{game?.gameDataDto.producedIn}</span>
                    <span className="text-gray-400">|</span>
                    <span>{game?.gameDataDto.companyName}</span>
                    <span className="text-gray-400">|</span>
                    <span className="bg-cyan-500/10 text-cyan-300 px-3 py-1.5 rounded-lg text-sm">
                    {game?.gameDataDto.genreName}
                    </span>
                </div>
                </div>
                
                <div className="p-[10vw]">
                <h5 className="text-xl font-semibold mb-3 text-cyan-300 flex items-center gap-2">
                    About the Game
                </h5>
                <p className="text-gray-300 leading-relaxed text-justify">
                    {game?.gameDataDto.description}
                </p>
                </div>
            </motion.div>
            )}
       </section>
        {showContent2 && (
        <motion.section
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 3 }}
            className="space-y-16 px-8 py-16"
        >
            <div className="space-y-6">
                <div className="flex items-end justify-between border-b border-gray-700 pb-4">
                    <h4 className="text-2xl font-light tracking-tight bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Game Characters
                    </h4>
                </div>
                <InfiniteSlider 
                    items={characterCardItems!} 
                    className="w-full md:w-[65%] md:ml-[18vw]"
                />
            </div>

            <div className="flex justify-center py-8">
                <div className="text-center space-y-6 max-w-2xl">
                    <Links className=""/>
                </div>
            </div>

            <CategorySelector 
                items={["Survival", "Sports", "Strategy", "Open Word", "Shooter"]}
                onSelect={handleGenreSelect}
                selectedItem={getActiveGenreName()}
                className="pl-1 md:pl-[25vw] lg:pl-[35vw]"
            />
        
            <div className="space-y-6 pt-8">
                <div className="flex items-end justify-between border-b border-gray-700 pb-4">
                    <h4 className="text-2xl font-light tracking-tight bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Latest on selected genre
                    </h4>
                    <span className="text-sm text-gray-500 mb-1">New releases</span>
                </div>
                <InfiniteSlider 
                    items={GenreGameCardItems} 
                    className="w-full"
                />
            </div>
        </motion.section>
        )}
    <div style={{ height: "50vh" }}></div>
    </main>
  )
}