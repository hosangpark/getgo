import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, StatusBar } from 'react-native';
// import { Toast } from 'native-base';
import Toast from 'react-native-toast-message';
import { getStatusBarHeight } from 'react-native-status-bar-height';


const cusToast = (message:string, duration?:any, position?:any, offset?:number) => {
  // Toast.show({ text: message, textStyle: styles.toastTxt, style: styles.toastWr, }); // native-base

  const str = `{
    "message" :"`+message+`"
  }`;
  Toast.show({
    type: 'custom_type', //success | error | info
    position: position?position:(Platform.OS === 'ios'?'bottom':'bottom'),
    text1: JSON.parse(str),
    // text2: '내용',
    visibilityTime: duration?duration:2000,
    autoHide: true,
    topOffset: (Platform.OS === 'ios'? 66 + getStatusBarHeight() : 10),
    bottomOffset: offset ? offset + 10 : Platform.OS === "ios" ? 25 : 10,
    onShow: () => {},
    onHide: () => {},
    onPress:() => {}
  });

}

export default cusToast;