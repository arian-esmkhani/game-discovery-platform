export interface SearchDataDto {
    id: number;
    name: string;
}

export interface PageableData {
    content: SearchDataDto[];
    pageable: any;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number;
    sort: any;
    numberOfElements: number;
    empty: boolean;
}

export interface PaginationInfo {
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
    totalElements: number;
    totalPages: number;
}

export interface SearchResponse {
    searchDataDto: PageableData;
    paginationInfo: PaginationInfo;
}

export interface GameResponseDto {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  isNostalgia: boolean;
  isTrend: boolean;
  isSuggested: boolean;
  producedIn: string;
  genre: SearchDataDto;
  company: SearchDataDto;
  characters: SearchDataDto[];
}

export interface UpdateResponseDto {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}
