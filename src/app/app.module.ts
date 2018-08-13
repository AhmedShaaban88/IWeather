import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {Routes, RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { WeatherComponent } from './weather/weather.component';
import {WeatherResolveService} from './weather-resolve.service';
import { AgmCoreModule } from '@agm/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
export const routes: Routes = [
  {
    path: '',
    component: WeatherComponent,
    resolve: {
      weather: WeatherResolveService
    }
  },
  {
    path: 'map',
    component: MapComponent
  },
  {
    path: '**',
    redirectTo: '/map',
    pathMatch: 'full'
  }
]
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    WeatherComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC8kDz25qFYhy1UYiPyrzvcOpkiwZz9C4o'
    }),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
