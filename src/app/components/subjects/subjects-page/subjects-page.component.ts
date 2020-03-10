import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { subjectsList } from 'src/app/common/constants';

@Component({
  selector: 'app-subjects-page',
  templateUrl: './subjects-page.component.html',
  styleUrls: ['./subjects-page.component.scss']
})
export class SubjectsPageComponent implements OnInit {
  public subjects: string[];
  public currentSubject$: Observable<Params>;

  public ngOnInit(): void {
    this.subjects = subjectsList;
  }

}
