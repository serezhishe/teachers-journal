import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { combineLatest, Subscription } from 'rxjs';

import { ISubjectInfo } from '../../../common/models/subject-info.model';
import { SubjectsService } from '../../../common/services/subjects.service';

@Component({
  selector: 'app-subjects-page',
  templateUrl: './subjects-page.component.html',
  styleUrls: ['./subjects-page.component.scss'],
})
export class SubjectsPageComponent implements OnInit, OnDestroy {
  public subjects: ISubjectInfo[];
  public subjectsSubscription: Subscription;
  public loaded: boolean;
  public searchSubjects: FormControl;

  constructor(private readonly subjectsService: SubjectsService) {}

  public ngOnInit(): void {
    this.loaded = false;
    this.searchSubjects = new FormControl();
    this.subjectsSubscription = combineLatest([this.subjectsService.getSubjects(), this.searchSubjects.valueChanges]).subscribe(
      ([subjectList, subjectName]) => {
        this.subjects = subjectList.filter(subject => subject.name.toLowerCase().includes(subjectName));
        this.loaded = true;
      }
    );
    this.searchSubjects.setValue('');
  }

  public delete(subjectID: string): void {
    this.subjectsService.deleteSubject(subjectID);
  }

  public ngOnDestroy(): void {
    this.subjectsSubscription.unsubscribe();
  }
}
