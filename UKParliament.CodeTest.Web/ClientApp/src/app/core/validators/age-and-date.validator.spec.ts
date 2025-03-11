import { FormControl } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { ageAndDateValidator } from './age-and-date.validator';

describe('ageAndDateValidator', () => {
  let originalDate: typeof Date;
  
  // Mock the current date to make tests deterministic
  const mockCurrentDate = new Date('2025-03-11'); // Current date
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    originalDate = global.Date;
    
    // Mock Date constructor to return fixed date for "now"
    global.Date = class extends Date {
      constructor(date?: string | number | Date) {
        if (date) {
          super(date);
        } else {
          super(mockCurrentDate);
        }
      }
    } as any;
  });
  
  afterEach(() => {
    // Restore original Date
    global.Date = originalDate;
  });

  it('should return null for empty values', () => {
    const validator = ageAndDateValidator(18, 100);
    const control = new FormControl(null);
    
    expect(validator(control)).toBeNull();
  });
  
  it('should return invalidDate for non-date values', () => {
    const validator = ageAndDateValidator(18, 100);
    const control = new FormControl('not-a-date');
    
    expect(validator(control)).toEqual({ invalidDate: true });
  });
  
  it('should return futureDate for dates in the future', () => {
    const validator = ageAndDateValidator(18, 100);
    const futureDate = new Date('2025-12-31'); // Future from mock date
    const control = new FormControl(futureDate.toISOString());
    
    expect(validator(control)).toEqual({ futureDate: true });
  });
  
  it('should return ageRange for someone younger than the minimum age', () => {
    const validator = ageAndDateValidator(18, 100);
    // Someone who is 17 (under 18)
    const tooYoungDate = new Date('2007-04-11'); // 17 years old
    const control = new FormControl(tooYoungDate.toISOString());
    
    expect(validator(control)).toEqual({ ageRange: true });
  });
  
  it('should return ageRange for someone older than the maximum age', () => {
    const validator = ageAndDateValidator(18, 100);
    // Someone who is 101 (over 100)
    const tooOldDate = new Date('1924-03-10'); // 101 years old
    const control = new FormControl(tooOldDate.toISOString());
    
    expect(validator(control)).toEqual({ ageRange: true });
  });
  
  it('should return null for valid dates within age range', () => {
    const validator = ageAndDateValidator(18, 100);
    // Someone who is 30
    const validDate = new Date('1994-03-11'); // 31 years old
    const control = new FormControl(validDate.toISOString());
    
    expect(validator(control)).toBeNull();
  });
  
  it('should handle edge case for minimum age', () => {
    const validator = ageAndDateValidator(18, 100);
    // Someone who turned 18 today
    const minimumAgeDate = new Date('2007-03-11');
    const control = new FormControl(minimumAgeDate.toISOString());
    
    expect(validator(control)).toBeNull();
  });
  
  it('should handle edge case for maximum age', () => {
    const validator = ageAndDateValidator(18, 100);
    // Someone who is exactly 100
    const maximumAgeDate = new Date('1925-03-11');
    const control = new FormControl(maximumAgeDate.toISOString());
    
    expect(validator(control)).toBeNull();
  });
  
  it('should account for birthday not reached yet this year', () => {
    const validator = ageAndDateValidator(18, 100);
    // Someone born on 2007-05-15 would be 17 on 2025-03-11 as birthday hasn't occurred yet
    const beforeBirthdayDate = new Date('2007-05-15');
    const control = new FormControl(beforeBirthdayDate.toISOString());
    
    expect(validator(control)).toEqual({ ageRange: true });
  });
  
  it('should handle different min and max age ranges', () => {
    const validator = ageAndDateValidator(21, 65);
    
    // Too young (20 years old)
    const tooYoungDate = new Date('2004-04-11');
    const tooYoungControl = new FormControl(tooYoungDate.toISOString());
    expect(validator(tooYoungControl)).toEqual({ ageRange: true });
    
    // Valid age (40 years old)
    const validDate = new Date('1984-03-11');
    const validControl = new FormControl(validDate.toISOString());
    expect(validator(validControl)).toBeNull();
    
    // Too old (66 years old)
    const tooOldDate = new Date('1959-03-10');
    const tooOldControl = new FormControl(tooOldDate.toISOString());
    expect(validator(tooOldControl)).toEqual({ ageRange: true });
  });
});