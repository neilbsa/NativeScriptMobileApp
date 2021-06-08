import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanMTFComponent } from './scan-mtf.component';

describe('ScanMTFComponent', () => {
  let component: ScanMTFComponent;
  let fixture: ComponentFixture<ScanMTFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanMTFComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanMTFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
