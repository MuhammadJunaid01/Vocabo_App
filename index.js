/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import App from './App';

GoogleSignin.configure({
  webClientId: '623836619468-4rjp4ssk6nsn77msstom12u0c40ne3gv.apps.googleusercontent.com',
});

import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
