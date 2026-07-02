import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { genreService } from '../service/gerne-service.service';
import { ApiResponse } from '../type/api-response.type';
import { SaveDto } from '../type/save.type';
import { SearchRequestDto } from '../type/search-request.type';
import { SearchResponse, UpdateResponseDto } from '../type/search-response.type';
import { Genre } from '../type/models.type';

@Injectable({
  providedIn: 'root'
})
export class GenreHooks {
  private loading = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<string | null>(null);
  private searchResults = new BehaviorSubject<SearchResponse | null>(null)
  private currentGenre = new BehaviorSubject<UpdateResponseDto | null>(null);

  loading$ = this.loading.asObservable();
  error$ = this.error.asObservable();
  searchResults$ = this.searchResults.asObservable();

  useSaveGenre(): (saveGenreDto: SaveDto) => Observable<ApiResponse<void>> {
    return (saveGenreDto: SaveDto) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<void>>(observer => {
        genreService.saveGenr(saveGenreDto)
          .then(result => {
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to save genre';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useSearchGenre(): (searchRequest: SearchRequestDto) => Observable<ApiResponse<SearchResponse>> {
    return (searchRequest: SearchRequestDto) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<SearchResponse>>(observer => {
        genreService.searchGerne(searchRequest)
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
          const errorMessage = error.message || 'Failed to search genre';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useDeleteGenre(): (genreId: number) => Observable<ApiResponse<void>> {
    return (genreId: number) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<void>>(observer => {
        genreService.deleteGenre(genreId)
          .then(result => {
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to delete genre';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useGetGenreById(): (genreId: number) => Observable<ApiResponse<UpdateResponseDto>> {
    return (genreId: number) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<UpdateResponseDto>>(observer => {
        genreService.getGenreById(genreId)
          .then(result => {
            this.currentGenre.next(result.data);
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to get genre by id';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useUpdateGenre(): (genreId: number, updateGenreDto: SaveDto) => Observable<ApiResponse<void>> {
    return (genreId: number, updateGenreDto: SaveDto) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<void>>(observer => {
        genreService.updateGenre(genreId, updateGenreDto)
          .then(result => {
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to update genre';
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

  clearCurrentGenre(): void {
    this.currentGenre.next(null);
  }

  getCurrentSearchResults(): SearchResponse | null {
    return this.searchResults.getValue();
  }

  getCurrentGenre(): UpdateResponseDto | null {
    return this.currentGenre.getValue();
  }
}
