import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';

import { Recept } from './models/Recept';
import { Anyag } from './models/Anyag';
import { Allergen } from './models/Allergen';
import { Hozzavalo } from './models/Hozzavalo';
import { Csoport } from './models/Csoport';
import { Kategoria } from './models/Kategoria';
import { User } from './models/User';
import { placeholderImageBase64 } from "../assets/placeholder_image_base64";

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {

  private receptjeim: Recept[] = [];
  private nextRecipeId = 6;
  
  constructor() {
    this.loadRecipesFromLocalStorage();
    this.createDb();
  }

  private users: User[] = [
    { id: 1, username: 'johndoe', email: 'john.doe@example.com', password: 'password', fav: []},
    { id: 2, username: 'janedoe', email: 'jane.doe@example.com', password: 'password', fav: []}
  ];

  createDb() {
    const allergenek: Allergen[] = [
      { id: 0, nev: 'Glutén', iconUrl: 'assets/icons/gluten.png', anyagAllergenek: [] },
      { id: 1, nev: 'Laktóz', iconUrl: 'assets/icons/lactose.png', anyagAllergenek: [] },
      { id: 2, nev: 'Tojás', iconUrl: 'assets/icons/egg.png', anyagAllergenek: [] }
    ];

    const anyagok: Anyag[] = [
      { id: 0, nev: 'Liszt', kategoriaId: 0, kategoria: { id: 0, nev: 'Alapanyag', anyagok: [] }, anyagAllergenek: [], allergenek: [allergenek[0]] },
      { id: 1, nev: 'Cukor', kategoriaId: 0, kategoria: { id: 0, nev: 'Alapanyag', anyagok: [] }, anyagAllergenek: [], allergenek: [allergenek[2]] },
      { id: 2, nev: 'Tojás', kategoriaId: 0, kategoria: { id: 0, nev: 'Alapanyag', anyagok: [] }, anyagAllergenek: [], allergenek: [allergenek[2]] },
      { id: 3, nev: 'Tej', kategoriaId: 0, kategoria: { id: 0, nev: 'Alapanyag', anyagok: [] }, anyagAllergenek: [], allergenek: [allergenek[1]] },
      { id: 4, nev: 'Só', kategoriaId: 1, kategoria: { id: 1, nev: 'Fűszer', anyagok: [] }, anyagAllergenek: [], allergenek: [] },
      { id: 5, nev: 'Bors', kategoriaId: 1, kategoria: { id: 1, nev: 'Fűszer', anyagok: [] }, anyagAllergenek: [], allergenek: [] },
      { id: 6, nev: 'Olaj', kategoriaId: 0, kategoria: { id: 0, nev: 'Alapanyag', anyagok: [] }, anyagAllergenek: [], allergenek: [allergenek[1]] }
    ];

    const hozzavalok: Hozzavalo[] = [
      { id: 0, anyagId: 0, anyag: anyagok[0], mennyiseg: 500, egyseg: 'g', receptId: 1, hozzavaloCsoportok: [] },
      { id: 1, anyagId: 1, anyag: anyagok[1], mennyiseg: 200, egyseg: 'g', receptId: 1, hozzavaloCsoportok: [] },
      { id: 2, anyagId: 2, anyag: anyagok[2], mennyiseg: 2, egyseg: 'db', receptId: 2, hozzavaloCsoportok: [] },
      { id: 3, anyagId: 3, anyag: anyagok[3], mennyiseg: 500, egyseg: 'ml', receptId: 2, hozzavaloCsoportok: [] },
      { id: 4, anyagId: 4, anyag: anyagok[4], mennyiseg: 1, egyseg: 'csipet', receptId: 3, hozzavaloCsoportok: [] },
      { id: 5, anyagId: 5, anyag: anyagok[5], mennyiseg: 1, egyseg: 'csipet', receptId: 3, hozzavaloCsoportok: [] },
      { id: 6, anyagId: 6, anyag: anyagok[6], mennyiseg: 50, egyseg: 'ml', receptId: 4, hozzavaloCsoportok: [] },
    ];

    const csoportok: Csoport[] = [
      { id: 0, nev: 'Száraz anyagok', hozzavaloCsoportok: [] },
      { id: 1, nev: 'Fűszerek', hozzavaloCsoportok: [] }
    ];

    const kategoriak: Kategoria[] = [
      { id: 0, nev: 'Alapanyag', anyagok: anyagok.filter(a => a.kategoriaId === 0) },
      { id: 1, nev: 'Fűszer', anyagok: anyagok.filter(a => a.kategoriaId === 1) }
    ];

    if (this.receptjeim.length === 0) {
      this.receptjeim = [
        { id: 1, cim: 'Palacsinta', leiras: 'Finom palacsinta recept', hozzavalok: hozzavalok.filter(h => h.receptId === 1), allergenek: [allergenek[1]], user: this.users[0], borito: placeholderImageBase64 },
        { id: 2, cim: 'Rántotta', leiras: 'Egyszerű rántotta recept', hozzavalok: hozzavalok.filter(h => h.receptId === 2), allergenek: [allergenek[2]], user: this.users[1], borito: placeholderImageBase64 },
        { id: 3, cim: 'Sóskafőzelék', leiras: 'Klasszikus sóskafőzelék recept', hozzavalok: hozzavalok.filter(h => h.receptId === 3), allergenek: [allergenek[1], allergenek[0]], user: this.users[0], borito: placeholderImageBase64 },
        { id: 4, cim: 'Sült krumpli', leiras: 'Ropogós sült krumpli recept', hozzavalok: hozzavalok.filter(h => h.receptId === 4), allergenek: [], user: this.users[0], borito: placeholderImageBase64 },
        { id: 5, cim: 'Tejbegríz', leiras: 'Gyermekkorunk kedvence, tejbegríz', hozzavalok: hozzavalok.filter(h => h.receptId === 1).concat({ id: 7, anyagId: 3, anyag: anyagok[3], mennyiseg: 300, egyseg: 'ml', receptId: 5, hozzavaloCsoportok: [] }), allergenek: [allergenek[1]], user: this.users[1], borito: placeholderImageBase64 },
      ];
      for (let i = 6; i <= 45; i++) {
        console.log(i);
        this.receptjeim.push({
          id: i,
          cim: `Recept ${i}`, // Example title
          leiras: `Leírás ${i}`, // Example description
          hozzavalok: hozzavalok.filter(h => h.receptId === i % 5 + 1), // Example filtering based on modulo for variety
          allergenek: [allergenek[i % allergenek.length]], // Example selection of allergen (mod for cycling through allergenek)
          user: this.users[i % this.users.length], // Example cycling through users
          borito: placeholderImageBase64
        });
      }
      this.saveRecipesToLocalStorage();
    }

    return { anyagok, allergenek, hozzavalok, csoportok, kategoriak, receptjeim: this.receptjeim };
  
  }


  getNextRecipeId(): number {
      return this.nextRecipeId++;
  }


  addRecipe(recipe: Recept) {
    //recipe.id = this.receptjeim.length+1;
    recipe.id = this.getNextRecipeId();
    this.receptjeim.push(recipe);
    this.saveRecipesToLocalStorage();
  }
  
  getRecipes(): Recept[] {
    return this.receptjeim;
  }

  getUsers(): User[] {
    return this.users;
  }

  addUser(user: User): void {
    user.id = this.generateId();
    this.users.push(user);
  }

  private generateId(): number {
    return this.users.length ? Math.max(...this.users.map(user => user.id)) + 1 : 1;
  }

  login(email: string, password: string): { token: string, userId: number } | null {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      let rand = Math.floor(Math.random() * (4));
      let token = this.JWT[rand];
      return { token: token, userId: user.id };
    }
    return null;
  }

  getAllergens(): Allergen[] {
    return this.createDb().allergenek;
  }

  getAlapanyag(): Anyag[] {
    return this.createDb().anyagok;
  }

  private JWT =
  [
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTg4MjAyMzUsImV4cCI6MTc1MDM1NjIzNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.-1xUA83lUiabD7rfbUq0_Nw4XZRLtrM4oFc7CFOgcfM',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTg4MjAyMzUsImV4cCI6MTc1MDM1NjIzNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.nkkhOITGXFwaGAuCCmCL1aPKaKqRzEC3s_TkRKqpEmM',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTg4MjAyMzUsImV4cCI6MTc1MDM1NjIzNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.wGsWBDXLZixnmuVgDQJj3ZO99ZuY1HCU39E2g59XzgA',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTg4MjAyMzUsImV4cCI6MTc1MDM1NjIzNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.td0rbFOYHL2PtA528JCGnu95Lu8NfaLuuk6gTv8Rydk',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTg4MjAyMzUsImV4cCI6MTc1MDM1NjIzNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.OFXcouGtbWvImAxLstTQwsJ4eMm5xPE3IW38uGTR400'
  ];

  private loadRecipesFromLocalStorage(): void { 
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
      this.receptjeim = JSON.parse(storedRecipes);
      this.nextRecipeId = this.receptjeim.length ? Math.max(...this.receptjeim.map(r => r.id)) + 1 : this.nextRecipeId;
    }
  }

  private saveRecipesToLocalStorage(): void { 
    localStorage.setItem('recipes', JSON.stringify(this.receptjeim));
  }

  //torles
  deleteRecipe(id: number): void {
    const index = this.receptjeim.findIndex(r => r.id === id);
    if (index > -1) {
      this.receptjeim.splice(index, 1);
      this.saveRecipesToLocalStorage();
    }
  }

  //update
  updateRecipe(updatedRecipe: Recept): void {
    const index = this.receptjeim.findIndex(recipe => recipe.id === updatedRecipe.id);
    if (index !== -1) {
      this.receptjeim[index] = updatedRecipe;
      this.saveRecipesToLocalStorage();
    }
  }
  
  getRecipeById(id: number): Recept | undefined {
    return this.receptjeim.find(r => r.id === id);
  }

}