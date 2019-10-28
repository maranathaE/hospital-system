import { TestBed } from '@angular/core/testing';

import { StaffsService } from './staffs.service';

describe('StaffsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StaffsService = TestBed.get(StaffsService);
    expect(service).toBeTruthy();
  });
});
