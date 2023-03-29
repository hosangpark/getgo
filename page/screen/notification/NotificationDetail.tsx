/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView, ScrollView, Text, View, StyleSheet, FlatList, Image, TouchableOpacity, Button
} from 'react-native';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import { BackHeader } from '../../../components/header/BackHeader';
import client from '../../../api/client';
import cusToast from '../../../components/navigation/CusToast';
import LoadingIndicator from '../../../components/layout/Loading';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

interface ddddd {
  pst_detail_content: string
  pst_title: string
  pst_url: string
  pst_url_target: string
  pst_wdate: string
  push_type: number
}



type Props = StackScreenProps<MainNavigatorParams, 'NotificationDetail'>
const NotificationDetail = ({ route }: Props) => {
  const { t, i18n } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const [Alert_datas, setAlert_datas] = React.useState<any>([])
  const [isLoading, setIsLoading] = useState(true);

  const NoticeDetailList = async () => {
    await client({
      method: 'get',
      url: '/user/push_detail',
      params: {
        // mt_idx : userInfo.idx
        pst_idx: route.params.pst_idx
      }
      }).then(
        res=>{
          console.log("res.datares.datares.datares.datares.datares.datares.datares.datares.datares.datares.datares.datares.datares.data",res.data)
          setAlert_datas(res.data[0])
          setIsLoading(false)
        }
      ).catch(
        err=>{
          console.log(err)
        }
      )
    };
  
    React.useEffect(()=>{
      setIsLoading(true)
      NoticeDetailList()
    },[])
    return (
        <SafeAreaView style={[style.default_background]}>
          <BackHeader title={t('알림상세')}/>
          {isLoading?
          <LoadingIndicator/>
          :
          <ScrollView style={{borderBottomColor:colors.GRAY_LINE,borderBottomWidth:1,paddingHorizontal:20}}>
            <View style={{justifyContent:'center',alignItems:'center',paddingVertical:20,borderBottomWidth:1,borderBottomColor:colors.GRAY_COLOR_3}}>
              <Text style={[style.text_me,{fontSize:13,color:colors.GREEN_COLOR_3}]}>
                {Alert_datas.pst_title}</Text>
              <Text style={[style.text_sb,{fontSize:18,color:colors.BLACK_COLOR_1,marginVertical:8}]}>
                {Alert_datas.pst_detail_content}</Text>
              <Text style={[style.text_re,{fontSize:13,color:colors.GRAY_COLOR_2}]}>
                {(Alert_datas.pst_wdate)}</Text>
            </View>
            <View style={{paddingVertical:20}}>
              <Text style={[style.text_re,{fontSize:14,color:colors.BLACK_COLOR_1,lineHeight:20}]}>
              {Alert_datas.pst_content}</Text>
          </View>
        </ScrollView>
      }
      <BackHandlerCom />
    </SafeAreaView>
  );
};

export default NotificationDetail;
