import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ageAndDateValidator(minAge: number, maxAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const enteredDate = new Date(control.value);
    const today = new Date();

    if (isNaN(enteredDate.getTime())) {
      return { invalidDate: true };
    }

    if (enteredDate > today) {
      return { futureDate: true };
    }

    const age = today.getFullYear() - enteredDate.getFullYear();
    const isBeforeBirthday =
      today.getMonth() < enteredDate.getMonth() ||
      (today.getMonth() === enteredDate.getMonth() && today.getDate() < enteredDate.getDate());

    const calculatedAge = isBeforeBirthday ? age - 1 : age;

    if (calculatedAge < minAge || calculatedAge > maxAge) {
      return { ageRange: true };
    }

    return null;
  };
}
