import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementationDetailsContainerComponent } from './implementation-details-container.component';

describe('ImplementationDetailsContainerComponent', () => {
  let component: ImplementationDetailsContainerComponent;
  let fixture: ComponentFixture<ImplementationDetailsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImplementationDetailsContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImplementationDetailsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
