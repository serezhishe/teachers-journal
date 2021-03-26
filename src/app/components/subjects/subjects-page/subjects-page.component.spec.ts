import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ISubjectInfo } from '../../../common/models';
import { SubjectsService } from '../../../common/services/subjects.service';
import { TranslateMockPipe } from '../../../shared/pipes/translate-mock.pipe';
import { HttpLoaderFactory } from '../../../shared/shared.module';

import { SubjectsPageComponent } from './subjects-page.component';

fdescribe('SubjectsPageComponent', () => {
  let component: SubjectsPageComponent;
  let fixture: ComponentFixture<SubjectsPageComponent>;
  const mockSubjects: ISubjectInfo[] = [
    {
      cabinet: 0,
      description: '',
      _id: '5e8b42164c0bbc3cd407f60b',
      subjectName: 'Some Subject',
      teacher: 'Elena',
    },
    {
      cabinet: 0,
      description: '',
      _id: '5e8c39db6b9406114097ac22',
      subjectName: 'Other Subject',
      teacher: 'Anna',
    },
  ];
  let subjectsServiceSpy: jasmine.SpyObj<SubjectsService>;

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('SubjectsService', ['getSubjectList']);
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [SubjectsPageComponent, TranslateMockPipe],
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      providers: [{ provide: SubjectsService, useValue: spy }],
    }).compileComponents();
    subjectsServiceSpy = TestBed.inject(SubjectsService) as jasmine.SpyObj<SubjectsService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectsPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    subjectsServiceSpy.getSubjectList.and.returnValue(of(mockSubjects));
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.search label').innerText).toEqual('app.subjects.search');
    expect(fixture.nativeElement.querySelector('.search input')).toBeTruthy();
  });

  it('should render subjects from subjectsService.getSubjectList', () => {
    subjectsServiceSpy.getSubjectList.and.returnValue(of(mockSubjects));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.subject').length).toEqual(mockSubjects.length);
    expect(fixture.nativeElement.querySelectorAll('.subject a')[0].innerText).toEqual(mockSubjects[0].subjectName);
    expect(fixture.nativeElement.querySelectorAll('.subject a')[1].innerText).toEqual(mockSubjects[1].subjectName);
  });

  it('should filter subjects by input value (lowercased)', () => {
    subjectsServiceSpy.getSubjectList.and.returnValue(of(mockSubjects));
    fixture.detectChanges();
    component.searchSubjects.setValue('some');
    fixture.detectChanges();
    const filteredSubjects = mockSubjects.filter(subject => subject.subjectName.toLowerCase().includes('some'));
    expect(fixture.nativeElement.querySelectorAll('.subject').length).toEqual(filteredSubjects.length);
    expect(fixture.nativeElement.querySelectorAll('.subject a')[0].innerText).toEqual(filteredSubjects[0].subjectName);

    component.searchSubjects.setValue('Some');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.subject').length).toEqual(filteredSubjects.length);
    expect(fixture.nativeElement.querySelectorAll('.subject a')[0].innerText).toEqual(filteredSubjects[0].subjectName);
  });
});
