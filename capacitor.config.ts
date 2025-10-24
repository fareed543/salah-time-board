import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.salahtime',
  appName: 'salah-time-board',
  webDir: 'dist/salah-time-board/browser', // <-- include /browser
};

export default config;