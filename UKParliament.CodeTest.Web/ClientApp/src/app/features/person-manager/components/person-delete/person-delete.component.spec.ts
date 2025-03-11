import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivatedRoute, Router, RouterModule, convertToParamMap } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { PersonDeleteComponent } from './person-delete.component';
import { PersonStore } from '../../services/person.store';
import { signal, Signal } from '@angular/core';
import { PersonViewModel } from '../../models/person-view-model';


describe('PersonDeleteComponent', () => {
  let component: PersonDeleteComponent;
  let fixture: ComponentFixture<PersonDeleteComponent>;
  let mockPersonStore: jasmine.SpyObj<PersonStore>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let personSubject: Signal<PersonViewModel | null>;

  beforeEach(async () => {
    // Create mock for PersonStore
    personSubject = signal<PersonViewModel | null>(null);
    mockPersonStore = jasmine.createSpyObj('PersonStore', [
      'loadPeople',
      'selectPerson',
      'deletePerson'
    ]);
    
    // Setup selectedPerson as a signal returning the BehaviorSubject's value
   
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