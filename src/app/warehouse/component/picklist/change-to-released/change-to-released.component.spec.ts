import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeToReleasedComponent } from './change-to-released.component';

describe('ChangeToReleasedComponent', () => {
  let component: ChangeToReleasedComponent;
  let fixture: ComponentFixture<ChangeToReleasedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeToReleasedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeToReleasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
