import { ApiResponse } from "../type/api-response.type";
import { SaveDto } from "../type/save.type";
import { SearchRequestDto } from "../type/search-request.type";
import { SearchResponse, UpdateResponseDto } from "../type/search-response.type";

export const genreService = {
  async saveGenr(saveGenrDto: SaveDto) {
    const response = await fetch(`/api/genre/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(saveGenrDto)
    });
    if (!response.ok) throw new Error('Failed to save');
    return response.json() as Promise<ApiResponse<void>>;
  },

  async searchGerne(searchRequest: SearchRequestDto) {
    const response = await fetch(`/api/genre/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(searchRequest)
    });
    if (!response.ok) throw new Error('Failed to get gerne');
    return response.json() as Promise<ApiResponse<SearchResponse>>;
  },

  async deleteGenre(genreId: number) {
    const response = await fetch(`/api/genre/${genreId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to delete genre');
    return response.json() as Promise<ApiResponse<void>>;
  },

  async getGenreById(genreId: number) {
    const response = await fetch(`/api/genre/getById/${genreId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to get genre by id');
    return response.json() as Promise<ApiResponse<UpdateResponseDto>>;
  },

  async updateGenre(genreId: number, updateGenreDto: SaveDto) {
    const response = await fetch(`/api/genre/update/${genreId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateGenreDto)
    });
    if (!response.ok) throw new Error('Failed to update genre');
    return response.json() as Promise<ApiResponse<void>>;
  },
}
