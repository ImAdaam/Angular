import { Kategoria } from './Kategoria';
import { AnyagAllergen } from './AnyagAllergen';

export class Anyag {
  public id: number;
  public nev: string;
  public kategoriaId: number;
  public kategoria: Kategoria;
  public anyagAllergenek: AnyagAllergen[];

  constructor(
    id: number,
    nev: string,
    kategoriaId: number,
    kategoria: Kategoria,
    anyagAllergenek: AnyagAllergen[]
  ) {
    this.id = id;
    this.nev = nev;
    this.kategoriaId = kategoriaId;
    this.kategoria = kategoria;
    this.anyagAllergenek = anyagAllergenek;
  }
}
