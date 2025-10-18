import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PrayerTimeService } from './prayer-time';

@Component({
  selector: 'app-prayer-time-board',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './prayer-time-board.html',
  styleUrls: ['./prayer-time-board.scss']
})
export class PrayerTimeBoard implements OnInit {
  // Current time
  currentTime: string = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  currentSalah: any = null;
  jamaatTime: string = '5:45';

  // Gregorian date parts
  dayOfWeek: string = '';
  day: string = '';
  month: string = '';
  year: string = '';

  // Islamic date parts
  islamicDay: string = '';
  islamicDateNumber: string = '';
  islamicMonthName: string = '';
  islamicYear: string = '';

  // Prayer times
  prayerTimes = [
    { name: 'Fajar', startTime: '04:30 AM', endTime: '06:00 AM', azan: '04:45 AM', jamaat: '05:00 AM' },
    { name: 'Zuhr', startTime: '12:00 PM', endTime: '03:30 PM', azan: '12:15 PM', jamaat: '12:30 PM' },
    { name: 'Asr', startTime: '03:30 PM', endTime: '06:30 PM', azan: '03:45 PM', jamaat: '04:00 PM' },
    { name: 'Maghrib', startTime: '06:30 PM', endTime: '07:30 PM', azan: '06:35 PM', jamaat: '06:45 PM' },
    { name: 'Isha', startTime: '07:30 PM', endTime: '10:00 PM', azan: '07:45 PM', jamaat: '08:00 PM' }
  ];

  // Tulu / Zawal / Gurub
  tuluTime = '6:10';
  zawalTime = '12:06';
  gurubTime = '6:02';

  timings: any;
  prayerKeys: string[] = [];

  constructor(private prayerService: PrayerTimeService) { }
  ngOnInit(): void {



    this.updateTime();
    this.updateDates();
    this.updateIslamicDate();
    this.updateCurrentSalah();

    setInterval(() => {
      this.updateTime();
      this.updateCurrentSalah();
    }, 60000);
  }

  // Update current time
  updateTime() {
    const now = new Date();
    this.currentTime = new Date().toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true
});
  }

  // Update Gregorian date
  updateDates() {
    const now = new Date();
    this.dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    this.day = now.getDate().toString();
    this.month = now.toLocaleDateString('en-US', { month: 'long' });
    this.year = now.getFullYear().toString();
  }

  // Update Islamic date (simple example using Intl)
  updateIslamicDate() {
    const now = new Date();
    const islamicDate = new Intl.DateTimeFormat('en-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    }).formatToParts(now);

    // Extract parts
    for (const part of islamicDate) {
      switch (part.type) {
        case 'weekday': this.islamicDay = part.value; break;
        case 'day': this.islamicDateNumber = part.value; break;
        case 'month': this.islamicMonthName = part.value; break;
        case 'year': this.islamicYear = part.value; break;
      }
    }
  }

  // Update current Salah based on current time
  updateCurrentSalah() {
    const current = this.timeToMinutes(this.currentTime);
    this.currentSalah = this.prayerTimes.find(prayer => {
      const start = this.timeToMinutes(prayer.startTime);
      const end = this.timeToMinutes(prayer.endTime);
      return current >= start && current <= end;
    });
  }

  // Converts 'HH:MM AM/PM' string to minutes for comparison
  timeToMinutes(time: string): number {
    let [t, meridiem] = time.split(' '); // ['04:30', 'AM']
    let [h, m] = t.split(':').map(Number);
    if (meridiem === 'PM' && h < 12) h += 12;
    if (meridiem === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  }





}
