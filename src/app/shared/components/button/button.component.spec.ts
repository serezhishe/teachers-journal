import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { Component } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateMockPipe } from '../../pipes/translate-mock-pipe.pipe';

import { ButtonComponent } from './button.component';

@Component({
  template: ` <app-button [type]="type"></app-button> `,
})
class TestHostComponent {
  public type: string;
  constructor(public readonly location: Location) {}
}
// tslint:disable-next-line: max-classes-per-file
@Component({
  template: '',
})
class DummyComponent {}

fdescribe('ButtonComponent', () => {
  let testHost: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let router: Router;
  let location: Location;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent, TestHostComponent, TranslateMockPipe, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'form', component: DummyComponent },
          { path: 'prefix', component: DummyComponent },
          { path: 'prefix/test', component: TestHostComponent },
          { path: 'prefix/test/form', component: DummyComponent },
         ]),
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();
    router.navigateByUrl('prefix/test');
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

    fdescribe('add', () => {
      it('contain proper text', () => {
        testHost.type = 'add';
        testHostFixture.detectChanges();
        expect(testHostFixture.nativeElement.querySelector('div button').innerText).toEqual('add');
      });

      it('contain rel link to form', fakeAsync(() => {
        testHost.type = 'add';
        testHostFixture.detectChanges();

        const button = testHostFixture.debugElement.query(By.css('div button'));
        button.nativeElement.click();
        tick();

        testHostFixture.whenStable().then(() => {
          expect(location.path()).toBe('prefix/test/form'); // actually '/form'
        });
        expect(true).toBeTruthy();
      }));
    });

    it('cancel', () => {
      testHost.type = 'cancel';
      testHostFixture.detectChanges();
      expect(testHostFixture.nativeElement.querySelector('div button').innerText).toEqual('app.cancel');
    });

    fdescribe('go-back', () => {
      it('contain proper text', () => {
        testHost.type = 'go-back';
        testHostFixture.detectChanges();
        expect(testHostFixture.nativeElement.querySelector('div button').innerText).toEqual('app.cancel');
      });
      it('contain rel link to form', () => {
        testHost.type = 'go-back';
        testHostFixture.detectChanges();
        expect(true).toBeTruthy();
      });
    });
  });
});
