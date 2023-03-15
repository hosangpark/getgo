/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useCallback } from 'react';
import {
  Alert,
  Image,
  SafeAreaView, Text, View,
  Linking, Platform
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './screen/user/SelectLogin';
import Itemlist from './screen/home/Itemlist';
import HomeScreen from './screen/home/Itemlist';
import Category from './screen/category/Category';
import Message from './screen/Message/Message';
import NotificationIndex from './screen/notification/NotificationIndex';
import Mypage from './screen/mypage/Mypage'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';
import Api from '../api/Api';
import { useNavigation, createNavigationContainerRef, useRoute, useNavigationState } from '@react-navigation/native';
import { onPushNavigate } from './components/navigation/onPushNavigate'; //push...
import PushNotification from 'react-native-push-notification'; //push...noti
import PushNotificationIOS from '@react-native-community/push-notification-ios';//push...noti
import messaging from '@react-native-firebase/messaging';
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const Main = () => {

  const Tab = createBottomTabNavigator();
  const [tabIndex, setTabIndex] = React.useState(1);
  // const Isloginn = useSelector((state: RootState) => state.auth.isLogin);

  const navigation = useNavigation();
  // const navigationRoute = useRoute();
  const routes = useNavigationState(state => state.routes);
  const navigationRouteName = routes.length ? routes[routes.length - 1].name : '';
  const navigationRoute = routes[routes.length - 1];

  const getFcmToken = useCallback(async () => {
    const fcmToken = await messaging().getToken();
    console.log(fcmToken)
    Api.state.mb_fcm = fcmToken;
  }, []);

  React.useEffect(() => {
    getFcmToken()
  }, [])


  const callScreen = (remoteMessage, isDirectMove = false) => {
    console.log('callScreen', remoteMessage.data, isDirectMove)
    let message = remoteMessage.data.message || remoteMessage.data.body;
    let title = remoteMessage.data.title;

    // if (remoteMessage.data?.type == 'chat-rev' || remoteMessage.data?.type == 'chat_add') {

    if (isDirectMove) {
      if (remoteMessage.data?.type == 'chat-rev' || remoteMessage.data?.type == 'chat-send') {
        //채팅수락알림, 메시지도착알림
        navigation.navigate('MessageRoom', { items: { room_id: remoteMessage.data.room_idx }, type: 'messageChat' });
      } else if (remoteMessage.data?.type == 'chat_add' || remoteMessage.data?.type == 'product_edit' || remoteMessage.data?.type == 'product_add') {
        //채팅요청알림, 상품금액변경알림
        navigation.navigate('Itempost', { pt_idx: remoteMessage.data.pt_idx });
      } else if (remoteMessage.data?.type == 'review_add') {
        //후기수신
        navigation.navigate('Allreview');
      }
    } else {
      console.log('alert');
      Alert.alert(title, message, [
        {
          text: '닫기',
          onPress: () => false,
          style: 'cancel',
        },
        {
          text: '이동',
          onPress: () => {
            if (remoteMessage.data?.type == 'chat-rev' || remoteMessage.data?.type == 'chat-send') {
              navigation.navigate('MessageRoom', { items: { room_id: remoteMessage.data.room_idx }, type: 'messageChat' });
            } else if (remoteMessage.data?.type == 'chat_add') {
              navigation.navigate('Itempost', { pt_idx: remoteMessage.data.pt_idx });
            }
          },
        },
      ]);
    }
    // }
  }


  //앱이 꺼져있다가 실행됬을떄 intent 처리
  const links = async () => {

    Linking.addEventListener('url', e => {
      // const route = e.url.replace(/.*?\/\//g, '');
      // console.log('Linking route', route);
      const url = e.url;
      const params: any = Api.urlGetCode(url);
      const { code, type } = params;

      console.log('Linking', url, params, code);

      if (code && type == 'product') {

        navigation.navigate('Itempost', { pt_idx: code });

        return true;
      } else return false;
    })

    const initialUrl = await Linking.getInitialURL();
    // console.log('initialUrl', initialUrl);
    if (initialUrl) {
      const params: any = Api.urlGetCode(initialUrl);
      // let pt_idx = params.pt_idx ?? false;
      const { code, type } = params;

      console.log('initialUrl', initialUrl, params);

      if (code && type == 'product') {
        console.log('앱이 꺼져있다가 실행됬을떄 intent 처리', initialUrl);

        // navigation.replace('post', {family_code: fitCode});
        navigation.navigate('Itempost', { pt_idx: code });

        return true;
      } else return false;
    } else {
      return false;
    }
  };

  //아이폰은 포그라운드 일때 화면에 푸시를 직접 띄움
  const sendLocalNotificationWithSound = onRemote => {
    console.log('sendLocalNotificationWithSound', onRemote);

    if (Platform.OS == 'ios') {
      PushNotificationIOS.addNotificationRequest({
        id: onRemote.data.notificationId
          ? onRemote.data.notificationId
          : new Date().toString(),
        title: onRemote.title,
        subtitle: '',
        body: onRemote.body ? onRemote.body : onRemote.message,
        // sound: 'default',
        // sound: 'buzy1.wav',
      });
    } else {
      PushNotification.localNotification({
        channelId: onRemote.channelId ?? 'default',
        id: onRemote.data.notificationId,
        title: onRemote.title,
        message: onRemote.message,
        // soundName: 'default',
        playSound: true,
        // smallIcon: 'ic_stat_ic_notification',
        color: '#FFFFFF',
        largeIcon: '',
        largeIconUrl: '',
        priority: 'high',

        // bigPictureUrl?: string | undefined;
        // bigLargeIcon?: string | undefined;
        // bigLargeIconUrl?: string | undefined;

        vibrate: true,
        groupSummary: true,
        userInfo: onRemote.data,
        // badge: 0,
      });
    }
  };

  //IOS 권한 획득
  const requestUserPermission = async () => {
    console.log('requestUserPermission', '1');

    if (!messaging().isDeviceRegisteredForRemoteMessages) {
      console.log('requestUserPermission', '2');
      messaging().registerDeviceForRemoteMessages();
      console.log('requestUserPermission', '3');
    }

    let authStatus = await messaging().hasPermission();

    if (authStatus !== messaging.AuthorizationStatus.AUTHORIZED) {
      authStatus = messaging().requestPermission({
        alert: true,
        announcement: false,
        badge: true,
        carPlay: false,
        provisional: false,
        sound: true,
      });
    }

    console.log('requestUserPermission', '4');

    // if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    //   const token = await messaging().getToken();
    //   if (token) {
    //     console.log('token', token);
    //     // Here the "token" is defined, but push notifications never arrive using this fcm token...
    //   }
    // }
  }

  const firstFcmSetting = async () => {
    await requestUserPermission();
    fcmSetting();
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      //console.log("Background:", remoteMessage)
      // callScreen(remoteMessage);
    });
  }

  const fcmSetting = () => {


    // PushNotificationIOS.setApplicationIconBadgeNumber(0);
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },

      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: async function (notification) {
        console.log('NOTIFICATION 작동여부:', notification);
        if (typeof notification.id == 'undefined')
          notification.id = new Date().toString();
        if (notification.foreground) {


          // callScreen(notification);

          if (notification.userInteraction) {
            //클릭했을때 -> 팝업말고 바로 이동

            console.log('포그라운드에서 푸시 클릭했을때.');
            if (notification.id == '') notification.id = new Date().toString();
            callScreen(notification, true);
          } else if (notification.data.title) {

            //채팅방
            if (navigationRouteName == 'MessageRoom' &&
              (navigationRoute.params.items.chr_id == notification.data.room_idx ||
                navigationRoute.params.items.room_id == notification.data.room_idx)) {

            } else {
              //내부 노티를 써서 일부러 푸시를 띄움
              sendLocalNotificationWithSound(notification);
            }

            // process the notification


            console.log('포그라운푸시.', navigationRoute, navigationRouteName);
          }
        } else {
          //백그라운드일때는 터치에만 반응 -> ios앱 푸시 눌러서 앱 켯을때도 여기로 들어옴.
          console.log(
            '백그라운드 푸시',
            // notification,
            navigationRoute,
            // navigation.dangerouslyGetState().index,
            // navigation.dangerouslyGetState().index.routes,
          );
          if (notification.userInteraction) {
            callScreen(notification, true);
          }
        }

        // (required) Called when a remote is received or opened, or local notification is opened
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },

      // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);

        // process the action
      },

      // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      requestPermissions: true,
    });

    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   // sendLocalNotificationWithSound(remoteMessage)
    //   //callScreen(remoteMessage)
    //   // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage))
    // });


    // messaging()
    //   .getInitialNotification()
    //   .then(async remoteMessage => {
    //     console.log('app closed!!', remoteMessage);

    //     if (remoteMessage) {
    //       console.log(
    //         'app closed 일때 받은 메시지가 있는 경우:',
    //         remoteMessage,
    //       );
    //       // setInitialRoute(remoteMessage.data.type);
    //       //callScreen(remoteMessage)
    //       // await saveScreen(remoteMessage.data);
    //       //setLoading(false);
    //     }
    //   });



    // //응용 프로그램이 실행 중이지만 백그라운드에있는 경우
    // messaging().onNotificationOpenedApp(async remoteMessage => {
    //console.log('app background!!', remoteMessage);
    //callScreen(remoteMessage)
    // });

    //app closed 일때 받은 메시지가 있는 경우 , 응용 프로그램이 종료 상태에서 열린 경우 -> 안드만?



  }

  React.useEffect(() => {
    links()

    firstFcmSetting();

  }, [])

  React.useEffect(() => {

    fcmSetting();

  }, [navigationRouteName, navigationRoute])



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>
        <Tab.Navigator initialRouteName="Home" backBehavior={'history'}>
          <Tab.Screen
            name="Home"
            // component={Itemlist}
            children={() =>
              <Itemlist
                setTabIndex={setTabIndex}
              />
            }
            listeners={{
              tabPress: (e: any) => {
                setTabIndex(1);
              }
            }}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
              tabBarIcon: ({ focused }) => (
                <Image style={{ width: 50, height: 50 }} source={focused ? require('../assets/img/f_menu1_on.png') : require('../assets/img/f_menu1_off.png')} />

              ),
            }}
          />
          <Tab.Screen
            name="NotificationIndex"
            component={NotificationIndex}
            listeners={{
              tabPress: (e) => {
                setTabIndex(2);
              }
            }}
            options={{
              // title: '로그인구현중',
              headerShown: false,
              tabBarShowLabel: false,
              tabBarIcon: ({ focused, color, size }) => (
                <Image style={{ width: 50, height: 50 }} source={focused ? require('../assets/img/f_menu2_on.png') : require('../assets/img/f_menu2_off.png')} />
              ),
            }}
          />
          <Tab.Screen
            name="Category"
            children={() =>
              <Category
                setTabIndex={setTabIndex}
              />
            }
            listeners={{
              tabPress: (e) => {
                setTabIndex(3);
              }
            }}
            options={{
              // title: '로그인구현중',
              headerShown: false,
              tabBarShowLabel: false,
              tabBarIcon: ({ focused, color, size }) => (
                <Image style={{ width: 50, height: 50 }} source={focused ? require('../assets/img/f_menu3_on.png') : require('../assets/img/f_menu3_off.png')} />
              ),
            }}
          />
          <Tab.Screen
            name="Message"
            component={Message}
            listeners={{
              tabPress: (e) => {
                setTabIndex(4);
              }
            }}
            options={{
              // title: '검색',
              headerShown: false,
              tabBarShowLabel: false,
              tabBarIcon: ({ focused, color, size }) => (
                <Image style={{ width: 50, height: 50 }} source={focused ? require('../assets/img/f_menu4_on.png') : require('../assets/img/f_menu4_off.png')} />
              ),
            }}
          />
          <Tab.Screen
            name="Mypage"
            component={Mypage}
            listeners={{
              tabPress: (e) => {
                setTabIndex(5);
              }
            }}
            options={{
              headerShown: false,
              tabBarShowLabel: false,
              tabBarIcon: ({ focused, color, size }) => (
                <Image style={{ width: 50, height: 50 }} source={focused ? require('../assets/img/f_menu5_on.png') : require('../assets/img/f_menu5_off.png')} />

              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default Main;
