import { Routes } from '@angular/router';
import {Profile} from './pages/profile/profile';
import {authGuard} from './core/guards/auth.guard';

export const routes: Routes = [

  {path: '', loadComponent: () => import('./pages/home/home').then(c => c.Home)},
  {path: 'auth', loadComponent: () => import('./pages/auth/auth').then(c => c.Auth)},
  {path: 'profile', component: Profile, canActivate:[authGuard]},


];
