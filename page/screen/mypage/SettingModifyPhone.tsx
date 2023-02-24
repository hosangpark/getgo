/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState} from 'react';
import {View, ViewStyle,Text, ScrollView, SafeAreaView, Button, Image , StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp,StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHeader } from '../../../components/header/BackHeader';
import { TabView, SceneMap,TabBar } from "react-native-tab-view";
import SaledList_OnSale from './SaledList_OnSale';
import SaledList_Complete from './SaledList_Complete';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CustomButton } from '../../../components/layout/CustomButton';
import { ProductItemType } from '../../../components/types/componentType';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import { OptionType } from '../../../components/types/componentType';
import { SelectBox } from '../../../components/layout/SelectBox';
import client from '../../../api/client';
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */




const SettingModifyPhone = () => {
  const {t} = useTranslation()  
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  const [phoneOptions] = React.useState([
      {label : '+82', value : '82', sel_id:1},
      {label : '+62', value : '62', sel_id:2},
  ])
  const [selectPhone, setSelPhone] = React.useState<OptionType>({
      label : '+82', value : '82' , sel_id:1
  })

  const [inputLoginInfo, setInputLoginInfo] = React.useState({
      areaCode : '',
      mt_hp : '',
  })
  const [authBtnTitle, setAuthBtnTitle] = React.useState(t('인증요청'));
  const [authCode, setAuthCode] = React.useState('123456');
  const [inputAuth, setInputAuth] = React.useState('');
  const inputControl = (type:string,text:string,areaCode:string) => {
      setInputLoginInfo({...inputLoginInfo, [type]:text,areaCode:selectPhone.value});
  }
  const [isInputEnd, setIsInputEnd] = React.useState(false);

  const phoneSelect = (item:OptionType) => {
      setSelPhone({...item});
  }

  const sendCode = () => {
    console.log(inputLoginInfo)

        /** 중복체크 & 핸드폰 인증 정보 저장 */
        const getAuthPhoceCode = async () => {
            await client<{data:string,auth_number:string}>({
              method: 'post',
              url: '/user/auth-send-hp',
              data:{
                  mt_na:inputLoginInfo.areaCode,
                  mt_hp:inputLoginInfo.mt_hp,
              }
              }).then(res=>{
                console.log(res.data)
                setAuthCode(res.data.auth_number);
              }).catch(error=>{
                console.log(error)
              })
          }
          getAuthPhoceCode();
  }


  React.useEffect(()=>{
      if(inputAuth == authCode){
          setIsInputEnd(true);
      }
      else{
          setIsInputEnd(false);
      }
  },[inputAuth])

    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <BackHeader title={t('휴대폰번호 변경하기')}/>
          <View style={{paddingHorizontal:20}}>
                <View style={{marginTop:40}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={[style.text_b,{fontSize:15,color:colors.BLACK_COLOR_2}]}>
                        {t('휴대폰번호')}
                        </Text>
                        <Text style={[style.text_me,{fontSize:15,color:colors.GREEN_COLOR_3}]}> *</Text>
                    </View>
                </View>
                <View style={{marginTop:10,flexDirection:'row'}}>
                    <View style={{flex:4}}>
                        <SelectBox 
                            selOption={selectPhone}
                            options={phoneOptions}
                            action={phoneSelect}
                            height={45}
                            paddingVertical={10}
                            overScrollEnable={()=>{}}
                        />
                    </View>
                    <View style={{flex:7,marginLeft:10}}>
                    <TextInput 
                        style={style.input_container} 
                        value={inputLoginInfo.mt_hp} 
                        onChangeText={text=>{inputControl('mt_hp',text)}}
                        placeholder={t('번호를 입력해주세요.')}
                        keyboardType='number-pad'
                    />
                    </View>
                </View>

                <View style={{marginTop:8}}>
                    <CustomButton title={authBtnTitle} buttonType='green' action={sendCode} disable={inputLoginInfo.mt_hp == ''}/>
                </View>

                <View style={{marginTop:10}}>
                    <TextInput 
                        style={style.input_container} 
                        value={inputAuth} 
                        onChangeText={text=>{setInputAuth(text)}}
                        placeholder={t('인증번호 입력')}
                        keyboardType='number-pad'
                    />
                </View>
          </View>
            <BackHandlerCom />
        </SafeAreaView>
    );
};

export default SettingModifyPhone;
