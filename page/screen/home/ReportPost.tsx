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
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { BackHeader } from '../../../components/header/BackHeader';
import { useTranslation } from 'react-i18next';


import { SearchHeader } from '../../../components/header/SearchHeader';
import { TextInput } from 'react-native-gesture-handler';
import client from '../../../api/client';
import { useSelector } from 'react-redux';
import cusToast from '../../../components/navigation/CusToast';


type Props = StackScreenProps<MainNavigatorParams, 'ReportPost'>
const ReportPost = ({route}:Props) => {
  const userInfo = useSelector((state:any) => state.userInfo)
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  // value,setValue,searchPlace
  const {t} = useTranslation()
  const [text,setText] = React.useState("")
  const [ReportList, setReportList] = useState([
    {reportlist:t("판매 금지 물품이에요") , report:false},
    {reportlist:t("중고거래 게시글이 아니에요"), report:false},
    {reportlist:t("전문 판매업자 같아요"), report:false},
    {reportlist:t("사기글이에요"), report:false},
    {reportlist:t("기타"), report:false},
  ])
  const [Report,setReport] = useState('')

  const selectReport = (e:string)=>{
    const nextitem = ReportList.map(item =>
      item.reportlist === e ? {...item, report: !item.report} : item,
    );
    setReportList(nextitem);
  }

  const Complete = async()=>{
    await client({
      method: 'post',
      url: '/product/declaration_chat',
      data:{
          room_idx:"",
          mt_idx:userInfo.idx,
          mt_declaration_idx:route.params.mt_declaration_idx,
          dct_reason:ReportList,
          dct_type:"3",
          dct_reason_etc:text
          }
      }).then(res=>{
         navigation.goBack()
         cusToast(t(res.data.message))
          }
      ).catch(error=>{
          console.log(error);
      })
  }

    return (
    <SafeAreaView style={[style.default_background , {flex:1}]}>
        <BackHeader title={t('게시글 신고')}/>     
            <ScrollView style={{paddingHorizontal:20}}>
              <Text style={[style.text_b, {color:colors.BLACK_COLOR_1,fontSize:22,marginTop:35, marginBottom:30, width:'60%',lineHeight:40}]}>
              {t('게시글을 신고하고자하는 이유를 선택하세요.')}
              </Text>
              
              {ReportList.map((e,index)=>{
                return(
                <TouchableOpacity key={index} style={{flexDirection:'row',marginBottom:15,paddingRight:40}} onPress={()=>setReport(e.reportlist)}>
                  {e.reportlist === Report?
                  <Image style={{width:22,height:22}} source={require('../../../assets/img/check_on.png')}/> :
                  <Image style={{width:22,height:22,}} source={require('../../../assets/img/check_off.png')}/>
                  }
                  <Text style={[style.text_me,{fontSize:15,marginLeft:10,color:colors.BLACK_COLOR_1}]}>{t(e.reportlist)}</Text>
                </TouchableOpacity>
                )
              })}

              <TextInput placeholder={t('입력하세요.')} style={{minHeight:95,borderRadius:5,borderWidth:1,borderColor:colors.GRAY_COLOR_3,padding:15,textAlignVertical:'top'}} multiline={true} value={text} onChangeText={setText}
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

          <BackHandlerCom/>
          
    </SafeAreaView>
    );
};


export default ReportPost;
