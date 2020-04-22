import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { TranslateMockPipe } from '../../pipes/translate-mock.pipe';
import { HttpLoaderFactory } from '../../shared.module';

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
  let translate: TranslateService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent, TestHostComponent, TranslateMockPipe, DummyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientModule,
        RouterTestingModule.withRoutes([{ path: 'form', component: DummyComponent }]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
    }).compileComponents();
    translate = TestBed.inject(TranslateService);
    translate.addLangs(['en', 'ru']);
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

    describe('goBack', () => {
      it('contain proper text', () => {
        testHost.type = 'goBack';
        testHostFixture.detectChanges();

        expect(testHostFixture.nativeElement.querySelector('div a').innerText).toEqual('app.cancel');
      });
      it('contain rel link to form', () => {
        testHost.type = 'goBack';
        testHostFixture.detectChanges();

        const href = testHostFixture.nativeElement.querySelector('div a').getAttribute('href');

        expect(href).toBe('/');
      });
    });
  });

  fdescribe('English locale', () => {
    beforeEach(async(() => {
      translate.use('en');
    }));

    it('save', () => {
      testHost.type = 'save';
      testHostFixture.detectChanges();
      expect(testHostFixture.nativeElement.querySelector('div button').innerText).toEqual('Save');
    });

    it('cancel', () => {
      testHost.type = 'cancel';
      testHostFixture.detectChanges();
      expect(testHostFixture.nativeElement.querySelector('div button').innerText).toEqual('Cancel');
    });

    it('goBack', () => {
      testHost.type = 'goBack';
      testHostFixture.detectChanges();
      expect(testHostFixture.nativeElement.querySelector('div a').innerText).toEqual('Cancel');
    });
  });

  fdescribe('Russian locale', () => {
    beforeEach(async(() => {
      translate.use('ru');
    }));

    it('save', () => {
      testHost.type = 'save';
      testHostFixture.detectChanges();
      expect(testHostFixture.nativeElement.querySelector('div button').innerText).toEqual('Сохранить');
    });

    it('cancel', () => {
      testHost.type = 'cancel';
      testHostFixture.detectChanges();
      expect(testHostFixture.nativeElement.querySelector('div button').innerText).toEqual('Отмена');
    });

    it('goBack', () => {
      testHost.type = 'goBack';
      testHostFixture.detectChanges();
      expect(testHostFixture.nativeElement.querySelector('div a').innerText).toEqual('Отмена');
    });
  });
});
