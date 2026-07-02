import { useCallback, useState } from "react";
import { gameService } from "../service/game-service";
import { SearchRequestDto } from "../types/game";

export const useGame = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);  

    const getGameForTrendSlider = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await gameService.findAllTrendGames();
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const findAllNewGames = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await gameService.findAllNewGames();
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const findAllSuggestedGames = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await gameService.findAllSuggestedGames();
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const findAllSurvivalGames = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await gameService.findAllSurvivalGames();
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const findAllNostalgiaGames = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await gameService.findAllNostalgiaGames();
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const findAllShooterGames = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await gameService.findAllShooterGames();
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const findAllCharacters = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await gameService.findAllCharacters();
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const findAllCompanies = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await gameService.findAllCompanies();
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const findGameById = useCallback(async (gameId: number) => {
        setLoading(true);
        setError(null);
        try {
            const result = await gameService.findGameById(gameId);
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const searchGames = useCallback(async (searchRequestDto: Partial<SearchRequestDto>) => {
        setLoading(true);
        setError(null);
        try {
            const fullDto: SearchRequestDto = {
                gameName: searchRequestDto.gameName || '',
                companyName: searchRequestDto.companyName || '',
                genreId: searchRequestDto.genreId || undefined
            };

            console.log("Searching with DTO:", fullDto);

            const result = await gameService.searchGames(fullDto)
            if (!result.success) throw new Error(result.message);
            return result.data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        getGameForTrendSlider,
        findAllNewGames,
        findAllSuggestedGames,
        findAllSurvivalGames,
        findAllNostalgiaGames,
        findAllShooterGames,
        findAllCompanies,
        findAllCharacters,
        findGameById,
        searchGames
    };
}