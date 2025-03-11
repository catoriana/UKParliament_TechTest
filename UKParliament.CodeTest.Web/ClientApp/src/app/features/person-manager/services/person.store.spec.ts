import { TestBed } from '@angular/core/testing';
import { PersonStore } from './person.store';
import { PersonViewModel } from '../models/person-view-model';
import { DepartmentViewModel } from '../models/department-view-model';

describe('PersonStore', () => {
    let store: PersonStore;
    let consoleSpy: jasmine.Spy;
  
    // Sample department data
    const testDepartment1: DepartmentViewModel = { 
      id: 101, 
      name: 'Engineering' 
    };
    
    const testDepartment2: DepartmentViewModel = { 
      id: 102, 
      name: 'Marketing' 
    };
  
    // Sample test data that matches the real PersonViewModel interface
    const testPerson1: PersonViewModel = { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Doe', 
      dateOfBirth: '1992-04-15', 
      departmentId: 101,
      department: testDepartment1
    };
    
    const testPerson2: PersonViewModel = { 
      id: 2, 
      firstName: 'Jane', 
      lastName: 'Smith', 
      dateOfBirth: '1995-08-22', 
      departmentId: 102,
      department: testDepartment2
    };
    
    const updatedPerson1: PersonViewModel = { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Updated', 
      dateOfBirth: '1992-04-15', 
      departmentId: 102,
      department: testDepartment2
    };
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [PersonStore]
      });
      store = TestBed.inject(PersonStore);
      
      // Spy on console.log to verify effect execution
      consoleSpy = spyOn(console, 'log');
    });
  
    it('should be created', () => {
      expect(store).toBeTruthy();
    });
  
    describe('setPeople', () => {
      it('should set people array', () => {
        const people = [testPerson1, testPerson2];
        
        store.setPeople(people);
        
        expect(store.totalPeople()).toBe(2);
        // Verify the effect was triggered
        expect(consoleSpy).toHaveBeenCalledWith('Total People: 2');
      });
  
      it('should replace existing people array', () => {
        // First set with two people
        store.setPeople([testPerson1, testPerson2]);
        
        // Then replace with just one
        const newPeople = [testPerson1];
        store.setPeople(newPeople);
        
        expect(store.totalPeople()).toBe(1);
        // Verify the effect was triggered for both operations
        expect(consoleSpy).toHaveBeenCalledWith('Total People: 1');
      });
    });
  
    describe('selectPerson', () => {
      it('should set selectedPersonId and update selectedPerson', () => {
        store.setPeople([testPerson1, testPerson2]);
        
        store.selectPerson(1);
        
        expect(store.selectedPerson()).toEqual(testPerson1);
      });
  
      it('should set selectedPerson to null when ID doesn\'t exist', () => {
        store.setPeople([testPerson1, testPerson2]);
        
        store.selectPerson(999);
        
        expect(store.selectedPerson()).toBeNull();
      });
  
      it('should set selectedPerson to null when passing null ID', () => {
        store.setPeople([testPerson1, testPerson2]);
        store.selectPerson(1);
        
        // Should clear the selection
        store.selectPerson(null);
        
        expect(store.selectedPerson()).toBeNull();
      });
    });
  
    describe('addPerson', () => {
      it('should add a person to empty store', () => {
        store.addPerson(testPerson1);
        
        expect(store.totalPeople()).toBe(1);
        // Check if effect logged the correct count
        expect(consoleSpy).toHaveBeenCalledWith('Total People: 1');
      });
  
      it('should add a person to existing people list', () => {
        store.setPeople([testPerson1]);
        consoleSpy.calls.reset(); // Reset spy call counter
        
        store.addPerson(testPerson2);
        
        expect(store.totalPeople()).toBe(2);
        expect(consoleSpy).toHaveBeenCalledWith('Total People: 2');
      });
    });
  
    describe('updatePerson', () => {
      it('should update an existing person', () => {
        store.setPeople([testPerson1, testPerson2]);
        store.selectPerson(1);
        
        store.updatePerson(updatedPerson1);
        
        expect(store.selectedPerson()).toEqual(updatedPerson1);
      });
  
      it('should update firstName, lastName, and department correctly', () => {
        store.setPeople([testPerson1]);
        
        store.updatePerson(updatedPerson1);
        store.selectPerson(1);
        
        const updated = store.selectedPerson();
        expect(updated?.lastName).toBe('Updated');
        expect(updated?.departmentId).toBe(102);
        expect(updated?.department).toEqual(testDepartment2);
      });
  
      it('should not affect other people when updating one person', () => {
        store.setPeople([testPerson1, testPerson2]);
        
        store.updatePerson(updatedPerson1);
        
        // Get the updated list by checking totalPeople and manually check testPerson2 still exists
        expect(store.totalPeople()).toBe(2);
        
        // Select and verify testPerson2 is unchanged
        store.selectPerson(2);
        expect(store.selectedPerson()).toEqual(testPerson2);
      });
  
      it('should not change array length when updating', () => {
        store.setPeople([testPerson1, testPerson2]);
        
        store.updatePerson(updatedPerson1);
        
        expect(store.totalPeople()).toBe(2);
      });
    });
  
    describe('deletePerson', () => {
      it('should remove a person from the list', () => {
        store.setPeople([testPerson1, testPerson2]);
        
        store.deletePerson(1);
        
        expect(store.totalPeople()).toBe(1);
        // Verify only testPerson2 remains by selecting it
        store.selectPerson(2);
        expect(store.selectedPerson()).toEqual(testPerson2);
      });
  
      it('should clear selectedPerson when deleting selected person', () => {
        store.setPeople([testPerson1, testPerson2]);
        store.selectPerson(1);
        
        store.deletePerson(1);
        
        expect(store.selectedPerson()).toBeNull();
      });
  
      it('should not clear selectedPerson when deleting different person', () => {
        store.setPeople([testPerson1, testPerson2]);
        store.selectPerson(1);
        
        store.deletePerson(2);
        
        expect(store.selectedPerson()).toEqual(testPerson1);
      });
  
      it('should not change store if person ID does not exist', () => {
        store.setPeople([testPerson1, testPerson2]);
        
        store.deletePerson(999);
        
        expect(store.totalPeople()).toBe(2);
      });
    });
  
    describe('computed signals', () => {
      it('totalPeople should reflect the correct count', () => {
        expect(store.totalPeople()).toBe(0);
        
        store.addPerson(testPerson1);
        expect(store.totalPeople()).toBe(1);
        
        store.addPerson(testPerson2);
        expect(store.totalPeople()).toBe(2);
        
        store.deletePerson(1);
        expect(store.totalPeople()).toBe(1);
        
        store.setPeople([]);
        expect(store.totalPeople()).toBe(0);
      });
  
      it('selectedPerson should update reactively based on selectPerson calls', () => {
        store.setPeople([testPerson1, testPerson2]);
        
        expect(store.selectedPerson()).toBeNull();
        
        store.selectPerson(1);
        expect(store.selectedPerson()).toEqual(testPerson1);
        
        store.selectPerson(2);
        expect(store.selectedPerson()).toEqual(testPerson2);
        
        store.selectPerson(null);
        expect(store.selectedPerson()).toBeNull();
      });
    });
  });