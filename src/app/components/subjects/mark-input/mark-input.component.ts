import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

const MAX_MARK = 10;
@Component({
  selector: 'app-mark-input',
  templateUrl: './mark-input.component.html',
  styleUrls: ['./mark-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkInputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MarkInputComponent),
      multi: true,
    },
  ],
})
export class MarkInputComponent implements ControlValueAccessor, Validator {
  public disabled: boolean;
  @Input()
  public value: number;
  public errors: ValidationErrors | null;
  public onChanged: any = () => {};
  public onTouched: any = () => {};

  public writeValue(val: number): void {
    this.value = val;
  }

  public validate(c: FormControl): ValidationErrors | null {
    return this.errors ? this.errors : null;
  }

  public registerOnChange(fn: any): void {
    this.onChanged = fn;
  }
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public updateValue(mark: number): void {
    if (this.value < 0 || this.value > MAX_MARK) {
      this.errors = {
        rangeError: {
          valid: false,
        },
      };
    } else {
      this.errors = null;
    }
    if (!this.disabled) {
      this.value = mark;
      this.onChanged(mark);
      this.onTouched();
    }
  }
}
