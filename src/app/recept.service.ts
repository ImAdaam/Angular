import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { InMemoryDataService } from './in-memory-data.service'; // Az InMemoryDbService-től
import { Recept } from './models/Recept';
import { User } from './models/User';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReceptService {

  private receptUrl = 'api/receptjeim';

  constructor(
    private inMemoryDataService: InMemoryDataService,
    private authService: AuthService
  ) {}

  getUserRecipes(): Observable<Recept[]> {
    const loggedInUserId = this.authService.getLoggedInUserId();
    if (loggedInUserId !== null) {
      const receptjeim = this.inMemoryDataService.createDb().receptjeim;
      const userRecipes = receptjeim.filter(recept => recept.user.id === loggedInUserId);
      return of(userRecipes);
    } else {
      return of([]); // Ha nincs bejelentkezett felhasználó, üres lista
    }
  }
}