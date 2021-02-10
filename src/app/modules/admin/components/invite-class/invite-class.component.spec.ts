import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteClassComponent } from './invite-class.component';

describe('InviteClassComponent', () => {
  let component: InviteClassComponent;
  let fixture: ComponentFixture<InviteClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
