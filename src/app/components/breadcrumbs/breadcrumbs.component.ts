import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs/operators';

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
  ) {}

  public ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
      });
  }

  public buildBreadCrumb(route: ActivatedRoute): IBreadCrumb[] { // REVIEW: name `buildBreadCrumb` -> `buildBreadCrumbs`
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

    return breadcrumbs;
  }
}
