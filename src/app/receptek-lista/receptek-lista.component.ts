import {Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import {InMemoryDataService} from '../in-memory-data.service';
import {Recept} from '../models/Recept';
import {Allergen} from '../models/Allergen';
import {SearchService} from '../search.service';
import {Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {AuthService} from '../auth.service';


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
    isLoading = false;
    private shownRecipes = 15;

    constructor(
        private inMemoryDataService: InMemoryDataService,
        private searchService: SearchService,
        public authService: AuthService
    ) {
    }

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

    ngAfterViewInit(): void {
        const scrollableElement = document.getElementById('receptTiles');
        if (scrollableElement) {
            scrollableElement.addEventListener('scroll', (event) => this.onScroll(event));
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
        this.showList = true;
    }

    onScroll(event: Event): void{
        const element = event.target as HTMLElement;

        const scrollTop = element.scrollTop;
        const clientHeight = element.clientHeight;
        const scrollHeight = element.scrollHeight;

        let totalItems;
        if(this.receptekBetoltve)
            totalItems = this.receptek.length;
        else
            totalItems = 50;
        const itemHeight = 300; // Replace with the height of your items

        const first = Math.floor(scrollTop / itemHeight);
        const last = Math.min(totalItems, Math.ceil((scrollTop + clientHeight) / itemHeight));

        if (Math.floor(this.shownRecipes / 5) < last) {
            this.shownRecipes += (last - Math.floor(this.shownRecipes / 5));
            this.isLoading = true;
        }

        setTimeout(() => {
            this.showReceptek();
            this.isLoading = false;
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

    getStarColor(id: number) {
        return this.authService.getLoggedInUser()?.fav.includes(id) ? 'yellow' : 'inherit';
    }

    showFav() {
        this.szurtReceptek = this.receptek.filter(recept =>
            this.authService.getLoggedInUser()?.fav.includes(recept.id)
        );

    }
}

























