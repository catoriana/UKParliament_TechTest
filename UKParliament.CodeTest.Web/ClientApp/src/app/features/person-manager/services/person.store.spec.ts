// import { TestBed } from '@angular/core/testing';
// import { PersonStore } from './person.store';
// import { PersonService } from './person.service';
// import { DepartmentStore } from './department.store';
// import { of, throwError } from 'rxjs';
// import { PersonViewModel } from '../models/person-view-model';

// describe('PersonStore', () => {
//   let store: typeof PersonStore;
//   let personServiceSpy: jasmine.SpyObj<PersonService>;
//   let departmentStoreSpy: jasmine.SpyObj<DepartmentStore>;

//   beforeEach(() => {
//     personServiceSpy = jasmine.createSpyObj('PersonService', ['getAll', 'addPerson', 'updatePerson', 'deletePerson']);
//     departmentStoreSpy = jasmine.createSpyObj('DepartmentStore', ['getDepartment']);

//     TestBed.configureTestingModule({
//       providers: [
//         { provide: PersonService, useValue: personServiceSpy },
//         { provide: DepartmentStore, useValue: departmentStoreSpy }
//       ]
//     });

//     store = TestBed.inject<typeof PersonStore>(PersonStore); // Get the instance of PersonStore
//   });

//   it('should initialize with default state', () => {
//     expect(store.people()).toEqual([]);
//     expect(store.selectedPerson()).toBeNull();
//     expect(store.loading()).toBeFalse();
//     expect(store.error()).toBeNull();
//   });

//   it('should load persons successfully', () => {
//     const mockPeople: PersonViewModel[] = [{ id: 1, firstName: 'John Doe', lastName: '', departmentId: 2 }];
//     personServiceSpy.getAll.and.returnValue(of(mockPeople));

//     store.loadPersons();

//     // expect(personServiceSpy.getAll).toHaveBeenCalled();
//     // expect(store.people()).toEqual(mockPeople);
//     expect(store.loading()).toBeFalse();
//     expect(store.error()).toBeNull();
//   });

//   it('should handle error while loading persons', () => {
//     personServiceSpy.getAll.and.returnValue(throwError(() => new Error('Network error')));

//     store.loadPersons();

//     expect(personServiceSpy.getAll).toHaveBeenCalled();
//     expect(store.people()).toEqual([]);
//     expect(store.loading()).toBeFalse();
//     expect(store.error()).toBe('Failed to load persons: Network error');
//   });

//   it('should create a person successfully', () => {
//     const newPerson: PersonViewModel = { id: 1, name: 'Jane Doe', departmentId: 3 };
//     personServiceSpy.addPerson.and.returnValue(of(newPerson));

//     store.createPerson({ name: 'Jane Doe', departmentId: 3 });

//     expect(personServiceSpy.addPerson).toHaveBeenCalled();
//     expect(store.people()).toContain(newPerson);
//     expect(store.loading()).toBeFalse();
//     expect(store.error()).toBeNull();
//   });

//   it('should update a person successfully', () => {
//     const existingPerson: PersonViewModel = { id: 1, name: 'John Doe', departmentId: 2 };
//     store.loadPersons();
//     store.createPerson(existingPerson);

//     const updatedPerson: PersonViewModel = { ...existingPerson, name: 'John Smith' };
//     personServiceSpy.updatePerson.and.returnValue(of(updatedPerson));
//     departmentStoreSpy.getDepartment.and.returnValue({ id: 2, name: 'HR' });

//     store.updatePerson(updatedPerson);

//     expect(personServiceSpy.updatePerson).toHaveBeenCalledWith(updatedPerson);
//     expect(store.people().find(p => p.id === updatedPerson.id)?.name).toBe('John Smith');
//     expect(store.loading()).toBeFalse();
//     expect(store.error()).toBeNull();
//   });

//   it('should delete a person successfully', () => {
//     const existingPerson: PersonViewModel = { id: 1, name: 'John Doe', departmentId: 2 };
//     store.loadPersons();
//     store.createPerson(existingPerson);

//     personServiceSpy.deletePerson.and.returnValue(of(null));

//     store.deletePerson(1);

//     expect(personServiceSpy.deletePerson).toHaveBeenCalledWith(1);
//     expect(store.people()).toEqual([]);
//     expect(store.selectedPerson()).toBeNull();
//     expect(store.loading()).toBeFalse();
//     expect(store.error()).toBeNull();
//   });

//   it('should select a person', () => {
//     const person: PersonViewModel = { id: 1, name: 'John Doe', departmentId: 2 };
//     store.createPerson(person);

//     store.selectPerson(1);
//     expect(store.selectedPerson()).toEqual(person);

//     store.selectPerson(null);
//     expect(store.selectedPerson()).toBeNull();
//   });
// });
