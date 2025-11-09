import { TestBed } from '@angular/core/testing';

import { WaqtService } from './waqt.service';

describe('WaqtService', () => {
  let service: WaqtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WaqtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
