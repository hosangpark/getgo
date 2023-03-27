/**
 * @format
 */
import React, { createRef, useRef, useState } from 'react';
import { AppRegistry, Text, TextInput, PermissionsAndroid} from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import i18next from './language/i18n';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
Text.defaultProps.includeFontPadding = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;


// Register background handler // app closed & background 일때
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  if (Platform.OS === 'ios') {
    PushNotificationIOS.getApplicationIconBadgeNumber(function (number) {
      PushNotificationIOS.setApplicationIconBadgeNumber(number + 1);
    });
  }
});

// async function DDDD() {
//   PermissionsAndroid.request(
//     PermissionsAndroid.PERMISSIONS.CAMERA,
//     {
//       title: "App Camera Permission",
//       message: "App needs",
//       buttonPositive: 'OK',
//       buttonNegative: 'Cancel',
//     },
//   )
// }

async function registerAppWithFCM() {
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages();
  }
}
async function requestUserPermission() {
  const settings = await messaging().requestPermission();

  if (settings) {
    console.log('Permission settings:', settings);
  }
}

registerAppWithFCM();
requestUserPermission();


AppRegistry.registerComponent(appName, () => App);
