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
  SafeAreaView, ScrollView, Text, View, Image, TouchableOpacity, StyleSheet, FlatList, Button, ActivityIndicator, BackHandler
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


type Props = StackScreenProps<MainNavigatorParams, 'ReportChat'>
const ReportChat = ({ route }: Props) => {
  const userInfo = useSelector((state: any) => state.userInfo)
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const [text, setText] = React.useState("")
  // value,setValue,searchPlace
  const { t } = useTranslation()

  const [Report, setReport] = useState('')

  const selectReport = (e: number) => {
    let nextitem = ReportList.map((item, index) =>
      index === e ? { reportlist: item.reportlist, report: true } : { reportlist: item.reportlist, report: false }
    );
    setReportList(nextitem);
  }

  const [ReportList, setReportList] = useState([
    { reportlist: t('욕설을 해요'), report: false },
    { reportlist: t('성희롱을 해요'), report: false },
    { reportlist: t('사기 대화를 시도해요'), report: false },
    { reportlist: t('영업 / 홍보 / 광고 목적의 대화를 시도해요'), report: false },
    { reportlist: t('연애 목적의 대화를 시도해요'), report: false },
    { reportlist: t('다른 문제가 있어요'), report: false },
    { reportlist: t('기타'), report: false },
  ])


  const Complete = async () => {

    let dct_reason = '';
    ReportList.forEach(({ reportlist, report }) => {
      if (report) {
        dct_reason = reportlist;
        return false;
      }
    })

    if (dct_reason == '') {
      cusToast(t('신고 사유를 선택해주세요.'));
      return;
    }
    if (dct_reason == '기타' && !text) {
      cusToast(t('기타 사유를 입력해주세요.'));
      return;
    }

    const chat_idx = route?.params?.chat_idx ?? ''

    await client({
      method: 'post',
      url: '/product/declaration_chat',
      data: {
        room_idx: route.params.room_idx,
        mt_idx: userInfo.idx,
        mt_declaration_idx: route.params.mt_declaration_idx,
        dct_reason: dct_reason,
        dct_type: (chat_idx) ? '5' : "1",
        dct_reason_etc: text,
        chat_idx: chat_idx,
      }
    }).then(res => {
      // navigation.goBack()
      navigation.pop(2)
      cusToast(t(res.data.message))
    }
    ).catch(error => {
      console.log(error);
    })
  }

  React.useEffect(() => {
    console.log(route)
  }, [])

  return (
    <SafeAreaView style={[style.default_background, { flex: 1 }]}>
      <BackHeader title={t('채팅 신고')} />
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <Text style={[style.text_b, { color: colors.BLACK_COLOR_1, fontSize: 22, marginTop: 35, marginBottom: 30, width: '60%', lineHeight: 40 }]}>
          {t('채팅을 신고하고자하는 이유를 선택하세요')}
        </Text>

        {ReportList.map((e, index) => {
          return (
            <TouchableOpacity key={index} style={{ flexDirection: 'row', marginBottom: 15, paddingRight: 40 }} onPress={() => { setReport(e.reportlist); selectReport(index) }
            }>
              {
                e.reportlist === Report ?
                  <Image style={{ width: 22, height: 22 }} source={require('../../../assets/img/check_on.png')} /> :
                  <Image style={{ width: 22, height: 22, }} source={require('../../../assets/img/check_off.png')} />
              }
              < Text style={[style.text_me, { fontSize: 15, marginLeft: 10, color: colors.BLACK_COLOR_1 }]} > {t(e.reportlist)}</Text>
            </TouchableOpacity>
          )
        })}

        <TextInput placeholder={t('입력하세요')} style={{ minHeight: 95, borderRadius: 5, borderWidth: 1, borderColor: colors.GRAY_COLOR_3, padding: 15, textAlignVertical: 'top' }} multiline={true} value={text} onChangeText={setText}
          onSubmitEditing={Complete}
        />
        <Text style={[style.text_re, { fontSize: 13, color: colors.BLUE_COLOR_1, marginTop: 10, marginBottom: 100 }]}>* {t('허위 신고시 서비스 사용이 제한될 수 있습니다.')}</Text>


      </ScrollView >

      <TouchableOpacity
        onPress={Complete}
        style={[{ backgroundColor: colors.GREEN_COLOR_2, alignItems: 'center', justifyContent: 'center', height: 60 }]}>
        <Text style={[style.text_sb, { color: colors.WHITE_COLOR, fontSize: 18 }]}>
          {t('완료')}
        </Text>
      </TouchableOpacity>

      <BackHandlerCom />
    </SafeAreaView >
  );
};


export default ReportChat;
