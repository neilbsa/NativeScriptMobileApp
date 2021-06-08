import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoforcastComponent } from './poforcast.component';

describe('PoforcastComponent', () => {
  let component: PoforcastComponent;
  let fixture: ComponentFixture<PoforcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoforcastComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoforcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
