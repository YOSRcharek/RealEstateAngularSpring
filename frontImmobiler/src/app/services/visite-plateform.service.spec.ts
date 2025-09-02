import { TestBed } from '@angular/core/testing';

import { VisitePlateformeService } from './visite-plateform.service';

describe('VisitePlateformService', () => {
  let service: VisitePlateformeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitePlateformeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
