'use client'

import { motion } from "framer-motion";
import { CategorySelector } from "../ui/categoory-selector";
import SearchLabel from "../ui/search-lable";
import { DataDto, SearchRequestDto } from "../types/game";
import { useEffect, useState } from "react";
import { useGame } from "../hooks/use-game";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";

const genreMap: Record<string, number> = {
    "Survival": 1,
    "Sports": 2,
    "Strategy": 3,
    "Open Word": 4,
    "Shooter": 5
};

export function FilterPage() {
    const [games, setGames] = useState<DataDto[]>([]);
    const { searchGames } = useGame();
    const [searchRequestDto, setSearchRequestDto] = useState<Partial<SearchRequestDto>>({});
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const router = useRouter();

    const handleGenreSelect = (genreName: string) => {
        setSearchRequestDto(prev => ({
            ...prev,
            genreId: genreMap[genreName] || undefined
        }));
        setHasSearched(true);
    };

    const handleGameNameChange = (gameName: string) => {
        setSearchRequestDto(prev => ({
            ...prev,
            gameName: gameName.trim() || undefined
        }));
        if (gameName.trim()) setHasSearched(true);
    };

    const handleCompanyNameChange = (companyName: string) => {
        setSearchRequestDto(prev => ({
            ...prev,
            companyName: companyName.trim() || undefined
        }));
        if (companyName.trim()) setHasSearched(true);
    };

    const handleGameClick = (gameId: number) => {
        router.push(`/components/${gameId.toString()}/game-information`);
    };

    const getActiveGenreName = () => {
        if (!searchRequestDto.genreId) return undefined;
        return Object.keys(genreMap).find(key => genreMap[key] === searchRequestDto.genreId);
    };

    useEffect(() => {
        const performSearch = async () => {
            if (searchRequestDto.gameName || searchRequestDto.companyName || searchRequestDto.genreId) {
                setLoading(true);
                try {
                    const results = await searchGames(searchRequestDto);
                    setGames(results || []);
                } catch (error) {
                    console.error("Search error:", error);
                    setGames([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        performSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
    searchRequestDto.gameName,
    searchRequestDto.companyName,
    searchRequestDto.genreId
    ]);
    
    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center p-5 bg-cyan-950/6 w-atue xl:w-[45%] xl:ml-[25vw] rounded-b-3xl xl:rounded-b-[6rem] shadow-lg/40 shadow-cyan-950/60"
                >
                <h6 className="text-2xl font-bold text-cyan-300 mb-2">
                            Find Your Perfect Game
                </h6>
                <CategorySelector 
                    items={["Survival", "Sports", "Strategy", "Open Word", "Shooter"]}
                    onSelect={handleGenreSelect}
                    selectedItem={getActiveGenreName()}
                />

                <div className="flex gap-17 p-2 pt-5">
                    <SearchLabel 
                        placeholder="Game name ..." 
                        value={searchRequestDto.gameName || ''}
                        onChange={handleGameNameChange}
                        className="flex-1"
                    />
                    <SearchLabel 
                        placeholder="Company name ..." 
                        value={searchRequestDto.companyName || ''}
                        onChange={handleCompanyNameChange}
                        className="flex-1"
                    />
                </div>
            </motion.div>
            <div className="container mx-auto px-4 py-8 mt-8">
                {loading ? (
                    <div className="flex flex-col justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                        <span className="mt-4 text-cyan-300">Searching games...</span>
                    </div>
                ) : hasSearched ? (
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                            <h6 className="text-xl font-bold text-cyan-300 mb-2 md:mb-0">
                                Search Results
                                {games.length > 0 && (
                                    <span className="text-cyan-400/70 text-sm font-normal ml-2">
                                        ({games.length} {games.length === 1 ? 'game' : 'games'} found)
                                    </span>
                                )}
                            </h6>
                        </div>

                        {games.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {games.map((game, index) => (
                                    <motion.div
                                        key={game.id}
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                                        onClick={() => handleGameClick(game.id)}
                                        className="cursor-pointer"
                                    >
                                        <Card
                                            title={game.name}
                                            description={game.description}
                                            imgSrc={game.imageUrl}
                                            imgAlt={game.name}
                                            variant="outlined"
                                            size="md"
                                            className="h-full hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <div className="text-cyan-400/50 text-6xl mb-4">🎮</div>
                                <h4 className="text-xl text-cyan-300 mb-2">No Games Found</h4>
                                <p className="text-cyan-400/70 mb-6">
                                    Try adjusting your search filters or try different keywords
                                </p>
                            </motion.div>
                        )}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-cyan-400/50 text-6xl mb-4">🔍</div>
                        <h4 className="text-xl text-cyan-300 mb-2">Start Your Search</h4>
                        <p className="text-cyan-400/70 max-w-md mx-auto mb-6">
                            Use the filters above to discover games by name, company, or select a genre category
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    )
}