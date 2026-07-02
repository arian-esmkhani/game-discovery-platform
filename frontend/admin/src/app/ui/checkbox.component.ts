import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';

@Component({
    selector: 'checkbox-basic',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [FormsModule, Checkbox],
    template:`
    <div class="card flex justify-center custom-select">
      <p-checkbox
      [(ngModel)]="checkedStatus" [binary]="true" (onChange)="onCheckBoxSelected($event)"/>
    </div>
    `,
  styles: [`
    :root {
      --p-primary-300: #933336 !important;
      --p-primary-400: #898899 !important;
    }

    .custom-select p-checkbox {
      border-radius: 0.39rem;
      opacity: 0.7 !important;
    }

    .custom-select p-checkbox:hover {
      opacity: 1 !important;
      box-shadow: 0 0 0 2px rgb(136 19 55 / 0.3),
                  0 1px 1px 1px rgb(136 19 55 / 0.4);
    }

    .custom-select p-checkbox:focus-within {
      box-shadow: 0 0 0 2px rgb(136 19 55 / 0.3),
                  0 1px 1px 1px rgb(136 19 55 / 0.4);
      outline: none;
      opacity: 0.8 !important;
    }
  `]
})
export class CheckboxBasic {
  @Output() checked = new EventEmitter<boolean>();

  checkedStatus: boolean = false;

  setValue(value: boolean): void {
    this.checkedStatus = value;
  }

  onCheckBoxSelected(event: any){
    this.checked.emit(event.checked);
  }

  reset(): void {
    this.checkedStatus = false;
  }

}
