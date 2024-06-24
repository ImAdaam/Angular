import { Component, OnInit, OnDestroy } from '@angular/core';
import { InMemoryDataService } from '../in-memory-data.service';
import { Recept } from '../models/Recept';
import { Allergen } from '../models/Allergen';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-receptek-lista',
  templateUrl: './receptek-lista.component.html',
  styleUrls: ['./receptek-lista.component.css']
})
export class ReceptekListaComponent implements OnInit, OnDestroy {
  receptek: Recept[] = [];
  szurtReceptek: Recept[] = [];
  receptekBetoltve = false;
  filterExpression = '';
  private searchSubscription: Subscription | undefined;
  showList = false;

  lazyLoading: boolean = false;
  loadLazyTimeout: any;

  constructor(
    private inMemoryDataService: InMemoryDataService,
    private searchService: SearchService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchService.getFilteredTerms()
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(terms => {
        this.filterExpression = terms.toLowerCase().trim();
        this.filterReceptek();
      });
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  fetchReceptek(): void {
    console.log(localStorage.getItem('token'));
    const db = this.inMemoryDataService.createDb();
    this.receptek = db.receptjeim.map((recept: Recept) => {
      const tisztitottAllergenek = recept.allergenek.filter((allergen: Allergen | undefined) => allergen !== undefined) as Allergen[];
      return {
        ...recept,
        allergenek: tisztitottAllergenek
      };
    });
    this.receptekBetoltve = true;
    this.filterReceptek();
  }

  filterReceptek(): void {
    if (!this.filterExpression) {
      this.szurtReceptek = [...this.receptek];
    } else {
      this.szurtReceptek = this.receptek.filter(recept =>
        recept.cim.toLowerCase().includes(this.filterExpression)
      );
    }
    console.log('Szurt receptek:', this.szurtReceptek);
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.searchService.search(searchTerm);
  }

  showReceptek(): void {
    if (!this.receptekBetoltve) {
      this.fetchReceptek();
    } else {
      this.filterReceptek();
    }
    this.showList = true; // A lista megjelenítése
  }

  onLazyLoad(event: LazyLoadEvent): void {
    this.lazyLoading = true;

    if (this.loadLazyTimeout) {
      clearTimeout(this.loadLazyTimeout);
    }

    // Imitate delay of a backend call
    this.loadLazyTimeout = setTimeout(() => {
      const first = event.first ?? 0;
      const rows = event.rows ?? 2;
      const nextBatch = this.szurtReceptek.slice(first, first + rows);

      this.szurtReceptek = this.szurtReceptek.concat(nextBatch);
      this.lazyLoading = false;
    }, 300);
  }

  addFavourite(recipeId: number): void {
    const user = this.authService.getLoggedInUser();
    if (user) {
      const favIndex = user.fav.indexOf(recipeId);
      if (favIndex > -1) {
        user.fav.splice(favIndex, 1);
      } else {
        user.fav.push(recipeId);
      }
    }
    console.log(user?.fav);
  }

  getStarColor(id : number){
    return this.authService.getLoggedInUser()?.fav.includes(id) ? 'yellow' : 'inherit';
  }

  showFav()
  {
    this.szurtReceptek = this.receptek.filter(recept =>
      this.authService.getLoggedInUser()?.fav.includes(recept.id)
    );

  }
}

























