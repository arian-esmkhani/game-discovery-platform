import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
    selector: 'app-label',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [ InputTextModule, FloatLabelModule, FormsModule],
    template:`
        <p-floatlabel class="custom-select">
          <input
                  pInputText
                  id="on_label"
                  [(ngModel)]="value"
                  (ngModelChange)="onInputChange($event)"
                  autocomplete="off"
                  class="min-w-37 w-[10.3vw]"
                  />
          <label for="on_label">Name</label>
      </p-floatlabel>
    `,
  styles: [`
    :root {
      --p-primary-400: rgb(132 19 65 / 0.7) !important;
    }

    .custom-select .p-inputtext {
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
export class FieldFloatLabel{
    @Output() nameChange = new EventEmitter<string>();

    value: string = '';

    onInputChange(value: string) {
        this.nameChange.emit(value);
    }

    reset(): void {
      this.value = '';
    }
}
