/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect, useCallback, Children } from 'react';
import {
  Alert,
  SafeAreaView, ScrollView, Text, View, StyleSheet, FlatList, Image, BackHandler, ActivityIndicator, VirtualizedList, Platform
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { MessageHeader } from '../../../components/header/MessageHeader'
import { ChatItemType } from '../../../components/types/componentType'
import { ReviewList } from '../../../components/layout/ReviewList';
import { QuitChatRoomModal } from '../../../components/modal/QuitChatRoomModal';
import { useTranslation } from 'react-i18next';
import LoadingIndicator from '../../../components/layout/Loading';
import client from '../../../api/client';
import { ChatList } from '../../../components/layout/ChatList';
import cusToast from '../../../components/navigation/CusToast';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import Api, { NodataView } from '../../../api/Api';
import messaging from '@react-native-firebase/messaging';


const Message = () => {
  const { t } = useTranslation()
  const ws = io(Api.state.socketUrl, { query: { device: Platform.OS } });
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const isFocused = useIsFocused();
  const [exitApp, setExitApp] = React.useState(false);
  const [items, setitem] = useState<ChatItemType[]>([])
  const [chatQuitVisible, setchatQuitVisible] = React.useState(false); // 채팅방 나가기 모달
  const [target, setTarget] = useState({})
  const [listmodal, setListmodal] = useState({})
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const userInfo = useSelector((state: any) => state.userInfo);

  const cancel = () => {
    setchatQuitVisible(false);
    setListmodal(false)
  }

  /** 방나가기 */
  const quitroom = async () => {
    await client({
      method: 'get',
      url: `/product/chat-list-delete?chr_idx=${target}`
    }).then(res => {
      setIsLoading(false)
      setchatQuitVisible(false)
      cusToast(t(res.data.message))
      getChatListData()
    }).catch(err => {
      console.log(err)
    })
    setIsLoading(false)
  }

  /**알림 차단 수신 */
  const noticeOnOff = async (e: { chr_id: number, ctt_push: string }) => {
    let YorN = e.ctt_push == "Y" ? "N" : "Y"
    await client({
      method: 'get',
      url: `/product/chat-list-push?chr_idx=${e.chr_id}&ctt_push=${YorN}`
    }).then(res => {
      cusToast(t(res.data.message))
      getChatListData()
    }).catch(err => {
      console.log(err)
    })
    setIsLoading(false)
  }

  const Enter = (items: any) => {
    navigation.navigate('MessageRoom', { items, type: 'messageChat' });
  }

  const Delete = async (e: number) => {
    setchatQuitVisible(true)
    setTarget(e)
  }

  const Toggle = (e: number) => {
    setListmodal(e)
    if (e == listmodal) {
      setListmodal(false)
    }
  }


  const getChatListData = async () => {
    await client({
      method: 'get',
      url: `/product/chat-list?mt_idx=${userInfo.idx}`
    }).then(res => {
      setitem(res.data.reverse())
      setIsLoading(false)
    }).catch(err => {
      console.log('getChatListData')
      setIsLoading(false)
    })
    setIsLoading(false)
  };

  const backAction = () => {
    var timeout;
    let tmp = 0;
    if (tmp == 0) {
      if ((exitApp == undefined || !exitApp) && isFocused) {
        navigation.goBack();
        // cusToast(t('한번 더 누르시면 종료됩니다'));
        // setExitApp(true);
        // timeout = setTimeout(() => {
        //   setExitApp(false);
        // }, 2000);
      } else {
        // appTimeSave();
        clearTimeout(timeout);
        BackHandler.exitApp(); // 앱 종료
      }
      return true;
    }
  };

  // React.useEffect(() => {
  //   getChatListData()
  // }, [])

  useFocusEffect(React.useCallback(() => {


    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('방 목록 리프레시', remoteMessage)
      getChatListData();
    });

    return unsubscribe;

  }, []))

  React.useEffect(() => {
    // ws.on('connect', () => {
    //   ws.emit('joinList', { mt_idx: userInfo.idx });
    //   console.log('Connected Server List');
    // });

    // ws.on('ListUpdate', e => {
    //   getChatListData()
    // });

    // return () => {
    //   ws.disconnect()
    //   console.log('disconnect Server List');
    // }




  }, []);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    if (!isFocused) {
      backHandler.remove();
    }
  }, [isFocused, exitApp]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      getChatListData();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <MessageHeader title={t('채팅')} />
      {isLoading ?
        <LoadingIndicator />
        :
        <FlatList
          data={items}
          renderItem={({ item }) => {
            return (
              <ChatList key={item.chr_id} item={item} Enter={Enter} Delete={Delete} Toggle={Toggle}
                listmodal={listmodal} noticeOnOff={noticeOnOff} />
            )
          }}
          contentContainerStyle={{ paddingHorizontal: 20, flexDirection: 'column-reverse' }}
          ListHeaderComponent={
            <View style={{ marginBottom: 120 }}></View>
          }
          ListEmptyComponent={<NodataView></NodataView>}
          showsVerticalScrollIndicator={false}
        />
      }
      <QuitChatRoomModal
        isVisible={chatQuitVisible}
        setVisible={setchatQuitVisible}
        action={quitroom}
        action2={cancel}
      />
    </SafeAreaView>
  );
};


export default Message;



