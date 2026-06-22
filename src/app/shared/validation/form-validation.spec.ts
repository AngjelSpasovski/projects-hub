import { FormControl } from '@angular/forms';

import { firstValidationError, trimmedMinLength, trimmedRequired } from './form-validation';

describe('shared form validation', () => {
  it('rejects blank required text', () => {
    const control = new FormControl('   ', trimmedRequired);
    expect(control.errors).toEqual({ required: true });
  });

  it('measures minimum length after trimming', () => {
    const control = new FormControl('  ab  ', trimmedMinLength(3));
    expect(control.errors).toEqual({ minlength: { requiredLength: 3, actualLength: 2 } });
  });

  it('returns the first error key for translated validation messages', () => {
    const control = new FormControl('', trimmedRequired);
    expect(firstValidationError(control)).toBe('required');
  });
});
