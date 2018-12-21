import { TestBed } from '@angular/core/testing';

import { PlanetService } from '../planet.service';

describe('PlanetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlanetService = TestBed.get(PlanetService);
    expect(service).toBeTruthy();
  });
});
