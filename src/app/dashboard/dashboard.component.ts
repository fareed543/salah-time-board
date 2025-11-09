import { KeyValue } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { WaqtService } from '../waqt.service';
import { Geolocation } from '@capacitor/geolocation';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  originalOrder = (a: KeyValue<string, string>, b: KeyValue<string, string>): number => 0;
  
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

  loading = false;
  errorMessage: string | null = null;

  constructor(
    private waqtService: WaqtService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.getLocationAndTimes();
    this.updateDates();
    this.updateIslamicDate();
    this.updateTime();

    setInterval(() => this.updateTime(), 1000);
  }

  async getLocationAndTimes() {
    this.loading = true;
    try {
      let lat: number, lng: number;

      if (Capacitor.getPlatform() === 'web') {
        // Browser fallback
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.ngZone.run(() => {
              lat = position.coords.latitude;
              lng = position.coords.longitude;
              this.computePrayerTimes(lat, lng);
            });
          },
          (error) => {
            this.ngZone.run(() => {
              this.loading = false;
              this.handleLocationError(error);
            });
          }
        );
      } else {
        // Capacitor plugin for APK (Android/iOS)
        const permission = await Geolocation.requestPermissions();

        if (permission.location === 'granted') {
          const position = await Geolocation.getCurrentPosition();
          lat = position.coords.latitude;
          lng = position.coords.longitude;
          this.computePrayerTimes(lat, lng);
        } else {
          this.errorMessage = 'Location permission denied. Please allow location access.';
          this.loading = false;
        }
      }
    } catch (err) {
      console.error(err);
      this.errorMessage = 'An error occurred while fetching location.';
      this.loading = false;
    }
  }

  // Separate function to handle browser geolocation errors
  handleLocationError(error: any) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.errorMessage = 'Location permission denied. Please allow location access.';
        break;
      case error.POSITION_UNAVAILABLE:
        this.errorMessage = 'Location unavailable. Please try again.';
        break;
      case error.TIMEOUT:
        this.errorMessage = 'Location request timed out. Please try again.';
        break;
      default:
        this.errorMessage = 'An unknown error occurred while fetching location.';
    }
  }

  // Separate function for computing prayer times
  computePrayerTimes(lat: number, lng: number) {
    const tzOffset = -new Date().getTimezoneOffset() / 60;
    const date = new Date();
    const times = this.waqtService.getTimes(date, lat, lng, tzOffset);

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

    this.loading = false;
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
