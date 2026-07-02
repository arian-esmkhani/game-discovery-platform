import { Component, EventEmitter, Output } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { FluidModule } from 'primeng/fluid';

@Component({
    selector: 'date-picker',
    standalone: true,
    imports: [DatePickerModule, FormsModule, FluidModule],
    template:`
    <div class="flex-auto">
        <label for="icondisplay" class=""></label>
        <p-datepicker
        [(ngModel)]="date"
        [iconDisplay]="'input'"
        [showIcon]="true"
        inputId="icondisplay"
        (ngModelChange)="onDateSelected($event)"/>
    </div>
    `,
    styles: [`
        .p-datepicker {
          border-radius: 0.49rem;
          opacity: 0.5 !important;
          font-size: 0.8rem;
        }

        .p-datepicker:hover {
          opacity: 1 !important;
          box-shadow: 0 0 0 2px rgb(136 19 55 / 0.3),
                      0 1px 1px 1px rgb(136 19 55 / 0.4);
          transition: all 3.4s
        }

        .p-datepicker:focus-within {
          box-shadow: 0 0 0 2px rgb(136 19 55 / 0.3),
                      0 1px 1px 1px rgb(136 19 55 / 0.4);
          outline: none;
          opacity: 0.8 !important;
          transition: all 3.4s
        }
    `]
})
export class DatePicker {
    date: Date | undefined;

    @Output() dateSelected = new EventEmitter<Date>();

    setValue(value: Date | undefined): void {
        this.date = value;
    }

    onDateSelected(value: Date) {
      this.dateSelected.emit(value);
    }

    reset(): void {
      this.date = undefined;
    }
}
