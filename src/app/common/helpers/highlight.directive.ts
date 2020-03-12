import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() public mark: number;

  constructor(private readonly el: ElementRef, private readonly renderer: Renderer2) { }

  @HostListener('mouseenter')
  private colorize(): void {
      if (this.mark < 5) {
        this.renderer.setStyle(
            this.el.nativeElement,
            'background',
            'blue'
    );
      } else {
        this.renderer.setStyle(
            this.el.nativeElement,
            'background',
            'green'
      );
      }
  }
  @HostListener('mouseleave')
  private reset(): void {
    this.renderer.setStyle(
        this.el.nativeElement,
        'background',
        ''
        );
  }
}
