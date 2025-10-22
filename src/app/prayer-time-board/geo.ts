import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

interface NominatimResponse {
  display_name: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  private baseUrl = 'https://nominatim.openstreetmap.org/reverse';
  constructor(private http: HttpClient) {}

  geocodeLatLng(lat: number, lon: number): Observable<string> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('format', 'json');

    return this.http.get<NominatimResponse>(this.baseUrl, { params }).pipe(
      map(res => res.display_name || 'Address not found')
    );
  }

  getCityName(lat: number, lon: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    return this.http.get(url);
  }
}
