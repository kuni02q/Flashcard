import { Routes } from '@angular/router';
import { Profile } from './pages/profile/profile';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((c) => c.Home) },
  { path: 'auth', loadComponent: () => import('./pages/auth/auth').then((c) => c.Auth) },
  { path: 'groups/:id/quiz', loadComponent: () => import('./pages/quiz/quiz').then((c) => c.Quiz) },
  {
    path: 'groups/:id',
    loadComponent: () => import('./pages/group-detail/group-detail').then((c) => c.GroupDetail),
  },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
];
