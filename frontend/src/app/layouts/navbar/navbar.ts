import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../core/services/auth.service';
import {AsyncPipe} from '@angular/common';

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
    private authService:AuthService
  ){

    this.username$ =
      this.authService.username$;

  }



  logout(){

    this.authService.logout();

  }

}
