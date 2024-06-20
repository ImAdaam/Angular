import { Anyag } from './Anyag';

export class Kategoria {
    public id: number;
    public nev: string;
    public anyagok: Anyag[];

    constructor(id: number, nev: string, anyagok: Anyag[]) {
        this.id = id;
        this.nev = nev;
        this.anyagok = anyagok;
    }
}