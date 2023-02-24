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
  SafeAreaView, ScrollView, Text, View, Image, TouchableOpacity, StyleSheet, FlatList ,Button, ActivityIndicator, BackHandler
} from 'react-native';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { BackHeader } from '../../../components/header/BackHeader';
import { useTranslation } from 'react-i18next';


import { SearchHeader } from '../../../components/header/SearchHeader';
import { TextInput } from 'react-native-gesture-handler';


const ReportChat = ({}) => {

    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    // value,setValue,searchPlace
    const {t} = useTranslation()

  const [ReportList, setReportList] = useState([
    {reportlist:t('전문판매업자') , report:false},
    {reportlist:t('비매너 사용자'), report:false},
    {reportlist:t('욕설을 해요'), report:false},
    {reportlist:t('성희롱을 해요'), report:false},
    {reportlist:t('거래,환불 분쟁 신고'), report:false},
    {reportlist:t('사기 당했어요'), report:false},
    {reportlist:t('다른 문제가 있어요'), report:false},
    {reportlist:t('연애 목적의 대화를 시도해요'), report:false},
    {reportlist:t('기타'), report:false},
  ])


  const ddd = (e:string)=>{
    const nextitem = ReportList.map(item =>
      item.reportlist === e ? {...item, report: !item.report} : item,
    );
    setReportList(nextitem);
  }

  const Complete = ()=>{
    navigation.goBack
  }

    return (
    <SafeAreaView style={[style.default_background , {flex:1}]}>
        <BackHeader title={t('사용자 신고')}/>     
            <ScrollView style={{paddingHorizontal:20}}>
              <Text style={[style.text_b, {color:colors.BLACK_COLOR_1,fontSize:22,marginTop:35, marginBottom:30, width:'60%',lineHeight:40}]}>
              {t('사용자를 신고하고자하는 이유를 선택하세요')}
              </Text>
              
              {ReportList.map((e,index)=>{
                return(
                <TouchableOpacity key={index} style={{flexDirection:'row',marginBottom:15}} onPress={()=>ddd(e.reportlist)}>
                  {!e.report?
                  <Image style={{width:22,height:22,}} source={require('../../../assets/img/check_off.png')}/> :
                  <Image style={{width:22,height:22}} source={require('../../../assets/img/check_on.png')}/>
                  }
                  <Text style={[style.text_me,{fontSize:15,marginLeft:10,color:colors.BLACK_COLOR_1}]}>{t(e.reportlist)}</Text>
                </TouchableOpacity>
                )
              })}

              <TextInput placeholder={t('입력하세요')} style={{minHeight:95,borderRadius:5,borderWidth:1,borderColor:colors.GRAY_COLOR_3,padding:15,textAlignVertical:'top'}} multiline={true}
              onSubmitEditing={Complete}
              />
              <Text style={[style.text_re,{fontSize:13,color:colors.BLUE_COLOR_1,marginTop:10,marginBottom:100}]}>* {t('허위 신고시 서비스 사용이 제한될 수 있습니다.')}</Text>
              
              
            </ScrollView>

            <TouchableOpacity 
                onPress = {Complete}
                style={[{backgroundColor:colors.GREEN_COLOR_2,alignItems:'center',justifyContent:'center', height:60}]}>
                <Text style={[style.text_sb,{color:colors.WHITE_COLOR, fontSize:18}]}> 
                {t('완료')}
                </Text>
            </TouchableOpacity>

          <BackHandlerCom />
    </SafeAreaView>
    );
};


export default ReportChat;
