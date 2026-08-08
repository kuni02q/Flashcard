import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',

  standalone: true,

  template: `
    <h1>Profil oldal</h1>

    <p>Csak bejelentkezett felhasználók látják.</p>
  `,
})
export class Profile {}
