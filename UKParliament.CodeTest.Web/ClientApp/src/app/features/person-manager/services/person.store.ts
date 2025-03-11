import { Injectable, effect, signal, computed, inject } from '@angular/core';
import { PersonViewModel } from '../models/person-view-model';
import { PersonService } from './person.service';
import { DepartmentViewModel } from '../models/department-view-model';
import { Subject, takeUntil } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PersonStore {
  // State signals
  private _people = signal<PersonViewModel[]>([]);
  private _departments = signal<DepartmentViewModel[]>([]);

  private _selectedPersonId = signal<number | null>(null);
  private _isLoading = signal<boolean>(false); // For loading state
  private _errorMessage = signal<string | null>(null); // For error handling

  private personService = inject(PersonService);
  private departmentService = inject(PersonService);
  private destroy$ = new Subject<void>();
  // Computed properties for reactive data management
  people = computed(() => this._people());


  selectedPerson = computed(() =>
    this._people().find((person) => person.id === this._selectedPersonId()) || null
  );



  // CRUD Operations
  setPeople(people: PersonViewModel[]): void {
    this._people.set(people); // Set all people data
  }

  selectPerson(personId: number | null): void {
    this._selectedPersonId.set(personId); // Set selected person ID
  }

  addPerson(person: PersonViewModel): void {
    // Add person by appending to the existing list
    this._people.set([...this._people(), person]);
  }

  updatePerson(updatedPerson: PersonViewModel): void {
    // Update the person in the list by replacing the entry
    this._people.set(this._people().map(person => 
      person.id === updatedPerson.id ? updatedPerson : person
    ));
  }

  deletePerson(personId: number): void {
    // Remove the person from the list and update the state
    this._people.set(this._people().filter(person => person.id !== personId));

    // Clear selection if the deleted person was selected
    if (this._selectedPersonId() === personId) {
      this._selectedPersonId.set(null);
    }
  }

   // Async Operation: Load people from service
   loadPeople(): void {
    this._isLoading.set(true); // Set loading to true while fetching data

    this.personService.getAll()
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe when destroyed
      .subscribe({
        next: (people) => {
          this._people.set(people); // Update people list
          this._isLoading.set(false); // Set loading to false after data is loaded
        },
        error: (error) => {
          this._isLoading.set(false); // Set loading to false on error
          this._errorMessage.set('Failed to load people. Please try again later.');
          console.error(error); // Log error
        }
      });
  }

    // Unsubscribe when the store is no longer needed
    ngOnDestroy(): void {
      this.destroy$.next(); // Signal that the store is being destroyed
      this.destroy$.complete(); // Clean up the subject
    }
}