import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { popUpTypes } from '../../common/constants';

import { PopUpComponent } from './pop-up.component';

describe('PopUpComponent', () => {
  let component: PopUpComponent;
  let fixture: ComponentFixture<PopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopUpComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be error type and contain error message', () => {
    const testMessage = 'test error';
    component.type = popUpTypes.error;
    component.message = testMessage;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div h2').innerText).toEqual(testMessage);
  });

  it('should be success type and contain success message', () => {
    const testMessage = 'test success';
    component.type = popUpTypes.success;
    component.message = testMessage;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div h2').innerText).toEqual(testMessage);
  });
});
