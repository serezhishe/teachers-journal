import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, startWith } from 'rxjs/operators';

import { BreadcrumbsService } from '../../common/services/breadcrumbs.service';

import { IBreadCrumb } from './breadcrumb.interface';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnInit {
  public breadcrumbs: IBreadCrumb[];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly translate: TranslateService,
    private readonly breadcrumbsService: BreadcrumbsService,
  ) {}

  public ngOnInit(): void {
    combineLatest([
      this.translate.onLangChange.pipe(startWith({} as LangChangeEvent)),
      this.router.events.pipe(startWith(new NavigationEnd(undefined, undefined, undefined))),
    ])
      .pipe(
        filter(([_, event]) => event instanceof NavigationEnd),
        distinctUntilChanged(),
      )
      .subscribe(() => {
        this.breadcrumbs = this.breadcrumbsService.buildBreadCrumbs(this.activatedRoute.root);
      });
  }
}
