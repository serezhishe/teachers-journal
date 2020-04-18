import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessComponent } from './success.component';

fdescribe('SuccessComponent', () => {
  let component: SuccessComponent;
  let fixture: ComponentFixture<SuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain successMessage', () => {
    const testMessage = 'test success';
    component.success = testMessage;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('div h2').innerText).toEqual(testMessage);
  });
});
