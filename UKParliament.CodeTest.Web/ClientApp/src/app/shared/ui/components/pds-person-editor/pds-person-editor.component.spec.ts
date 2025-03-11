import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { PdsPersonEditorComponent } from './pds-person-editor.component';
import { ChangeDetectionStrategy, SimpleChange } from '@angular/core';
import { DepartmentViewModel } from 'src/app/features/person-manager/models/department-view-model';
import { PersonViewModel } from 'src/app/features/person-manager/models/person-view-model';
import { FormErrorUtil } from 'src/app/core/utils/form-error.util';

describe('PdsPersonEditorComponent', () => {
  let component: PdsPersonEditorComponent;
  let fixture: ComponentFixture<PdsPersonEditorComponent>;
  let mockFormErrorUtil: jasmine.SpyObj<typeof FormErrorUtil>;

  const mockDepartments: DepartmentViewModel[] = [
    { id: 1, name: 'HR' },
    { id: 2, name: 'Engineering' }
  ];

  const mockPerson: PersonViewModel = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    departmentId: 1
  };

  beforeEach(async () => {
    mockFormErrorUtil = jasmine.createSpyObj('FormErrorUtil', ['getErrorMessage']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PdsPersonEditorComponent],
      providers: [
        { provide: FormErrorUtil, useValue: mockFormErrorUtil }
      ]
    })
    .overrideComponent(PdsPersonEditorComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdsPersonEditorComponent);
    component = fixture.componentInstance;
    
    // Set required inputs properly
    fixture.componentRef.setInput('componentTitle', 'Test Editor');
    fixture.componentRef.setInput('buttonReset', 'Reset');
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.form.value).toEqual({
        firstName: '',
        lastName: '',
        departmentId: '',
        dateOfBirth: ''
      });
    });

    it('should have required validators on all fields', () => {
      const formControls = component.form.controls;
      
      Object.keys(formControls).forEach(key => {
        component.form.get(key)?.setValue('');
        component.form.get(key)?.markAsTouched();
        expect(component.form.get(key)?.hasError('required')).toBeTruthy();
      });
    });

    it('should have pattern validators on name fields', () => {
      const firstNameControl = component.form.get('firstName');
      const lastNameControl = component.form.get('lastName');
      
      firstNameControl?.setValue('123');
      lastNameControl?.setValue('456');
      
      expect(firstNameControl?.hasError('pattern')).toBeTruthy();
      expect(lastNameControl?.hasError('pattern')).toBeTruthy();
    });

    it('should have maxLength validators on name fields', () => {
      const firstNameControl = component.form.get('firstName');
      const lastNameControl = component.form.get('lastName');
      
      const longName = 'a'.repeat(101);
      
      firstNameControl?.setValue(longName);
      lastNameControl?.setValue(longName);
      
      expect(firstNameControl?.hasError('maxlength')).toBeTruthy();
      expect(lastNameControl?.hasError('maxlength')).toBeTruthy();
    });
  });

  describe('ngOnChanges', () => {
    it('should patch form with person data when person input changes', () => {
      // Arrange
      component.person = mockPerson;
      
      // Act
      component.ngOnChanges({
        person: new SimpleChange(null, mockPerson, true)
      });
      
      // Assert
      expect(component.form.value).toEqual({
        firstName: mockPerson.firstName,
        lastName: mockPerson.lastName,
        departmentId: mockPerson.departmentId,
        dateOfBirth: mockPerson.dateOfBirth
      });
    });

    it('should not patch form if person is null', () => {
      // Arrange
      spyOn(component.form, 'patchValue');
      component.person = null;
      
      // Act
      component.ngOnChanges({
        person: new SimpleChange(mockPerson, null, false)
      });
      
      // Assert
      expect(component.form.patchValue).not.toHaveBeenCalled();
    });
  });

  describe('getErrorMessage', () => {
    it('should call FormErrorUtil.getErrorMessage with correct parameters', () => {
      // Arrange
      const controlName = 'firstName';
      const friendlyName = 'First Name';
      const mockControl = component.form.get(controlName);
      mockFormErrorUtil.getErrorMessage.and.returnValue('Mock error message');
      
      // Act
      const result = component.getErrorMessage(controlName, friendlyName);
      
      // Assert
      expect(FormErrorUtil.getErrorMessage).toHaveBeenCalledWith(mockControl, friendlyName);
      expect(result).toBe('Mock error message');
    });
  });

  describe('onSubmit', () => {
    it('should emit updated person when form is valid and person exists', () => {
      // Arrange
      spyOn(component.submitEvent, 'emit');
      component.person = mockPerson;
      component.form.setValue({
        firstName: 'Jane',
        lastName: 'Smith',
        departmentId: 2,
        dateOfBirth: '1985-05-05'
      });
      
      // Act
      component.onSubmit();
      
      // Assert
      expect(component.submitEvent.emit).toHaveBeenCalledWith({
        ...mockPerson,
        firstName: 'Jane',
        lastName: 'Smith',
        departmentId: 2,
        dateOfBirth: '1985-05-05'
      });
    });

    it('should emit newPerson when form is valid but person is null', () => {
      // Arrange
      spyOn(component.submitEvent, 'emit');
      component.person = null;
      component.form.setValue({
        firstName: 'Jane',
        lastName: 'Smith',
        departmentId: 2,
        dateOfBirth: '1985-05-05'
      });
      
      // Act
      component.onSubmit();
      
      // Assert
      expect(component.submitEvent.emit).toHaveBeenCalledWith(component.newPerson);
    });

    it('should not emit when form is invalid', () => {
      // Arrange
      spyOn(component.submitEvent, 'emit');
      component.person = mockPerson;
      component.form.get('firstName')?.setValue(''); // Making form invalid
      
      // Act
      component.onSubmit();
      
      // Assert
      expect(component.submitEvent.emit).not.toHaveBeenCalled();
    });
  });

  describe('onCancel', () => {
    it('should reset form and emit cancelEvent', () => {
      // Arrange
      spyOn(component.form, 'reset');
      spyOn(component.cancelEvent, 'emit');
      
      // Act
      component.onCancel();
      
      // Assert
      expect(component.form.reset).toHaveBeenCalled();
      expect(component.cancelEvent.emit).toHaveBeenCalled();
    });
  });
});