import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'pi-pen',
  standalone: true,
  imports: [],
  template: `
    <button
      class="icon-btn pen-btn"
      (click)="onClick.emit($event)"
      [class.disabled]="disabled"
      [title]="tooltip"
    >
      <i class="pi pi-pen-to-square"></i>
    </button>
  `,
  styles: [`
    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border: none;
      border-radius: 0.75rem;
      background: rgba(59, 130, 246, 0.1);
      color: #60a5fa;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .icon-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
      transition: left 0.5s;
    }

    .icon-btn:hover::before {
      left: 100%;
    }

    .icon-btn:hover {
      background: rgba(59, 130, 246, 0.2);
      color: #3b82f6;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .icon-btn:active {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
    }

    .icon-btn:focus {
      outline: none;
      ring: 2px solid rgba(59, 130, 246, 0.5);
      ring-offset: 2px;
    }

    .icon-btn.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    .icon-btn.disabled:hover::before {
      left: -100%;
    }

    .pi {
      font-size: 1.25rem;
      transition: transform 0.2s;
    }

    .icon-btn:hover .pi {
      transform: scale(1.1);
    }

    /* Animation for click */
    .icon-btn:active .pi {
      transform: scale(0.95);
    }
  `]
})
export class PenButton {
  @Input() disabled: boolean = false;
  @Input() tooltip: string = 'Edit';
  @Output() onClick = new EventEmitter<Event>();
}
