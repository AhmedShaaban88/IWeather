import { Component, OnInit } from '@angular/core';
import {Weather, WeatherService, ForecastWeather} from '../weather.service';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.sass']
})
export class WeatherComponent implements OnInit {
  cityName: string;
  error = null;
  loaded = false;
  weather: Weather;
  weatherDays: ForecastWeather[] = [];
  dayTime: string;
  private data: Date = new Date();
  private hours = this.data.getHours();
  private today = this.data.getFullYear() + '-' + ('0' + (this.data.getMonth() + 1)).slice(-2) + '-' + ('0' + (this.data.getDate())).slice(-2);

  constructor(private weatherService: WeatherService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.dayTime = (this.hours > 6 && this.hours < 19) ? 'day' : 'night';
    this.route.data.subscribe((data: { weather: Weather }) => {
      this.weather = this.weatherService.currentWeatherWithIcon(data.weather);
      this.loaded = false;
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          this.weatherService.forcasetByGeo(lat, long).subscribe(value => this.weatherDays =  this.adjForcast(value), error => this.error = error, () => this.loaded = true);
        }));

    }

  }

  getWeather(): void {
    this.error = null;
    this.loaded = true;
    if (this.cityName !== undefined && this.cityName.trim() !== '') {
      this.dayTime = undefined;
      this.cityName = this.cityName.trim();
      this.weatherService.byCity(this.cityName).subscribe(cityWeather => this.weather = this.weatherService.currentWeatherWithIcon(cityWeather), error => this.error = error, () => this.loaded = false);
      this.weatherService.forcastBycity(this.cityName).subscribe(value => this.weatherDays = this.adjForcast(value), error => this.error = error, () => this.loaded = true);
    }


  }
  adjForcast(weather): Array<ForecastWeather> {
    const weatherDaysTemp = [];
    const weatherDays_ = [];
    weather.list.filter((val) => {
        if (val.dt_txt.split(' ')[0] !== this.today) {
          weatherDaysTemp.push(val);
        }
      });
      for (let i = 0; i < 32; i += 8) {
        weatherDays_.push(this.weatherService.currentWeatherWithIcon(weatherDaysTemp[i]));
      }
      return weatherDays_;

  }

  refresh(): void {
    this.error = null;
    this.weatherDays = [];
    this.ngOnInit();
  }
}
