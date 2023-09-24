import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'g.sonde',
  appName: 'g-sonde',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
