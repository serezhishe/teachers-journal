import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectsRootComponent } from './subjects-root.component';

describe('SubjectsRootComponent', () => {
  let component: SubjectsRootComponent;
  let fixture: ComponentFixture<SubjectsRootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectsRootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectsRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
