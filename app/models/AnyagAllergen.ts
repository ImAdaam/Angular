import { Anyag } from './Anyag';
import { Allergen } from './Allergen';

export class AnyagAllergen {
  public id: number;
  public anyagId: number;
  public anyag: Anyag;
  public allergenId: number;
  public allergen: Allergen;

  constructor(
    id: number,
    anyagId: number,
    anyag: Anyag,
    allergenId: number,
    allergen: Allergen
  ) {
    this.id = id;
    this.anyagId = anyagId;
    this.anyag = anyag;
    this.allergenId = allergenId;
    this.allergen = allergen;
  }
}
