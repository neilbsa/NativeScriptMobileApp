import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeToPickComponent } from './change-to-pick.component';

describe('ChangeToPickComponent', () => {
  let component: ChangeToPickComponent;
  let fixture: ComponentFixture<ChangeToPickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeToPickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeToPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
