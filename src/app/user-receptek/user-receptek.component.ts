/*
import { Component, OnInit } from '@angular/core';
import { Recept } from '../models/Recept';
import { ReceptService } from '../recept.service';
import { SearchService } from '../search.service';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { InMemoryDataService } from '../in-memory-data.service';
import { Allergen } from '../models/Allergen';

@Component({
  selector: 'app-user-receptek',
  templateUrl: './user-receptek.component.html',
  styleUrls: ['./user-receptek.component.css']
})
export class UserReceptekComponent implements OnInit {

  recipes: Recept[] = [];
  filteredRecipes: Recept[] = []; // Új tömb a szűrt receptek számára

  private searchSubscription: Subscription | undefined = undefined;

  constructor(private receptService: ReceptService, private searchService: SearchService, private inMemoryDataService: InMemoryDataService,) { }

  ngOnInit(): void {
    this.loadUserRecipes();
    console.log(this.inMemoryDataService.createDb().receptjeim);

    // Feliratkozás a keresési kifejezések figyelésére
    this.searchSubscription = this.searchService.searchTerms$
      .pipe(
        debounceTime(300), // Várakozás 300ms-ig a beírt szöveg stabilizálódásáig
        distinctUntilChanged() // Csak akkor küldj be, ha a kifejezés megváltozik
      )
      .subscribe(searchTerm => {
        this.filterRecipes(searchTerm);
      });
  }

  first = 0;
  rows = 1;
  totalRecords = 3;
  rowsPerPageOptions = [1, 2, 3];

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  private loadUserRecipes(): void {
    this.receptService.getUserRecipes().subscribe(
      recipes => {
        this.recipes = recipes;
        this.filteredRecipes = recipes; // Kezdetben mindent megjelenítünk
      },
      error => {
        console.error('Error fetching user recipes:', error);
      }
    );
  }


  onSearch(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement)?.value.toLowerCase().trim() || '';
    this.searchService.search(searchTerm);
  }

  private filterRecipes(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.filteredRecipes = [...this.recipes]; // Ha nincs keresési kifejezés, mutassuk az összeset
      return;
    }

    // Szűrés a receptek között a cím alapján
    this.filteredRecipes = this.recipes.filter(recept =>
      recept.cim.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

    allergenek = this.inMemoryDataService.getAllergens();
    allArray: any[] = [];

    public onAllergenChange(event: Event)
    {
        
        const target = event.target as HTMLInputElement;
        const allergenId = parseInt(target.value);

        if(this.allArray.includes(allergenId)){
            this.allArray.splice(this.allArray.indexOf(allergenId),1)
        }
        else{
          this.allArray.push(allergenId);
        }
        console.log(this.allArray);
        this.filteredRecipes = this.recipes.filter(recept =>
          recept.allergenek.every(allergen => !(this.allArray.includes(allergen.id)))
        );
    }
}
    */

import { Component, OnInit } from '@angular/core';
import { Recept } from '../models/Recept';
import { SearchService } from '../search.service';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { InMemoryDataService } from '../in-memory-data.service';
import { Allergen } from '../models/Allergen';
import { AuthService } from '../auth.service';
import { Router, NavigationEnd } from '@angular/router';

import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-user-receptek',
  templateUrl: './user-receptek.component.html',
  styleUrls: ['./user-receptek.component.css']
  //providers: [ConfirmationService]
})
export class UserReceptekComponent implements OnInit {
  recipes: Recept[] = [];
  filteredRecipes: Recept[] = [];
  currentUser: any = null;
  searchTerms = new Subject<string>();
  searchTerm: string = ''; // Holds the current search term
  allergens: Allergen[] = [];
  selectedAllergens: number[] = [];
  searchSubscription: Subscription | undefined = undefined;

  constructor(
    private searchService: SearchService,
    private inMemoryDataService: InMemoryDataService,
    private authService: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

    ngOnInit(): void {
      this.currentUser = this.authService.getLoggedInUserId();
      if (this.currentUser) {
        this.loadUserRecipes();
        this.allergens = this.inMemoryDataService.getAllergens();
      }
    
      this.searchTerms.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        map(term => term.trim().toLowerCase())
      ).subscribe(term => {
        this.searchTerm = term;
        this.filterRecipes();
      });
    
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.loadUserRecipes();
        }
      });
    
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras?.state?.['refresh']) {
        this.loadUserRecipes();
      }
    }

  onSearch(event: any): void {
    this.searchTerms.next(event.target.value);
  }

  filterAndSortRecipes(term: string): Recept[] {
    let filtered = this.recipes;

    if (term) {
      filtered = filtered.filter(recipe => recipe.cim.toLowerCase().includes(term));
    }

    if (this.selectedAllergens.length > 0) {
      filtered = filtered.filter(recipe =>
        !recipe.allergenek.some(allergen => this.selectedAllergens.includes(allergen.id))
      );
    }

    return filtered.sort((a, b) => {
      const indexA = a.cim.toLowerCase().indexOf(term);
      const indexB = b.cim.toLowerCase().indexOf(term);
      return indexA - indexB;
    });
  }

  filterRecipes() {
    this.filteredRecipes = this.filterAndSortRecipes(this.searchTerm);
  }

  navigateToCreateRecipe(): void {
    this.router.navigate(['/create']);
  }

  private loadUserRecipes(): void {
    const userId = this.authService.getLoggedInUserId();
    console.log('Current User ID:', userId);
    //this.recipes = this.inMemoryDataService.getRecipes().filter(recipe => recipe.user.id === userId);
    const storedRecipes = localStorage.getItem('receptjeim');
    if (storedRecipes) {
      this.recipes = JSON.parse(storedRecipes).filter((recipe: any) => recipe.user.id === userId);
      console.log(storedRecipes);
    } else {
      this.recipes = this.inMemoryDataService.getRecipes().filter(recipe => recipe.user.id === userId); // or handle the case when there are no recipes
    }
    console.log('User Recipes:', this.recipes);
    this.filteredRecipes = this.recipes;
  }

  onAllergenChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const allergenId = parseInt(target.value);

    if (this.selectedAllergens.includes(allergenId)) {
      this.selectedAllergens.splice(this.selectedAllergens.indexOf(allergenId), 1);
    } else {
      this.selectedAllergens.push(allergenId);
    }

    this.filterRecipes();
  }

  
  deleteRecipe(recipeId: number): void {
    this.inMemoryDataService.deleteRecipe(recipeId);
    this.loadUserRecipes();
  }
    

  confirmDelete(recipeId: number): void {
    this.confirmationService.confirm({
      message: 'Biztosan törölni szeretnéd ezt a receptet?',
      header: 'Törlés megerősítése',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteRecipe(recipeId);
      },
      reject: () => {
        console.log("rejecteltél");
      }
    });
  }

  editRecipe(recipeId: number): void {
    this.router.navigate(['/update', recipeId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  navigateBack(){
    this.router.navigate(['/']);
  }

}