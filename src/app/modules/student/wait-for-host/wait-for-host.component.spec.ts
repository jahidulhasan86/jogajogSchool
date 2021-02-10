import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitForHostComponent } from './wait-for-host.component';

describe('WaitForHostComponent', () => {
  let component: WaitForHostComponent;
  let fixture: ComponentFixture<WaitForHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitForHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitForHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
