import { Routes } from '@angular/router';
import { PrayerTimeBoard } from './prayer-time-board/prayer-time-board';
import { PrivacyPolicy } from './privacy-policy/privacy-policy';

export const routes: Routes = [
    { path: '', component: PrayerTimeBoard },
    { path: 'privacy-policy', component: PrivacyPolicy },
    { path: '**', redirectTo: '' }
];

