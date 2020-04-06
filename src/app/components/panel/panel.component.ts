import { Component, Input, OnInit } from '@angular/core';
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
    this.tabs = [];
    for (const tab in TABS) {
      this.tabs.push(TABS[tab]);
    }
  }

  public useLanguage(language: string): void {
    this.translate.use(language);
  }
}
