import { CommonModule, KeyValue } from '@angular/common';
import { Component, OnInit, NgZone } from '@angular/core';
import { PrayerTimeService } from './prayer-time';
import { GeoService } from './geo';

@Component({
  selector: 'app-prayer-time-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prayer-time-board.html',
  styleUrls: ['./prayer-time-board.scss']
})
export class PrayerTimeBoard implements OnInit {
  originalOrder = (a: KeyValue<string, string>, b: KeyValue<string, string>): number => {
  return 0; // keeps the original order
  };
  prayerTimes: any = {};
  currentTime = '';
  dayOfWeek = '';
  day = '';
  month = '';
  year = '';
  islamicDay = '';
  islamicDateNumber = '';
  islamicMonthName = '';
  islamicYear = '';

  constructor(
    private prayerService: PrayerTimeService,
    private geoService: GeoService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.getLocationAndTimes();
    this.updateDates();
    this.updateIslamicDate();
    this.updateTime();

    setInterval(() => this.updateTime(), 1000);
  }

  getLocationAndTimes() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.ngZone.run(() => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const address = this.geoService.getCityName(lat, lng);
            console.log(address);
            
          
            const tzOffset = -new Date().getTimezoneOffset() / 60;

            const date = new Date();
            const times = this.prayerService.getTimes(date, lat, lng, tzOffset);

            this.prayerTimes = {
              sahri: this.formatTime(times.sahri),
              fajr: this.formatTime(times.fajr),
              tulu: this.formatTime(times.tulu),
              dhuhr: this.formatTime(times.dhuhr),
              asr: this.formatTime(times.asr),
              gurub: this.formatTime(times.gurub),
              iftar: this.formatTime(times.iftar),
              maghrib: this.formatTime(times.maghrib),
              isha: this.formatTime(times.isha),
              midnight: this.formatTime(times.midnight)
            };

            console.log('📿 Prayer Times Calculated:', this.prayerTimes);
          });
        },
        (error) => console.error('❌ Error getting location:', error)
      );
    } else {
      console.error('⚠️ Geolocation not supported by this browser.');
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  updateTime() {
    this.currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  updateDates() {
    const now = new Date();
    this.dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    this.day = now.getDate().toString();
    this.month = now.toLocaleDateString('en-US', { month: 'long' });
    this.year = now.getFullYear().toString();
  }

  updateIslamicDate() {
    const now = new Date();
    const islamicDate = new Intl.DateTimeFormat('en-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    }).formatToParts(now);

    for (const part of islamicDate) {
      switch (part.type) {
        case 'weekday':
          this.islamicDay = part.value;
          break;
        case 'day':
          this.islamicDateNumber = part.value;
          break;
        case 'month':
          this.islamicMonthName = part.value;
          break;
        case 'year':
          this.islamicYear = part.value;
          break;
      }
    }
  }
}
