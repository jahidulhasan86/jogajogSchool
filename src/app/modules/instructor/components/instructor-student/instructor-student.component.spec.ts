import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorStudentComponent } from './instructor-student.component';

describe('InstructorStudentComponent', () => {
  let component: InstructorStudentComponent;
  let fixture: ComponentFixture<InstructorStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
