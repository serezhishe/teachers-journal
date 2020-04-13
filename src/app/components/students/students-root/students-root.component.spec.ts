import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsRootComponent } from './students-root.component';

describe('StudentsRootComponent', () => {
  let component: StudentsRootComponent;
  let fixture: ComponentFixture<StudentsRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentsRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
