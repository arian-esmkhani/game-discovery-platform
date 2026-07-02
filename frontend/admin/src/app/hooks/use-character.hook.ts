import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { SaveDto } from '../type/save.type';
import { ApiResponse } from '../type/api-response.type';
import { characterService } from '../service/character-service.service';
import { SearchRequestDto } from '../type/search-request.type';
import { SearchResponse, UpdateResponseDto } from '../type/search-response.type';
import { Character } from '../type/models.type';


@Injectable({
  providedIn: 'root'
})
export class CharacterHooks {
  private loading = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<string | null>(null);
  private searchResults = new BehaviorSubject<SearchResponse | null>(null)
  private currentCharacter = new BehaviorSubject<UpdateResponseDto | null>(null);


  loading$ = this.loading.asObservable();
  error$ = this.error.asObservable();
  searchResults$ = this.searchResults.asObservable();

  useSaveCharacter(): (saveCharacterDto: SaveDto) => Observable<ApiResponse<void>> {
    return (saveCharacterDto: SaveDto) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<void>>(observer => {
        characterService.saveCharacter(saveCharacterDto)
          .then(result => {
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to save character';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useSearchCharacters(): (searchRequest: SearchRequestDto) => Observable<ApiResponse<SearchResponse>> {
    return (searchRequest: SearchRequestDto) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<SearchResponse>>(observer => {
        characterService.searchCharacters(searchRequest)
          .then(result => {
            this.searchResults.next(result.data);
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to search characters';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useDeleteCharacter(): (characterId: number) => Observable<ApiResponse<void>> {
    return (characterId: number) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<void>>(observer => {
        characterService.deleteCharacter(characterId)
          .then(result => {
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to delete character';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useGetCharacterById(): (characterId: number) => Observable<ApiResponse<UpdateResponseDto>> {
    return (characterId: number) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<UpdateResponseDto>>(observer => {
        characterService.getCharacterById(characterId)
          .then(result => {
            this.currentCharacter.next(result.data);
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to get character by id';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useUpdateCharacter(): (characterId: number, updateCharacterDto: SaveDto) => Observable<ApiResponse<void>> {
    return (characterId: number, updateCharacterDto: SaveDto) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<void>>(observer => {
        characterService.updateCharacter(characterId, updateCharacterDto)
          .then(result => {
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to update character';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  clearError(): void {
    this.error.next(null);
  }

  clearSearchResults(): void {
    this.searchResults.next(null);
  }

  clearCurrentCharacter(): void {
    this.currentCharacter.next(null);
  }

  getCurrentSearchResults(): SearchResponse | null {
    return this.searchResults.getValue();
  }

  getCurrentCharacter(): UpdateResponseDto | null {
    return this.currentCharacter.getValue();
  }
}
