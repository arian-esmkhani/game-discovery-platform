import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template:`
      <header class="bg-gray-900 border-b border-rose-900/30 shadow-lg">
        <nav class="container mx-auto px-4 py-3">
          <div class="flex items-center justify-between">
            @for (item of navItems; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="text-rose-400 border-b-2 border-rose-400"
                [routerLinkActiveOptions]="{exact: true}"
                class="text-slate-300 hover:text-rose-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {{ item.label }}
              </a>
            }
          </div>
        </nav>
      </header>
    `
})

export class HeaderComponent {

  navItems = [
    { path: '/independents', label: 'Independents' },
    { path: '/game', label: 'Game' },
  ];
}
