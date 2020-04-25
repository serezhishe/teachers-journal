import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { IStudent } from '../../../common/models';
import { PopUpService } from '../../../common/services/pop-up.service';
import { StudentsService } from '../../../common/services/students.service';

import { StudentsTableComponent } from './students-table.component';

fdescribe('StudentsTableComponent', () => {
  let component: StudentsTableComponent;
  let fixture: ComponentFixture<StudentsTableComponent>;
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
  const mockDisplayedColumns = ['index', 'name', 'lastName', 'address', 'description'];
  let studentsServiceSpy: jasmine.SpyObj<StudentsService>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let popUpServiceSpy: jasmine.SpyObj<PopUpService>;

  beforeEach(async(() => {
    const studentsSpy = jasmine.createSpyObj('StudentsService', ['getStudents', 'deleteStudent']);
    const translateSpy = jasmine.createSpyObj('TranslateService', ['get']);
    const popUpSpy = jasmine.createSpyObj('PopUpService', ['errorMessage']);
    TestBed.configureTestingModule({
      declarations: [StudentsTableComponent],
      providers: [
        FormBuilder,
        { provide: StudentsService, useValue: studentsSpy },
        { provide: TranslateService, useValue: translateSpy },
        { provide: PopUpService, useValue: popUpSpy },
        MatTableModule,
      ],
    }).compileComponents();
    studentsServiceSpy = TestBed.inject(StudentsService) as jasmine.SpyObj<StudentsService>;
    translateServiceSpy = TestBed.inject(TranslateService) as jasmine.SpyObj<TranslateService>;
    popUpServiceSpy = TestBed.inject(PopUpService) as jasmine.SpyObj<PopUpService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', (done) => {
    studentsServiceSpy.getStudents.and.returnValue(of(mockStudents));
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
      expect(component.displayedColumns.length).toEqual(5);
      component.displayedColumns.forEach((column, index) => {
        expect(column).toEqual(mockDisplayedColumns[index]);
      });
      console.log(fixture.nativeElement.querySelector('table'));
      done();
    });
  });
});
