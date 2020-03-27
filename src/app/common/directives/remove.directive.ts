import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appRemove]',
})
export class RemoveDirective {
  constructor(private readonly el: ElementRef, private readonly renderer: Renderer2) {}

  @HostListener('mouseenter')
  private showRemoveButton(): void {
    this.renderer.addClass(this.el.nativeElement, 'shown');
  }
  @HostListener('mouseleave')
  private hideRemoveButton(): void {
    this.renderer.removeClass(this.el.nativeElement, 'shown');
  }
}
