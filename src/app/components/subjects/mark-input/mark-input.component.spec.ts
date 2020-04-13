import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkInputComponent } from './mark-input.component';

describe('MarkInputComponent', () => {
  let component: MarkInputComponent;
  let fixture: ComponentFixture<MarkInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
