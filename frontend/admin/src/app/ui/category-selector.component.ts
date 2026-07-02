import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-selector',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, SelectModule, FloatLabelModule, FormsModule],
  template: `
      <p-floatlabel class="min-w-30 w-[13.7vw] p-0.5 text-sm custom-select">
        <p-select
          [disabled]="disabled"
          [(ngModel)]="selectedCategory"
          [options]="categories"
          optionLabel="label"
          placeholder="Choose a category"
          (onChange)="onCategoryChange()"
          class="w-full">
        </p-select>
      </p-floatlabel>
  `,
  styles: [`
    :root {
      --p-primary-400: #952222 !important;
    }

    .custom-select .p-select {
      border: 0.04rem solid rgb(136 19 55 / 0.9);
      border-radius: 20rem;
      background-color: rgb(24 24 27 / 0.9);
    }
  `]
})
export class CategorySelectorComponent {
  @Output() categoryChange = new EventEmitter<string>();
  @Input() disabled: boolean = false;

  selectedCategory: { label: string; value: string } | undefined;

  categories = [
    { label: 'Character', value: 'character' },
    { label: 'Company', value: 'company' },
    { label: 'Genre', value: 'genre' }
  ];

  onCategoryChange() {
    if (this.selectedCategory) {
      this.categoryChange.emit(this.selectedCategory.value);
    } else {
      this.categoryChange.emit('');
    }
  }

  reset(): void {
    this.selectedCategory = undefined;
  }
}
