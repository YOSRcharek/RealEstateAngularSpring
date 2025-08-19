import { TestBed } from '@angular/core/testing';

import { ImageAnnonceService } from './image-annonce.service';

describe('ImageAnnonceService', () => {
  let service: ImageAnnonceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageAnnonceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
