import { TestBed } from '@angular/core/testing';

import { PrayerTime } from './prayer-time';

describe('PrayerTime', () => {
  let service: PrayerTime;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrayerTime);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
