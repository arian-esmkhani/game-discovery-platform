import { Routes } from '@angular/router';
import { IndependentsPage } from './pages/independents-page.component';
import { GamePage } from './pages/game-page.component';

export const routes: Routes = [
  { path: '', redirectTo: '/independents', pathMatch: 'full' },
  { path: 'independents', component: IndependentsPage },
  { path: 'game', component: GamePage },
  { path: '**', redirectTo: 'independents' }
];
