import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule, convertToParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { PersonDeleteComponent } from './person-delete.component';
import { PersonStore } from '../../services/person.store';
import { Person } from '../../models/person.model'; // Assuming this model exists

describe('PersonDeleteComponent', () => {
  let component: PersonDeleteComponent;
  let fixture: ComponentFixture<PersonDeleteComponent>;
  let mockPersonStore: jasmine.SpyObj<PersonStore>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let personSubject: BehaviorSubject<Person | null>;

  beforeEach(async () => {
    // Create mock for PersonStore
    personSubject = new BehaviorSubject<Person | null>(null);
    mockPersonStore = jasmine.createSpyObj('PersonStore', [
      'loadPeople',
      'selectPerson',
      'deletePerson'
    ]);
    
    // Setup selectedPerson as a signal returning the BehaviorSubject's value
    mockPersonStore.selectedPerson = jasmine.createSpy().and.callFake(() => personSubject.value);

    // Create mock for Router
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Create mock for ActivatedRoute
    mockActivatedRoute = {
      paramMap: of(convertToParamMap({ id: '123' }))
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterModule, PersonDeleteComponent],
      providers: [
        { provide: PersonStore, useValue: mockPersonStore },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonDeleteComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load people and select person if person is null', fakeAsync(() => {
      // Initial setup - person is null
      personSubject.next(null);
      
      // Call ngOnInit
      fixture.detectChanges();
      tick();
      
      // Verify correct methods were called
      expect(mockPersonStore.loadPeople).toHaveBeenCalled();
      expect(mockPersonStore.selectPerson).toHaveBeenCalledWith(123);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/person-manager']);
    }));

    it('should not load people or select person if person already exists', fakeAsync(() => {
      // Setup - person exists
      const testPerson: Person = { id: 123, name: 'Test Person' }; // Adjust according to your Person model
      personSubject.next(testPerson);
      
      // Call ngOnInit
      fixture.detectChanges();
      tick();
      
      // Verify methods were not called
      expect(mockPersonStore.loadPeople).not.toHaveBeenCalled();
      expect(mockPersonStore.selectPerson).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    }));

    it('should not attempt to select person if no id param exists', fakeAsync(() => {
      // Update route params to have no id
      mockActivatedRoute.paramMap = of(convertToParamMap({}));
      
      // Call ngOnInit
      fixture.detectChanges();
      tick();
      
      // Verify methods were not called
      expect(mockPersonStore.loadPeople).not.toHaveBeenCalled();
      expect(mockPersonStore.selectPerson).not.toHaveBeenCalled();
    }));
  });

  describe('onCancel', () => {
    it('should navigate to person-manager route', () => {
      // Call onCancel
      component.onCancel();
      
      // Verify navigation
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/person-manager']);
    });
  });

  describe('onDelete', () => {
    it('should call deletePerson with the provided id', () => {
      // Call onDelete with test ID
      const testId = 123;
      component.onDelete(testId);
      
      // Verify deletePerson was called
      expect(mockPersonStore.deletePerson).toHaveBeenCalledWith(testId);
    });

    it('should not call deletePerson when id is undefined', () => {
      // Call onDelete with undefined
      component.onDelete(undefined);
      
      // Verify deletePerson was not called
      expect(mockPersonStore.deletePerson).not.toHaveBeenCalled();
    });
  });
});