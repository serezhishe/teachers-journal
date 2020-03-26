import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { SubjectsService } from './../../common/services/subjects.service';
import { IBreadCrumb } from './breadcrumb.interface';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {
  public breadcrumbs: IBreadCrumb[];

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly subjectsService: SubjectsService,
  ) {
  }

  public ngOnInit(): void {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.buildBreadCrumb(this.activatedRoute.root).subscribe((value) => this.breadcrumbs = value);
    });
  }

  public buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: IBreadCrumb[] = []): Observable<IBreadCrumb[]> {

    while (route) {
      let label = route.routeConfig?.data?.breadcrumb ||  '';
      let path = route.routeConfig?.data ? route.routeConfig.path : '';
      const lastRoutePart = path.split('/').pop();
      if (lastRoutePart[0] === ':' && !!route.snapshot) {
        const paramName = lastRoutePart.split(':')[1];
        path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
        label = route.snapshot.params[paramName];
        if (paramName === 'subject') {
          return this.subjectsService.getSubjectInfo(route.snapshot.params[paramName]).pipe(map((elem) =>
            [
              ...breadcrumbs,
              {
                label: elem.name,
                url,
              }
            ]));
        }
      }

      url = path ? `${url}/${path}` : url;

      if (label) {
        breadcrumbs.push({
          label,
          url,
        });
      }
      route = route.firstChild;
    }

    return of(breadcrumbs);
  }
}
