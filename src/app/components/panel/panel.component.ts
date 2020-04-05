import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const TABS = ['students', 'subjects', 'statistics', 'export']; // REVIEW: convert to enum `enum Tab { students: 'students` ...} and push it ->`

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit {
  public tabs: string[];

  constructor(private readonly translate: TranslateService) {}

  public ngOnInit(): void {
    this.tabs = TABS; // REVIEW: -> here
  }

  public useLanguage(language: string): void {
    this.translate.use(language);
  }
}
