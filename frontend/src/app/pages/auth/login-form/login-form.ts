import {ChangeDetectorRef, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../core/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {

  identifier = '';
  password = '';

  loginError = false;

  constructor(private authService:AuthService, private router:Router, private cdr: ChangeDetectorRef) {}



  login(){

    this.loginError = false;

    this.authService.login({
      identifier:this.identifier,
      password:this.password
    })
      .subscribe({

        next:(response)=>{
          //console.log(response);
          this.authService.saveAuth(response);
          this.router.navigate(['/']);

        },

        error:(err)=>{
          console.error(err);
          this.loginError = true;

          this.cdr.markForCheck();

        }
      });

  }


  clearError(){
    if(this.loginError){
      this.loginError = false;
    }

  }


}
