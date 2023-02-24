/**
 * @format
 */

import {AppRegistry , Text, TextInput} from 'react-native';
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

PushNotification.createChannel(
    {
      channelId: "getgo", // (required)
      channelName: "GetGo", // (required)
    //   channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
    //   soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
    //   importance: 4, // (optional) default: 4. Int value of the Android notification importance
    //   vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );

  const notificationDisplay = (remoteMessage) => {
    console.log('notificationDisplay');
    console.log('body: ' + remoteMessage.data.body);
    console.log('title: ' + remoteMessage.data.title);
    if (Platform.OS === 'android') {
      PushNotification.localNotification({
        channelId: "getgo",
        message: remoteMessage.data.body,
        title: remoteMessage.data.title,
        data:{
          content_idx : remoteMessage.data.content_idx ? remoteMessage.data.content_idx : '',
          content_idx2 : remoteMessage.data.content_idx2 ? remoteMessage.data.content_idx2 : '',
          intent : remoteMessage.data.intent,
        },
        autoCancel: true,
      });
    }
  };

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log(remoteMessage)
//     notificationDisplay(remoteMessage)
// });

AppRegistry.registerComponent(appName, () => App);
