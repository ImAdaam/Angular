import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReceptekComponent } from './user-receptek.component';

describe('UserReceptekComponent', () => {
  let component: UserReceptekComponent;
  let fixture: ComponentFixture<UserReceptekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserReceptekComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserReceptekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
