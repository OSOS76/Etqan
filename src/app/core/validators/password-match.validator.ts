import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl) => {
        const password = control.get('password');
        const confirmPassword = control.get('confirmPassword');
        if (password?.value === confirmPassword?.value) {
            return null;
        }
        return {
            passwordMismatch: true
        };
    }
}
