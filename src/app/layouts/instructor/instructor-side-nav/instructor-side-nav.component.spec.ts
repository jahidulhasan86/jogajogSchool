import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorSideNavComponent } from './instructor-side-nav.component';

describe('InstructorSideNavComponent', () => {
  let component: InstructorSideNavComponent;
  let fixture: ComponentFixture<InstructorSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructorSideNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructorSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
