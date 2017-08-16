import { TestBed, inject } from '@angular/core/testing';

import { CiService } from './ci.service';

describe('CiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CiService]
    });
  });

  it('should be created', inject([CiService], (service: CiService) => {
    expect(service).toBeTruthy();
  }));
});
