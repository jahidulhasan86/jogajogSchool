import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingPlayComponent } from './recording-play.component';

describe('RecordingPlayComponent', () => {
  let component: RecordingPlayComponent;
  let fixture: ComponentFixture<RecordingPlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordingPlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingPlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
