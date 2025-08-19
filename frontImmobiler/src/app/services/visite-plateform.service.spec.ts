import { TestBed } from '@angular/core/testing';

import { VisitePlateformService } from './visite-plateform.service';

describe('VisitePlateformService', () => {
  let service: VisitePlateformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitePlateformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
