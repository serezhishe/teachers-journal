import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateMockPipe } from '../../pipes/translate-mock-pipe.pipe';

import { ButtonComponent } from './button.component';

@Component({
  template: ` <app-button [type]="type"></app-button> `,
})
class TestHostComponent {
  public type: string;
}

fdescribe('ButtonComponent', () => {
  let testHost: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent, TestHostComponent, TranslateMockPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHost = testHostFixture.componentInstance;
  });

  describe('should have a proper type', () => {
    it('save', () => {
      testHost.type = 'save';
      testHostFixture.detectChanges();
      expect(testHostFixture.nativeElement.querySelector('div button').type).toEqual('submit');
      expect(testHostFixture.nativeElement.querySelector('div button').innerText).toEqual('app.save');
    });

    it('delete', () => {
      testHost.type = 'delete';
      testHostFixture.detectChanges();
      expect(testHostFixture.nativeElement.querySelector('div button').innerText).toEqual('delete');
    });

    it('add', () => {
      testHost.type = 'add';
      testHostFixture.detectChanges();
      expect(testHostFixture.nativeElement.querySelector('div button').innerText).toEqual('add');
    });

    it('cancel', () => {
      testHost.type = 'cancel';
      testHostFixture.detectChanges();
      expect(testHostFixture.nativeElement.querySelector('div button').innerText).toEqual('app.cancel');
    });

    it('go-back', () => {
      testHost.type = 'go-back';
      testHostFixture.detectChanges();
      expect(testHostFixture.nativeElement.querySelector('div button').innerText).toEqual('app.cancel');
    });
  });
});
