import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorTeacherComponent } from './instructor-teacher.component';

describe('InstructorTeacherComponent', () => {
  let component: InstructorTeacherComponent;
  let fixture: ComponentFixture<InstructorTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
