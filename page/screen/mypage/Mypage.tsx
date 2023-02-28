/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useEffect, useState} from 'react';
import {
    Alert,
  SafeAreaView, ScrollView, Text, View,StyleSheet, FlatList, Image,BackHandler
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { useNavigation,useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { MypageHeader } from '../../../components/header/MypageHeader'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import client from '../../../api/client';
import cusToast from '../../../components/navigation/CusToast';





const Mypage = () => {

 
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const isFocused = useIsFocused();
  const [exitApp, setExitApp] = React.useState(false);
  /** redux 상태관리 */
  const userInfo = useSelector((state:any) => state.userInfo);
  const myLocation = useSelector((state:any) => state.myLocation);
  const [isLoading ,  setIsLoading] = React.useState<boolean>(true);
  const [ProfileData,setProfileData] = useState<any>()

  const {t} = useTranslation()

  const ProfileModify = () => {
    navigation.navigate('ProfileModify');
  }
  const SaledList = (target:number) => {
    navigation.navigate('SaledList',target)
  }
  const PurchaseList = () => {
    navigation.navigate('PurchaseList')
  }
  const InterestsList = () => {
    navigation.navigate('InterestsList')
  }
  const DistrictCertified = () => {
    navigation.navigate('SetMyLocation')
  }
  const Question = () => {
    navigation.navigate('Question');
  }
  const Inquiry_1_1 = () => {
    navigation.navigate('Inquiry_1_1');
  }


  const getProfileData = async() =>{
    await client({
      method: 'get',
      url: `/user/mypage?mt_idx=${userInfo.idx}`,
      }).then(
        res=>{
          setProfileData(res.data)
          setIsLoading(false)
        }
      ).catch(
        err=>console.log(err)
      )
    };

  const backAction = () => {
    var timeout;
    let tmp = 0;
    if (tmp == 0) {
      if ((exitApp == undefined || !exitApp) && isFocused) {
        cusToast(t('한번 더 누르시면 종료됩니다'));
        setExitApp(true);
        timeout = setTimeout(() => {
          setExitApp(false);
        }, 2000);
      } else {
        // appTimeSave();
        clearTimeout(timeout);
        BackHandler.exitApp(); // 앱 종료
      }
      return true;
    }
  };
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    if (!isFocused) {
      backHandler.remove();
    }
  }, [isFocused, exitApp]);
  
    React.useEffect(()=>{
      setIsLoading(true)
      getProfileData()
    },[])
    React.useEffect(()=>{
      if(ProfileData == undefined){
        setIsLoading(true)
      } else {
        setIsLoading(false)
      }
    },[])
    React.useEffect(() => {
      setIsLoading(true)
      navigation.addListener('focus',()=>{
        getProfileData();
      })
    }, []);

    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <MypageHeader title={t('마이페이지')}/>
            <ScrollView>
            {/* 프로필 */}
              <View style={{borderBottomWidth:1,borderBottomColor:colors.GRAY_COLOR_3}}>
                <View style={{flexDirection:'row',padding:20,}}>
                  <TouchableOpacity
                  onPress={ProfileModify}>
                    {ProfileData == undefined?
                      <Image style={{width:85,height:85,marginRight:30,borderRadius:50}} source={
                        require('../../../assets/img/img_profile.png')}/>
                        :
                      <Image style={{width:85,height:85,marginRight:30,borderRadius:50}} source={
                        ProfileData.data[0].mt_image1? {uri:'http://ec2-13-125-251-68.ap-northeast-2.compute.amazonaws.com:4000/uploads/'+ProfileData.data[0].mt_image1}:
                        require('../../../assets/img/img_profile.png')}/>
                    }
                  </TouchableOpacity>
                  <View style={{width:250}}>
                    {ProfileData == undefined?
                    <Text style={[style.text_b,{fontSize:18,color:colors.BLACK_COLOR_2}]}>
                      {t('이름을지정해주세요')}
                    </Text>
                    :
                    <Text style={[style.text_b,{fontSize:18,color:colors.BLACK_COLOR_2}]}>
                      {ProfileData.data[0].mt_nickname? ProfileData.data[0].mt_nickname:t('이름을지정해주세요')}
                    </Text>
                    }
                    <View style={{flexDirection:'row',marginBottom:7,marginTop:3}}>
                      {ProfileData == undefined?
                        <Text style={[style.text_li,{fontSize:13,color:colors.GRAY_COLOR_2,marginRight:5}]}>
                        {t('주소 미등록')}
                        </Text>
                        :
                        <Text style={[style.text_li,{fontSize:13,color:colors.GRAY_COLOR_2,marginRight:5}]}>
                        {ProfileData.data[0].mt_area? ProfileData.data[0].mt_area : t('주소 미등록')}
                        </Text>
                      }
                      {ProfileData == undefined?
                      <Text style={[style.text_li,{fontSize:13,color:colors.GRAY_COLOR_2}]}>
                        ({'id없음'})
                      </Text>
                      :
                      <Text style={[style.text_li,{fontSize:13,color:colors.GRAY_COLOR_2}]}>
                        ({ProfileData.data[0].mt_id? ProfileData.data[0].mt_id:'id없음'})
                      </Text>
                      }
                    </View>
                    <View style={{flexDirection:'row'}}>
                      <TouchableOpacity style={{borderWidth:1,borderColor:colors.GRAY_COLOR_3,borderRadius:15}}
                      onPress={ProfileModify}
                      >
                        <Text style={[style.text_me,{fontSize:13,color:colors.GRAY_COLOR_2,marginHorizontal:15,marginVertical:6}]}>
                        {t('프로필 수정')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

              {/* 판매 및 거래 횟수 */}
                <View style={{backgroundColor:colors.GRAY_COLOR_1,marginHorizontal:20,marginBottom:20,borderRadius:6,flexDirection:'row',height:84}}>
                  <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={()=>SaledList(0)}>
                      <Text style={[style.text_li,{fontSize:15,color:colors.GRAY_COLOR_2}]}>
                      {t('판매')}
                      </Text>
                      {ProfileData !== undefined ?
                      <Text style={[style.text_b,{fontSize:17,color:colors.BLACK_COLOR_1}]}>
                      {ProfileData.pt_count? ProfileData.pt_count:0}
                      </Text>
                      :
                      <Text style={[style.text_b,{fontSize:17,color:colors.BLACK_COLOR_1}]}>
                      0
                      </Text>
                      }
                    </TouchableOpacity>
                  </View>
                  <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                  <TouchableOpacity style={{justifyContent:'center',alignItems:'center'}} onPress={()=>SaledList(1)}>
                    <Text style={[style.text_li,{fontSize:15,color:colors.GRAY_COLOR_2}]}>
                    {t('거래완료')}
                    </Text>
                    {ProfileData !== undefined ?
                    <Text style={[style.text_b,{fontSize:17,color:colors.BLACK_COLOR_1}]}>
                    {ProfileData.pt_end_count? ProfileData.pt_end_count:0}
                    </Text>
                    :
                    <Text style={[style.text_b,{fontSize:17,color:colors.BLACK_COLOR_1}]}>
                    {0}
                    </Text>
                    }
                  </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* 나의 거래 */}
              <View style={{borderTopWidth:7,borderColor:colors.GRAY_COLOR_1,paddingHorizontal:20,paddingVertical:30
              ,borderBottomWidth:3,borderBottomColor:colors.GRAY_COLOR_1}}>
                <View style={{flexDirection:'row',paddingBottom:20}}>
                  <Image style={{width:22, height:22, marginRight:10}} 
                  source={require('../../../assets/img/ico_mylist.png')} />
                  <Text style={[style.text_b,{fontSize:17,color:colors.BLACK_COLOR_2}]}>
                    {t('나의 거래')}
                  </Text>
                </View>
                <View style={{}}>
                  <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:12}}
                  onPress={()=>SaledList(1)}
                  >
                    <Text style={[style.text_me,{fontSize:15,color:colors.BLACK_COLOR_2}]}>
                    {t('판매내역')}
                    </Text>
                    <Image 
                    style={{width:7,height:11}}
                    source={require('../../../assets/img/arrow4_r.png')}/> 
                  </TouchableOpacity>
                  <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:12}}
                  onPress={PurchaseList}
                  >
                    <Text style={[style.text_me,{fontSize:15,color:colors.BLACK_COLOR_2}]}>
                    {t('구매내역')}
                    </Text>
                    <Image 
                    style={{width:7,height:11}}
                    source={require('../../../assets/img/arrow4_r.png')}/> 
                  </TouchableOpacity>
                  <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:12}}
                    onPress={InterestsList}
                  >
                    <Text style={[style.text_me,{fontSize:15,color:colors.BLACK_COLOR_2}]}>
                    {t('관심목록')}
                    </Text>
                    <Image 
                    style={{width:7,height:11}}
                    source={require('../../../assets/img/arrow4_r.png')}/> 
                  </TouchableOpacity>
                </View>
              </View>

              {/* 동네인증 */}
              <TouchableOpacity style={{paddingHorizontal:20,paddingVertical:20
              ,borderBottomWidth:3,borderBottomColor:colors.GRAY_COLOR_1}}
              onPress={DistrictCertified}
              >
                <View style={{flexDirection:'row', justifyContent:'space-between',alignItems:'center'}}>
                  <View style={{flexDirection:'row'}}>
                    <Image style={{width:22, height:22, marginRight:10}} 
                    source={require('../../../assets/img/ico_town_set.png')} />
                    <Text style={[style.text_b,{fontSize:17,color:colors.BLACK_COLOR_2}]}>
                    {t('동네 인증')}
                    </Text>
                  </View>
                  <Image 
                  style={{width:7,height:11}}
                  source={require('../../../assets/img/arrow4_r.png')}/> 
                </View>
              </TouchableOpacity>

              {/* Q & A */}
              <View style={{paddingHorizontal:20,paddingVertical:30
              ,borderBottomWidth:3,borderBottomColor:colors.GRAY_COLOR_1}}>
                <View style={{flexDirection:'row',paddingBottom:20}}>
                  <Image style={{width:22, height:22, marginRight:10}} 
                  source={require('../../../assets/img/ico_qna.png')} />
                  <Text style={[style.text_b,{fontSize:17,color:colors.BLACK_COLOR_2}]}>
                  {t('Q&A')}
                  </Text>
                </View>
                <View style={{}}>
                  <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:12}}
                  onPress={Question}
                  >
                    <Text style={[style.text_me,{fontSize:15,color:colors.BLACK_COLOR_2}]}>
                    {t('자주 묻는 질문')}
                    </Text>
                    <Image 
                    style={{width:7,height:11}}
                    source={require('../../../assets/img/arrow4_r.png')}/> 
                  </TouchableOpacity>
                  <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:12}}
                  onPress={Inquiry_1_1}                  
                  >
                    <Text style={[style.text_me,{fontSize:15,color:colors.BLACK_COLOR_2}]}>
                    {t('1:1 문의하기')}
                    </Text>
                    <Image 
                    style={{width:7,height:11}}
                    source={require('../../../assets/img/arrow4_r.png')}/> 
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
        </SafeAreaView>
    );
};


export default Mypage;
