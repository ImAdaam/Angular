import { TestBed } from '@angular/core/testing';

import { ReceptService } from './recept.service';

describe('ReceptService', () => {
  let service: ReceptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

