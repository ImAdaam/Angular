import { Injectable } from '@angular/core';
import { InMemoryDataService } from './in-memory-data.service';
import { User } from './models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  private userIdKey = 'user_id';

  constructor(private inMemoryDataService: InMemoryDataService) {}

  login(email: string, password: string): boolean {
    const result = this.inMemoryDataService.login(email, password);
    if (result && result.token) {
      localStorage.clear();
      localStorage.setItem('token', result.token)

      // Az új adattag beállítása az azonosító mentéséhez
      if (result) {
        localStorage.setItem(this.userIdKey, result.userId.toString());
        localStorage.setItem("actualUserID", result.userId.toString());
      }

      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem("actualUserID");
    localStorage.removeItem('user_id');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.tokenKey) !== null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getLoggedInUserId(): number | null {
    const userId = localStorage.getItem('user_id');
    return userId ? parseInt(userId, 10) : null;
  }

  getLoggedInUser(): User | undefined{
    const userData = localStorage.getItem(this.userIdKey);
    if(userData){
      return this.inMemoryDataService.getUsers().find(id=>id.id == parseInt(userData));
    } else {
      return undefined;
    }
  }

}