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

  constructor(private readonly subjectsService: SubjectsService) { }

  public ngOnInit(): void {
    this.error$ = this.subjectsService.error$;
    this.searchSubjects = new FormControl();
    this.subjects$ = this.searchSubjects.valueChanges.pipe(
      startWith(''),
      map((searchValue: string) => searchValue.toLowerCase()),
      switchMap(searchValue =>
        this.subjectsService.getSubjectList().pipe(
          map(subjectList => subjectList.filter(subject => subject.subjectName.toLowerCase().includes(searchValue))),
        )),
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

  public changeEditState(event: Event, subject: any, id: string): void {
    subject.disabled = !subject.disabled;
    if (subject.disabled) {
      this.subjectsService.changeSubjectName(id, subject.value);
    }
    this.cancelEvent(event);
  }
}
