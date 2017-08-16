import { TestBed, inject } from '@angular/core/testing';

import { PiplineService } from './pipline.service';

describe('PiplineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PiplineService]
    });
  });

  it('should be created', inject([PiplineService], (service: PiplineService) => {
    expect(service).toBeTruthy();
  }));
});
