export interface SaveDto {
    name: string;
    description: string;
    imageUrl: string;
}

export type SaveGameDto = {
  name: string;
  description: string;
  imageUrl: string;
  isNostalgia: boolean;
  isTrend: boolean;
  isSuggested: boolean;
  ProducedIn: string;
  genreId: number | undefined;
  companyId: number | undefined;
  characterIds: number[];
};
