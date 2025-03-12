import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PdsPersonEditorComponent } from './pds-person-editor.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { PersonViewModel } from 'src/app/features/person-manager/models/person-view-model';

describe('PdsPersonEditorComponent', () => {
  let component: PdsPersonEditorComponent;
  let fixture: ComponentFixture<PdsPersonEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdsPersonEditorComponent, ReactiveFormsModule],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(PdsPersonEditorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with correct controls', () => {
    expect(component.form.contains('firstName')).toBeTrue();
    expect(component.form.contains('lastName')).toBeTrue();
    expect(component.form.contains('departmentId')).toBeTrue();
    expect(component.form.contains('dateOfBirth')).toBeTrue();
  });

  it('should update the form when `person` input changes', () => {
    const mockPerson: PersonViewModel = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      departmentId: 2,
    };

    component.person = mockPerson;
    component.ngOnChanges({
      person: {
        currentValue: mockPerson,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });

    expect(component.form.value.firstName).toBe('John');
    expect(component.form.value.lastName).toBe('Doe');
    expect(component.form.value.dateOfBirth).toBe('1990-01-01');
    expect(component.form.value.departmentId).toBe(2);
  });

  it('should emit `submitEvent` with correct values when form is valid', () => {
    spyOn(component.submitEvent, 'emit');

    component.form.setValue({
      firstName: 'Alice',
      lastName: 'Smith',
      dateOfBirth: '1985-05-15',
      departmentId: 3,
    });

    component.onSubmit();

    expect(component.submitEvent.emit).toHaveBeenCalledWith({
      id: 0, // Since newPerson defaults to id: 0
      firstName: 'Alice',
      lastName: 'Smith',
      dateOfBirth: '1985-05-15',
      departmentId: 3,
    });
  });

  it('should reset the form and emit `cancelEvent` on cancel', () => {
    spyOn(component.cancelEvent, 'emit');
    
    component.form.setValue({
      firstName: 'Alice',
      lastName: 'Smith',
      dateOfBirth: '1985-05-15',
      departmentId: 3,
    });

    component.onCancel();

    expect(component.cancelEvent.emit).toHaveBeenCalled();
    expect(component.form.value.firstName).toBe('');
    expect(component.form.value.lastName).toBe('');
  });

  it('should disable submit when the form is invalid', () => {
    component.form.setValue({
      firstName: '',  // Required field left blank
      lastName: 'Smith',
      dateOfBirth: '2005-12-12', // Assume validation rule requires age >= 18
      departmentId: null, // Required field left null
    });

    expect(component.form.valid).toBeFalse();
  });

  it('should display validation error messages', () => {
    component.form.controls['firstName'].setValue('');
    component.form.controls['firstName'].markAsTouched();

    fixture.detectChanges();

    const errorMessage = component.getErrorMessage('firstName', 'First Name');
    expect(errorMessage).toContain('This field is required.'); // Assuming FormErrorUtil has this message
  });
});
