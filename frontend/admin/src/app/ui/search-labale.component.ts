import { Component, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'search-lable',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [InputIcon, IconField, InputTextModule, FormsModule],
    template:`
    <p-iconfield class="custom-select">
        <span class="pi pi-search opacity-[.17] mr-[0.3rem]"></span>
        <p-inputicon class="custom-select" />
        <input
          type="text"
          pInputText
          [(ngModel)]="searchQuery"
          (input)="onSearchChange()"
        />
    </p-iconfield>
    `,
  styles: [`
    :root {
      --p-primary-400: rgb(132 19 65 / 0.7) !important;
    }

    .custom-select .p-inputtext  {
      border: 0.04rem solid rgb(136 19 55 / 0.9);
      border-radius: 20rem;
      background-color: rgb(24 24 27 / 0.5);
      color: rgb(148 163 184) !important;
      font-size: 0.875rem !important;
      padding: 0.5rem 1rem !important;
      transition: all 0.5s ease-in-out !important;
      opacity: 0.7 !important;
    }

    .custom-select .p-inputtext:hover {
      border-color: rgb(136 19 55) !important;
      background-color: rgb(24 24 27) !important;
      opacity: 1 !important;
    }
  `]
})
export class searchLable {
  @Output() searchChange = new EventEmitter<string>();

  searchQuery: string = '';

  onSearchChange() {
    this.searchChange.emit(this.searchQuery);
  }

  reset(): void {
    this.searchQuery = '';
  }
}
