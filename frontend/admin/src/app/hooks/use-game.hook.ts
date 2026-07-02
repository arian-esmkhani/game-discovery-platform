import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { gameService } from '../service/game-service.service';
import { ApiResponse } from '../type/api-response.type';
import { SearchRequestDto } from '../type/search-request.type';
import { GameResponseDto, SearchResponse } from '../type/search-response.type';
import { Game } from '../type/models.type';
import { SaveGameDto } from '../type/save.type';

@Injectable({
  providedIn: 'root'
})
export class GameHooks {
  private loading = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<string | null>(null);
  private searchResults = new BehaviorSubject<SearchResponse | null>(null);
  private currentGame = new BehaviorSubject<GameResponseDto | null>(null);

  loading$ = this.loading.asObservable();
  error$ = this.error.asObservable();
  searchResults$ = this.searchResults.asObservable();
  currentGame$ = this.currentGame.asObservable();

  useSaveGame(): (saveGameDto: SaveGameDto) => Observable<ApiResponse<void>> {
    return (saveGameDto: SaveGameDto) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<void>>(observer => {
        gameService.saveGame(saveGameDto)
          .then(result => {
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to save game';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useSearchGames(): (searchRequest: SearchRequestDto) => Observable<ApiResponse<SearchResponse>> {
    return (searchRequest: SearchRequestDto) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<SearchResponse>>(observer => {
        gameService.searchGames(searchRequest)
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
          const errorMessage = error.message || 'Failed to search games';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useDeleteGame(): (gameId: number) => Observable<ApiResponse<void>> {
    return (gameId: number) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<void>>(observer => {
        gameService.deleteGame(gameId)
          .then(result => {
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to delete game';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useGetGameById(): (gameId: number) => Observable<ApiResponse<GameResponseDto>> {
    return (gameId: number) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<GameResponseDto>>(observer => {
        gameService.getGameById(gameId)
          .then(result => {
            this.currentGame.next(result.data);
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to get game by id';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useUpdateGame(): (gameId: number, updateGameDto: SaveGameDto) => Observable<ApiResponse<void>> {
    return (gameId: number, updateGameDto: SaveGameDto) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<void>>(observer => {
        gameService.updateGame(gameId, updateGameDto)
          .then(result => {
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to update game';
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

  clearCurrentGame(): void {
    this.currentGame.next(null);
  }

  getCurrentSearchResults(): SearchResponse | null {
    return this.searchResults.getValue();
  }

  getCurrentGame(): GameResponseDto | null {
    return this.currentGame.getValue();
  }

  setCurrentGame(game: GameResponseDto): void {
    this.currentGame.next(game);
  }
}
