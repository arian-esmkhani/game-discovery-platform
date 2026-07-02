import { Component, EventEmitter, Input, Output } from "@angular/core";
import { SearchResponse, SearchDataDto, PaginationInfo } from "../type/search-response.type";
import { PenButton } from "./pen-button.component";
import { TrashButton } from "./trash-button.component";
import { PaginationComponent } from "./pagination.component";

@Component({
    selector: 'search-data-tabale',
    standalone: true,
    imports: [PenButton, TrashButton, PaginationComponent],
    template:`
      <div class="bg-gray-900/50 rounded-xl border border-rose-900/30 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gradient-to-r from-rose-900/20 to-purple-900/20 border-b border-rose-900/30">
                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300/80">ID</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-slate-300/80">Name</th>
                <th class="px-6 py-4 text-right text-sm font-semibold text-slate-300/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              @if (data && data.searchDataDto && data.searchDataDto.content && data.searchDataDto.content.length > 0) {
                @for (item of data.searchDataDto.content; track item.id) {
                  <tr class="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors duration-200">
                    <td class="px-6 py-4 text-sm text-slate-400">{{ item.id }}</td>
                    <td class="px-6 py-4 text-sm text-slate-300">{{ item.name }}</td>
                    <td class="px-6 py-4 text-right">
                      <div class="flex justify-end space-x-2">
                        <pi-pen
                          [tooltip]="'Edit item'"
                          (onClick)="onEdit.emit(item)"
                        ></pi-pen>

                        <pi-trash
                          [tooltip]="'Delete item'"
                          (onClick)="onDelete.emit(item)"
                        ></pi-trash>
                      </div>
                    </td>
                  </tr>
                }
              } @else if (loading) {
                <tr>
                  <td colspan="3" class="px-6 py-8 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              } @else {
                <tr>
                  <td colspan="3" class="px-6 py-8 text-center text-slate-500">
                    No data found
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (showPagination) {
          <app-pagination
            [currentPage]="paginationInfo!.currentPage"
            [pageSize]="paginationInfo!.pageSize"
            [hasNext]="paginationInfo!.hasNext"
            [hasPrevious]="paginationInfo!.hasPrevious"
            [totalElements]="paginationInfo!.totalElements"
            (onPageChange)="onPageChange.emit($event)"
            (onPageSizeChange)="onPageSizeChange.emit($event)"
          ></app-pagination>
        }
      </div>
    `
})

export class SearchDataTabale{
  @Input() data: SearchResponse | null = null;
  @Input() loading: boolean = false;

  @Output() onEdit = new EventEmitter<SearchDataDto>();
  @Output() onDelete = new EventEmitter<SearchDataDto>();
  @Output() onPageChange = new EventEmitter<number>();
  @Output() onPageSizeChange = new EventEmitter<number>();


  trackById(index: number, item: SearchDataDto): number {
    return item.id;
  }

  get paginationInfo(): PaginationInfo | null {
      return this.data?.paginationInfo || null;
  }

  get showPagination(): boolean {
      return !!this.paginationInfo && this.paginationInfo.totalElements > 0;
  }
}
