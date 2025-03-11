import { AbstractControl } from "@angular/forms";

export class FormErrorUtil {
    private static readonly ERROR_MESSAGES: Record<string, string> = {
      required: 'This field is required.',
      pattern: 'Invalid format.',
      maxlength: 'Maximum length exceeded.',
      ageInvalid: 'Age must be between 18 and 100 years.',
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
  
        return this.ERROR_MESSAGES[firstErrorKey] || `Invalid ${controlFriendlyName}.`;
      }
  
      return null;
    }
  }
