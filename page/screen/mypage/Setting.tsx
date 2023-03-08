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
  SafeAreaView, Image, Text, View, Switch ,StyleSheet ,ScrollView
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHeader } from '../../../components/header/BackHeader'
import Modal from "react-native-modal";
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { LangugaeChange } from '../../../components/modal/LangugaeChange';
import * as UserInfoAction from '../../../redux/actions/UserInfoAction';
import { SelectLangType } from '../../../components/types/userType';
import { changeLanguage } from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../../../api/client';
import cusToast from '../../../components/navigation/CusToast';




/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */


interface MypageSettingType {
  mt_idx:null | string,
  mt_pushing1:string,
  mt_type:number,
  mt_email:string,
  mt_email_yn:string,
  mt_hp:number
}

const MypageSetting = () => {

  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  /** redux 상태관리 */
  const userInfo = useSelector((state:any) => state.userInfo);
  const myLocation = useSelector((state:any) => state.myLocation);
  const dispatch = useDispatch()
  const [isLoading ,  setIsLoading] = React.useState<boolean>(true);
  const [rt_type ,  setRt_type] = React.useState('');
  const [profileData,setProfileData] = useState<MypageSettingType>([])

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () =>{ 
    if(profileData.mt_pushing1 == "Y"){
      ChangeNotice("N")
    } else {
      ChangeNotice("Y")
    }
    
  }

  const ModifyEmail = () => {
    navigation.navigate('SettingModifyEmail');
  }
  const ModifyPhone = () => {
    navigation.navigate('SettingModifyPhone',{PhoneNumber:profileData.mt_hp})
  }

  const Announce = () => {
    navigation.navigate('SettingAnnounce');
  }
  const Terms = () => {
    navigation.navigate('SettingTerms');
  }
  const Policy = () => {
    navigation.navigate('SettingPolicy');
  }
  const Logout = () => {
    Alert.alert(
      t('로그아웃'),
      '',
      [
        {text: t('로그아웃'), onPress: async() => {
          await client({
            method: 'get',
            url: `/user/logout?mt_idx=${userInfo.idx}`,
            }).then(
              res=>{
                cusToast(t(res.data.message))
                AsyncStorage.removeItem('userIdx')
                dispatch(UserInfoAction.logOut());
                navigation.reset({routes:[{name:'SelectLogin'}]});
              }
            ).catch(
              err=>console.log(err)
            )

        }, style:'cancel'},
        {
          text: t('취소'),
          onPress: () => {
            console.log('d')
          },
          style: 'destructive',
        },
      ]
    )
  }
  const Withdrawal = () => {
    navigation.navigate('SettingWithdrawal');
  }
  
  React.useEffect(()=>{
    if(profileData){
      if(profileData.mt_email == ''){
        Alert.alert(
          t('이메일을 등록해주세요')
        )
      }
    }
  },[])
  


  const {t, i18n} = useTranslation() // 언어변경
  
  const [modalvisual, setModalVisual] = React.useState(false); // 모달 창 상태
  const [lange, setlange] = useState('') // 언어선택
  
  const selectLag = (e:string) =>{
    setlange(e)
  }
  const Change = () => {
    i18n.changeLanguage(lange)
    setModalVisual(false);
  }
  const Cancel = () => {
    setModalVisual(false);
  }
  const getProfileDetailData = async() =>{
    await client({
      method: 'get',
      url: `/user/myconfig?mt_idx=${userInfo.idx}`,
      }).then(
        res=>{
          setProfileData(res.data.data[0])
          setIsLoading(false)
        }
      ).catch(
        err=>console.log(err)
      )
    };
  const ChangeNotice = async(target:string) =>{
    await client({
      method: 'get',
      url: `user/pushconfig?mt_idx=${userInfo.idx}&mt_pushing1=${target}`,
      }).then(
        res=>{
          cusToast(t(res.data.message))
          getProfileDetailData()
        }
      ).catch(
        err=>console.log(err)
      )
    };
    React.useEffect(()=>{
      console.log(profileData.mt_pushing1)
      setIsLoading(true)
      getProfileDetailData()
    },[])

    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <BackHeader title={t('설정')}/>
          <View style={[{padding:20,borderBottomWidth:1,borderColor:colors.GRAY_COLOR_3,flexDirection:'row',justifyContent:'space-between',alignItems:'center',}]}>
            <Text style={[style.text_b,{fontSize:17,color:colors.BLACK_COLOR_2}]}>
            {t('전체 알림')}
            </Text>
            <Switch 
            trackColor={{ false: "#767577", true: "#DBE1E5" }}
            thumbColor={profileData.mt_pushing1 == undefined? colors.WHITE_COLOR : profileData.mt_pushing1 == "Y"?  colors.GREEN_COLOR_3 : colors.WHITE_COLOR}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={profileData.mt_pushing1 == undefined? false : profileData.mt_pushing1 == "Y"? true:false}
            />
          </View>
          <ScrollView>
            <View style={[{paddingHorizontal:20,paddingVertical:30,
              borderBottomWidth:1,borderColor:colors.GRAY_COLOR_3,
              borderTopWidth:8, borderTopColor:colors.GRAY_COLOR_1 ,
              }]}>
              <Text style={[style.text_b,{fontSize:17,color:colors.BLACK_COLOR_2,marginBottom:20}]}>
              {t('내 정보 수정')}
              </Text>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10}}>
                <Text style={[style.text_me,{color:colors.BLACK_COLOR_2,fontSize:15}]}>
                {t('가입구분')}
                </Text>
                {profileData.mt_type == null || "1"?
                  <Text style={[style.text_me,{color:colors.BLACK_COLOR_2,fontSize:15}]}>
                  {t('일반')}
                  </Text>
                  :
                  <Text style={[style.text_me,{color:colors.BLACK_COLOR_2,fontSize:15}]}>
                  {t('관리자')}
                  </Text>
                }

              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10,alignItems:'center'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Text style={[style.text_me,{color:colors.BLACK_COLOR_2,fontSize:15,marginRight:8}]}>
                  {t('이메일')}
                  </Text>
                  <TouchableOpacity style={{borderWidth:1,borderColor:colors.GRAY_COLOR_3,paddingHorizontal:15,paddingVertical:6,borderRadius:150}}
                  onPress={ModifyEmail}
                  >
                  <Text style={[style.text_re,{fontSize:12}]}>
                  {t('관리')}
                  </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[style.text_me,{color:colors.BLACK_COLOR_2,fontSize:15}]}>
                {profileData.mt_email? profileData.mt_email : t('이메일을 등록해주세요.')}
                </Text>
              </View>
              <View style={{backgroundColor:'black'}}>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginVertical:10,alignItems:'center'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Text style={[style.text_me,{color:colors.BLACK_COLOR_2,fontSize:15,marginRight:8}]}>
                  {t('휴대폰번호')}
                  </Text>
                  <TouchableOpacity style={{borderWidth:1,borderColor:colors.GRAY_COLOR_3,paddingHorizontal:15,paddingVertical:6,borderRadius:150}}
                  onPress={ModifyPhone}
                  >
                  <Text style={[style.text_re,{fontSize:12}]}>
                  {t('관리')}
                  </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[style.text_me,{color:colors.BLACK_COLOR_2,fontSize:15}]}>
                  {profileData.mt_hp? profileData.mt_hp : t('휴대폰을 등록해주세요.')}
                </Text>
              </View>
            </View>

            {/* 공지사항 */}
            <TouchableOpacity style={[{paddingHorizontal:20,
              borderBottomWidth:1,borderColor:colors.GRAY_COLOR_3,
              borderTopWidth:8, borderTopColor:colors.GRAY_COLOR_1 ,
              flexDirection:'row', justifyContent:'space-between', alignItems:'center',paddingVertical:20}]}
              onPress={Announce}
              >
              <Text style={[style.text_me,{fontSize:15,color:colors.BLACK_COLOR_2}]}>
              {t('공지사항')}
              </Text>
              <Image 
              style={{width:7,height:12,marginRight:4}}
              source={require('../../../assets/img/arrow4_r.png')}/> 
            </TouchableOpacity>
            <TouchableOpacity style={[{paddingHorizontal:20,
              borderBottomWidth:1,borderColor:colors.GRAY_COLOR_3,
              flexDirection:'row', justifyContent:'space-between', alignItems:'center',paddingVertical:20}]}
              onPress={Terms}
              >
              <Text style={[style.text_me,{fontSize:15,color:colors.BLACK_COLOR_2}]}>
              {t('이용약관')}
              </Text>
              <Image 
              style={{width:7,height:12,marginRight:4}}
              source={require('../../../assets/img/arrow4_r.png')}/> 
            </TouchableOpacity>
            <TouchableOpacity style={[{paddingHorizontal:20,
              borderBottomWidth:1,borderColor:colors.GRAY_COLOR_3,
              flexDirection:'row', justifyContent:'space-between', alignItems:'center',paddingVertical:20}]}
              onPress={Policy}
              >
              <Text style={[style.text_me,{fontSize:15,color:colors.BLACK_COLOR_2}]}>
              {t('개인정보처리방침')}
              </Text>
              <Image 
              style={{width:7,height:12,marginRight:4}}
              source={require('../../../assets/img/arrow4_r.png')}/> 
            </TouchableOpacity>
            <TouchableOpacity style={[{paddingHorizontal:20,
              borderBottomWidth:1,borderColor:colors.GRAY_COLOR_3,
              flexDirection:'row', justifyContent:'space-between', alignItems:'center',paddingVertical:20}]}
              onPress={()=>setModalVisual(true)}
              >
              <Text style={[style.text_me,{fontSize:15,color:colors.BLACK_COLOR_2}]}>
              {t('언어변경')}
              </Text>
              <Image 
              style={{width:7,height:12,marginRight:4}}
              source={require('../../../assets/img/arrow4_r.png')}/> 
            </TouchableOpacity>
            <TouchableOpacity style={[{paddingHorizontal:20,
              borderBottomWidth:1,borderColor:colors.GRAY_COLOR_3,
              flexDirection:'row', justifyContent:'space-between', alignItems:'center',paddingVertical:20}]}
              onPress={Logout}
              >
              <Text style={[style.text_me,{fontSize:15,color:colors.BLACK_COLOR_2}]}>
              {t('로그아웃')}
              </Text>
              <Image 
              style={{width:7,height:12,marginRight:4}}
              source={require('../../../assets/img/arrow4_r.png')}/> 
            </TouchableOpacity>
            <TouchableOpacity style={[{paddingVertical:25, paddingHorizontal:20, flexDirection:'row', justifyContent:'flex-end'}]}
              onPress={Withdrawal}            
            >
              <Text style={[style.text_re,{fontSize:13,color:colors.BLACK_COLOR_2,textDecorationLine:'underline'}]}>
              {t('탈퇴하기')}
              </Text>
            </TouchableOpacity>

          </ScrollView>

        <LangugaeChange 
            isVisible={modalvisual}
            selectLag={(e)=>selectLag(e)}
            action={Change}
            action2={Cancel}
        />
          <BackHandlerCom />
        </SafeAreaView>
    );
};



export default MypageSetting;
