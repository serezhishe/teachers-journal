import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IFormConfig } from '../../../common/models/form-config.model';

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
      const validators = elem.required ? [Validators.required] : [];
      this.controlGroup[elem.label] = new FormControl(defaultValue, validators);
    });
    this.addingForm = this.formBuilder.group(this.controlGroup);
  }

  public onSubmit(value: Record<string, unknown>): void {
    if (this.addingForm.invalid) {
      return;
    }
    this.add.emit(value);
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
