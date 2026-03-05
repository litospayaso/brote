import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.brote.app',
  appName: 'Brote',
  webDir: 'gh-pages',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "DARK",
      backgroundColor: "#a285bbb",
    },
  },
};

export default config;
