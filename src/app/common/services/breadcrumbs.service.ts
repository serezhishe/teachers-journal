import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IBreadCrumb } from 'src/app/components/breadcrumbs/breadcrumb.interface';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbsService {
  constructor(private readonly translate: TranslateService) {}

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
