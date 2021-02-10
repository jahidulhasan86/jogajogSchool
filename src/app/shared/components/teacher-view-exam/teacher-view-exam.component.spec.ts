import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherViewExamComponent } from './teacher-view-exam.component';

describe('TeacherViewExamComponent', () => {
  let component: TeacherViewExamComponent;
  let fixture: ComponentFixture<TeacherViewExamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherViewExamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherViewExamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
