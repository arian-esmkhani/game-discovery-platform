import { ApiResponse } from "../type/api-response.type";
import { SaveDto } from "../type/save.type";
import { SearchRequestDto } from "../type/search-request.type";
import { SearchResponse, UpdateResponseDto } from "../type/search-response.type";

export const companyService = {
  async saveCompany(saveCompanyDto: SaveDto) {
    const response = await fetch(`/api/company/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(saveCompanyDto)
    });
    if (!response.ok) throw new Error('Failed to save');
    return response.json() as Promise<ApiResponse<void>>;
  },

  async searchCompany(searchRequest: SearchRequestDto) {
    const response = await fetch(`/api/company/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(searchRequest)
    });
    if (!response.ok) throw new Error('Failed to get company');
    return response.json() as Promise<ApiResponse<SearchResponse>>;
  },

  async deleteCompany(companyId: number) {
    const response = await fetch(`/api/company/${companyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to delete company');
    return response.json() as Promise<ApiResponse<void>>;
  },

  async getCompanyById(companyId: number) {
    const response = await fetch(`/api/company/getById/${companyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if (!response.ok) throw new Error('Failed to get company by id');
    return response.json() as Promise<ApiResponse<UpdateResponseDto>>;
  },

  async updateCompany(companyId: number, updateCompanyDto: SaveDto) {
    const response = await fetch(`/api/company/update/${companyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateCompanyDto)
    });
    if (!response.ok) throw new Error('Failed to update company');
    return response.json() as Promise<ApiResponse<void>>;
  },
}
