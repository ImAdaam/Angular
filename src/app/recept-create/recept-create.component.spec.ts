import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptCreateComponent } from './recept-create.component';

describe('ReceptCreateComponent', () => {
  let component: ReceptCreateComponent;
  let fixture: ComponentFixture<ReceptCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceptCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
