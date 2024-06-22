/*import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InMemoryDataService } from '../in-memory-data.service';
import { Anyag } from '../models/Anyag';
import { Hozzavalo } from '../models/Hozzavalo';
import { Recept } from '../models/Recept';
import { AuthService } from '../auth.service';
import { Allergen } from '../models/Allergen';

@Component({
  selector: 'app-recept-create',
  templateUrl: './recept-create.component.html',
  styleUrls: ['./recept-create.component.css']
})
export class ReceptCreateComponent implements OnInit {
  recipeForm: FormGroup;
  baseIngredients: Anyag[] = [];
  ingredientsError: boolean = false;

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

    const currentUser = this.authService.getLoggedInUserId();
    if (!currentUser) {
      console.error('User is not logged in');
      return;
    }

    const currentUser2 = this.authService.getLoggedInUser();
    if (!currentUser2) {
      console.error('User is not logged in');
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
          [] // Új paraméter // Az ID-t később állítjuk be
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
      0, // Az ID-t az InMemoryDataService állítja be
      this.recipeForm.value.name,
      this.recipeForm.value.description,
      selectedIngredients,
      Array.from(uniqueAllergens.values()), // Allergének a recepthez
      currentUser2
    );

    this.dataService.addRecipe(newRecipe);
    console.log('Recept sikeresen hozzáadva:', newRecipe);
    this.router.navigate(['/user']); // Navigálás a felhasználó receptjeinek listájára
  }
}*/


/*import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InMemoryDataService } from '../in-memory-data.service';
import { Anyag } from '../models/Anyag';
import { Hozzavalo } from '../models/Hozzavalo';
import { Recept } from '../models/Recept';
import { AuthService } from '../auth.service';
import { Allergen } from '../models/Allergen';

@Component({
  selector: 'app-recept-create',
  templateUrl: './recept-create.component.html',
  styleUrls: ['./recept-create.component.css']
})
export class ReceptCreateComponent implements OnInit {
  recipeForm: FormGroup;
  baseIngredients: Anyag[] = [];
  ingredientsError: boolean = false;

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
    this.baseIngredients = this.dataService.getAlapanyag();
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
    if (!currentUser) {
      console.error('User is not logged in');
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
      0,
      this.recipeForm.value.name,
      this.recipeForm.value.description,
      selectedIngredients,
      Array.from(uniqueAllergens.values()),
      currentUser
    );

    this.dataService.addRecipe(newRecipe);
    console.log('Recept sikeresen hozzáadva:', newRecipe);

    // Navigálás a felhasználó oldalára és frissítés kérése
    this.router.navigate(['/user'], { state: { refresh: true } });
  }
}*/



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


@Component({
  selector: 'app-recept-create',
  templateUrl: './recept-create.component.html',
  styleUrls: ['./recept-create.component.css']
})
export class ReceptCreateComponent implements OnInit {
  recipeForm: FormGroup;
  baseIngredients: Anyag[] = [];
  ingredientsError: boolean = false;

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
      currentUser
    );

    this.dataService.addRecipe(newRecipe);
    console.log('Recept sikeresen hozzáadva:', newRecipe);
    console.log(newRecipe.id);
    this.router.navigate(['/user']); // Navigate to user's recipe list with refresh
  }

}

