import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHover]',
})
export class HoverDirective {
  constructor(private readonly el: ElementRef, private readonly renderer: Renderer2) {}

  @HostListener('mouseenter')
  private addShownClass(): void {
    this.renderer.addClass(this.el.nativeElement, 'shown');
  }
  @HostListener('mouseleave')
  private removeShownClass(): void {
    this.renderer.removeClass(this.el.nativeElement, 'shown');
  }
}
