import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PersonManagerContainerComponent } from './person-manager-container.component';
import { PersonService } from '../../services/person.service';
import { PersonStore } from '../../services/person.store';
import { DepartmentService } from '../../services/department.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PersonListComponent } from '../person-list/person-list.component';
import { PdsPersonEditorComponent } from 'src/app/shared/ui/components/pds-person-editor/pds-person-editor.component';
import { PersonViewModel } from '../../models/person-view-model';
import { DepartmentViewModel } from '../../models/department-view-model';
import { of } from 'rxjs';
import { ChangeDetectionStrategy, signal } from '@angular/core';

describe('PersonManagerContainerComponent', () => {
  let component: PersonManagerContainerComponent;
  let fixture: ComponentFixture<PersonManagerContainerComponent>;
  let personServiceSpy: jasmine.SpyObj<PersonService>;
  let personStoreSpy: jasmine.SpyObj<PersonStore>;
  let departmentServiceSpy: jasmine.SpyObj<DepartmentService>;

  const mockPeople: PersonViewModel[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', departmentId: 1, dateOfBirth: '1987-01-02'},
    { id: 2, firstName: 'Jane', lastName: 'Smith', departmentId: 2, dateOfBirth: '2000-05-22'}
  ];

  const mockDepartments: DepartmentViewModel[] = [
    { id: 1, name: 'HR' },
    { id: 2, name: 'Engineering' }
  ];

  beforeEach(async () => {
    // Create spies for the services and store
    personServiceSpy = jasmine.createSpyObj('PersonService', ['getAll', 'addPerson', 'updatePerson', 'deletePerson']);
    personStoreSpy = jasmine.createSpyObj('PersonStore', [
      'setPeople', 
      'selectPerson', 
      'addPerson', 
      'updatePerson', 
      'deletePerson'
    ], {
      // Mock signal properties
      people: signal(mockPeople),
      selectedPerson: signal(null),
      totalPeople: signal(mockPeople.length)
    });
    
    departmentServiceSpy = jasmine.createSpyObj('DepartmentService', ['getAll']);

    // Set up default return values for service methods
    personServiceSpy.getAll.and.returnValue(of(mockPeople));
    personServiceSpy.addPerson.and.callFake(person => of({ ...person, id: 3 }));
    personServiceSpy.updatePerson.and.callFake(person => of(person));
    personServiceSpy.deletePerson.and.returnValue(of(void 0));
    departmentServiceSpy.getAll.and.returnValue(of(mockDepartments));

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterModule,
        PersonManagerContainerComponent,
        PersonListComponent,
        PdsPersonEditorComponent
      ],
      providers: [
        { provide: PersonService, useValue: personServiceSpy },
        { provide: PersonStore, useValue: personStoreSpy },
        { provide: DepartmentService, useValue: departmentServiceSpy }
      ]
    })
    // Override the component's ChangeDetectionStrategy to enable testing
    .overrideComponent(PersonManagerContainerComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonManagerContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with data from services during ngOnInit', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(personServiceSpy.getAll).toHaveBeenCalled();
    expect(departmentServiceSpy.getAll).toHaveBeenCalled();
    expect(personStoreSpy.setPeople).toHaveBeenCalledWith(mockPeople);
    expect(component.departments()).toEqual(mockDepartments);
  }));

  it('should call selectPerson when onPersonSelected is called', () => {
    const selectedPerson = mockPeople[0];
    component.onPersonSelected(selectedPerson);
    
    expect(personStoreSpy.selectPerson).toHaveBeenCalledWith(selectedPerson.id);
  });

  it('should add a person and reset state when onPersonAdded is called', fakeAsync(() => {
    const newPerson: PersonViewModel = { 
      id: 0, 
      firstName: 'New', 
      lastName: 'Person', 
      departmentId: 1, 
      dateOfBirth: '1988-01-02', 

    };
    const addedPerson = { ...newPerson, id: 3 };
    
    component.onPersonAdded(newPerson);
    tick();
    
    expect(personServiceSpy.addPerson).toHaveBeenCalledWith(newPerson);
    expect(personStoreSpy.addPerson).toHaveBeenCalledWith(addedPerson);
    expect(personStoreSpy.selectPerson).toHaveBeenCalledWith(null);
  }));

  it('should update a person and reset state when onPersonUpdated is called', fakeAsync(() => {
    const updatedPerson = { ...mockPeople[0], firstName: 'Updated' };
    
    component.onPersonUpdated(updatedPerson);
    tick();
    
    expect(personServiceSpy.updatePerson).toHaveBeenCalledWith(updatedPerson);
    expect(personStoreSpy.updatePerson).toHaveBeenCalledWith(updatedPerson);
    expect(personStoreSpy.selectPerson).toHaveBeenCalledWith(null);
  }));

  it('should delete a person and reset state when onPersonDeleted is called', fakeAsync(() => {
    const personId = 1;
    
    component.onPersonDeleted(personId);
    tick();
    
    expect(personServiceSpy.deletePerson).toHaveBeenCalledWith(personId);
    expect(personStoreSpy.deletePerson).toHaveBeenCalledWith(personId);
    expect(personStoreSpy.selectPerson).toHaveBeenCalledWith(null);
  }));

  it('should reset state when onCancel is called', () => {
    component.onCancel();
    
    expect(personStoreSpy.selectPerson).toHaveBeenCalledWith(null);
  });

  it('should reset state when onAdd is called', () => {
    component.onAdd();
    
    expect(personStoreSpy.selectPerson).toHaveBeenCalledWith(null);
  });

  // Test for error handling
  it('should handle errors when adding a person', fakeAsync(() => {
    const newPerson: PersonViewModel = { 
      id: 0, 
      firstName: 'Error', 
      lastName: 'Person', 
      departmentId: 1, 
      dateOfBirth: '1988-01-02', 
    };
    
    // Make the service return an error
    const error = new Error('Server error');
    personServiceSpy.addPerson.and.returnValue(of(error) as any);
    
    // We need to spy on console.error to prevent test output pollution
    spyOn(console, 'error');
    
    component.onPersonAdded(newPerson);
    tick();
    
    expect(personServiceSpy.addPerson).toHaveBeenCalledWith(newPerson);
    // The store operations should not be called due to error
    expect(personStoreSpy.addPerson).not.toHaveBeenCalled();
  }));
});