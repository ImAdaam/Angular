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