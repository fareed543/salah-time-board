import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrayerTimeService {

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  private toDeg(rad: number): number {
    return (rad * 180) / Math.PI;
  }

  private hoursToDate(date: Date, hours: number): Date {
    const localDate = new Date(date);
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    localDate.setHours(h, m, 0, 0);
    return localDate;
  }

  private subtractMinutes(time: Date, mins: number): Date {
    return new Date(time.getTime() - mins * 60000);
  }

  getTimes(date: Date, lat: number, lng: number, tzOffset: number) {
    const n = Math.ceil(
      (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
    );

    const gamma = (2 * Math.PI / 365) * (n - 1 + (date.getHours() - 12) / 24);

    // Solar declination
    const decl =
      0.006918 -
      0.399912 * Math.cos(gamma) +
      0.070257 * Math.sin(gamma) -
      0.006758 * Math.cos(2 * gamma) +
      0.000907 * Math.sin(2 * gamma);

    // Equation of time (minutes)
    const eqtime =
      229.18 *
      (0.000075 +
        0.001868 * Math.cos(gamma) -
        0.032077 * Math.sin(gamma) -
        0.014615 * Math.cos(2 * gamma) -
        0.040849 * Math.sin(2 * gamma));

    const noon = 12 + tzOffset - lng / 15 - eqtime / 60;
    const phi = this.toRad(lat);

    const calcTime = (angle: number) => {
      const h = this.toRad(-angle);
      const omega = Math.acos(
        (Math.sin(h) - Math.sin(phi) * Math.sin(decl)) /
        (Math.cos(phi) * Math.cos(decl))
      );
      return this.toDeg(omega) / 15;
    };

    const sunrise = noon - calcTime(0.833);
    const sunset = noon + calcTime(0.833);
    const fajr = noon - calcTime(18);
    const isha = noon + calcTime(17);
    const dhuhr = noon;
    const asr = dhuhr + 3.5; // basic offset for Asr
    const midnight = (sunset + fajr) / 2;

    // Convert hours to Date
    const times = {
      fajr: this.hoursToDate(date, fajr),
      sunrise: this.hoursToDate(date, sunrise),
      dhuhr: this.hoursToDate(date, dhuhr),
      asr: this.hoursToDate(date, asr),
      maghrib: this.hoursToDate(date, sunset),
      isha: this.hoursToDate(date, isha),
      midnight: this.hoursToDate(date, midnight)
    };

    // Additional times
    const sahri = this.subtractMinutes(times.fajr, 10); // 10 min before Fajr
    const iftar = times.maghrib;
    const tulu = times.sunrise;
    const zawal = times.dhuhr;
    const gurub = times.maghrib;

    return {
      sahri: sahri,
      fajr: times.fajr,
      tulu: tulu,
      zawal: zawal,
      dhuhr: times.dhuhr,
      asr: times.asr,
      gurub: gurub,
      maghrib: times.maghrib,
      iftar: iftar,
      isha: times.isha,
      midnight: times.midnight
    };
  }
}
