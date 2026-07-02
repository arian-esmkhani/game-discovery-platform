export interface Genre {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  games?: Game[];
}

export interface Company {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  games?: Game[];
}

export interface Character {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
  games?: Game[];
}

export interface Game {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  isNostalgia: boolean;
  isTrend: boolean;
  isSuggested: boolean;
  producedIn: string;
  genre: Genre;
  company: Company;
  characters: Character[];
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}
