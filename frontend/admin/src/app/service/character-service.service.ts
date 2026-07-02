import { SearchRequestDto } from './../type/search-request.type';
import { ApiResponse } from "../type/api-response.type";
import { SaveDto } from "../type/save.type";
import { SearchResponse, UpdateResponseDto } from '../type/search-response.type';

export const characterService = {
  async saveCharacter(saveCharacterDto: SaveDto) {
    const response = await fetch(`/api/character/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(saveCharacterDto)
    });
    if (!response.ok) throw new Error('Failed to save');
    return response.json() as Promise<ApiResponse<void>>;
  },

  async searchCharacters(searchRequest: SearchRequestDto) {
    const response = await fetch(`/api/character/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(searchRequest)
    });
    if (!response.ok) throw new Error('Failed to get character');
    return response.json() as Promise<ApiResponse<SearchResponse>>;
  },

  async deleteCharacter(characterId: number) {
    const response = await fetch(`/api/character/${characterId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to delete character');
    return response.json() as Promise<ApiResponse<void>>;
  },

  async getCharacterById(characterId: number) {
    const response = await fetch(`/api/character/getById/${characterId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to get character by id');
    return response.json() as Promise<ApiResponse<UpdateResponseDto>>;
  },

  async updateCharacter(characterId: number, updateCharacterDto: SaveDto) {
    const response = await fetch(`/api/character/update/${characterId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateCharacterDto)
    });
    if (!response.ok) throw new Error('Failed to update character');
    return response.json() as Promise<ApiResponse<void>>;
  },
}
