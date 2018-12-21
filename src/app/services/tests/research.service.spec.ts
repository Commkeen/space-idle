import { TestBed } from '@angular/core/testing';

import { ResearchService } from '../research.service';

describe('ResearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResearchService = TestBed.get(ResearchService);
    expect(service).toBeTruthy();
  });
});
