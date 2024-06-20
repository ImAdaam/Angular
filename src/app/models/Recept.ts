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

export class Recept {
    public id: number;
    public kodneve: string;
    public cim: string;
    public leiras: string;
    public hozzavalok: Hozzavalo[];
    public allergenek: Allergen[];

    constructor(id: number, kodneve: string, cime: string, leirasa: string, hozzavalok: Hozzavalo[], allergenek: Allergen[]) {
        this.id = id;
        this.kodneve = kodneve;
        this.cim = cime;
        this.leiras = leirasa;
        this.hozzavalok = hozzavalok;
        this.allergenek = allergenek; // Hozzáadva az allergenek mező
    }
}