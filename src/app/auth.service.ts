import { Injectable } from '@angular/core';
import { InMemoryDataService } from './in-memory-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';

  constructor(private inMemoryDataService: InMemoryDataService) {}

  login(email: string, password: string): boolean {
    const result = this.inMemoryDataService.login(email, password);
    if (result && result.token) {
      localStorage.clear();
      localStorage.setItem('token', result.token)
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.tokenKey) !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}