import { Component, EventEmitter, inject, OnDestroy, OnInit, Output, signal, ViewChild} from "@angular/core";
import { SearchDataTabale } from "../ui/search-data-tabale.component";
import { searchLable } from "../ui/search-labale.component";
import { CategorySelectorComponent } from "../ui/category-selector.component";
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { SearchRequestDto } from '../type/search-request.type';
import { SearchResponse } from '../type/search-response.type';
import { ToastSeverity } from "../ui/toast.component";
import { GameHooks } from "../hooks/use-game.hook";

@Component({
    selector: 'game-table',
    standalone: true,
    imports: [CommonModule, SearchDataTabale, searchLable,
      ToastSeverity],
    template:`
    <div class="p-6 bg-gradient-to-br from-gray-900 to-zinc-900 min-h-screen">
      <!-- Header -->
      <div class="flex justify-center mb-8">
        <h1 class="text-[1.6rem] font-bold text-slate-400 tracking-wide">Data Management</h1>
      </div>

      <!-- Controls -->
      <div class="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <!-- Search Input -->
        <div class="flex-1">
          <search-lable
            (searchChange)="onSearchChange($event)"
          ></search-lable>
        </div>
      </div>

      <!-- Data Table -->
      <div>
        <search-data-tabale
          [data]="searchResults()"
          [loading]="loading()"
          (onEdit)="onEditItem($event)"
          (onDelete)="onDeleteItem($event)"
          (onPageChange)="onPageChange($event)"
        ></search-data-tabale>
      </div>

      <toast-severity></toast-severity>

      @if (loading()) {
        <div class="text-center py-12 text-slate-500">
          <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
          </svg>
          <p class="text-lg">Loading...</p>
        </div>
      }
    </div>
    `
})
export class GameTable implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchTimeout: any;

  searchQuery = signal<string>('');
  currentPage = signal<number>(0);

  searchResults = signal<SearchResponse | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  @Output() editItem = new EventEmitter<{id: number}>();

  private gameHooks = inject(GameHooks);

  @ViewChild(CategorySelectorComponent) categorySelector!: CategorySelectorComponent;
  @ViewChild(ToastSeverity) toastService!: ToastSeverity;
  @ViewChild(searchLable) searchLabel!: searchLable;

  ngOnInit() {
    this.gameHooks.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
      this.loading.set(loading);
    });

    this.gameHooks.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
          this.error.set(error);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    clearTimeout(this.searchTimeout);
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


  performSearch() {
    const searchRequest: SearchRequestDto = {
      page: this.currentPage(),
      name: this.searchQuery().trim() || " "
    };


    this.loading.set(true);
    this.error.set(null);

    let searchObservable = this.gameHooks.useSearchGames()(searchRequest);

    searchObservable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {

        this.searchResults.set(response.data);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(error.message || 'Search failed');
        this.loading.set(false);
      }
    });
  }

  clearFilters() {
    this.searchQuery.set('');
    this.currentPage.set(0);
    this.searchResults.set(null);
    this.error.set(null);

    this.categorySelector.reset();
    this.searchLabel.reset();

    // Clear search results from all hooks
    this.gameHooks.clearSearchResults();
  }

  onEditItem(item: any) {

    this.editItem.emit({
      id: item.id
    });
  }


  onDeleteItem(item: any) {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {

      let deleteObservable = this.gameHooks.useDeleteGame()(item.id);

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
    this.performSearch();
  }

  private showErrorToast(message: string | null): void {
    setTimeout(() => {
      if (this.toastService) {
        this.toastService.showError(message || 'An error occurred');
      }
    }, 100);
  }
}
