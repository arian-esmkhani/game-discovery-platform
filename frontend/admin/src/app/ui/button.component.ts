import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

const buttonVariants = {
  base: "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[20rem] font-normal tracking-tight p-0.5 transition-opacity duration-400 focus-visible:outline-none bg-zinc-950/90",
  variants: {
    variant: {
      primary: "opacity-[.70]  hover:opacity-100 border-2 border-rose-900/90 text-slate-400",
      secondary: "opacity-[.62] hover:opacity-94 border-1 border-rose-900/60 text-slate-400/93",
    },
    size: {
      sm: "text-[clamp(0.745rem,2.1vw,0.9rem)] min-w-15 w-[5.4vw]",
      md: "text-[clamp(0.795rem,2.5vw,1rem)] min-w-19 w-[7.7vw]",
      lg: "text-[clamp(0.860rem,2.6vw,1.08rem)] min-w-26 w-[12vw]"
    }
  }
};

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="disabled"
      [type]="type"
      (click)="onClick.emit($event)"
    >
      @if (icon && iconPosition === 'left') {
        <span [class]="iconClass">{{ icon }}</span>
      }

      <ng-content></ng-content>

      @if (icon && iconPosition === 'right') {
        <span [class]="iconClass">{{ icon }}</span>
      }
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Output() onClick = new EventEmitter<Event>();

  get buttonClasses(): string {
    const base = buttonVariants.base;
    const variantClass = buttonVariants.variants.variant[this.variant];
    const sizeClass = buttonVariants.variants.size[this.size];

    return `${base} ${variantClass} ${sizeClass}`;
  }

  get iconClass(): string {
    return this.size === 'sm' ? 'text-xs' : 'text-sm';
  }
}
