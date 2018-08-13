import { TestBed, inject } from '@angular/core/testing';

import { WeatherResolveService } from './weather-resolve.service';

describe('WeatherResolveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeatherResolveService]
    });
  });

  it('should be created', inject([WeatherResolveService], (service: WeatherResolveService) => {
    expect(service).toBeTruthy();
  }));
});
