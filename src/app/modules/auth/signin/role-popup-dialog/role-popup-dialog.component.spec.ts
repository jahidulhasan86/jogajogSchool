import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePopupDialogComponent } from './role-popup-dialog.component';

describe('RolePopupDialogComponent', () => {
  let component: RolePopupDialogComponent;
  let fixture: ComponentFixture<RolePopupDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolePopupDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePopupDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
