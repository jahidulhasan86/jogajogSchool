import { TestBed } from '@angular/core/testing';

import { RecordingPlayService } from './recording-play.service';

describe('RecordingPlayService', () => {
  let service: RecordingPlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordingPlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
