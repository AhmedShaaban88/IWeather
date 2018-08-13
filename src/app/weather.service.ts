import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError, from} from 'rxjs';
import {retry, catchError, take} from 'rxjs/operators';


export interface Weather {
  name: string;
  weather: [{
    id: number,
    main: string,
    description: string,
    icon: any,
  }];
  temp: {
    main_temp: number,
    max_temp: number,
    min_temp: number,
  };
}
export interface ForecastWeather extends Weather {
  dt_txt: string;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  icons: object;
  constructor(private http: HttpClient) {
   this.http.get<object>('https://gist.githubusercontent.com/tbranyen/62d974681dea8ee0caa1/raw/3405bfb2a76b7cbd90fde33d8536f0cd13706955/icons.json').pipe(
      retry(3),
      catchError(WeatherService.handleError),
    ).subscribe(icons => this.icons = icons);
  }
  static handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      return throwError('Oops! check your connection');
    } else if (error.status === 404) {
      return throwError('This city not found please check your input or try maps');
    }
    return throwError('Sorry something wrong please try again later');
  }
  getMyLocation(): Observable<Weather> {
    return from(new Promise((res, rej) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
             this.byGeo(lat, long).toPromise().then(
              (data: Weather) => res(data)).catch(() => rej(WeatherService.handleError));
          }), (error) => {
            if (error.code === 1) {
            alert('permissionDenied. Please turn on Location Service!');
            location.assign('/map');
            }
          });
      }



    }));

  }
  byCity(name: string): Observable<Weather> {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&units=metric&appid=431345a92c7ec9462c63d8512e795682`;
    return this.http.get<Weather>(url).pipe(
      retry(3),
      take(1),
      catchError(WeatherService.handleError)
    );
  }
  byGeo(lat: number, long: number): Observable<Weather> {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&units=metric&lon=${long}&appid=431345a92c7ec9462c63d8512e795682`;
    return this.http.get<Weather>(url).pipe(
      retry(3),
      take(1),
      catchError(WeatherService.handleError)
    );
  }
  forcastBycity(name: string): Observable<ForecastWeather[]> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&units=metric&appid=431345a92c7ec9462c63d8512e795682`;
    return this.http.get<Weather>(url).pipe(
      retry(3),
      catchError(WeatherService.handleError)
    );
  }
  forcasetByGeo(lat: number, long: number): Observable<ForecastWeather[]> {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&units=metric&lon=${long}&appid=431345a92c7ec9462c63d8512e795682`;
    return this.http.get<Weather>(url).pipe(
      retry(3),
      catchError(WeatherService.handleError)
    );
  }
  getIcon(weather: Weather): string {
   const prefix = 'wi wi-';
    const code = weather.weather[0]['id'];
    const weatherIcon = this.icons[code].icon;
    var status = '';
      // If we are not in the ranges mentioned above, add a day/night prefix.
      if (!(code > 699 && code < 800) && !(code > 899 && code < 1000)) {
          status = 'day-';
      }
      // Finally tack on the prefix.
      return  prefix + status + weatherIcon;

  }
  currentWeatherWithIcon(weather: Weather): any {
    if (weather.name !== undefined) {
      weather.weather[0].icon = this.getIcon(weather);
      return weather;
    } else {
      weather.weather[0].icon = this.getIcon(weather);
      return weather;
    }
  }



}
