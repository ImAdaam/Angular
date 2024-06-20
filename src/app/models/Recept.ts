/*import { Hozzavalo } from './Hozzavalo';
import { Allergen } from './Allergen';

export class Recept {
    public kodneve: string;
    public cim: string;
    public leiras: string;
    public hozzavalok: Hozzavalo[];

    constructor(kodneve: string, cime: string, leirasa: string, hozzavalok: Hozzavalo[]) {
        this.kodneve = kodneve;
        this.cim = cime;
        this.leiras = leirasa;
        this.hozzavalok = hozzavalok;
        
    }
}
*/

import { Hozzavalo } from './Hozzavalo';
import { Allergen } from './Allergen';
import { User } from './User';

export class Recept {
    public id: number;
    public cim: string;
    public leiras: string;
    public hozzavalok: Hozzavalo[];
    public allergenek: Allergen[];
    public user: User; // Új mező hozzáadása

    constructor(id: number, cime: string, leirasa: string, hozzavalok: Hozzavalo[], allergenek: Allergen[], user: User) {
        this.id = id;
        this.cim = cime;
        this.leiras = leirasa;
        this.hozzavalok = hozzavalok;
        this.allergenek = allergenek; // Hozzáadva az allergenek mező
        this.user = user;
    }



}


export class ReceptModel {
    public static receptek: Recept[] = [
        
    ];
  }
