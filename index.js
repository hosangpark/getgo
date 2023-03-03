/**
 * @format
 */
import React, { createRef,useRef,useState } from 'react';
import {AppRegistry , Text, TextInput,} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import i18next from './language/i18n';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
Text.defaultProps.includeFontPadding = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;




const notificationDisplay = (remoteMessage) => {
  console.log('notificationDisplay');
  console.log('body: ' + remoteMessage.notification.body);
  console.log('title: ' + remoteMessage.notification.title);
  if (Platform.OS === 'android') {
    PushNotification.localNotification({
      channelId: "getgo",
      title: remoteMessage.notification.title,
      message: remoteMessage.notification.body,
      data:{
        content_idx : remoteMessage.data.content_idx ? remoteMessage.data.content_idx : '',
        content_idx2 : remoteMessage.data.content_idx2 ? remoteMessage.data.content_idx2 : '',
      },
      autoCancel: true,
    });
  }
};

messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log("Background:",remoteMessage)
    notificationDisplay(remoteMessage)
});



AppRegistry.registerComponent(appName, () => App);
