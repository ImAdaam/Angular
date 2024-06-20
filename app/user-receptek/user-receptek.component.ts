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