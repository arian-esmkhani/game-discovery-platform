import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { SaveDto } from '../type/save.type';
import { ApiResponse } from '../type/api-response.type';
import { companyService } from '../service/company-service.service';
import { SearchRequestDto } from '../type/search-request.type';
import { SearchResponse, UpdateResponseDto } from '../type/search-response.type';
import { Company } from '../type/models.type';


@Injectable({
  providedIn: 'root'
})
export class CompanyHooks {
  private loading = new BehaviorSubject<boolean>(false);
  private error = new BehaviorSubject<string | null>(null);
  private searchResults = new BehaviorSubject<SearchResponse | null>(null)
  private currentCompany = new BehaviorSubject<UpdateResponseDto | null>(null);


  loading$ = this.loading.asObservable();
  error$ = this.error.asObservable();
  searchResults$ = this.searchResults.asObservable();

  useSaveCompany(): (saveCompanyDto: SaveDto) => Observable<ApiResponse<void>> {
    return (saveCompanyDto: SaveDto) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<void>>(observer => {
        companyService.saveCompany(saveCompanyDto)
          .then(result => {
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to save company';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useSearchCompany(): (searchRequest: SearchRequestDto) => Observable<ApiResponse<SearchResponse>> {
    return (searchRequest: SearchRequestDto) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<SearchResponse>>(observer => {
        companyService.searchCompany(searchRequest)
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
          const errorMessage = error.message || 'Failed to search company';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useDeleteCompany(): (companyId: number) => Observable<ApiResponse<void>> {
    return (companyId: number) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<void>>(observer => {
        companyService.deleteCompany(companyId)
          .then(result => {
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to delete company';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useGetCompanyById(): (companyId: number) => Observable<ApiResponse<UpdateResponseDto>> {
    return (companyId: number) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<UpdateResponseDto>>(observer => {
        companyService.getCompanyById(companyId)
          .then(result => {
            this.currentCompany.next(result.data);
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to get company by id';
          this.error.next(errorMessage);
          throw error;
        }),
        finalize(() => this.loading.next(false))
      );
    };
  }

  useUpdateCompany(): (companyId: number, updateCompanyDto: SaveDto) => Observable<ApiResponse<void>> {
    return (companyId: number, updateCompanyDto: SaveDto) => {
      this.loading.next(true);
      this.error.next(null);

      return new Observable<ApiResponse<void>>(observer => {
        companyService.updateCompany(companyId, updateCompanyDto)
          .then(result => {
            observer.next(result);
            observer.complete();
          })
          .catch(err => {
            observer.error(err);
          });
      }).pipe(
        catchError(error => {
          const errorMessage = error.message || 'Failed to update company';
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

  clearCurrentCompany(): void {
    this.currentCompany.next(null);
  }

  getCurrentSearchResults(): SearchResponse | null {
    return this.searchResults.getValue();
  }

  getCurrentCompany(): UpdateResponseDto | null {
    return this.currentCompany.getValue();
  }
}
