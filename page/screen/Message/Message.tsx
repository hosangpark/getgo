/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState,useEffect,useCallback, Children} from 'react';
import {
    Alert,
  SafeAreaView, ScrollView, Text, View,StyleSheet, FlatList, Image, BackHandler,ActivityIndicator, VirtualizedList,Platform
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { useNavigation } from '@react-navigation/native';
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



const Message = () => {
  const {t} = useTranslation()
  const ws  = io(`http://ec2-13-125-251-68.ap-northeast-2.compute.amazonaws.com:3333`, { query  : { device : Platform.OS }});
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  const [items, setitem] = useState<ChatItemType[]>([])
  const [chatQuitVisible, setchatQuitVisible] = React.useState(false); // 채팅방 나가기 모달
  const [target,setTarget] = useState({})
  const [listmodal, setListmodal] = useState({})
  const [isLoading ,  setIsLoading] = React.useState<boolean>(true);

  const userInfo = useSelector((state:any) => state.userInfo);

  const cancel = () => {
    setchatQuitVisible(false);
    setListmodal(false)
  }

    /** 방나가기 */
  const quitroom = async() => {
    await client({
      method: 'get',
      url: `/product/chat-list-delete?chr_idx=${target}`
      }).then(res=>{
        setIsLoading(false)
        setchatQuitVisible(false)
        cusToast(t(res.data.message))
        getChatListData()
      }).catch(err=>{
        console.log(err)
      })
      setIsLoading(false)
  }

  /**알림 차단 수신 */
  const noticeOnOff = async(e:{chr_id:number,ctt_push:string},noticeState:boolean)=>{
    let YorN = noticeState? "Y":"N"
    console.log(YorN)
    await client({
      method: 'get',
      url: `/product/chat-list-push?chr_idx=${e.chr_id}&ctt_push=${YorN}`
      }).then(res=>{
        cusToast(t(res.data.message))
        getChatListData()
      }).catch(err=>{
        console.log(err)
      })
      setIsLoading(false)
  }

  const Enter = (items:any) => {
    navigation.navigate('MessageRoom', {items,type:'messageChat'});
  }

  const Delete = async(e:number) => {
    setchatQuitVisible(true)
    setTarget(e)
  }

  const Toggle = (e:number)=>{
    setListmodal(e)
    if(e == listmodal){
      setListmodal(false)
    }
  }


  const getChatListData = async () => {
    await client({
      method: 'get',
      url: `/product/chat-list?mt_idx=${userInfo.idx}`
      }).then(res=>{
        setitem(res.data.reverse())
        setIsLoading(false)
      }).catch(err=>{
        console.log('getChatListData')
        setIsLoading(false)
      })
      setIsLoading(false)
  };

  React.useEffect(()=>{
    getChatListData()
  },[])

  React.useEffect(() => {
    ws.on('connect', () => {
      ws.emit('joinList', {mt_idx:userInfo.idx});
      console.log('Connected Server List');
    });

    ws.on('ListUpdate', e => {
      getChatListData()
    });
    
    
    return()=>{
      ws.disconnect()
      console.log('disconnect Server List');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async() => {
      getChatListData();
    });
    return unsubscribe;
  }, [navigation]);

    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <MessageHeader title={t('채팅')}/>  
          {isLoading ? 
            <LoadingIndicator/>
            :
              <FlatList
                data = {items}
                renderItem = {({item})=>{
                  return(
                    <ChatList key={item.chr_id} item={item} Enter={Enter} Delete={Delete} Toggle={Toggle} 
                    listmodal={listmodal} noticeOnOff={noticeOnOff}/>
                  )
                }}
                contentContainerStyle = {{paddingHorizontal:20,flexDirection:'column-reverse'}}
                ListHeaderComponent={
                  <View style={{marginBottom:120}}></View>
                }
                showsVerticalScrollIndicator = {false}
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



            