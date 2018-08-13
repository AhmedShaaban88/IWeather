import { Component, OnInit } from '@angular/core';
import {ForecastWeather, Weather, WeatherService} from '../weather.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent implements OnInit {
   lat = 51.678418;
   long = 7.809007;
  error = null;
  loaded: boolean;
  weather: Weather;
  weatherDays: ForecastWeather[] = [];
  private data: Date = new Date();
  private today = this.data.getFullYear() + '-' + ('0' + (this.data.getMonth() + 1)).slice(-2) + '-' + ('0' + (this.data.getDate())).slice(-2);
  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position => {
          this.lat = position.coords.latitude;
          this.long = position.coords.longitude;
        }));


    }
  }
  location(event) {
   this.lat = event.coords.lat;
    this.long = event.coords.lng;
    this.weatherService.byGeo(this.lat, this.long).subscribe(weather => this.weather = this.weatherService.currentWeatherWithIcon(weather), error => this.error = error, () => this.loaded = false);
    this.weatherService.forcasetByGeo(this.lat, this.long).subscribe(value => this.weatherDays =  this.adjForcast(value), error => this.error = error, () => this.loaded = true);
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


}
