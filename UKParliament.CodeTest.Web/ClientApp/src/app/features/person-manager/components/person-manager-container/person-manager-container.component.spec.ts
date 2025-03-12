// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { By } from '@angular/platform-browser';
// import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, signal } from '@angular/core';

// import { PersonManagerContainerComponent } from './person-manager-container.component';
// import { PersonStore } from '../../services/person.store';
// import { DepartmentStore } from '../../services/department.store';
// import { PersonViewModel } from '../../models/person-view-model';
// import { DepartmentViewModel } from '../../models/department-view-model';

// // Mock components
// @Component({
//   selector: 'app-person-list',
//   template: '<div></div>'
// })
// class MockPersonListComponent {
//   @Input() people: PersonViewModel[] | null = [];
//   @Input() selectedPerson: PersonViewModel | null = null;
//   @Output() personSelected = new EventEmitter<PersonViewModel>();
//   @Output() personDeleted = new EventEmitter<number>();
//   @Output() addPerson = new EventEmitter<void>();
// }

// @Component({
//   selector: 'app-pds-person-editor',
//   template: '<div></div>'
// })
// class MockPdsPersonEditorComponent {
//   @Input() componentTitle!: string;
//   @Input() buttonReset!: string;
//   @Input() departments: DepartmentViewModel[] | null = [];
//   @Input() person: PersonViewModel | null = null;
//   @Output() submitEvent = new EventEmitter<PersonViewModel>();
//   @Output() cancelEvent = new EventEmitter<void>();
// }

// describe('PersonManagerContainerComponent', () => {
//   let component: PersonManagerContainerComponent;
//   let fixture: ComponentFixture<PersonManagerContainerComponent>;
//   let mockPersonStore: jasmine.SpyObj<PersonStore>;
//   let mockDepartmentStore: jasmine.SpyObj<DepartmentStore>;
//   let mockRouter: jasmine.SpyObj<Router>;
//   let mockActivatedRoute: any;

//   const mockPeople = [
//     { id: 1, firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01', departmentId: 1 },
//     { id: 2, firstName: 'Jane', lastName: 'Smith', dateOfBirth: '1985-05-05', departmentId: 2 }
//   ] as PersonViewModel[];

//   const mockDepartments = [
//     { id: 1, name: 'HR' },
//     { id: 2, name: 'Engineering' }
//   ] as DepartmentViewModel[];

//   const mockPerson = mockPeople[0];

//   beforeEach(async () => {
//     // Create spies for the stores
//     const peopleSignal = signal<PersonViewModel[]>(mockPeople);
//     const loadingSignal = signal<boolean>(false);
//     const selectedPersonSignal = signal<PersonViewModel | null>(null);
//     const departmentsSignal = signal<DepartmentViewModel[]>(mockDepartments);

//     mockPersonStore = jasmine.createSpyObj('PersonStore', [
//       'loadPeople',
//       'selectPerson',
//       'addPerson',
//       'updatePerson',
//       'deletePerson'
//     ], {
//       people: peopleSignal,
//       isLoading: loadingSignal,
//       selectedPerson: selectedPersonSignal
//     });

//     mockDepartmentStore = jasmine.createSpyObj('DepartmentStore', [
//       'loadDepartments'
//     ], {
//       departments: departmentsSignal
//     });

//     mockRouter = jasmine.createSpyObj('Router', ['navigate']);
//     mockActivatedRoute = {};

//     await TestBed.configureTestingModule({
//       imports: [
//         CommonModule,
//         RouterModule,
//         PersonManagerContainerComponent
//       ],
//       declarations: [
//         MockPersonListComponent,
//         MockPdsPersonEditorComponent
//       ],
//       providers: [
//         { provide: PersonStore, useValue: mockPersonStore },
//         { provide: DepartmentStore, useValue: mockDepartmentStore },
//         { provide: Router, useValue: mockRouter },
//         { provide: ActivatedRoute, useValue: mockActivatedRoute }
//       ]
//     })
//     .overrideComponent(PersonManagerContainerComponent, {
//       set: {
//         imports: [
//           CommonModule,
//           RouterModule,
//           MockPersonListComponent,
//           MockPdsPersonEditorComponent
//         ],
//         changeDetection: ChangeDetectionStrategy.Default
//       }
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(PersonManagerContainerComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('ngOnInit', () => {
//     it('should load people and departments on initialization', () => {
//       // The loadPeople and loadDepartments should have been called in beforeEach during fixture.detectChanges()
//       expect(mockPersonStore.loadPeople).toHaveBeenCalled();
//       expect(mockDepartmentStore.loadDepartments).toHaveBeenCalled();
//     });
//   });

//   describe('onPersonSelected', () => {
//     it('should call personStore.selectPerson with correct id', () => {
//       // Arrange
//       const person = { ...mockPerson };

//       // Act
//       component.onPersonSelected(person);

//       // Assert
//       expect(mockPersonStore.selectPerson).toHaveBeenCalledWith(person.id);
//     });
//   });

//   describe('onPersonAdded', () => {
//     it('should call personStore.addPerson with the provided person', () => {
//       // Arrange
//       const person = { ...mockPerson, id: 0 };

//       // Act
//       component.onPersonAdded(person);

//       // Assert
//       expect(mockPersonStore.addPerson).toHaveBeenCalledWith(person);
//     });
//   });

//   describe('onPersonUpdated', () => {
//     it('should call personStore.updatePerson with the provided person', () => {
//       // Arrange
//       const person = { ...mockPerson };

//       // Act
//       component.onPersonUpdated(person);

//       // Assert
//       expect(mockPersonStore.updatePerson).toHaveBeenCalledWith(person);
//     });
//   });

//   describe('onPersonDeleted', () => {
//     it('should navigate to delete route with correct personId', () => {
//       // Arrange
//       const personId = 1;

//       // Act
//       component.onPersonDeleted(personId);

//       // Assert
//       expect(mockPersonStore.selectPerson).toHaveBeenCalledWith(personId);
//       expect(mockRouter.navigate).toHaveBeenCalledWith(['delete', personId], { relativeTo: mockActivatedRoute });
//     });
//   });

//   describe('onCancel', () => {
//     it('should call resetState', () => {
//       // Arrange
//       spyOn(component as any, 'resetState');

//       // Act
//       component.onCancel();

//       // Assert
//       expect((component as any).resetState).toHaveBeenCalled();
//     });
//   });

//   describe('onAdd', () => {
//     it('should call resetState', () => {
//       // Arrange
//       spyOn(component as any, 'resetState');

//       // Act
//       component.onAdd();

//       // Assert
//       expect((component as any).resetState).toHaveBeenCalled();
//     });
//   });

//   describe('resetState', () => {
//     it('should call personStore.selectPerson with null', () => {
//       // Act
//       (component as any).resetState();

//       // Assert
//       expect(mockPersonStore.selectPerson).toHaveBeenCalledWith(null);
//     });
//   });
// });