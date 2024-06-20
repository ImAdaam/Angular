import { Hozzavalo } from './Hozzavalo';
import { Csoport } from './Csoport';

export class HozzavaloCsoport {
    public id: number;
    public hozzavaloId: number;
    public hozzavalo: Hozzavalo;
    public csoportId: number;
    public csoport: Csoport;

    constructor(id: number, hozzavaloId: number, hozzavalo: Hozzavalo, csoportId: number, csoport: Csoport) {
        this.id = id;
        this.hozzavaloId = hozzavaloId;
        this.hozzavalo = hozzavalo;
        this.csoportId = csoportId;
        this.csoport = csoport;
    }
}