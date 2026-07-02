import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header.component';
import { Component, signal } from '@angular/core';



@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Admin');
}
