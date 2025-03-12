import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonDeleteComponent } from './person-delete.component';
import { PersonStore } from '../../services/person.store';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { PersonViewModel } from '../../models/person-view-model';
import { signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

describe('PersonDeleteComponent', () => {
  let component: PersonDeleteComponent;
  let fixture: ComponentFixture<PersonDeleteComponent>;
  let personStore: any;
  let router: jasmine.SpyObj<Router>;
  let route: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    // Mock PersonStore with signal support
    personStore = jasmine.createSpyObj('PersonStore', [
      'loadPersons', 'selectPerson', 'createPerson', 'updatePerson', 'deletePerson'
    ]);

    // Mocking selectedPerson signal
    personStore.selectedPerson = signal<PersonViewModel | null>(null); // Using signal for selectedPerson
    personStore.selectPerson.and.callFake((id: number) => {
      // Simulate the behavior of selectPerson with a mocked signal
      if (id === 1) {
        personStore.selectedPerson.set({
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1990-01-01',
          departmentId: 1
        });
      } else {
        personStore.selectedPerson.set(null);
      }
    });

    // Mock Router
    router = jasmine.createSpyObj('Router', ['navigate']);

    // Mock ActivatedRoute with paramMap as a getter
    route = jasmine.createSpyObj('ActivatedRoute', ['paramMap']);
    Object.defineProperty(route, 'paramMap', {
      get: () => of(new Map([['id', '1']])),  // Mocking paramMap to return the ID as an observable
    });

    TestBed.configureTestingModule({
      imports: [PersonDeleteComponent, RouterTestingModule, CommonModule, DatePipe],
      providers: [
        { provide: PersonStore, useValue: personStore },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
      ],
    });

    fixture = TestBed.createComponent(PersonDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call selectPerson when initialized with an ID', () => {
    component.ngOnInit();
    
    expect(personStore.selectPerson).toHaveBeenCalledWith(1);
    expect(component.person()).toEqual({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      departmentId: 1
    });
  });

  it('should navigate to the person-manager page onCancel', () => {
    component.onCancel();

    expect(router.navigate).toHaveBeenCalledWith(['/person-manager']);
  });

  it('should call deletePerson and navigate when onDelete is triggered', () => {
    const personId = 1;

    component.onDelete(personId);

    expect(personStore.deletePerson).toHaveBeenCalledWith(personId);
    expect(router.navigate).toHaveBeenCalledWith(['/person-manager']);
  });
});
