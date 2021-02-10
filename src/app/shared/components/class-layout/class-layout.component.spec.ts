import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassLayoutComponent } from './class-layout.component';

describe('ClassLayoutComponent', () => {
  let component: ClassLayoutComponent;
  let fixture: ComponentFixture<ClassLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
