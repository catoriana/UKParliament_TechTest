import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdsTableGridComponent } from './pds-table-grid.component';

describe('PdsTableGridComponent', () => {
  let component: PdsTableGridComponent;
  let fixture: ComponentFixture<PdsTableGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdsTableGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdsTableGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
