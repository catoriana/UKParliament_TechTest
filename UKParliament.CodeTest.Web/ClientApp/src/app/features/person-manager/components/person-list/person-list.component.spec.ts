import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { PersonListComponent } from './person-list.component';
import { PersonViewModel } from '../../models/person-view-model';

// Mock NgxPaginationModule
@Component({
  selector: 'pagination-controls',
  template: ''
})
class MockPaginationControls {}

@Component({
  selector: 'ngx-pagination',
  template: ''
})
class MockNgxPagination {}

describe('PersonListComponent', () => {
  let component: PersonListComponent;
  let fixture: ComponentFixture<PersonListComponent>;

  const mockPeople: PersonViewModel[] = [
    { 
      id: 1, 
      firstName: 'John', 
      lastName: 'Doe', 
      dateOfBirth: '1990-01-01', 
      departmentId: 1,
      department: { id: 1, name: 'IT' } 
    },
    { 
      id: 2, 
      firstName: 'Jane', 
      lastName: 'Smith', 
      dateOfBirth: '1992-05-15', 
      departmentId: 2,
      department: { id: 2, name: 'HR' } 
    },
    { 
      id: 3, 
      firstName: 'Bob', 
      lastName: 'Johnson', 
      dateOfBirth: '1985-11-20', 
      departmentId: 1,
      department: { id: 1, name: 'IT' } 
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule],
      declarations: [MockPaginationControls, MockNgxPagination],
      providers: [
        // Any providers needed
      ]
    })
    .overrideComponent(PersonListComponent, {
      set: {
        imports: [CommonModule, RouterTestingModule],
        // Override the component to not use the real NgxPaginationModule
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonListComponent);
    component = fixture.componentInstance;
    component.people = [...mockPeople];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input properties', () => {
    it('should receive people input', () => {
      expect(component.people.length).toBe(3);
      expect(component.people).toEqual(mockPeople);
    });

    it('should receive selectedPerson input', () => {
      // Arrange
      const selectedPerson = mockPeople[1];
      
      // Act
      component.selectedPerson = selectedPerson;
      fixture.detectChanges();
      
      // Assert
      expect(component.selectedPerson).toEqual(selectedPerson);
    });
  });

  describe('Pagination', () => {
    it('should initialize with page 1', () => {
      expect(component.currentPage).toBe(1);
    });
  });

  describe('Component methods', () => {
    it('should emit personSelected when selectPerson is called', () => {
      // Arrange
      const selectedPerson = mockPeople[0];
      spyOn(component.personSelected, 'emit');
      
      // Act
      component.selectPerson(selectedPerson);
      
      // Assert
      expect(component.personSelected.emit).toHaveBeenCalledWith(selectedPerson);
    });

    it('should emit personDeleted when deletePerson is called', () => {
      // Arrange
      const personId = 2;
      spyOn(component.personDeleted, 'emit');
      
      // Act
      component.deletePerson(personId);
      
      // Assert
      expect(component.personDeleted.emit).toHaveBeenCalledWith(personId);
    });

    it('should emit addEvent when AddPerson is called', () => {
      // Arrange
      spyOn(component.addEvent, 'emit');
      
      // Act
      component.AddPerson();
      
      // Assert
      expect(component.addEvent.emit).toHaveBeenCalled();
    });
  });

  // If you have a template, you can test DOM interactions
  // These tests would need to be adjusted based on your actual template
  describe('Template interactions', () => {
    // If you have a method that gets called when clicking a button
    // This would be the pattern, but you'd need to adjust the selectors
    xit('should call selectPerson when person row is clicked', () => {
      // Arrange
      spyOn(component, 'selectPerson');
      const personElements = fixture.debugElement.queryAll(By.css('.person-row'));
      
      // Act - if you have a row with class 'person-row'
      if (personElements.length > 0) {
        personElements[0].triggerEventHandler('click', null);
      }
      
      // Assert
      expect(component.selectPerson).toHaveBeenCalledWith(mockPeople[0]);
    });

    xit('should call deletePerson when delete button is clicked', () => {
      // Arrange
      spyOn(component, 'deletePerson');
      const deleteButtons = fixture.debugElement.queryAll(By.css('.delete-button'));
      
      // Act - if you have buttons with class 'delete-button'
      if (deleteButtons.length > 0) {
        deleteButtons[0].triggerEventHandler('click', null);
      }
      
      // Assert
      expect(component.deletePerson).toHaveBeenCalledWith(mockPeople[0].id);
    });

    xit('should call AddPerson when add button is clicked', () => {
      // Arrange
      spyOn(component, 'AddPerson');
      const addButton = fixture.debugElement.query(By.css('.add-button'));
      
      // Act - if you have a button with class 'add-button'
      if (addButton) {
        addButton.triggerEventHandler('click', null);
      }
      
      // Assert
      expect(component.AddPerson).toHaveBeenCalled();
    });
  });
});