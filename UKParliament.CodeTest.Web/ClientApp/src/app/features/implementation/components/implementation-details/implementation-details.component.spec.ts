import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementationDetailsComponent } from './implementation-details.component';

describe('ImplementationDetailsContainerComponent', () => {
  let component: ImplementationDetailsComponent;
  let fixture: ComponentFixture<ImplementationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImplementationDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImplementationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
