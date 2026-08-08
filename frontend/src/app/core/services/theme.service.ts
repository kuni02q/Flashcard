import { Injectable } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly storageKey = 'theme';

  constructor() {
    this.loadTheme();
  }

  get currentTheme(): Theme {
    return (document.documentElement.getAttribute('data-bs-theme') as Theme) || 'light';
  }

  toggleTheme(): void {
    const newTheme: Theme = this.currentTheme === 'light' ? 'dark' : 'light';

    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-bs-theme', theme);

    localStorage.setItem(this.storageKey, theme);
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem(this.storageKey) as Theme | null;

    if (savedTheme === 'dark' || savedTheme === 'light') {
      this.setTheme(savedTheme);
    } else {
      this.setTheme('light');
    }
  }
}
