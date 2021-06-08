import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMTFComponent } from './list-mtf.component';

describe('ListMTFComponent', () => {
  let component: ListMTFComponent;
  let fixture: ComponentFixture<ListMTFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListMTFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListMTFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
