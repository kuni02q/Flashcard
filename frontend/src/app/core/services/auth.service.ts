import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { LoginRequest } from '../models/login-request';
import { RegisterRequest } from '../models/register-request';
import { AuthResponse } from '../models/auth-response';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));

  username$ = this.usernameSubject.asObservable();

  constructor(private api: ApiService) {}

  login(request: LoginRequest) {
    return this.api.post<AuthResponse>('/auth/login', request);
  }

  register(request: RegisterRequest) {
    return this.api.post<any>('/auth/register', request);
  }

  saveAuth(response: AuthResponse) {
    localStorage.setItem('token', response.token);

    localStorage.setItem('username', response.username);

    this.usernameSubject.next(response.username);
  }

  logout() {
    localStorage.removeItem('token');

    localStorage.removeItem('username');

    this.usernameSubject.next(null);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }
}
