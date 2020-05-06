import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  public updateSubjectsIdList(newValue: string, subject: ISubjectInfo): void {
    if (subject.subjectName !== newValue) {
      this.subjectsService.updateSubjectNameRecord(subject._id, subject.subjectName, newValue);
      subject.subjectName = newValue;
    }
  }

  public updateSubjectName(newValue: string, subject: ISubjectInfo): void {
    this.subjectsService.changeSubjectName(subject._id, newValue);
  }

  public changeEditState(event: Event, inputElement: HTMLInputElement): void {
    inputElement.disabled = !inputElement.disabled;
    if (!inputElement.disabled) {
      inputElement.focus();
    }
    this.cancelEvent(event);
  }
}
