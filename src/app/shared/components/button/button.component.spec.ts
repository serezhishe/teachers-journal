import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateMockPipe } from '../../pipes/translate-mock-pipe.pipe';

import { ButtonComponent } from './button.component';

@Component({
  template: ` <app-button [type]="type"></app-button> `,
})
class TestHostComponent {
  public type: string;
}
// tslint:disable-next-line: max-classes-per-file
@Component({
  template: '',
})
class DummyComponent {}

fdescribe('ButtonComponent', () => {
  let testHost: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent, TestHostComponent, TranslateMockPipe, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule.withRoutes([{ path: 'form', component: DummyComponent }])],
    }).compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHost = testHostFixture.componentInstance;
    testHostFixture.detectChanges();
  });

  fdescribe('should have a proper type', () => {
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

    describe('add', () => {
      it('contain proper text', () => {
        testHost.type = 'add';
        testHostFixture.detectChanges();
        expect(testHostFixture.nativeElement.querySelector('div a').innerText).toEqual('add');
      });

      it('contain rel link to form', () => {
        testHost.type = 'add';
        testHostFixture.detectChanges();

        const href = testHostFixture.nativeElement.querySelector('div a').getAttribute('href');

        expect(href).toBe('/form');
      });
    });

    it('cancel', () => {
      testHost.type = 'cancel';
      testHostFixture.detectChanges();
      expect(testHostFixture.nativeElement.querySelector('div button').innerText).toEqual('app.cancel');
    });

    describe('go-back', () => {
      it('contain proper text', () => {
        testHost.type = 'go-back';
        testHostFixture.detectChanges();

        expect(testHostFixture.nativeElement.querySelector('div a').innerText).toEqual('app.cancel');
      });
      it('contain rel link to form', () => {
        testHost.type = 'go-back';
        testHostFixture.detectChanges();

        const href = testHostFixture.nativeElement.querySelector('div a').getAttribute('href');

        expect(href).toBe('/');
      });
    });
  });
});
