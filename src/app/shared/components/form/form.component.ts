import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap, switchMapTo, tap } from 'rxjs/operators';

import { IFormConfig } from '../../../common/models';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Input()
  public configs: IFormConfig[];
  @Output()
  public add: EventEmitter<any> = new EventEmitter();
  public controlGroup: any;
  public addingForm: FormGroup;
  constructor(private readonly formBuilder: FormBuilder, private readonly router: Router, private readonly route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.controlGroup = {};
    this.configs.forEach((elem) => {
      const defaultValue = elem.type === 'number' ? 0 : '';
      this.controlGroup[elem.label] = new FormControl(defaultValue, elem.validators);
    });
    this.addingForm = this.formBuilder.group(this.controlGroup);
  }

  public onSubmit(value: Record<string, unknown>): void {
    if (this.addingForm.invalid) {
      return;
    }
    this.add.emit(value);
    this.addingForm.markAsUntouched();
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  public canDeactivate(): Observable<boolean> | boolean {
    if (this.addingForm.dirty && this.addingForm.touched) {
      if (this.addingForm.valid) {
        return of(window.confirm('Do you want to submit the information?')).pipe(
          switchMap((submit) => {
            if (submit) {
              this.add.emit(this.addingForm.value);
              this.addingForm.reset();
            }

            return of(window.confirm('Do you want to leave the page?'));
          })
        );
      }

      return of(window.confirm('Information is invalid, are you sure want to leave the page?'));
    }

    return true;
  }
}
