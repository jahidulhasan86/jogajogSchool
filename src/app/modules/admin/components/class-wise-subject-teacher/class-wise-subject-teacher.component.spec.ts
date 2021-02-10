import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassWiseSubjectTeacherComponent } from './class-wise-subject-teacher.component';

describe('ClassWiseSubjectTeacherComponent', () => {
  let component: ClassWiseSubjectTeacherComponent;
  let fixture: ComponentFixture<ClassWiseSubjectTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassWiseSubjectTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassWiseSubjectTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
