/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useRef } from 'react';
import {
  Alert,
  SafeAreaView, ScrollView, Text, View, StyleSheet, FlatList, Image, Button,
  Platform
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHandlerCom } from '../../../components/BackHandlerCom';

import { onImagePick } from '../../../components/utils/imgPicker';
import { useTranslation } from 'react-i18next';
import { foramtDate, NumberComma } from '../../../components/utils/funcKt';
import client from '../../../api/client';
import { useSelector } from 'react-redux';
import { MessageRoomHeader } from '../../../components/header/MessageRoomHeader';
import LoadingIndicator from '../../../components/layout/Loading';
import io from 'socket.io-client';
import Api from '../../../api/Api';

type MessageType = {
  type: string;
  value: string;
  date: string;
}
type ChatType = {
  item: MessageType[];
  index: number;
}



type Props = StackScreenProps<MainNavigatorParams, 'MessageRoom'>
const MessageRoom = ({ route }: Props) => {
  const ws = io(Api.state.socketUrl, { query: { device: Platform.OS } });
  const userInfo = useSelector((state: any) => state.userInfo)
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [items, setitem] = useState<any>()

  const {t} = useTranslation()
    const [inputChat, setInputChat] = React.useState('');
    const [selectImg, setSelectImg] = React.useState({
      uri : '',
      type : '',
      name : '',
    })

  const [tempChatList, setTempChatList] = React.useState([
    { ctt_content_type: 0, ctt_send_idx: 0, ctt_msg: '네! 그걸로 살게요', ctt_sdate: '15:00', ctt_file1: '', mt_image1: '' },
    { type: 'date', value: '2022년 11월 23일' },
  ])



  const ChatRender = ({ item, index }: any) => {
    if (item.type == 'date') {
      return (
        <View key={index} style={{ flex: 1, alignItems: 'center', paddingBottom: 20 }}>
          <Text>{item.value}</Text>
        </View>
      )
    }
    else if (item.ctt_content_type === 1) {
      return (
        <>
          {item.ctt_send_idx == userInfo.idx ?
            <View style={{ alignItems: 'flex-end', marginBottom: 20 }}>
              <View style={{ backgroundColor: colors.GREEN_COLOR_2, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 150, borderTopRightRadius: 0, maxWidth: '50%' }}>
                <Text style={[style.text_re, { fontSize: 16, color: colors.WHITE_COLOR }]}>{item.ctt_msg}</Text>
              </View>
              <Text style={[style.text_re, { marginTop: 5, fontSize: 12, color: colors.GRAY_COLOR_2 }]}>{t('오후')} {item.ctt_sdate}</Text>
            </View>
            :
            <View style={{ alignItems: 'flex-start', marginBottom: 20, flex: 1 }}>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <Image source={
                    item.mt_image1 == null ? require('../../../assets/img/img_profile.png') : { uri: Api.state.imageUrl + item.mt_image1 }}
                    style={{ width: 42, height: 42 }} borderRadius={100} />
                </View>
                <View style={{ marginLeft: 20, marginTop: 5, flex: 9 }}>
                  <View style={{ backgroundColor: colors.WHITE_COLOR, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 150, borderTopLeftRadius: 0, maxWidth: '50%' }}>
                    <Text style={[style.text_re, { fontSize: 16, color: colors.GREEN_COLOR_2 }]}>{item.ctt_msg}</Text>
                  </View>
                  <Text style={[style.text_re, { marginTop: 5, fontSize: 12, color: colors.GRAY_COLOR_2 }]}>{t('오후')} {item.ctt_sdate}</Text>
                </View>
              </View>
            </View>
          }
        </>
      )
    }
    else {
      return (
        <>
          {item.ctt_send_idx == userInfo.idx ?
            <View style={{ alignItems: 'flex-end', marginBottom: 20 }}>
              {/* <View style={{backgroundColor:colors.GREEN_COLOR_2,paddingVertical:10,paddingHorizontal:20,borderRadius:150,borderTopRightRadius:0,maxWidth:'50%'}}> */}
              {item.ctt_file1 ? <Image source={{ uri: Api.state.imageUrl + item.ctt_file1 }} style={{ width: 135, height: 135, borderRadius: 6 }} /> : null}
              {/* </View> */}
              <Text style={[style.text_re, { marginTop: 5, fontSize: 12, color: colors.GRAY_COLOR_2 }]}>{t('오후')} {item.ctt_sdate}</Text>
            </View>
            :
            <View style={{ alignItems: 'flex-start', marginBottom: 20, flex: 1, }}>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <Image source={
                    item.mt_image1 == null ? require('../../../assets/img/img_profile.png') : { uri: Api.state.imageUrl + item.mt_image1 }}
                    style={{ width: 42, height: 42 }} borderRadius={100} />
                </View>
                <View style={{ marginLeft: 20, marginTop: 5, flex: 8 }}>
                  {item.ctt_file1 ? <View style={{ maxWidth: '50%' }}>
                    <Image source={{ uri: Api.state.imageUrl + item.ctt_file1 }} style={{ width: 42, height: 42 }} borderRadius={6} />
                  </View> : null}
                  <Text style={[style.text_re, { marginTop: 5, fontSize: 12, color: colors.GRAY_COLOR_2 }]}>{t('오후')} {item.ctt_sdate}</Text>
                </View>
              </View>
            </View>
          }
        </>
      )
    }
  }


  const ChatTypeCheck = async (type: string) => {
    const form = new FormData();
    form.append('crt_idx', route.params.items.chr_id);
    form.append(`ctt_room_id`, route.params.items.ctt_id);
    form.append(`ctt_send_idx`, userInfo.idx);
    if (type == 'messageChat') {
      form.append(`ctt_content_type`, 1);
      form.append(`ctt_msg`, inputChat);
    } else if (type == 'imageChat') {
      form.append(`ctt_content_type`, 4);
      form.append("ctt_file1", {
        name: selectImg.name,
        type: selectImg.type,
        uri: Platform.OS === 'ios' ? selectImg.uri.replace('file://', '') : selectImg.uri,
      });
    }
    await client({
      method: 'post',
      url: `/product/chat-send`,
      headers: { "Content-Type": "multipart/form-data" },
      data: form
    }).then(res => {
      console.log(res.data)
    }).catch(err => {
      console.log('err:', err)
    })
    console.log(form)
    ws.emit('SendListUpdate', { mt_idx: items.mt_idx });
    ws.emit('SendMessage', { room_idx: route.params.items.chr_id, msg: inputChat ? inputChat : null });

  }
  const sendChat = async (type: string) => {
    const nowDate = new Date();
    const nowHour = nowDate.getHours();
    const nowMin = nowDate.getMinutes();


    if (selectImg.uri == '' && inputChat == '') {
      return false;
    }
    else if (selectImg.uri == '' && inputChat != '') {
      console.log('1')
      ChatTypeCheck(type = "messageChat")
    }
    else {
      console.log('2')
      ChatTypeCheck(type = "imageChat")
    }
    setInputChat('');
    setSelectImg({
      uri: '',
      name: '',
      type: '',
    })

  }
  const getRoomData = async (roomidx: number) => {
    await client({
      method: 'get',
      url: `/product/chat-room?room_idx=${roomidx}&mt_idx=${userInfo.idx}`,
      // url: `/product/chat-room?room_idx=1&mt_idx=31`,
    }).then(res => {
      console.log('res.data===', res.data);
      setitem(res.data)
      setIsLoading(false)
    }).catch(err => {
      console.log('getRoomData')
      setIsLoading(false)
    })
  };
  const getChatData = async (roomidx: number) => {
    await client({
      method: 'get',
      url: `/product/chating-list?room_idx=${roomidx}&mt_idx=${userInfo.idx}`,
      //url: `/product/chating-list?room_idx=1&mt_idx=${userInfo.idx}`,
    }).then(res => {
      setTempChatList(res.data.reverse())
      setIsLoading(false)
    }).catch(err => {
      console.log('getChatData')
      setIsLoading(false)
    })
  };
  const setComplete = async (roomidx: number) => {
    await client({
      method: 'get',
      url: `/product/chatting_status?room_idx=${roomidx}&pt_sale_now=3`,
      //url: `/product/chating-list?room_idx=1&mt_idx=${userInfo.idx}`,
    }).then(res => {
      getRoomData(roomidx);
      setIsLoading(false)
    }).catch(err => {
      console.log('setComplete')
      setIsLoading(false)
    })
  }

  React.useEffect(() => {
    if (selectImg.uri != '') {
      setInputChat('');
    }
  }, [selectImg.uri])

  const SendReview = () => {
    // navigation.navigate('SendReview',route.params)
  }


    React.useEffect(()=>{
      if(selectImg.uri != ''){
        setInputChat('');
      }
    },[selectImg.uri])    



  React.useEffect(() => {
    setIsLoading(true)
    if(route.params.type == 'messageChat'){
      getRoomData(route.params.items.chr_id);
      getChatData(route.params.items.chr_id);
    } else if (route.params.type == 'reserveChat') {
      getRoomData(route.params.items.room_id);
      getChatData(route.params.items.room_id)
    } else {
      console.log('other room')
    }
  }, []);



  // const sendMessage = () => {
  //   let message = {
  //     type: 'Chat',
  //     user: user,
  //     message: messageText,
  //     room: route.params.room,
  //   };
  //   webSocket.current.emit('message', message);
  //   setMessageText('');
  // };

  React.useEffect(() => {
    ws.on('connect', () => {
      console.log('room connect')
      ws.emit('join', { room_idx: route.params.items.chr_id });
    });

    ws.on('revMessage', e => {
      getChatData(route.params.items.chr_id)
      console.log('revMessage', e);
    });

    return () => {
      ws.disconnect();
      console.log('room disconnect')
    };
  }, []);

  
    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          {items == undefined?
          null
          :
          <MessageRoomHeader item={items == undefined? null : {
            username:items.mt_nickname,
            room_idx:items.room_idx,
            ctt_push:route.params.items.ctt_push,
            rt_idx:items.rt_idx,
            tradeImg:items.data[0] ==undefined? null:items.data[0].pt_image1,
            producttitle:items.data[0] ==undefined? null:items.data[0].pt_title,
            price:items.data[0] ==undefined? null : NumberComma(items.data[0].pt_selling_price),
            salestate:items.data[0] ==undefined? null:items.data[0].pt_sale_now,
            mt_seller_idx:items.data[0] ==undefined? null:items.data[0].mt_seller_idx,
          }}
          />
          }
          {isLoading? 
          <LoadingIndicator/>
          :
          <>
          <View style={{flex:1,backgroundColor:colors.BLUE_COLOR_2}}>
            <FlatList
              data={tempChatList}
              renderItem={ChatRender}
              inverted={true}
              contentContainerStyle={{ justifyContent: 'center', paddingBottom: 70, paddingHorizontal: 20 }}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0.1}
            />
            {selectImg.uri != '' &&
              <View style={{ position: 'absolute', width: 150, height: 150, left: 20, bottom: 10, borderRadius: 6, backgroundColor: '#fff' }}>
                <View style={{ position: 'absolute', left: 10, top: 10, width: 25, height: 25, borderRadius: 5, zIndex: 10 }}>
                  <TouchableOpacity onPress={() => { setSelectImg({ uri: '', name: '', type: '' }) }} style={{ backgroundColor: colors.GRAY_COLOR_4, borderRadius: 5, width: 25, height: 25, zIndex: 3, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../../assets/img/ico_x_w.png')} style={{ width: 13, height: 13 }} />
                  </TouchableOpacity>
                </View>
                <Image source={{ uri: selectImg.uri }} style={{ width: '100%', height: '100%', borderWidth: 3, borderColor: colors.GREEN_COLOR_2, borderRadius: 6 }} />
              </View>
            }
          </View>
          <View style={{ borderColor: colors.GRAY_LINE, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={() => { onImagePick(setSelectImg) }} style={{ backgroundColor: selectImg.uri != '' ? colors.GRAY_LINE : colors.WHITE_COLOR, width: 38, height: 38, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../../../assets/img/ico_pic.png')} style={{ width: 18, height: 14 }} />
              </TouchableOpacity>
              <TextInput
                style={{ marginLeft: 5, flex: 1 }}
                placeholder={selectImg.uri == '' ? t('채팅을 입력하세요.') : t('이미지 전송')}
                value={inputChat}
                onChangeText={(text) => { setInputChat(text) }}
                editable={selectImg.uri == ''}
              />
              <TouchableOpacity onPress={() => { sendChat(route.params.type) }}>
                <Image source={require('../../../assets/img/ico_send.png')} style={{ width: 38, height: 38 }} />
              </TouchableOpacity>
            </View>

          </View>
        </>
      }
      <BackHandlerCom />
    </SafeAreaView>
  );
};


export default MessageRoom;
