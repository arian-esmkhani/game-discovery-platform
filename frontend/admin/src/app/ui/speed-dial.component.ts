import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { SpeedDial } from 'primeng/speeddial';

@Component({
    selector: 'speed-dial-circle',
    standalone: true,
    imports: [SpeedDial],
    providers: [MessageService],
    template:`
    <div class="">
      <p-speeddial
          [model]="items"
          [radius]="75"
          type="semi-circle"
          direction="up"
          [style]="{
              position: 'absolute',
              left: 'calc(50% - 2rem)',
              bottom: '30px'
          }"
          (onClick)="onActionClick($event)"
          [class.speeddial-active]="isActive"
      />
    </div>
    `,
    styles: `
    :host ::ng-deep {
        .p-speeddial-button {
            transition: all 0.43s ease-in-out;
            background: linear-gradient(135deg, #4B0407 19%, #111111 80%) !important;
            opacity: 0.88 !important;
            border: 2px solid #2B0407;
        }

        .p-speeddial-button:hover {
            transform: translateY(-7px) scale(1.09);
            border-color: #1B0407;
        }
    }
    `
})

export class SpeedDialCircle {
    @Output() actionSelected = new EventEmitter<string>();
    isActive: boolean = false;

    items: MenuItem[] = [
        {
            icon: 'pi pi-pencil',
            tooltip: 'form',
            command: () => {
                this.actionSelected.emit('form');
            }
        },
        {
            icon: 'pi pi-table',
            tooltip: 'tabale',
            command: () => {
                this.actionSelected.emit('table');
            }
        }
    ];

    onActionClick(event: any) {
    }
}
