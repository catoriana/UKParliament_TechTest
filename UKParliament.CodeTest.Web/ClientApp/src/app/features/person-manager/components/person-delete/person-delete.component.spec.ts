import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonDeleteComponent } from './person-delete.component';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PersonStore } from '../../services/person.store';
import { of } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';

describe('PersonDeleteComponent', () => {
  let component: PersonDeleteComponent;
  let fixture: ComponentFixture<PersonDeleteComponent>;
  let personStoreMock: jasmine.SpyObj<PersonStore>;
  let activatedRouteMock: jasmine.SpyObj<ActivatedRoute>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create mock instances of the services
    personStoreMock = jasmine.createSpyObj('PersonStore', ['selectPerson', 'deletePerson']);
    activatedRouteMock = jasmine.createSpyObj('ActivatedRoute', ['paramMap']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    // Mock the route paramMap observable
    activatedRouteMock.params = of({ get: () => '123' }); // Mocking an ID of '123'

    await TestBed.configureTestingModule({
      declarations: [PersonDeleteComponent],
      imports: [CommonModule, RouterModule],
      providers: [
        { provide: PersonStore, useValue: personStoreMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: Router, useValue: routerMock },
        DatePipe,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call selectPerson if person is not selected when ID param is provided', () => {
    // Mock the initial person state (no person selected)
    personStoreMock.selectedPerson = jasmine.createSpy().and.returnValue(null);

    // Trigger ngOnInit
    component.ngOnInit();

    expect(personStoreMock.selectPerson).toHaveBeenCalledWith(123);
  });

  it('should not call selectPerson if person is already selected when ID param is provided', () => {
    // Mock the initial person state (person is already selected)
    personStoreMock.selectedPerson = jasmine.createSpy().and.returnValue({ id: 123 });

    // Trigger ngOnInit
    component.ngOnInit();

    expect(personStoreMock.selectPerson).not.toHaveBeenCalled();
  });

  it('should navigate to "/person-manager" when onCancel is called', () => {
    component.onCancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/person-manager']);
  });

  it('should call deletePerson and navigate to "/person-manager" when onDelete is called', () => {
    component.onDelete(123);

    expect(personStoreMock.deletePerson).toHaveBeenCalledWith(123);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/person-manager']);
  });
});
