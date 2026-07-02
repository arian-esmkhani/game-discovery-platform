import { ApiResponse } from "../type/api-response.type";
import { SearchRequestDto } from "../type/search-request.type";
import { GameResponseDto, SearchResponse } from "../type/search-response.type";
import { Game } from "../type/models.type";
import { SaveGameDto } from "../type/save.type";

export const gameService = {
  async saveGame(saveGameDto: SaveGameDto) {
    const response = await fetch(`/api/game/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(saveGameDto)
    });
    if (!response.ok) throw new Error('Failed to save game');
    return response.json() as Promise<ApiResponse<void>>;
  },

  async searchGames(searchRequest: SearchRequestDto) {
    const response = await fetch(`/api/game/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(searchRequest)
    });
    if (!response.ok) throw new Error('Failed to get games');
    return response.json() as Promise<ApiResponse<SearchResponse>>;
  },

  async deleteGame(gameId: number) {
    const response = await fetch(`/api/game/${gameId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to delete game');
    return response.json() as Promise<ApiResponse<void>>;
  },

  async getGameById(gameId: number) {
    const response = await fetch(`/api/game/getById/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to get game by id');
    return response.json() as Promise<ApiResponse<GameResponseDto>>;
  },

  async updateGame(gameId: number, updateGameDto: SaveGameDto) {
    const response = await fetch(`/api/game/update/${gameId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateGameDto)
    });
    if (!response.ok) throw new Error('Failed to update game');
    return response.json() as Promise<ApiResponse<void>>;
  },
}
