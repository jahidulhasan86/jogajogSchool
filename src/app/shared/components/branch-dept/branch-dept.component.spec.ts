import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchDeptComponent } from './branch-dept.component';

describe('BranchDeptComponent', () => {
  let component: BranchDeptComponent;
  let fixture: ComponentFixture<BranchDeptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchDeptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchDeptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
