import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { SubjectsService } from './../../../common/services/subjects.service';

@Component({
  selector: 'app-subjects-page',
  templateUrl: './subjects-page.component.html',
  styleUrls: ['./subjects-page.component.scss']
})
export class SubjectsPageComponent implements OnInit, OnDestroy {
  public subjects: string[];
  public subjectsSubscription: Subscription;
  public loaded: boolean;

  constructor(private readonly subjectsService: SubjectsService) {}

  public ngOnInit(): void {
    this.loaded = false;
    this.subjectsSubscription = this.subjectsService.getSubjects().subscribe((subjectList) => {
      this.subjects = subjectList;
      this.loaded = true;
    });
  }

  public ngOnDestroy(): void {
    this.subjectsSubscription.unsubscribe();
  }
}
