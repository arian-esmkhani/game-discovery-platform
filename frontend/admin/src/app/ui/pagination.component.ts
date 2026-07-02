import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'app-pagination',
    standalone: true,
    template: `
        <div class="flex items-center justify-between px-4 py-3 bg-gray-900/50 border-t border-rose-900/30">
            <div class="text-sm text-slate-400">
                Showing {{ getStartItem() }} to {{ getEndItem() }} of {{ totalElements }} items
            </div>

            <div class="flex items-center space-x-2">
                <button
                    (click)="goToPreviousPage()"
                    [disabled]="!hasPrevious"
                    class="p-2 rounded-lg border border-rose-900/30 bg-zinc-800/40 text-slate-300 hover:bg-rose-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    title="Previous page"
                >
                    <i class="pi pi-caret-left text-sm"></i>
                </button>

                <div class="flex items-center space-x-1 mx-2">
                    <span class="text-sm text-slate-300">Page</span>
                    <span class="text-sm font-medium text-rose-400">{{ currentPage + 1 }}</span>
                    <span class="text-sm text-slate-400">of</span>
                    <span class="text-sm text-slate-300">{{ getTotalPages() }}</span>
                </div>

                <button
                    (click)="goToNextPage()"
                    [disabled]="!hasNext"
                    class="p-2 rounded-lg border border-rose-900/30 bg-zinc-800/40 text-slate-300 hover:bg-rose-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    title="Next page"
                >
                    <i class="pi pi-caret-right text-sm"></i>
                </button>
            </div>
        </div>
    `
})
export class PaginationComponent {
    @Input() currentPage: number = 0;
    @Input() pageSize: number = 10;
    @Input() hasNext: boolean = false;
    @Input() hasPrevious: boolean = false;
    @Input() totalElements: number = 0;

    @Output() onPageChange = new EventEmitter<number>();
    @Output() onPageSizeChange = new EventEmitter<number>();

    goToPreviousPage(): void {
        if (this.hasPrevious) {
            this.onPageChange.emit(this.currentPage - 1);
        }
    }

    goToNextPage(): void {
        if (this.hasNext) {
            this.onPageChange.emit(this.currentPage + 1);
        }
    }

    getTotalPages(): number {
        return Math.ceil(this.totalElements / this.pageSize);
    }

    getStartItem(): number {
        return (this.currentPage * this.pageSize) + 1;
    }

    getEndItem(): number {
        const end = (this.currentPage + 1) * this.pageSize;
        return Math.min(end, this.totalElements);
    }
}
