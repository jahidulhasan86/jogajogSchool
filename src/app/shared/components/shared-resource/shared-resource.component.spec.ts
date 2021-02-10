import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedResourceComponent } from './shared-resource.component';

describe('SharedResourceComponent', () => {
  let component: SharedResourceComponent;
  let fixture: ComponentFixture<SharedResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedResourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
