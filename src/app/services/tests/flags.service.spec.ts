import { TestBed } from '@angular/core/testing';

import { FlagsService } from '../flags.service';

describe('FlagsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlagsService = TestBed.get(FlagsService);
    expect(service).toBeTruthy();
  });
});
