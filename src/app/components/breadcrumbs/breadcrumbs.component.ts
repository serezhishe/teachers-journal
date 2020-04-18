import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, startWith } from 'rxjs/operators';

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
        this.breadcrumbs = this.buildBreadCrumbs(this.activatedRoute.root);
      });
  }

  public buildBreadCrumbs(route: ActivatedRoute): IBreadCrumb[] {
    let url: string = '';
    const breadcrumbs: IBreadCrumb[] = [];
    while (route) {
      let label = route.routeConfig?.data?.breadcrumb || '';
      let path = route.routeConfig?.data ? route.routeConfig.path : '';
      const lastRoutePart = path.split('/').pop();
      if (lastRoutePart[0] === ':') {
        const paramName = lastRoutePart.split(':')[1];
        path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
        label = route.snapshot.params[paramName];
        url = path ? `${url}/${path}` : url;
        if (label) {
          breadcrumbs.push({
            label,
            url,
          });
        }
      } else {
        this.translate.get(`app.${label}.breadcrumb`).subscribe((translation: string) => {
          url = path ? `${url}/${path}` : url;
          if (label) {
            breadcrumbs.push({
              label: translation,
              url,
            });
          }
        });
      }

      route = route.firstChild;
    }

    return breadcrumbs;
  }
}
