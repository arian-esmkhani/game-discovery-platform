import { FloatLabel } from 'primeng/floatlabel'
import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { TextareaModule } from 'primeng/textarea';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-input-textarea',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FormsModule, TextareaModule, FloatLabel],
    template:`
      <p-floatlabel class="h-48 custom-select">
        <textarea
            pTextarea
            id="over_label"
            [(ngModel)]="value"
            rows="5"
            cols="30"
            style="resize: none"
            class="h-full min-w-44 w-[50.7vw]"
            (ngModelChange)="onInputChange($event)">
        </textarea>
        <label for="on_label">Description</label>
      </p-floatlabel>
    `,
  styles: [`
    :root {
      --p-primary-400: rgb(161 19 62 / 0.5) !important;
    }

    app-input-textarea .custom-select textarea {
      border: 0.04rem solid rgb(136 19 55 / 0.9) !important;
      border-radius: 1.4rem !important;
      background-color: rgb(24 24 27 / 0.5) !important;
      color: rgb(148 163 184) !important;
      font-size: 0.875rem !important;
      padding: 0.5rem 1rem !important;
      transition: all 0.5s ease-in-out !important;
      opacity: 0.7 !important;
    }

    app-input-textarea .custom-select textarea:hover {
      border-color: rgb(136 19 55) !important;
      background-color: rgb(24 24 27) !important;
      opacity: 1 !important;
    }
  `]
})

export class InputTextarea {
    @Output() descriptionChange = new EventEmitter<string>();

    value: string = '';

    onInputChange(value: string) {
        this.descriptionChange.emit(value);
    }

    reset(): void {
      this.value = '';
    }
}
