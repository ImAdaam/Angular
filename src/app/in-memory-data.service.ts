/*import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Recept } from './models/Recept';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const anyagok = [
      { id: 0, nev: 'Liszt', kategoriaId: 0, kategoria: {id: 0, nev: 'Alapanyag', anyagok: [] }, anyagAllergenek: [] },
      { id: 1, nev: 'Cukor', kategoriaId: 0, kategoria: {id: 0, nev: 'Alapanyag', anyagok: [] }, anyagAllergenek: [] }
    ];

    const allergenek = [
      { id: 0, nev: 'Glutén', anyagAllergenek: [] },
      { id: 1, nev: 'Laktóz', anyagAllergenek: [] }
    ];

    const hozzavalok = [
      { id: 0, anyagId: 1, anyag: anyagok[0], mennyiseg: 500, egyseg: 'g', receptId: 1, hozzavaloCsoportok: [] },
      { id: 1, anyagId: 2, anyag: anyagok[1], mennyiseg: 200, egyseg: 'g', receptId: 1, hozzavaloCsoportok: [] }
    ];

    const csoportok = [
      { id:0, nev: 'Száraz anyagok', hozzavaloCsoportok: [] }
    ];

    const kategoriak = [
      {id: 0, nev: 'Alapanyag', anyagok: anyagok }
    ];

    const receptjeim: Recept[] = [
      {id:1, kodneve: 'Palacsinta', cim: 'Palacsinta recept', leiras: 'Finom palacsinta recept', hozzavalok: hozzavalok, allergenek: [allergenek[1]]}
    ];

    return { anyagok, allergenek, hozzavalok, csoportok, kategoriak, receptjeim };
  }
}

*/



import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Injectable } from '@angular/core';
import { Recept } from './models/Recept';
import { Anyag } from './models/Anyag';
import { Allergen } from './models/Allergen';
import { Hozzavalo } from './models/Hozzavalo';
import { Csoport } from './models/Csoport';
import { Kategoria } from './models/Kategoria';
import { User } from './models/User';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    

    const anyagok: Anyag[] = [
      { id: 0, nev: 'Liszt', kategoriaId: 0, kategoria: { id: 0, nev: 'Alapanyag', anyagok: [] }, anyagAllergenek: [] },
      { id: 1, nev: 'Cukor', kategoriaId: 0, kategoria: { id: 0, nev: 'Alapanyag', anyagok: [] }, anyagAllergenek: [] },
      { id: 2, nev: 'Tojás', kategoriaId: 0, kategoria: { id: 0, nev: 'Alapanyag', anyagok: [] }, anyagAllergenek: [] },
      { id: 3, nev: 'Tej', kategoriaId: 0, kategoria: { id: 0, nev: 'Alapanyag', anyagok: [] }, anyagAllergenek: [] },
      { id: 4, nev: 'Só', kategoriaId: 1, kategoria: { id: 1, nev: 'Fűszer', anyagok: [] }, anyagAllergenek: [] },
      { id: 5, nev: 'Bors', kategoriaId: 1, kategoria: { id: 1, nev: 'Fűszer', anyagok: [] }, anyagAllergenek: [] },
      { id: 6, nev: 'Olaj', kategoriaId: 0, kategoria: { id: 0, nev: 'Alapanyag', anyagok: [] }, anyagAllergenek: [] },
    ];

    const allergenek: Allergen[] = [
      { id: 0, nev: 'Glutén', iconUrl: 'assets/icons/gluten.png', anyagAllergenek: [] },
      { id: 1, nev: 'Laktóz', iconUrl: 'assets/icons/lactose.png', anyagAllergenek: [] },
      { id: 2, nev: 'Tojás', iconUrl: 'assets/icons/egg.png', anyagAllergenek: [] }
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

    const receptjeim: Recept[] = [
      { id: 1, kodneve: 'Palacsinta', cim: 'Palacsinta recept', leiras: 'Finom palacsinta recept', hozzavalok: hozzavalok.filter(h => h.receptId === 1), allergenek: [allergenek[1]] },
      { id: 2, kodneve: 'Rántotta', cim: 'Rántotta recept', leiras: 'Egyszerű rántotta recept', hozzavalok: hozzavalok.filter(h => h.receptId === 2), allergenek: [allergenek[2]] },
      { id: 3, kodneve: 'Sóskafőzelék', cim: 'Sóskafőzelék recept', leiras: 'Klasszikus sóskafőzelék recept', hozzavalok: hozzavalok.filter(h => h.receptId === 3), allergenek: [allergenek[1], allergenek[0]] },
      { id: 4, kodneve: 'Sült krumpli', cim: 'Sült krumpli recept', leiras: 'Ropogós sült krumpli recept', hozzavalok: hozzavalok.filter(h => h.receptId === 4), allergenek: [] },
      { id: 5, kodneve: 'Tejbegríz', cim: 'Tejbegríz recept', leiras: 'Gyermekkorunk kedvence, tejbegríz', hozzavalok: hozzavalok.filter(h => h.receptId === 1).concat({ id: 7, anyagId: 3, anyag: anyagok[3], mennyiseg: 300, egyseg: 'ml', receptId: 5, hozzavaloCsoportok: [] }), allergenek: [allergenek[1]] },
    ];

    return { anyagok, allergenek, hozzavalok, csoportok, kategoriak, receptjeim};
  }

  private users: User[] = [];

  getUsers(): User[] {
    return this.users;
  }

  addUser(user: User): void {
    user.id = this.generateId(); // Automatikusan generáljuk az ID-t

    this.users.push(user);
  }

  private generateId(): number {
    return this.users.length ? Math.max(...this.users.map(user => user.id)) + 1 : 1;
  }

  private JWT =
  [
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTg4MjAyMzUsImV4cCI6MTc1MDM1NjIzNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.-1xUA83lUiabD7rfbUq0_Nw4XZRLtrM4oFc7CFOgcfM',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTg4MjAyMzUsImV4cCI6MTc1MDM1NjIzNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.nkkhOITGXFwaGAuCCmCL1aPKaKqRzEC3s_TkRKqpEmM',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTg4MjAyMzUsImV4cCI6MTc1MDM1NjIzNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.wGsWBDXLZixnmuVgDQJj3ZO99ZuY1HCU39E2g59XzgA',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTg4MjAyMzUsImV4cCI6MTc1MDM1NjIzNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.td0rbFOYHL2PtA528JCGnu95Lu8NfaLuuk6gTv8Rydk',
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MTg4MjAyMzUsImV4cCI6MTc1MDM1NjIzNSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.OFXcouGtbWvImAxLstTQwsJ4eMm5xPE3IW38uGTR400'
    
  ]

  login(email: string, password: string): { token: string } | null {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      let rand = Math.floor(Math.random() * (4));
      let token = this.JWT[rand]
      return { token: token }
    }
    return null;
  }
}