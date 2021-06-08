import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialTransferComponent } from './material-transfer.component';

describe('MaterialTransferComponent', () => {
  let component: MaterialTransferComponent;
  let fixture: ComponentFixture<MaterialTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
