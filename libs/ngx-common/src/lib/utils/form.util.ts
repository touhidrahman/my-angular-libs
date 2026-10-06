import {
    AbstractControl,
    FormArray,
    FormControl,
    FormGroup,
} from '@angular/forms'

/**
 * Marks all the controls and their nested controls as dirty.
 * @param abstractControls - an array of controls(can be FormControls, FormGroups or FormArrays)
 */
export function markAllControlsAsDirty(
    abstractControls: AbstractControl[],
): void {
    abstractControls.forEach((abstractControl) => {
        let control:
            | AbstractControl
            | FormControl
            | FormGroup
            | FormArray
            | null = null
        if (abstractControl instanceof FormControl) {
            control = abstractControl as FormControl
            control.markAsDirty({ onlySelf: true })
            control.markAsTouched({ onlySelf: true })
            control.updateValueAndValidity({ onlySelf: true })
        } else if (abstractControl instanceof FormGroup) {
            control = abstractControl as FormGroup
            markAllControlsAsDirty(
                Object.values((control as FormGroup).controls),
            )
        } else if (abstractControl instanceof FormArray) {
            control = abstractControl as FormArray
            markAllControlsAsDirty((control as FormArray).controls)
        }
    })
}

export function markAllControlsAsTouched(control: AbstractControl): void {
    control.markAsTouched()
    control.updateValueAndValidity()

    if (control instanceof FormGroup || control instanceof FormArray) {
        Object.values(control.controls).forEach((child) =>
            markAllControlsAsTouched(child),
        )
    }
}

export function getMessageForCommonFormControlErrors(
    control: AbstractControl,
): string {
    if (control.hasError('required')) {
        return 'This field is required'
    }
    if (control.hasError('email')) {
        return 'Please enter a valid email'
    }
    if (control.hasError('minlength')) {
        const minLength = control.getError('minlength').requiredLength
        return `Minimum ${minLength} characters required`
    }
    if (control.hasError('maxlength')) {
        const maxLength = control.getError('maxlength').requiredLength
        return `Maximum ${maxLength} characters allowed`
    }
    if (control.hasError('pattern')) {
        return 'Please enter a valid value'
    }
    return ''
}
