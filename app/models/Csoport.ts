import { HozzavaloCsoport } from './HozzavaloCsoport';

export class Csoport {
    public id: number;
    public nev: string;
    public hozzavaloCsoportok: HozzavaloCsoport[];

    constructor(id: number, nev: string, hozzavaloCsoportok: HozzavaloCsoport[]) {
        this.id = id;
        this.nev = nev;
        this.hozzavaloCsoportok = hozzavaloCsoportok;
    }
}