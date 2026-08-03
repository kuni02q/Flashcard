import { Component } from '@angular/core';
import {LoginForm} from './login-form/login-form';
import {RegisterForm} from './register-form/register-form';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [LoginForm, RegisterForm],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {

  loginSelected = true;

}
