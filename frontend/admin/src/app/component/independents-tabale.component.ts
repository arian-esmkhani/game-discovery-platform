import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, signal, ViewChild} from "@angular/core";
import { SearchDataTabale } from "../ui/search-data-tabale.component";
import { searchLable } from "../ui/search-labale.component";
import { CategorySelectorComponent } from "../ui/category-selector.component";
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { CharacterHooks } from '../hooks/use-character.hook';
import { CompanyHooks } from '../hooks/use-company.hook';
import { GenreHooks } from '../hooks/use-genre.hook';
import { SearchRequestDto } from '../type/search-request.type';
import { SearchResponse } from '../type/search-response.type';
import { ToastSeverity } from "../ui/toast.component";

@Component({
    selector: 'independents-table',
    standalone: true,
    imports: [CommonModule, SearchDataTabale, searchLable,
      CategorySelectorComponent, ToastSeverity],
    template:`
    <div class="p-6 bg-gradient-to-br from-gray-900 to-zinc-900 min-h-screen">
      <!-- Header -->
      <div class="flex justify-center mb-8">
        <h1 class="text-[1.6rem] font-bold text-slate-400 tracking-wide">Data Management</h1>
      </div>

      <!-- Controls -->
      <div class="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <!-- Category Selector -->
        <div class="flex-1">
          <app-category-selector
            (categoryChange)="onCategoryChange($event)"
          ></app-category-selector>
        </div>

        <!-- Search Input -->
        <div class="flex-1">
          <search-lable
            (searchChange)="onSearchChange($event)"
          ></search-lable>
        </div>

        <!-- Clear Filters -->
        <button
          (click)="clearFilters()"
          class="px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-600/30 text-slate-300 rounded-lg transition-all duration-200"
        >
          Clear Filters
        </button>
      </div>

      <!-- Data Table -->
      <div>
        <search-data-tabale
          [data]="searchResults()"
          [loading]="loading()"
          (onEdit)="onEditItem($event)"
          (onDelete)="onDeleteItem($event)"
          (onPageChange)="onPageChange($event)"
          (onPageSizeChange)="onPageSizeChange($event)"
        ></search-data-tabale>
      </div>

      <toast-severity></toast-severity>

      <!-- No Category Selected -->
      @if (!selectedCategory && !loading()) {
        <div class="text-center py-12 text-slate-500">
          <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
          <p class="text-lg">Please select a category to view data</p>
        </div>
      }
    </div>
    `
})
export class IndependentsTable implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchTimeout: any;

  selectedCategory = signal<string>('');
  searchQuery = signal<string>('');
  currentPage = signal<number>(0);
  pageSize = signal<number>(3);

  searchResults = signal<SearchResponse | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  @Output() editItem = new EventEmitter<{category: string, id: number}>();

  private characterHooks = inject(CharacterHooks);
  private companyHooks = inject(CompanyHooks);
  private genreHooks = inject(GenreHooks);

  @ViewChild(CategorySelectorComponent) categorySelector!: CategorySelectorComponent;
  @ViewChild(ToastSeverity) toastService!: ToastSeverity;
  @ViewChild(searchLable) searchLabel!: searchLable;

  ngOnInit() {
    // Subscribe to hook loading states
    this.characterHooks.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        if (this.selectedCategory() === 'character') {
          this.loading.set(loading);
        }
      });

    this.companyHooks.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        if (this.selectedCategory() === 'company') {
          this.loading.set(loading);
        }
      });

    this.genreHooks.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        if (this.selectedCategory() === 'genre') {
          this.loading.set(loading);
        }
      });

    // Subscribe to hook errors
    this.characterHooks.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (this.selectedCategory() === 'character') {
          this.error.set(error);
        }
      });

    this.companyHooks.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (this.selectedCategory() === 'company') {
          this.error.set(error);
        }
      });

    this.genreHooks.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (this.selectedCategory() === 'genre') {
          this.error.set(error);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.searchTimeout);
  }

  onCategoryChange(category: string) {
    this.selectedCategory.set(category);
    this.currentPage.set(0);
    this.performSearch();
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(0);

    // Debounce search - perform search after 300ms of no typing
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.performSearch();
    }, 300);
  }


  onPageChange(page: number) {
    this.currentPage.set(page);
    this.performSearch();
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(0);
    this.performSearch();
  }

  performSearch() {
    if (!this.selectedCategory()) {
      this.searchResults.set(null);
      return;
    }

    const searchRequest: SearchRequestDto = {
      page: this.currentPage(),
      name: this.searchQuery().trim() || " "
    };


    this.loading.set(true);
    this.error.set(null);

    let searchObservable;

    switch (this.selectedCategory()) {
      case 'character':
        searchObservable = this.characterHooks.useSearchCharacters()(searchRequest);
        break;
      case 'company':
        searchObservable = this.companyHooks.useSearchCompany()(searchRequest);
        break;
      case 'genre':
        searchObservable = this.genreHooks.useSearchGenre()(searchRequest);
        break;
      default:
        this.loading.set(false);
        return;
    }

    searchObservable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {

        this.searchResults.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error.message || 'Search failed');
        this.loading.set(false);
        this.showErrorToast(error);
      }
    });
  }

  clearFilters() {
    this.selectedCategory.set('');
    this.searchQuery.set('');
    this.currentPage.set(0);
    this.searchResults.set(null);
    this.error.set(null);

    this.categorySelector.reset();
    this.searchLabel.reset();

    // Clear search results from all hooks
    this.characterHooks.clearSearchResults();
    this.companyHooks.clearSearchResults();
    this.genreHooks.clearSearchResults();
  }

  getCategoryLabel(): string {
    switch (this.selectedCategory()) {
      case 'character': return 'Characters';
      case 'company': return 'Companies';
      case 'genre': return 'Genres';
      default: return 'items';
    }
  }

  onEditItem(item: any) {
    
    this.editItem.emit({
      category: this.selectedCategory(),
      id: item.id
    });
  }


  onDeleteItem(item: any) {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      let deleteObservable;

      switch (this.selectedCategory()) {
        case 'character':
          deleteObservable = this.characterHooks.useDeleteCharacter()(item.id);
          break;
        case 'company':
          deleteObservable = this.companyHooks.useDeleteCompany()(item.id);
          break;
        case 'genre':
          deleteObservable = this.genreHooks.useDeleteGenre()(item.id);
          break;
        default:
          return;
      }

      if (deleteObservable) {
        this.loading.set(true);
        deleteObservable.pipe(takeUntil(this.destroy$)).subscribe({
          next: (response) => {
            this.loading.set(false);
            this.toastService.showSuccess(`"${item.name}" deleted successfully`);
            // Refresh the search results after deletion
            this.performSearch();
          },
          error: (error) => {
            this.loading.set(false);
            this.error.set(error.message || 'Delete failed');
            this.showErrorToast(error);
          }
        });
      }
    }
  }

  refreshData(): void {
      this.performSearch();
  }


  ngAfterViewInit() {
  }

  private showErrorToast(message: string | null): void {
    setTimeout(() => {
      if (this.toastService) {
        this.toastService.showError(message || 'An error occurred');
      }
    }, 100);
  }
}
