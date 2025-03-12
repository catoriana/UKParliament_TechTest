import { AbstractControl } from "@angular/forms";

export class FormErrorUtil {
    private static readonly ERROR_MESSAGES: Record<string, string> = {
      required: 'This field is required.',
      pattern: 'Invalid format.',
      maxlength: 'Maximum length exceeded.',
      invalidAgeRange: 'Age must be between 18 and 100 years.',
      invalidDate: 'The date is invalid.',
      futureDate: 'The date cannot be in the future.'
    };
  
    static getErrorMessage(control: AbstractControl | null, controlFriendlyName: string): string | null {
      if (control && control.errors) {
        const firstErrorKey = Object.keys(control.errors)[0];
  
        if (firstErrorKey === 'pattern') {
          return `${controlFriendlyName} must contain only valid characters.`;
        }
    
        if (firstErrorKey === 'maxlength') {
          return `Maximum length of ${control.getError('maxlength').requiredLength} characters exceeded.`;
        }

        if (firstErrorKey === 'invalidDate') {
          return `${controlFriendlyName} is invalid.`;
        }

        if (firstErrorKey === 'futureDate') {
          return `${controlFriendlyName} cannot be in the future.`;
        }

        if (firstErrorKey === 'invalidAgeRange') {
          return `The age range must be between 18 and 100.`;
        }
  
        return this.ERROR_MESSAGES[firstErrorKey] || `Invalid ${controlFriendlyName}.`;
      }
  
      return null;
    }
  }
