import { FormControl } from '@angular/forms';
import { FormErrorUtil } from './form-error-util';

describe('FormErrorUtil', () => {

  it('should return "This field is required." for a required error', () => {
    const control = new FormControl();
    control.setErrors({ required: true });

    const errorMessage = FormErrorUtil.getErrorMessage(control, 'Test Field');
    
    expect(errorMessage).toBe('This field is required.');
  });

  it('should return "Invalid format." for a pattern error', () => {
    const control = new FormControl('invalid');
    control.setErrors({ pattern: true });

    const errorMessage = FormErrorUtil.getErrorMessage(control, 'Test Field');
    
    expect(errorMessage).toBe('Test Field must contain only valid characters.');
  });

  it('should return "Maximum length exceeded." for a maxlength error', () => {
    const control = new FormControl('Too long');
    control.setErrors({ maxlength: { requiredLength: 5, actualLength: 8 } });

    const errorMessage = FormErrorUtil.getErrorMessage(control, 'Test Field');
    
    expect(errorMessage).toBe('Maximum length of 5 characters exceeded.');
  });

  it('should return "Test Field is invalid." for an invalidDate error', () => {
    const control = new FormControl('invalid date');
    control.setErrors({ invalidDate: true });

    const errorMessage = FormErrorUtil.getErrorMessage(control, 'Test Field');
    
    expect(errorMessage).toBe('Test Field is invalid.');
  });

  it('should return "Test Field cannot be in the future." for a futureDate error', () => {
    const control = new FormControl('2025-01-01');
    control.setErrors({ futureDate: true });

    const errorMessage = FormErrorUtil.getErrorMessage(control, 'Test Field');
    
    expect(errorMessage).toBe('Test Field cannot be in the future.');
  });

  it('should return "The age range must be between 18 and 100." for an invalidAgeRange error', () => {
    const control = new FormControl(150); // Invalid age
    control.setErrors({ invalidAgeRange: true });

    const errorMessage = FormErrorUtil.getErrorMessage(control, 'Age');
    
    expect(errorMessage).toBe('The age range must be between 18 and 100.');
  });

  it('should return "Invalid Test Field." for an unknown error key', () => {
    const control = new FormControl();
    control.setErrors({ unknownError: true });

    const errorMessage = FormErrorUtil.getErrorMessage(control, 'Test Field');
    
    expect(errorMessage).toBe('Invalid Test Field.');
  });

  it('should return null if there are no errors', () => {
    const control = new FormControl('valid');

    const errorMessage = FormErrorUtil.getErrorMessage(control, 'Test Field');
    
    expect(errorMessage).toBeNull();
  });

  it('should return null if control is null', () => {
    const errorMessage = FormErrorUtil.getErrorMessage(null, 'Test Field');
    
    expect(errorMessage).toBeNull();
  });

});
