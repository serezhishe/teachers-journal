import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const TABS = ['students', 'subjects', 'statistics', 'export'];

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {
  public tabs: string[];

  constructor(private readonly translate: TranslateService) {}

  public ngOnInit(): void {
    this.tabs = TABS;
  }

  public useLanguage(language: string): void {
    this.translate.use(language);
  }
}
