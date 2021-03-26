import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectRootComponent } from './subject-root.component';

describe('SubjectRootComponent', () => {
  let component: SubjectRootComponent;
  let fixture: ComponentFixture<SubjectRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectRootComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
