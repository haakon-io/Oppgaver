import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      const inputElement = this.el.nativeElement.querySelector('input');
      if (inputElement) {
        inputElement.focus();
      }
    }, 300);
  }
}
