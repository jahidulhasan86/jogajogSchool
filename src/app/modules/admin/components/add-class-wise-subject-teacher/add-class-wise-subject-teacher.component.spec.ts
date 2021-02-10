import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClassWiseSubjectTeacherComponent } from './add-class-wise-subject-teacher.component';

describe('AddClassWiseSubjectTeacherComponent', () => {
  let component: AddClassWiseSubjectTeacherComponent;
  let fixture: ComponentFixture<AddClassWiseSubjectTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClassWiseSubjectTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddClassWiseSubjectTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
