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
import { useNavigation } from '@react-navigation/native';
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

  const getFcmToken = useCallback(async () => {
    const fcmToken = await messaging().getToken();
    console.log(fcmToken)
    Api.state.mb_fcm = fcmToken;

  }, []);

  React.useEffect(() => {
    getFcmToken()
  }, [])

  React.useEffect(() => {

  }, []);



  // const notificationDisplay = (remoteMessage) => {
  //   console.log('notificationDisplay Close');
  //   console.log('body: ' + remoteMessage.notification.body);
  //   console.log('title: ' + remoteMessage.notification.title);
  //   console.log('data: ', remoteMessage.data);
  //   const navigation = useNavigation();
  //   // if (Platform.OS === 'android') {
  //   //   PushNotification.localNotification({
  //   //     channelId: "getgo",
  //   //     title: remoteMessage.notification.title,
  //   //     message: remoteMessage.notification.body,
  //   //     data: remoteMessage.data,
  //   //     autoCancel: true,
  //   //   });
  //   // }

  //   if (remoteMessage.data?.type == 'chat-rev' || remoteMessage.data?.type == 'chat_add') {
  //     Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body ?? '', [
  //       {
  //         text: '닫기',
  //         onPress: () => false,
  //         style: 'cancel',
  //       },
  //       {
  //         text: '이동',
  //         onPress: () => {
  //           if (remoteMessage.data?.type == 'chat-rev') {
  //             navigation.navigate('MessageRoom', { room_id: remoteMessage.data.room_id, type: 'messageChat' });
  //           } else if (remoteMessage.data?.type == 'chat_add') {
  //             navigation.navigate('Itempost', { pt_idx: remoteMessage.data.pt_idx });
  //           }
  //         },
  //       },
  //     ]);
  //   }
  // };




  const notificationDisplay = (remoteMessage: any, isSave = false) => {
    console.log('notificationDisplay');
    console.log('body: ' + remoteMessage.notification.body);
    console.log('title: ' + remoteMessage.notification.title);
    console.log('data: ', remoteMessage.data)
    // if (Platform.OS === 'android') {
    //   PushNotification.localNotification({
    //     channelId: "getgo",
    //     title: remoteMessage.notification.title,
    //     message: remoteMessage.notification.body,

    //     autoCancel: true,
    //   });
    // }

    if (Platform.OS == 'ios') {
      // PushNotificationIOS.addNotificationRequest({
      //   id: new Date().toString(),
      //   title: remoteMessage.notification.title,
      //   // subtitle: remoteMessage.data.message ? remoteMessage.data.message : '',
      //   body: remoteMessage.notification.body ? remoteMessage.notification.body : '',
      //   userInfo: remoteMessage.data
      //   // sound: remoteMessage.data.sound,
      //   // sound: 'buzy1.wav',
      // });
    } else {
      // PushNotification.localNotification({
      //   channelId: remoteMessage.data.android_channel_id ? remoteMessage.data.android_channel_id : new Date().toString(),
      //   id: remoteMessage.notificationId,
      //   title: remoteMessage.notification.title,
      //   message: remoteMessage.notification.body,
      //   userInfo: remoteMessage.data,
      //   // soundName: remoteMessage.data.sound,
      //   playSound: true,
      //   // smallIcon: 'ic_stat_ic_notification',
      //   color: '#FFFFFF',
      //   largeIcon: '',
      //   largeIconUrl: '',
      //   vibrate: true,
      //   groupSummary: true,
      //   //userInfo: onRemote.data,
      //   // badge: 0,
      // });


    }

    if (remoteMessage.data?.type == 'chat-rev' || remoteMessage.data?.type == 'chat_add') {
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body ?? '', [
        {
          text: '닫기',
          onPress: () => false,
          style: 'cancel',
        },
        {
          text: '이동',
          onPress: () => {
            if (remoteMessage.data?.type == 'chat-rev') {
              navigation.navigate('MessageRoom', { items: { room_id: remoteMessage.data.room_idx }, type: 'messageChat' });
            } else if (remoteMessage.data?.type == 'chat_add') {
              navigation.navigate('Itempost', { pt_idx: remoteMessage.data.pt_idx });
            }
          },
        },
      ]);
    }


  };

  //앱이 꺼져있다가 실행됬을떄 intent 처리
  const links = async () => {

    const initialUrl = await Linking.getInitialURL();
    console.log('initialUrl', initialUrl);

    let pt_idx = Api.urlGetCode(initialUrl);

    if (initialUrl && pt_idx) {
      console.log('앱이 꺼져있다가 실행됬을떄 intent 처리', initialUrl);

      // navigation.replace('post', {family_code: fitCode});
      navigation.navigate('Itempost', { pt_idx: pt_idx });

      return true;
    } else {
      return false;
    }
  };

  React.useEffect(() => {
    links()

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      notificationDisplay(remoteMessage)
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage))
    });


    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        console.log('app closed!!', remoteMessage);

        if (remoteMessage) {
          console.log(
            'app closed 일때 받은 메시지가 있는 경우:',
            remoteMessage,
          );
          // setInitialRoute(remoteMessage.data.type);
          notificationDisplay(remoteMessage, true)
          // await saveScreen(remoteMessage.data);
          //setLoading(false);
        }
      });



    // //응용 프로그램이 실행 중이지만 백그라운드에있는 경우
    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log('app background!!', remoteMessage);
      notificationDisplay(remoteMessage, true)
    });

    //app closed 일때 받은 메시지가 있는 경우 , 응용 프로그램이 종료 상태에서 열린 경우 -> 안드만?
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log("Background:", remoteMessage)
      notificationDisplay(remoteMessage, true);
    });

    return unsubscribe;
  }, [])



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
