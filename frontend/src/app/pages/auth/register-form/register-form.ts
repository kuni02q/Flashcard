import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  registerError = false;

  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  register() {
    this.registerError = false;

    if (this.password !== this.confirmPassword) {
      this.registerError = true;

      this.errorMessage = 'A jelszavak nem egyeznek!';

      console.log('A jelszavak nem egyeznek');
      return;
    }

    this.authService
      .register({
        username: this.username,
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          console.log(response);

          this.authService.saveAuth(response);
          this.router.navigate(['/']);
        },

        error: (err) => {
          console.error(err);

          this.registerError = true;

          const message = err.error?.message;

          if (message?.includes('Username')) {
            this.errorMessage = 'Ez a felhasználónév már foglalt!';
          } else if (message?.includes('Email')) {
            this.errorMessage = 'Ez az email cím már használatban van!';
          } else {
            this.errorMessage = 'Sikertelen regisztráció!';
          }

          this.cdr.markForCheck();
        },
      });
  }

  clearError() {
    if (this.registerError) {
      this.registerError = false;
      this.errorMessage = '';
    }
  }
}
