import { Injectable, computed, effect, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, catchError, pipe, switchMap, tap } from 'rxjs';
import { PersonViewModel } from '../models/person-view-model';
import { PersonService } from './person.service';
import { DepartmentStore } from './department.store';



interface PersonState {
    people: PersonViewModel[];
    selectedPerson: PersonViewModel | null;
    loading: boolean;
    error: string | null;
  }

  const initialState: PersonState = {
    people: [],
    selectedPerson: null,
    loading: false,
    error: null
  };

  export const PersonStore = signalStore(
    { providedIn: 'root' },
  
  // Define the state
  withState(initialState),
  
  // Define computed properties
  withComputed((state) => ({
    personCount: computed(() => state.people().length),
    
  })),
  
  // Define methods
  withMethods((state) => {
    // Inject the API service
    const personService = inject(PersonService);
    const departmentStore = inject(DepartmentStore);
    
    return {
      // Helper methods
      setLoading(loading: boolean) {
        patchState(state, { loading });
      },
      
      setError(error: string | null) {
        patchState(state, { error });
      },
      
      // Load all persons
      loadPersons: rxMethod<void>(
        pipe(
          tap(() => patchState(state, { loading: true })),
          switchMap(() => personService.getAll().pipe(
            tap({
              next: (people) => patchState(state, { 
                people, 
                error: null, 
                loading: false 
              }),
              error: (error) => patchState(state, { 
                error: `Failed to load persons: ${error.message}`, 
                loading: false 
              })
            }),
            catchError(() => EMPTY)
          ))
        )
      ),
    
      // Create a new person
      createPerson: rxMethod<PersonViewModel>(
        pipe(
          tap(() => patchState(state, { loading: true })),
          switchMap((person) => personService.addPerson(person).pipe(
            tap({
              next: (newPerson) =>{
                newPerson.department = departmentStore.getDepartment(person.departmentId);
                patchState(state, { 
                
                  people: [...state.people(), newPerson],
                  selectedPerson: null,
                  error: null, 
                  loading: false 
                })
              } ,
              error: (error) => patchState(state, { 
                error: `Failed to create person: ${error.message}`, 
                loading: false 
              })
            }),
            catchError(() => EMPTY)
          ))
        )
      ),
      
      // Update an existing person
      updatePerson: rxMethod<PersonViewModel>(
        pipe(
          tap(() => patchState(state, { loading: true })),
          switchMap((person) => personService.updatePerson(person).pipe(
            tap({
              next: () => {
                person.department = departmentStore.getDepartment(person.departmentId);
                const updatedPersons = state.people().map(p => 
                  p.id === person.id ? person : p
                );
               
                patchState(state, { 
                    people: updatedPersons,
                  selectedPerson: null,
                  error: null, 
                  loading: false 
                });
                
              },
              error: (error) => patchState(state, { 
                error: `Failed to update person: ${error.message}`, 
                loading: false 
              })
            }),
            catchError(() => EMPTY)
          ))
        )
      ),
      
      // Delete a person
      deletePerson: rxMethod<number>(
        pipe(
          tap(() => patchState(state, { loading: true })),
          switchMap((id) => personService.deletePerson(id).pipe(
            tap({
              next: () => {
                const filteredPersons = state.people().filter(p => p.id !== id);
                
                patchState(state, { 
                    people: filteredPersons,
                  selectedPerson: state.selectedPerson()?.id === id 
                    ? null 
                    : state.selectedPerson(),
                  error: null, 
                  loading: false 
                });
              },
              error: (error) => patchState(state, { 
                error: `Failed to delete person: ${error.message}`, 
                loading: false 
              })
            }),
            catchError(() => EMPTY)
          ))
        )
      ),
      
      // Set selected person without API call
      selectPerson(id: number | null): void {
        if (id === null) {
          patchState(state, { selectedPerson: null });
          return;
        }
        
        const person = state.people().find(p => p.id === id) || null;
        patchState(state, { selectedPerson: person });
      },
      

      // Clear selected person
      clearSelectedPerson(): void {
        patchState(state, { selectedPerson: null });
      }
    };
  }),
  
  // Define lifecycle hooks for side effects
  withHooks({
    onInit: (store) => {
      // Create an effect to log changes to the state
      effect(() => {
        console.log('Current store state:', {
          persons: store.people(),
          selectedPerson: store.selectedPerson(),
          loading: store.loading(),
          error: store.error()
        });
      });
    }
  })
);