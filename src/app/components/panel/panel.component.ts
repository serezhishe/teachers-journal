import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

enum TABS {
  'students' = 'students',
  'subjects' = 'subjects',
  'statistics' = 'statistics',
  'export' = 'export',
}

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {
  public tabs: string[];

  constructor(private readonly translate: TranslateService) {}

  public ngOnInit(): void {
    this.tabs = [
      TABS.students,
      TABS.subjects,
      TABS.statistics,
      TABS.export,
    ];
  }

  public useLanguage(language: string): void {
    this.translate.use(language);
  }
}
