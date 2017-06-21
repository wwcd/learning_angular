import { TestBed, inject } from '@angular/core/testing';

import { EcService } from './ec.service';

describe('EcService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EcService]
    });
  });

  it('should be created', inject([EcService], (service: EcService) => {
    expect(service).toBeTruthy();
  }));
});
