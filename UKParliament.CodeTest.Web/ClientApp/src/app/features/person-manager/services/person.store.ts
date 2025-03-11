import { Injectable, effect, signal, computed, inject } from '@angular/core';
import { PersonViewModel } from '../models/person-view-model';
import { PersonService } from './person.service';
import { DepartmentViewModel } from '../models/department-view-model';
import { Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonStore {
  // State signals
  private _people = signal<PersonViewModel[]>([]);


  private _selectedPersonId = signal<number | null>(null);
  private _isLoading = signal<boolean>(false); // For loading state
  private _errorMessage = signal<string | null>(null); // For error handling

  private personService = inject(PersonService);

  private destroy$ = new Subject<void>();
  // Computed properties for reactive data management
  people = computed(() => this._people());
  isLoading = computed(() => this._isLoading());

  selectedPerson = computed(
    () =>
      this._people().find((person) => person.id === this._selectedPersonId()) ||
      null
  );

  // CRUD Operations
  setPeople(people: PersonViewModel[]): void {
    this._people.set(people); // Set all people data
  }

  selectPerson(personId: number | null): void {
    this._selectedPersonId.set(personId); // Set selected person ID
  }

  private addPersonInStore(person: PersonViewModel): void {
    // Add person by appending to the existing list
    this._people.set([...this._people(), person]);
  }

  private updatePersonInStore(updatedPerson: PersonViewModel): void {
    // Update the person in the list by replacing the entry
    this._people.set(
      this._people().map((person) =>
        person.id === updatedPerson.id ? updatedPerson : person
      )
    );
  }

  private deletePersonInStore(personId: number): void {
    // Remove the person from the list and update the state
    this._people.set(this._people().filter((person) => person.id !== personId));

  }

  // Async Operation: Load people from service
  loadPeople(): void {
    this._isLoading.set(true); // Set loading to true while fetching data

    this.personService
      .getAll()
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe when destroyed
      .subscribe({
        next: (people) => {
          this._people.set(people); // Update people list
          this._isLoading.set(false); // Set loading to false after data is loaded
        },
        error: (error) => {
          this._isLoading.set(false); // Set loading to false on error
          this._errorMessage.set(
            'Failed to load people. Please try again later.'
          );
          console.error(error); // Log error
        },
      });
  }

   updatePerson(person: PersonViewModel): void {
    this._isLoading.set(true); // Set loading to true while fetching data

    this.personService
      .updatePerson(person)
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe when destroyed
      .subscribe({
        next: () => {
          this.updatePersonInStore(person);
          this._selectedPersonId.set(null);
          this._isLoading.set(false); // Set loading to false after data is loaded
        },
        error: (error) => {
          this._isLoading.set(false); // Set loading to false on error
          this._errorMessage.set(
            'Failed to update person. Please try again later.'
          );
          console.error(error); // Log error
        },
      });

  }

  addPerson(person: PersonViewModel): void {
    this._isLoading.set(true); // Set loading to true while fetching data

    this.personService
      .addPerson(person)
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe when destroyed
      .subscribe({
        next: (person) => {
          this.addPersonInStore(person);
          this._selectedPersonId.set(null);
          this._isLoading.set(false); // Set loading to false after data is loaded
        },
        error: (error) => {
          this.addPersonInStore(person);
          this._isLoading.set(false); // Set loading to false on error
          this._errorMessage.set(
            'Failed to Add person. Please try again later.'
          );
          console.error(error); // Log error
        },
      });

  }

  deletePerson(personId: number): void {
    this._isLoading.set(true); // Set loading to true while fetching data

    this.personService
      .deletePerson(personId)
      .pipe(takeUntil(this.destroy$)) // Automatically unsubscribe when destroyed
      .subscribe({
        next: () => {
          this.deletePersonInStore(personId);
          // Clear selection if the deleted person was selected
          if (this._selectedPersonId() === personId) {
            this._selectedPersonId.set(null);
          }
          this._isLoading.set(false); // Set loading to false after data is loaded
        },
        error: (error) => {
          this._isLoading.set(false); // Set loading to false on error
          this._errorMessage.set(
            'Failed to delete person. Please try again later.'
          );
          console.error(error); // Log error
        },
      });

  }

  // Unsubscribe when the store is no longer needed
  ngOnDestroy(): void {
    this.destroy$.next(); // Signal that the store is being destroyed
    this.destroy$.complete(); // Clean up the subject
  }
}
