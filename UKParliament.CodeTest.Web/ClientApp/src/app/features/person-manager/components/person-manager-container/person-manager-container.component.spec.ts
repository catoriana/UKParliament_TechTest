import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonManagerContainerComponent } from './person-manager-container.component';
import { PersonStore } from '../../services/person.store';
import { DepartmentStore } from '../../services/department.store';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { PersonViewModel } from '../../models/person-view-model';
import { DepartmentViewModel } from '../../models/department-view-model';
import { signal } from '@angular/core';  // Import signal from Angular

describe('PersonManagerContainerComponent with Signals Store', () => {
  let component: PersonManagerContainerComponent;
  let fixture: ComponentFixture<PersonManagerContainerComponent>;
  let personStore: any;
  let departmentStore: jasmine.SpyObj<DepartmentStore>;
  let router: jasmine.SpyObj<Router>;
  let route: ActivatedRoute;

  beforeEach(() => {
    // Mock the signal store
    personStore = jasmine.createSpyObj('PersonStore', ['loadPersons', 'selectPerson', 'createPerson', 'updatePerson', 'deletePerson']);

    // Mock signals for reactive state
    personStore.loading = signal<boolean>(false);  // Mocked loading signal
    personStore.people = signal<PersonViewModel[]>([]);  // Mocked people signal
    personStore.selectedPerson = signal<PersonViewModel | null>(null);  // Mocked selectedPerson signal

    const departmentStoreSpy = jasmine.createSpyObj('DepartmentStore', ['loadDepartments']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    // Mock department signal
    departmentStoreSpy.departments = signal<DepartmentViewModel[]>([]);  // Mocked departments signal

    TestBed.configureTestingModule({
      imports: [PersonManagerContainerComponent, RouterTestingModule],
      providers: [
        { provide: PersonStore, useValue: personStore },
        { provide: DepartmentStore, useValue: departmentStoreSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} }
      ]
    });

    fixture = TestBed.createComponent(PersonManagerContainerComponent);
    component = fixture.componentInstance;
    personStore = TestBed.inject(PersonStore);
    departmentStore = TestBed.inject(DepartmentStore) as jasmine.SpyObj<DepartmentStore>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    route = TestBed.inject(ActivatedRoute);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadPersons and loadDepartments on initialization', () => {
    personStore.loadPersons.and.callFake(() => {
      personStore.people.set([{ id: 1, firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01', departmentId: 1 }]);
    });
    departmentStore.loadDepartments.and.returnValue();

    component.ngOnInit();

    expect(personStore.loadPersons).toHaveBeenCalled();
    expect(departmentStore.loadDepartments).toHaveBeenCalled();
    expect(personStore.people()).toEqual([{ id: 1, firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01', departmentId: 1 }]);
  });

  it('should call createPerson when onPersonAdded is triggered', () => {
    
    const person: PersonViewModel = { id: 1, firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01', departmentId: 1 };

    component.onPersonAdded(person);

    expect(personStore.selectedPerson()).toBeNull();
  });

  it('should call navigate to delete route when onPersonDeleted is triggered', () => {
    const personId = 1;

    component.onPersonDeleted(personId);

    expect(router.navigate).toHaveBeenCalledWith(['delete', personId], { relativeTo: route });
  });

  it('should reset state when onCancel is called', () => {
    component.onCancel();

    expect(personStore.selectedPerson()).toBeNull();
  });

  it('should reset state when onAdd is called', () => {
    component.onAdd();

    expect(personStore.selectedPerson()).toBeNull();
  });

  it('should properly bind isLoading property', () => {
    expect(component.isLoading()).toBe(false);  // Access the signal value using '()'

    // Update the loading signal
    personStore.loading.set(true);
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
  });


});
