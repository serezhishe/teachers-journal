import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateMockPipe } from '../../pipes/translate-mock-pipe.pipe';

import { PageNotFoundComponent } from './page-not-found.component';

fdescribe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;
  const router = {
    navigate: jasmine.createSpy('navigate'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageNotFoundComponent, TranslateMockPipe],
      imports: [RouterTestingModule],
    }).compileComponents();
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
    expect(fixture.nativeElement.querySelector('.container h3').innerText).toEqual('app.pageNotFound.message');
  });

  it('should contain link to students page', () => {
    expect(fixture.nativeElement.querySelector('.container a').innerText).toEqual('app.pageNotFound.navigation');
    const href = fixture.debugElement.query(By.css('.container a')).nativeElement.getAttribute('href');
    expect(href).toEqual('/students');
    console.log(fixture.debugElement.query(By.css('.container a')).nativeElement);
  });
});
