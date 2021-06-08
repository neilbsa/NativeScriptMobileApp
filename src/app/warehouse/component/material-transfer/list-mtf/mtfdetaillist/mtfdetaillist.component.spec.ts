import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtfdetaillistComponent } from './mtfdetaillist.component';

describe('MtfdetaillistComponent', () => {
  let component: MtfdetaillistComponent;
  let fixture: ComponentFixture<MtfdetaillistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtfdetaillistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtfdetaillistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
