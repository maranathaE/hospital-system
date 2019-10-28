import { TestBed } from '@angular/core/testing';

import { InvestigationsService } from './investigations.service';

describe('InvestigationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InvestigationsService = TestBed.get(InvestigationsService);
    expect(service).toBeTruthy();
  });
});
