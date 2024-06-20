
import { Component, OnInit } from '@angular/core';
import { InMemoryDataService } from '../in-memory-data.service';
import { Recept } from '../models/Recept';
import { Allergen } from '../models/Allergen';
import { SearchService } from '../search.service';
import { Observable, Subscription } from 'rxjs';
import { ScrollerModule } from 'primeng/scroller';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface LazyEvent {
  first: number;
  last: number;
}

@Component({
  selector: 'app-receptek-lista',
  templateUrl: './receptek-lista.component.html',
  styleUrls: ['./receptek-lista.component.css']
})
export class ReceptekListaComponent implements OnInit {
  receptek: Recept[] = [];
  szurtReceptek: Recept[] = [];
  receptekBetoltve = false;
  filterExpression = '';
  private searchSubscription: Subscription | undefined;

  lazyLoading: boolean = true;
  loadLazyTimeout: any;

  header = 'jwt header';
  payload = {
    "iss": "Online JWT Builder",
    "iat": 1718820235,
    "exp": 1750356235,
    "aud": "www.example.com",
    "sub": "jrocket@example.com",
    "GivenName": "Johnny",
    "Surname": "Rocket",
    "Email": "jrocket@example.com",
    "Role": [
      "Manager",
      "Project Administrator"
    ]
  };
  key = 'qwertyuiopasdfghjklzxcvbnm123456';

  constructor(
    private inMemoryDataService: InMemoryDataService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.searchSubscription = this.searchService.getFilteredTerms().subscribe(terms => {
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
    const db = this.inMemoryDataService.createDb();
    this.receptek = db.receptjeim.map((recept: Recept) => {
      const tisztitottAllergenek = recept.allergenek.filter((allergen: Allergen | undefined) => allergen !== undefined) as Allergen[];
      return {
        ...recept,
        allergenek: tisztitottAllergenek
      };
    });
    this.receptekBetoltve = true;
    this.filterReceptek(); // Szűrés induló állapot beállítása
  }

  filterReceptek(): void {
    if (!this.filterExpression) {
      this.szurtReceptek = [...this.receptek];
    } else {
      this.szurtReceptek = this.receptek.filter(recept =>
        recept.kodneve.toLowerCase().includes(this.filterExpression)
      );
    }
  }

  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.searchService.search(searchTerm);
  }

  showReceptek(): void {
    if (!this.receptekBetoltve) {
      this.fetchReceptek();
    } else {
      this.szurtReceptek = [...this.receptek];
    }
  }

  onLazyLoad(event: LazyEvent) {
    this.lazyLoading = true;

    if (this.loadLazyTimeout) {
      clearTimeout(this.loadLazyTimeout);
    }

    //imitate delay of a backend call
    this.loadLazyTimeout = setTimeout(() => {
      const { first, last } = event;
      const lazyItems = [...this.receptek];

      console.log(this.tokenGenerate());

      for (let i = first; i < last; i++) {
        lazyItems[i] = this.receptek[i];
      }

      this.receptek = lazyItems;
      this.lazyLoading = false;
    // }, Math.random() * 100 + 25);
    }, 300);
  }

  tokenGenerate(): string{
    let jwt = this.header + '.' + this.payload + '.' + this.key;

    return btoa(jwt);
  }
}













