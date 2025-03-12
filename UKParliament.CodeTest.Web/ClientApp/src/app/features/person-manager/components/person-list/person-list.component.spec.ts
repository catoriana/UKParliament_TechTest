import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonListComponent } from './person-list.component';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PersonListComponent', () => {
  let component: PersonListComponent;
  let fixture: ComponentFixture<PersonListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PersonListComponent, CommonModule, NgxPaginationModule],  // Import the standalone component
    });

    fixture = TestBed.createComponent(PersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit addEvent when AddPerson is called', () => {
    spyOn(component.addEvent, 'emit');
    
    component.AddPerson();
    
    expect(component.addEvent.emit).toHaveBeenCalled();
  });

  it('should emit personSelected when selectPerson is called', () => {
    spyOn(component.personSelected, 'emit');
    const person = { id: 1, firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01', departmentId: 1 };

    component.selectPerson(person);
    
    expect(component.personSelected.emit).toHaveBeenCalledWith(person);
  });

  it('should emit personDeleted when deletePerson is called', () => {
    spyOn(component.personDeleted, 'emit');
    
    component.deletePerson(1);
    
    expect(component.personDeleted.emit).toHaveBeenCalledWith(1);
  });

  it('should initialize pagination with currentPage set to 1', () => {
    expect(component.currentPage).toBe(1);
  });

});
