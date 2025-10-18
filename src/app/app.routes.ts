import { Routes } from '@angular/router';
import { PrayerTimeBoard } from './prayer-time-board/prayer-time-board';

export const routes: Routes = [
    { path: '', component: PrayerTimeBoard },
    { path: '**', redirectTo: '' }
];

