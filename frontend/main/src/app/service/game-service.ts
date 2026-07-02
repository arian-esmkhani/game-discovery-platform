import { SearchRequestDto } from './../types/game';
import { ApiResponse } from "../types/api";
import { GameDataResponseDto, GameForTrandSliderDto, DataDto } from "../types/game";

export const gameService = {
  async findAllTrendGames() {
    const response = await fetch(`/api/slider/trend_game`, {
      method: 'GET'
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json() as Promise<ApiResponse<GameForTrandSliderDto[]>>;
  },

  async findAllNewGames() {
    const response = await fetch(`/api/slider/new-game`, {
      method: 'GET'
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json() as Promise<ApiResponse<DataDto[]>>;
  },

  async findAllSuggestedGames() {
    const response = await fetch(`/api/slider/suggested-game`, {
      method: 'GET'
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json() as Promise<ApiResponse<DataDto[]>>;
  },

  async findAllSurvivalGames() {
    const response = await fetch(`/api/slider/survival-game`, {
      method: 'GET'
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json() as Promise<ApiResponse<DataDto[]>>;
  },

  async findAllNostalgiaGames() {
    const response = await fetch(`/api/slider/nostalgia-game`, {
      method: 'GET'
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json() as Promise<ApiResponse<DataDto[]>>;
  },

  async findAllShooterGames() {
    const response = await fetch(`/api/slider/shooter-game`, {
      method: 'GET'
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json() as Promise<ApiResponse<DataDto[]>>;
  },

  async findAllCharacters() {
    const response = await fetch(`/api/slider/characters-slider`, {
      method: 'GET'
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json() as Promise<ApiResponse<DataDto[]>>;
  },

  async findAllCompanies() {
    const response = await fetch(`/api/slider/companies-slider`, {
      method: 'GET'
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json() as Promise<ApiResponse<DataDto[]>>;
  },

  async findGameById(gameId: number) {
    const response = await fetch(`/api/game/by/${gameId}`, {
      method: 'GET'
    })
    if (!response.ok) throw new Error('Failed to fetch instructors');
    return response.json() as Promise<ApiResponse<GameDataResponseDto>>;
  },

  async searchGames(searchRequestDto: SearchRequestDto) {
    const response = await fetch(`/api/game/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify(searchRequestDto),
    });
    if (!response.ok) throw new Error('Failed to save Order');
    return response.json() as Promise<ApiResponse<DataDto[]>>;
  },  
}