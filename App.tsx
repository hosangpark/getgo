/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { createRef, useRef, useState, useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Router from './Router';

import { onPushNavigate } from './components/navigation/onPushNavigate'; //push...
import PushNotification from 'react-native-push-notification'; //push...noti
import PushNotificationIOS from '@react-native-community/push-notification-ios';//push...noti

import Toast from 'react-native-toast-message'; //toast...
import { toastConfig } from './components/navigation/toastConfig'; //toast...custom
import messaging from '@react-native-firebase/messaging';
import { Provider } from 'react-redux' //redux...provider
import initStore from './redux/store';//redux...init
import { requestTrackingPermission } from 'react-native-tracking-transparency';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
import SplashScreen from 'react-native-splash-screen';
import logsStorage from './components/utils/logStorage';

import axios from 'axios';
import Api from './api/Api';
import client from './api/client';






const App = () => {
  const store = initStore();
  const navigationRef = createRef();

  const getFcmToken = useCallback(async () => {
    const fcmToken = await messaging().getToken();
    console.log(fcmToken)
    Api.state.mb_fcm = fcmToken;

  }, []);

  React.useEffect(() => {
    getFcmToken()
  }, [])

  const getDefaultData = async () => {
    //카테고리 정보 가져옴
    await client({
      method: 'get',
      url: '/product/category-list',
    }).then(
      res => {
        Api.state.baseCode.category = res.data
      }
    ).catch(
      err => console.log(err)
    )
  };


  const tracking = async () => {
    const trackingStatus = await requestTrackingPermission();
    if (trackingStatus === 'authorized' || trackingStatus === 'unavailable') {
      // enable tracking features
    }
  }

  React.useEffect(() => {
    setTimeout(() => {
      tracking();
    }, 1000);
  }, [])

  React.useEffect(() => {
    //setTimeout을 이용하면 몇초간 스플래시 스크린을 보여주고 싶은지 설정할 수 있다.

    getDefaultData();

    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, [])

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
      <Toast config={toastConfig} />
    </Provider>
  );
};
export default App;
