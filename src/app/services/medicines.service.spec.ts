import { TestBed } from '@angular/core/testing';

import { MedicinesService } from './medicines.service';

describe('MedicinesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MedicinesService = TestBed.get(MedicinesService);
    expect(service).toBeTruthy();
  });
});
