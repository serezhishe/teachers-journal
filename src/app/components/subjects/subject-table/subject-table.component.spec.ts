import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { IStudent, ISubjectPage } from '../../../common/models';
import { PopUpService } from '../../../common/services/pop-up.service';
import { SubjectsService } from '../../../common/services/subjects.service';
import { TranslateMockPipe } from '../../../shared/pipes/translate-mock.pipe';

import { SubjectTableComponent } from './subject-table.component';

fdescribe('SubjectTableComponent', () => {
  let component: SubjectTableComponent;
  let fixture: ComponentFixture<SubjectTableComponent>;
  const mockStudents: IStudent[] = [
    {
      description: 'good guy',
      address: 'Mira, 21',
      _id: '5e7ddaa1c8605615bcd8fccb',
      name: 'Evgeniy',
      lastName: 'Pashko',
    },
    {
      description: 'bad guy',
      address: 'Kolasa, 5',
      _id: '5e7ddb2dc8605615bcd8fccd',
      name: 'Alexandro',
      lastName: 'Smith',
    },
  ];
  const oneMockSubject: ISubjectPage = {
    dates: ['2020-04-08T21:00:00.000Z', '2020-04-14T21:00:00.000Z', '2020-04-15T21:00:00.000Z', '2020-04-18T21:00:00.000Z'],
    students: ['5e7ddaa1c8605615bcd8fccb', '5e7ddb2dc8605615bcd8fccd'],
    _id: '5e8b42164c0bbc3cd407f60b',
    marks: new Map(),
    subjectId: '5e8b42164c0bbc3cd407f60b',
    cabinet: 0,
    description: '',
    subjectName: 'Some Subject',
    teacher: 'Elena',
  };
  const mockDateHeaders = ['09/04/20', '15/04/20', '16/04/20', '19/04/20'];
  const mockDisplayedColumns = ['name', 'lastName', 'averageMark', '09/04/20', '15/04/20', '16/04/20', '19/04/20'];
  let subjectsServiceSpy: jasmine.SpyObj<SubjectsService>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let popUpServiceSpy: jasmine.SpyObj<PopUpService>;

  beforeEach(async(() => {
    const subjectsSpy = jasmine.createSpyObj('SubjectsService', [
      'getSubject',
      'getDataSource',
      'updateCurrentSubject',
      'deleteDate',
      'createDate',
      'removeStudentFromSubject',
      'loadSubject',
    ]);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['get']);
    const popUpSpy = jasmine.createSpyObj('PopUpService', ['errorMessage']);
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [SubjectTableComponent, TranslateMockPipe],
      providers: [
        FormBuilder,
        { provide: SubjectsService, useValue: subjectsSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: PopUpService, useValue: popUpSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { subject: oneMockSubject.subjectName } } } },
      ],
    }).compileComponents();
    subjectsServiceSpy = TestBed.inject(SubjectsService) as jasmine.SpyObj<SubjectsService>;
    translateServiceSpy = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    popUpServiceSpy = TestBed.inject(PopUpService) as jasmine.SpyObj<PopUpService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectTableComponent);
    component = fixture.componentInstance;
    subjectsServiceSpy.getSubject.and.returnValue(of(oneMockSubject));
    const dataSource = oneMockSubject.students.map(id => ({
      marks: [],
      averageMark: undefined,
      student: {
        name: mockStudents.filter(student => student._id === id)[0].name,
        lastName: mockStudents.filter(student => student._id === id)[0].lastName,
      },
    }));
    subjectsServiceSpy.getDataSource.and.returnValue(dataSource);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.subjectName).toEqual('Some Subject');
    expect(component.teacher).toEqual('Elena');
    component.datesHeaders.forEach((dateHeader, index) => {
      expect(dateHeader).toEqual(mockDateHeaders[index]);
    });
    component.displayedColumns.forEach((column, index) => {
      expect(column).toEqual(mockDisplayedColumns[index]);
    });
    const teacher = fixture.nativeElement.querySelector('.teacher input');
    expect(teacher.placeholder).toEqual('app.subjects.teacherPlaceholder');
    expect(teacher.value).toEqual('Elena');
    expect(fixture.nativeElement.querySelectorAll('.buttons app-button').length).toEqual(3);
  });
});
