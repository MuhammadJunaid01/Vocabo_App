/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Config from 'react-native-config';
import App from './App';
import { name as appName } from './app.json';

GoogleSignin.configure({
  webClientId: Config.GOOGLE_WEB_CLIENT_ID,
});

AppRegistry.registerComponent(appName, () => App);
