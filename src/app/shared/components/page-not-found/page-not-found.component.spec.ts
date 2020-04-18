import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { TranslateMockPipe } from '../../pipes/translate-mock.pipe';
import { HttpLoaderFactory } from '../../shared.module';

import { PageNotFoundComponent } from './page-not-found.component';

fdescribe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageNotFoundComponent, TranslateMockPipe],
      imports: [
        HttpClientModule,
        RouterTestingModule,
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
    translate.use('en');
    translate.use('ru');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain status code and message', () => {
    expect(fixture.nativeElement.querySelector('.container h2').innerText).toEqual('404');
  });

  it('should contain link to students page', () => {
    const href = fixture.debugElement.query(By.css('.container a')).nativeElement.getAttribute('href');
    expect(href).toEqual('/students');
  });

  describe('English locale', () => {
    beforeEach(async(() => {
      translate.use('en');
      fixture.detectChanges();
    }));

    it('should contain status code and message', () => {
      const message = fixture.nativeElement.querySelector('.container h3').innerText;
      translate.get('app.pageNotFound.message').subscribe(translation => {
        expect(message).toEqual(translation);
      });
      const navigation = fixture.nativeElement.querySelector('.container a').innerText;
      translate.get('app.pageNotFound.navigation').subscribe(translation => {
        expect(navigation).toEqual(translation);
      });
    });
  });

  describe('Russian locale', () => {
    beforeEach(async(() => {
      translate.use('ru');
      fixture.detectChanges();
    }));

    it('should contain status code and message', () => {
      const message = fixture.nativeElement.querySelector('.container h3').innerText;
      translate.get('app.pageNotFound.message').subscribe(translation => {
        expect(message).toEqual(translation);
      });
      const navigation = fixture.nativeElement.querySelector('.container a').innerText;
      translate.get('app.pageNotFound.navigation').subscribe(translation => {
        expect(navigation).toEqual(translation);
      });
    });
  });
});
