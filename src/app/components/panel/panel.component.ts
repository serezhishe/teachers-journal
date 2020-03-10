import { Component, Input, OnInit } from '@angular/core';

const TABS = ['students', 'subjects', 'statistics', 'export'];

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  @Input()
  public title: string;
  public tabs: string[];

  public ngOnInit(): void {
    this.tabs = TABS;
  }

}
