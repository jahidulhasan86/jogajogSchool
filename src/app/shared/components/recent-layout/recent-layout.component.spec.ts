import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentLayoutComponent } from './recent-layout.component';

describe('RecentLayoutComponent', () => {
  let component: RecentLayoutComponent;
  let fixture: ComponentFixture<RecentLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
