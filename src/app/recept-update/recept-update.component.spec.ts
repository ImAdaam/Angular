import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptUpdateComponent } from './recept-update.component';

describe('ReceptUpdateComponent', () => {
  let component: ReceptUpdateComponent;
  let fixture: ComponentFixture<ReceptUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceptUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
