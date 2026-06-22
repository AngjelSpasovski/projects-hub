import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const trimmedRequired: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;

  if (typeof value === 'string') {
    return value.trim().length > 0 ? null : { required: true };
  }

  return value === null || value === undefined ? { required: true } : null;
};

export function trimmedMinLength(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (typeof control.value !== 'string' || control.value.length === 0) {
      return null;
    }

    const actualLength = control.value.trim().length;
    return actualLength >= minLength ? null : { minlength: { requiredLength: minLength, actualLength } };
  };
}

export function firstValidationError(control: AbstractControl): string | null {
  const errors = control.errors;
  return errors ? Object.keys(errors)[0] ?? null : null;
}
