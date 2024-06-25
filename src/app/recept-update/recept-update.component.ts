import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InMemoryDataService } from '../in-memory-data.service';
import { Anyag } from '../models/Anyag';
import { Hozzavalo } from '../models/Hozzavalo';
import { Recept } from '../models/Recept';
import { AuthService } from '../auth.service';
import { Allergen } from '../models/Allergen';

@Component({
  selector: 'app-recept-update',
  templateUrl: './recept-update.component.html',
  styleUrls: ['./recept-update.component.css']
})
export class ReceptUpdateComponent implements OnInit {
  recipeForm: FormGroup;
  baseIngredients: Anyag[] = [];
  ingredientsError: boolean = false;
  recipeId: number | null = null;
  currentRecipe: Recept | null = null;
  selectedFile: File | undefined;
  selectedFileBase64: string | undefined;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: InMemoryDataService,
    private authService: AuthService
  ) {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ingredients: this.fb.array([]),
      coverImage: ['']
    });
  }

  ngOnInit(): void {
    this.baseIngredients = this.dataService.createDb().anyagok;

    this.route.paramMap.subscribe(params => {
      this.recipeId = Number(params.get('id'));
      if (this.recipeId) {
        this.currentRecipe = this.dataService.getRecipes().find(recipe => recipe.id === this.recipeId) || null;
        if (this.currentRecipe) {
          this.populateForm(this.currentRecipe);
        }
      }
    });
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

  populateForm(recipe: Recept): void {
    this.recipeForm.patchValue({
      name: recipe.cim,
      description: recipe.leiras,
      coverImage: recipe.borito
    });

    recipe.hozzavalok.forEach(ingredient => {
      this.ingredients.push(this.fb.group({
        baseIngridientId: [ingredient.anyag.id, Validators.required],
        quantity: [ingredient.mennyiseg, Validators.required],
        unit: [ingredient.egyseg, Validators.required]
      }));
    });
  }

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

  onSubmit(): void {
    if (this.recipeForm.invalid || this.ingredients.length === 0) {
      this.ingredientsError = this.ingredients.length === 0;
      return;
    }

    const currentUser = this.authService.getLoggedInUser();
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

    if (this.currentRecipe) {
      this.currentRecipe.cim = this.recipeForm.value.name;
      this.currentRecipe.leiras = this.recipeForm.value.description;
      this.currentRecipe.borito = this.selectedFileBase64 || this.recipeForm.value.coverImage; // Use selected file or existing cover image
      this.currentRecipe.hozzavalok = selectedIngredients;
      this.currentRecipe.allergenek = Array.from(uniqueAllergens.values());

      this.dataService.updateRecipe(this.currentRecipe);
      console.log('Recept sikeresen frissítve:', this.currentRecipe);
      this.router.navigate(['/user']);
    }
  }

  navigateToUserPage(): void {
    this.router.navigate(['/user']);
  }

  clearCoverImage(): void {
    this.selectedFile = undefined;
    this.selectedFileBase64 = undefined;
    this.recipeForm.patchValue({
      coverImage: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/4QBWRXhpZgAATU0AKgAAAAgABAEaAAUAAAABAAAAPgEbAAUAAAABAAAARgEoAAMAAAABAAIAAAITAAMAAAABAAEAAAAAAAAAAAEsAAAAAQAAASwAAAAB/+0ALFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAPHAFaAAMbJUccAQAAAgAEAP/hDIFodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nIHg6eG1wdGs9J0ltYWdlOjpFeGlmVG9vbCAxMC4xMCc+CjxyZGY6UkRGIHhtbG5zOnJkZj0naHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyc+CgogPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9JycKICB4bWxuczp0aWZmPSdodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyc+CiAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICA8dGlmZjpYUmVzb2x1dGlvbj4zMDAvMTwvdGlmZjpYUmVzb2x1dGlvbj4KICA8dGlmZjpZUmVzb2x1dGlvbj4zMDAvMTwvdGlmZjpZUmVzb2x1dGlvbj4KIDwvcmRmOkRlc2NyaXB0aW9uPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6eG1wTU09J2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8nPgogIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnN0b2NrOjY4ODU0MTQ2LWI1NDEtNGQxMi1hOTE0LTEwMTNiZTZmZTZiYjwveG1wTU06RG9jdW1lbnRJRD4KICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjdjMDRlMjliLTlkMGMtNGIyMS04Nzg1LTgwMTE5MzY1YWIyMTwveG1wTU06SW5zdGFuY2VJRD4KIDwvcmRmOkRlc2NyaXB0aW9uPgo8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSd3Jz8+/9sAQwAFAwQEBAMFBAQEBQUFBgcMCAcHBwcPCwsJDBEPEhIRDxERExYcFxMUGhURERghGBodHR8fHxMXIiQiHiQcHh8e/8AACwgBaAIOAQERAP/EAB0AAQEAAgMBAQEAAAAAAAAAAAAIBQcDBgkEAQL/xABPEAABAgMCCAcOAwcCBQUBAAAAAQMCBAUGEQcIFiExQZTSN1FxcpGxsxITGDM0NlRVVmF0dbLTFDJCFSJSYoGSoSMkJUNTY8GCk6LR4fD/2gAIAQEAAD8AssAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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'
    });
  }
}