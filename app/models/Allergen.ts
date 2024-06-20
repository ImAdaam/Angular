import { AnyagAllergen } from './AnyagAllergen';

export class Allergen {
  public id: number;
  public nev: string;
  public iconUrl: string;
  public anyagAllergenek: AnyagAllergen[];

  constructor(id: number, nev: string, iconUrl: string, anyagAllergenek: AnyagAllergen[]) {
    this.id = id;
    this.nev = nev;
    this.iconUrl = iconUrl;
    this.anyagAllergenek = anyagAllergenek;
  }
}
