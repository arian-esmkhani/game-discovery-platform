export interface GameForTrandSliderDto{
    id: number;
    name: string;
    imageUrl: string;
    description: string;
}

export interface DataDto{
    id: number;
    name: string;
    imageUrl: string;
    description: string;
}

export interface GameDataDto{
    id: number;
    name: string;
    description: string;    
    imageUrl: string;
    producedIn: string;
    companyName: string;
    genreName: string;
}

export interface GameDataResponseDto{
    dataDto: DataDto[];
    gameDataDto: GameDataDto;
}

export interface SearchRequestDto{
    gameName?: string;
    companyName?: string;
    genreId?: number;
}