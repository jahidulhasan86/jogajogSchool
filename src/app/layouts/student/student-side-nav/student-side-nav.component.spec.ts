import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSideNavComponent } from './student-side-nav.component';

describe('StudentSideNavComponent', () => {
  let component: StudentSideNavComponent;
  let fixture: ComponentFixture<StudentSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentSideNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
