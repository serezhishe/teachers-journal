import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAnchor } from '@angular/material/button';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import { ISubjectInfo } from '../../../common/models/subject-info.model';
import { SubjectsService } from '../../../common/services/subjects.service';

@Component({
  selector: 'app-subjects-page',
  templateUrl: './subjects-page.component.html',
  styleUrls: ['./subjects-page.component.scss'],
})
export class SubjectsPageComponent implements OnInit {
  public error$: Observable<string>;
  public subjects$: Observable<ISubjectInfo[]>;
  public searchSubjects: FormControl;

  constructor(private readonly subjectsService: SubjectsService) {}

  public ngOnInit(): void {
    this.error$ = this.subjectsService.error$;
    this.searchSubjects = new FormControl();
    this.subjects$ = this.searchSubjects.valueChanges.pipe(
      startWith(''),
      map((searchValue: string) => searchValue.toLowerCase()),
      switchMap(searchValue =>
        this.subjectsService
          .getSubjectList()
          .pipe(
            map((subjectList: ISubjectInfo[]) => subjectList.filter(subject => subject.subjectName.toLowerCase().includes(searchValue))),
          ),
      ),
    );
  }

  public cancelEvent(event: Event): void {
    event.stopImmediatePropagation();
    event.preventDefault();
  }

  public deleteSubject(event: Event, subjectId: string): void {
    this.subjectsService.deleteSubject(subjectId);
    this.cancelEvent(event);
  }

  public changeEditState(event: Event, inputElement: HTMLInputElement, subject: ISubjectInfo): void {
    inputElement.disabled = !inputElement.disabled;
    if (inputElement.disabled) {
      if (subject.subjectName !== inputElement.value) {
        this.subjectsService.changeSubjectName(subject._id, subject.subjectName, inputElement.value);
      }
    } else {
      inputElement.focus();
    }
    this.cancelEvent(event);
  }
}
