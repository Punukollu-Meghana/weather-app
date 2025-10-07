import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as loadActions from './weather.actions';
import { catchError, delay, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class Weathereffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);


// IMPORTANT !!!!!!!!!! Replcae the text 'REPLACE_IT_WITH_YOUR_ID' with your API KEY
// ELSE APP WONT RUN   

  loadWeather$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadActions.loadWeather),
      switchMap(({city}) =>
        this.http.get<any>(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=_KEY_&units=metric`)
        .pipe(
          delay(1000)
        )
        .pipe(
          map(res =>
            loadActions.loadWeatherSuccess({
              weather : {
                city : res.name,
                temperature : res.main.temp,
                humidity : res.main.humidity,
                description : res.weather[0].description
              }
            }),
          ),
          catchError(err => of(loadActions.loadWeatherFailure({error : err.message || 'Failed to load the message'})))
        )
      )
    )
  )
}
