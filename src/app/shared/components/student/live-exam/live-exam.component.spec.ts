import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveExamComponent } from './live-exam.component';

describe('LiveExamComponent', () => {
  let component: LiveExamComponent;
  let fixture: ComponentFixture<LiveExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
