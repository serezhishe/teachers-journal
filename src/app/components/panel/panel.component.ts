import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { filter, map, pluck, startWith, tap } from 'rxjs/operators';

enum TABS {
  students = 'students',
  subjects = 'subjects',
  statistics = 'statistics',
  export = 'export',
}

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {
  public tabs: string[];
  public currentTab$: Observable<string>;
  public currentLang$: Observable<string>;

  constructor(
    private readonly translate: TranslateService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.currentTab$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      pluck('url'),
      startWith(this.router.url),
      map((url: string) => url.split('?')[0]),
      map((url: string) => url.split('/').pop()),
    );
    this.currentLang$ = this.translate.onLangChange.pipe(pluck('lang'), startWith(this.translate.defaultLang));
    this.tabs = [TABS.students, TABS.subjects, TABS.statistics, TABS.export];
  }

  public useLanguage(language: string): void {
    this.translate.use(language);
    const currentLang = this.translate.currentLang;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { lang: currentLang },
      queryParamsHandling: 'merge',
    });
  }
}
