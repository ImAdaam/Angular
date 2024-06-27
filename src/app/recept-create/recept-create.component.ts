import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {InMemoryDataService} from '../in-memory-data.service';
import {Anyag} from '../models/Anyag';
import {Hozzavalo} from '../models/Hozzavalo';
import {Recept} from '../models/Recept';
import {AuthService} from '../auth.service';
import {Allergen} from '../models/Allergen';
import {User} from '../models/User';
import {Subscriber} from 'rxjs';
import {HttpClient} from '@angular/common/http';


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
            this.selectedFileBase64 ? this.selectedFileBase64 : '' // Assign the base64 encoded image here // Assign the selected file name here
        );

        this.dataService.addRecipe(newRecipe);
        console.log('Recept sikeresen hozzáadva:', newRecipe);
        console.log(newRecipe.id);
        this.router.navigate(['/user']); // Navigate to user's recipe list with refresh
    }

    public hiba = false;

    onFileSelected(event: any) {
        const file: File = event.target.files[0];

        if (file.size > 2 * 1024 * 1024) { // 2MB-nál nagyobb fájlok tiltása
            alert('A fájl mérete túl nagy. Maximum 2MB lehet.');
            return;
        }

        const allowedExtensions = /(.jpg|.jpeg|.png)$/i;
        if (!allowedExtensions.exec(file.name)) {
            alert('Csak JPG, JPEG és PNG formátumú fájlokat lehet feltölteni.');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.selectedFileBase64 = reader.result as string;
        };
    }

    getFileExtension(filename: string): string {
        return filename.split('.').pop()!.toLowerCase();
    }

}
