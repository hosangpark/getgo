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
  SafeAreaView, ScrollView, Text, View, StyleSheet, FlatList, Image, Button, TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { BackHeader } from '../../../components/header/BackHeader'
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import client from '../../../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as UserInfoAction from '../../../redux/actions/UserInfoAction'


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */




const SettingWithdrawal = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const userInfo = useSelector((state: any) => state.userInfo);
  const myLocation = useSelector((state: any) => state.myLocation);
  const dispatch = useDispatch()
  /** redux 상태관리 */

  const [withdrawal, setWithdrawal] = useState(false)

  console.log('userInfo', userInfo);

  const accccction = () => {
    if (withdrawal == true) {
      Alert.alert(t('탈퇴하시겠습니까?'), ''
        ,
        [
          {
            text: '탈퇴', onPress: async () => {
              await AsyncStorage.removeItem('userIdx')
              DeleteUser();
            }, style: 'cancel'
          },
          {
            text: '취소',
            onPress: () => {

            },
            style: 'destructive',
          },
        ]
      )
    } else {
      Alert.alert('약관에 동의해주세요', '')
    }
  }

  const DeleteUser = async () => {
    await client<any>({
      method: 'get',
      url: '/user/memout',
      params: {
        mt_idx: userInfo.idx
      }
    }).then(
      res => {
        console.log(res.data)
        dispatch(UserInfoAction.logOut());
        navigation.reset({ routes: [{ name: 'SelectLogin' }] });
      }
    ).catch(
      err => console.log(err)
    )
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <BackHeader title={t('탈퇴하기')} />
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <Text style={[style.text_b, { fontSize: 22, color: colors.BLACK_COLOR_1, paddingTop: 30, }]}>
          {userInfo.mt_nickname} {t('님')}
        </Text>
        <Text style={[style.text_b, { fontSize: 22, color: colors.BLACK_COLOR_1 }]}>
          {t('정말로 탈퇴하시겠습니까?')}
        </Text>
        <Text style={[style.text_re, { fontSize: 15, color: colors.BLACK_COLOR_1, marginRight: 20, paddingVertical: 25, lineHeight: 23 }]}>
          {t('계정을 삭제하면 판매내역, 평가받은 만족도와 후기, 관심, 채팅 모든 활동 정보가 삭제됩니다. 계정 삭제후 7일간 다시 가입할 수 없습니다.')}
        </Text>

        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => setWithdrawal(!withdrawal)}>
          {!withdrawal ?
            <Image style={{ width: 22, height: 22 }} source={require('../../../assets/img/check_off.png')} /> :
            <Image style={{ width: 22, height: 22 }} source={require('../../../assets/img/check_on.png')} />
          }
          <Text style={[style.text_me, { fontSize: 15, color: colors.BLACK_COLOR_1, marginLeft: 10 }]}>
            {t('네, 확인했습니다.')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity
        onPress={accccction}
        style={[{ backgroundColor: withdrawal ? colors.GREEN_COLOR_2 : colors.GRAY_COLOR_2, alignItems: 'center', justifyContent: 'center', height: 60 }]}>
        <Text style={[style.text_sb, { color: colors.WHITE_COLOR, fontSize: 18 }]}>
          {t('탈퇴하기')}
        </Text>
      </TouchableOpacity>
      <BackHandlerCom />
    </SafeAreaView>
  );
};

export default SettingWithdrawal;
