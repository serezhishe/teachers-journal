import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { IFormConfig } from '../../models/form-config.model';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  @Input()
  public configs: IFormConfig[];
  @Output()
  public add = new EventEmitter();
  public controlGroup;
  public addingForm: FormGroup;

  constructor(private readonly formBuilder: FormBuilder, private readonly router: Router, private readonly route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.controlGroup = {};
    this.configs.forEach((elem) => {
      this.controlGroup[elem.label] = elem.type === 'number' ? 0 : '';
    });
    this.addingForm = this.formBuilder.group(this.controlGroup);
  }

  public onSubmit(value): void {
    console.log(value);
    this.add.emit(value);
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
