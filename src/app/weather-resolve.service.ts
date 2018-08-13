import { Injectable } from '@angular/core';
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Weather, WeatherService} from './weather.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherResolveService implements Resolve<Weather> {
  weather: Weather;

  constructor(private weatherService: WeatherService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Weather> {
    return this.weatherService.getMyLocation();

  }
}

