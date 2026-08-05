import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {AsyncPipe} from '@angular/common';
import {ThemeService} from '../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  username$;

  constructor(
    private authService:AuthService, public themeService: ThemeService, private router:Router
  ){

    this.username$ =
      this.authService.username$;

  }


  toggleTheme(): void {
    this.themeService.toggleTheme();
  }


  logout(){

    this.authService.logout();

    this.router.navigate(['/auth']);

  }

}
