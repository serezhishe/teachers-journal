import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

import { colors } from '../constants/';

const mediumMark = 5;

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private readonly badMarkColor: string;
  private readonly goodMarkColor: string;
  @Input()
  public mark: number;

  constructor(private readonly el: ElementRef, private readonly renderer: Renderer2) {
    this.badMarkColor = colors.niceBlue;
    this.goodMarkColor = colors.niceGreen;
  }

  @HostListener('mouseenter')
  private colorize(): void {
    if (this.mark < mediumMark) {
      this.renderer.setStyle(this.el.nativeElement, 'background', this.badMarkColor);
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'background', this.goodMarkColor);
    }
  }
  @HostListener('mouseleave')
  private reset(): void {
    this.renderer.setStyle(this.el.nativeElement, 'background', '');
  }
}
