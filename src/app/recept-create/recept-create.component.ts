/*
import { Component, OnInit } from '@angular/core';
import { Recept } from '../models/Recept';
import { Hozzavalo } from '../models/Hozzavalo';
import { ReceptService } from '../recept.service';
import { InMemoryDataService } from '../in-memory-data.service';
import { Anyag } from '../models/Anyag';
import { User } from '../models/User';
import { AuthService } from '../auth.service';
import { Route, Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-recept-create',
  templateUrl: './recept-create.component.html',
  styleUrls: ['./recept-create.component.css']
})
export class ReceptCreateComponent implements OnInit {

  recept = {
    id: null,
    cim: '',
    leiras: '',
    hozzavalok: [],
    allergenek: [],
    user: null
  };

  

  selectedHozzavalo: number | undefined; // Ez tárolja a kiválasztott hozzávaló id-ját
  addedHozzavalo: number[] = [];
  hozzavalok: Anyag[] = []; // Ez tárolja az elérhető hozzávalókat
  anyag: Anyag[] = [];

  constructor(private receptService: ReceptService, private InMemoryDataService: InMemoryDataService, private router: Router) { }

  ngOnInit(): void {
    this.hozzavalok = this.InMemoryDataService.getAlapanyag();
  }

  addHozzavalo(): void {
    // Keressük meg a kiválasztott hozzávalót az elérhető hozzávalók között
    const selected = this.hozzavalok.find(h => h.id == this.selectedHozzavalo);
    console.log(selected);
    console.log(this.hozzavalok);
    console.log(this.selectedHozzavalo);
    if (selected) {
      if(this.addedHozzavalo.includes(selected.id)){
        this.addedHozzavalo.splice(this.addedHozzavalo.indexOf(selected.id),1)
        this.anyag.splice(this.anyag.indexOf(selected),1)
      }
      else{
        this.addedHozzavalo.push(selected.id);
        this.anyag.push(selected);
      }
    }
    console.log(this.addedHozzavalo);
  }



  onSubmit(): void {
      //this.recept.hozzavalok = this.anyag
      this.InMemoryDataService.addRecept(this.recept)
      //this.router.navigate(['user']);
      console.log(this.InMemoryDataService.createDb().receptjeim);
  }

}
  */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InMemoryDataService } from '../in-memory-data.service';
import { Anyag } from '../models/Anyag';
import { Hozzavalo } from '../models/Hozzavalo';
import { Recept } from '../models/Recept';
import { AuthService } from '../auth.service';
import { Allergen } from '../models/Allergen';
import { User } from '../models/User';
import { Subscriber } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-recept-create',
  templateUrl: './recept-create.component.html',
  styleUrls: ['./recept-create.component.css']
})
export class ReceptCreateComponent implements OnInit {
  recipeForm: FormGroup;
  baseIngredients: Anyag[] = [];
  ingredientsError: boolean = false;
  selectedFile: File | undefined;
  selectedFileBase64: string | undefined;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dataService: InMemoryDataService,
    private authService: AuthService
  ) {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ingredients: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.baseIngredients = this.dataService.createDb().anyagok;
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient(): void {
    this.ingredients.push(this.fb.group({
      baseIngridientId: ['', Validators.required],
      quantity: ['', Validators.required],
      unit: ['', Validators.required]
    }));
    this.ingredientsError = false;
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  onSubmit(): void {
    if (this.recipeForm.invalid || this.ingredients.length === 0) {
      this.ingredientsError = this.ingredients.length === 0;
      return;
    }

    const currentUser = this.authService.getLoggedInUser();
    console.log(currentUser);
    if (!currentUser) {
      return;
    }

    const selectedIngredients = this.recipeForm.value.ingredients.map(
      (ingredient: { baseIngridientId: number; quantity: number; unit: string }, index: number) => {
        const baseIngredient = this.baseIngredients.find(bi => bi.id === ingredient.baseIngridientId);
        if (!baseIngredient) {
          console.error(`Base ingredient with ID ${ingredient.baseIngridientId} not found`);
          return null;
        }
        return new Hozzavalo(
          index + 1,
          ingredient.baseIngridientId,
          baseIngredient,
          ingredient.quantity,
          ingredient.unit,
          0,
          []
        );
      }
    ).filter((ingredient: Hozzavalo | null) => ingredient !== null) as Hozzavalo[];

    const uniqueAllergens = new Map<number, Allergen>();
    selectedIngredients.forEach((ingredient: Hozzavalo) => {
      if (ingredient.anyag.allergenek) {
        ingredient.anyag.allergenek.forEach((allergen: Allergen) => {
          if (!uniqueAllergens.has(allergen.id)) {
            uniqueAllergens.set(allergen.id, allergen);
          }
        });
      }
    });

    const newRecipe = new Recept(
      0, // The ID will be set by InMemoryDataService
      this.recipeForm.value.name,
      this.recipeForm.value.description,
      selectedIngredients,
      Array.from(uniqueAllergens.values()), // Allergens for the recipe
      currentUser,
      //undefined,
      this.selectedFileBase64 ? this.selectedFileBase64:'' // Assign the base64 encoded image here // Assign the selected file name here
    );

    this.dataService.addRecipe(newRecipe);
    console.log('Recept sikeresen hozzáadva:', newRecipe);
    console.log(newRecipe.id);
    this.router.navigate(['/user']); // Navigate to user's recipe list with refresh
  }

  public hiba = false;

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileBase64 = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()!.toLowerCase();
  }

}
