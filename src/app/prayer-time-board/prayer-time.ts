import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, switchMap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrayerTimeService {
  private readonly baseUrl = 'https://api.aladhan.com/v1';

  constructor(private http: HttpClient) {}

  /**
   * Fetch prayer times using latitude & longitude (no redirect issue)
   */
  getPrayerTimes(lat: number, lon: number, method: number = 2): Observable<any> {
    const url = `${this.baseUrl}/timings?latitude=${lat}&longitude=${lon}&method=${method}`;
    return this.http.get(url);
  }

  /**
   * Fetch prayer times by city & country (can cause redirect in browser)
   */
  getPrayerTimesByCity(city: string, country: string, method: number = 2): Observable<any> {
    const url = `${this.baseUrl}/timingsByCity?city=${city}&country=${country}&method=${method}`;
    return this.http.get(url);
  }

  /**
   * Automatically detects location and fetches prayer times
   */
  getPrayerTimesByLocation(method: number = 2): Observable<any> {
    if ('geolocation' in navigator) {
      return from(
        new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        )
      ).pipe(
        switchMap(position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          return this.getPrayerTimes(lat, lon, method);
        }),
        catchError(err => {
          console.warn('⚠️ Geolocation failed, falling back to Bengaluru.', err);
          return this.getPrayerTimesByCity('Bengaluru', 'IN', method);
        })
      );
    } else {
      console.warn('⚠️ Geolocation not available, using Bengaluru as default.');
      return this.getPrayerTimesByCity('Bengaluru', 'IN', method);
    }
  }
}
