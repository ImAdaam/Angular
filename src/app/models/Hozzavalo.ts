import { Anyag } from './Anyag';
import { HozzavaloCsoport } from './HozzavaloCsoport';

export class Hozzavalo {
  public id: number;
  public anyagId: number;
  public anyag: Anyag;
  public mennyiseg: number;
  public egyseg: string;
  public receptId: number;
  public hozzavaloCsoportok: HozzavaloCsoport[];

  constructor(
    id: number,
    anyagId: number,
    anyag: Anyag,
    mennyiseg: number,
    egyseg: string,
    receptId: number,
    hozzavaloCsoportok: HozzavaloCsoport[]
  ) {
    this.id = id;
    this.anyagId = anyagId;
    this.anyag = anyag;
    this.mennyiseg = mennyiseg;
    this.egyseg = egyseg;
    this.receptId = receptId;
    this.hozzavaloCsoportok = hozzavaloCsoportok;
  }
}
