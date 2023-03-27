/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState} from 'react';
import {
    Alert,
  SafeAreaView, ScrollView, Text, View,StyleSheet, FlatList, Image,Button
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { BackHeader } from '../../../components/header/BackHeader'
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import { validateEmail } from '../../../components/utils/funcKt';
import client from '../../../api/client';
import { useDispatch, useSelector } from 'react-redux';
import * as UserInfoAction from '../../../redux/actions/UserInfoAction';
import { CustomButton } from '../../../components/layout/CustomButton';
import cusToast from '../../../components/navigation/CusToast';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */




const SettingModifyEmail = () => {
  const {t} = useTranslation()  
  const [inputEmail ,setInputEmail] = React.useState('');
  const [isAuthEmail ,setIsAuthEmail] = React.useState(false);
  const [emailcheck,setEmailcheck] = React.useState(false)
  const [change,setChange] = React.useState(false)
  const userInfo = useSelector((state:any) => state.userInfo);
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const dispatch = useDispatch()

  const EmailAuthSend = ()=>{
    if(inputEmail !== ''){
        setIsAuthEmail(true)
        validateEmail(inputEmail) ?
        [setEmailcheck(true),getEmailApi()]
        :
        setEmailcheck(false)
    }
}
/** 인증메일 보내기 */
const getEmailApi = async () => {
    await client({
      method: 'post',
      url: '/user/auth-email',
      data:{
        mt_idx:userInfo.idx,
        mt_email:inputEmail,
        }
      }).then((res)=>{
        cusToast(t(res.data.message))
      }).catch(error=>{
        console.log(error);
      })
  }

  /** 인증메일 확인 */
const getEmailCheckApi = async () => {
  await client({
    method: 'get',
    url: '/user/email-check',
    params:{
      mt_idx:userInfo.idx,
      mt_email:inputEmail,
      }
    }).then((res)=>{
      cusToast(t(res.data.message))
      setChange(true)

    }).catch(error=>{
      console.log(error);
    })
}

const ChangeCheck = ()=>{
  if(!change){
    cusToast('Error')
  } else {
    let params={
      ...userInfo,
      mt_email:inputEmail,
    }
    dispatch(UserInfoAction.updateUserInfo(JSON.stringify(params)));
    navigation.goBack()
  }
  setChange(!change)
}
  React.useEffect(() => {
    console.log(userInfo)
    // navigation.addListener('focus',()=>{
    //   getEmailCheckApi();
    // })
  }, []);
  // React.useEffect(() => {
  //   console.log(change)
  //   if(emailcheck){
  //     getEmailCheckApi()
  //   }
  // }, [emailcheck]);

    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <BackHeader title={t('이메일등록')}/>
            <ScrollView style={{paddingHorizontal:20}}>
              <Text style={[style.text_b,{fontSize:15,color:colors.BLACK_COLOR_1,paddingTop:30,}]}>
              {t('이메일주소')}
              </Text>
              <Text style={[style.text_re,{fontSize:13,color:colors.GRAY_COLOR_2,marginBottom:30,marginTop:8}]}>
              {t('계정 찾기시 사용될 이메일 주소 인증이 필요합니다.')}
              </Text>

              <View style={{flexDirection:'row'}}>
                <TextInput placeholder={t('이메일을 입력해주세요.')} style={{borderWidth:1,borderColor:colors.GRAY_COLOR_3,height:44,paddingLeft:10,marginRight:10,flex:3}}
                value={inputEmail}
                onChangeText={(e)=>{setInputEmail(e.replace(/ /g,""))}}
                keyboardType={'email-address'}
                />
                <View style={{flex:1,}}>
                  <CustomButton 
                      disable={inputEmail == ''}
                      title={t('인증요청')}
                      buttonType={'green'}
                      action={EmailAuthSend}
                  />
                </View>
              </View>
              {isAuthEmail &&
                <View>
                    {emailcheck?
                    <View>
                      {change?
                        <Text style={[style.text_re,{marginTop:5,fontSize:13,color:colors.BLUE_COLOR_1}]}>
                        {t('인증이 완료되었습니다.')}</Text>
                        :
                        <Text style={[style.text_re,{marginTop:5,fontSize:13,color:colors.BLUE_COLOR_1}]}>
                        {t('보낸 메일을 확인해주세요!')}</Text>
                      }
                    </View>
                        :
                        <Text style={[style.text_re,{marginTop:5,fontSize:13,color:colors.RED_COLOR_1}]}>
                            {t('이메일을 형식을 확인해주세요!')}</Text>
                    }
                </View>
              }
            </ScrollView>
            <TouchableOpacity 
                onPress = {ChangeCheck}
                style={[{backgroundColor:change?colors.GREEN_COLOR_2:colors.GRAY_COLOR_2,alignItems:'center',justifyContent:'center', height:60}]}>
                <Text style={[style.text_sb,{color:change?colors.WHITE_COLOR:colors.WHITE_COLOR, fontSize:18}]}> 
                {t('변경하기')}
                </Text>
            </TouchableOpacity>
            <BackHandlerCom />
        </SafeAreaView>
    );
};

export default SettingModifyEmail;
