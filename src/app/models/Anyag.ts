import { Kategoria } from './Kategoria';
import { AnyagAllergen } from './AnyagAllergen';
import { Allergen } from './Allergen';

export class Anyag {
  public id: number;
  public nev: string;
  public kategoriaId: number;
  public kategoria: Kategoria;
  public anyagAllergenek: AnyagAllergen[];
  public allergenek: Allergen[];

  constructor(
    id: number,
    nev: string,
    kategoriaId: number,
    kategoria: Kategoria,
    anyagAllergenek: AnyagAllergen[],
    allergenek: Allergen[]
  ) {
    this.id = id;
    this.nev = nev;
    this.kategoriaId = kategoriaId;
    this.kategoria = kategoria;
    this.anyagAllergenek = anyagAllergenek;
    this.allergenek = allergenek;
  }
}
