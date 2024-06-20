import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptekListaComponent } from './receptek-lista.component';

describe('ReceptekListaComponent', () => {
  let component: ReceptekListaComponent;
  let fixture: ComponentFixture<ReceptekListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReceptekListaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceptekListaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
