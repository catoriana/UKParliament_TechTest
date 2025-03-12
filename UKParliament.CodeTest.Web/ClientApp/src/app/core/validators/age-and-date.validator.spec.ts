import { AbstractControl, FormControl } from '@angular/forms';
import { ageAndDateValidator } from './age-and-date.validator';  // Adjust path as necessary

describe('ageAndDateValidator', () => {

  let control: AbstractControl;

  it('should return null for valid date within age range', () => {
    const validDate = '1990-01-01';  // Age should be between 18 and 100
    control = new FormControl(validDate);
    const validator = ageAndDateValidator(18, 100);

    const result = validator(control);

    expect(result).toBeNull();  // No validation error, since the date is valid and age is within the range
  });

  it('should return invalidDate error for invalid date format', () => {
    const invalidDate = 'invalid-date';
    control = new FormControl(invalidDate);
    const validator = ageAndDateValidator(18, 100);

    const result = validator(control);

    expect(result).toEqual({ invalidDate: true });  // Invalid date format should return error
  });

  it('should return futureDate error for future dates', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);  // Set to a date 1 year in the future
    control = new FormControl(futureDate.toISOString());
    const validator = ageAndDateValidator(18, 100);

    const result = validator(control);

    expect(result).toEqual({ futureDate: true });  // Future date should return error
  });

  it('should return invalidAgeRange error for age below minAge', () => {
    const dateOfBirth = '2010-01-01';  // This will result in an age below the minAge of 18
    control = new FormControl(dateOfBirth);
    const validator = ageAndDateValidator(18, 100);

    const result = validator(control);

    expect(result).toEqual({ invalidAgeRange: true });  // Should return error because age is below minAge
  });

  it('should return invalidAgeRange error for age above maxAge', () => {
    const dateOfBirth = '1900-01-01';  // This will result in an age above the maxAge of 100
    control = new FormControl(dateOfBirth);
    const validator = ageAndDateValidator(18, 100);

    const result = validator(control);

    expect(result).toEqual({ invalidAgeRange: true });  // Should return error because age is above maxAge
  });

  it('should return null if value is null or empty', () => {
    control = new FormControl(null);  // Null value should not trigger validation
    const validator = ageAndDateValidator(18, 100);

    const result = validator(control);

    expect(result).toBeNull();  // Null or empty values should not return any validation errors
  });
});
