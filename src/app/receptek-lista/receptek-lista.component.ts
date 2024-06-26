import { Component, OnInit, OnDestroy } from '@angular/core';
import { InMemoryDataService } from '../in-memory-data.service';
import { Recept } from '../models/Recept';
import { Allergen } from '../models/Allergen';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from '../auth.service';

interface LazyLoadEvent {
  first: number;
  last: number;
}

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
  private shownRecipes = 20;

  //TODO:
  // lazyLoad event(first,last)
  // 10-el kezd
  // utolsó soron túl scrollor -> még +5 betöltés
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
    document.addEventListener('DOMContentLoaded', () => {
      const scrollableElement = document.getElementById('receptTiles');

      if (scrollableElement) {
        scrollableElement.addEventListener('scroll', this.onScroll);
      }
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
    this.filterReceptek();
  }

  filterReceptek(): void {
    if (!this.filterExpression) {
      this.szurtReceptek = [...this.receptek];
      if (this.szurtReceptek.length > this.shownRecipes) {
        this.szurtReceptek = this.szurtReceptek.slice(0, this.shownRecipes);
      }
    } else {
      this.szurtReceptek = this.receptek.filter(recept =>
        recept.cim.toLowerCase().includes(this.filterExpression)
      );
      if (this.szurtReceptek.length > this.shownRecipes) {
        this.szurtReceptek = this.szurtReceptek.slice(0, this.shownRecipes);
      }
    }
    console.log(this.szurtReceptek.length);
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

  // onLazyLoad(event: LazyLoadEvent): void {
  //   this.lazyLoading = true;
  //
  //   if (this.loadLazyTimeout) {
  //     clearTimeout(this.loadLazyTimeout);
  //   }
  //
  //   // Imitate delay of a backend call
  //   this.loadLazyTimeout = setTimeout(() => {
  //     const first = event.first ?? 0;
  //     const rows = event.rows ?? 2;
  //     const nextBatch = this.szurtReceptek.slice(first, first + rows);
  //
  //     this.szurtReceptek = this.szurtReceptek.concat(nextBatch);
  //     this.lazyLoading = false;
  //   }, 300);
  // }

  // Function to handle the scroll event
  public onScroll(event: Event) {
    const element = event.target as HTMLElement;

    // Example logic to determine the first and last visible items
    const scrollTop = element.scrollTop;
    const clientHeight = element.clientHeight;
    const scrollHeight = element.scrollHeight;

    // Adjust these calculations based on your specific requirements
    const totalItems = 50; // Replace with your total number of items
    const itemHeight = 300; // Replace with the height of your items

    const first = Math.floor(scrollTop / itemHeight);
    const last = Math.min(totalItems, Math.ceil((scrollTop + clientHeight) / itemHeight));

    this.shownRecipes = last;
    console.log(this.shownRecipes);
    this.showReceptek();
    // const lazyLoadEvent: LazyLoadEvent = {
    //   first: first,
    //   last: last,
    // };
    //
    //
    // // Fire the custom event with the LazyLoadEvent detail
    // const customEvent = new CustomEvent('lazyloadevent', { detail: lazyLoadEvent });
    // element.dispatchEvent(customEvent);
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

























