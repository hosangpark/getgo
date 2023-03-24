/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  Alert,
  SafeAreaView, ScrollView, Text, View, StyleSheet, FlatList, Image, Keyboard
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../../assets/style/style';

import { BackHeader } from '../../../components/header/BackHeader'
import { colors } from '../../../assets/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import { useSelector } from 'react-redux';
import LoadingIndicator from '../../../components/layout/Loading';
import Api, { NodataView } from '../../../api/Api';
import { foramtDate, NumberComma } from '../../../components/utils/funcKt';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */




const KeywordNoti = ({ KeywordNotiitem, MaxTextCount }: any) => {
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  const userInfo = useSelector((state: any) => state.userInfo);
  const [isLoading, setIsLoading] = useState(false);
  const { t, i18n } = useTranslation()

  console.log('KeywordNotiitem', KeywordNotiitem);

  return (
    <SafeAreaView style={[style.default_background, { flex: 1, position: 'relative' }]}>
      {isLoading ?
        <LoadingIndicator />
        :
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, marginBottom: 11, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row' }}>
            <Image style={{ width: 24, height: 24, marginRight: 7 }} source={require('../../../assets/img/top_alim.png')} />
            <Text style={[style.text_b, { color: colors.BLACK_COLOR_1, fontSize: 17, }]}>
              {t('알림받는 키워드')}
              <Text style={[style.text_b, { color: colors.GREEN_COLOR_2, fontSize: 17 }]}>
                {MaxTextCount}
              </Text></Text></View>
          <TouchableOpacity style={{
            borderColor: colors.GRAY_COLOR_2, borderWidth: 1, width: 52, height: 27
            , justifyContent: 'center', alignItems: 'center', borderRadius: 15
          }}
            onPress={() => { navigation.navigate('KeywordSetting') }}>
            <Text style={[style.text_me, { color: colors.GRAY_COLOR_2, fontSize: 13, }]}>
              {t('설정')}
            </Text>
          </TouchableOpacity>
        </View>
      }
      {KeywordNotiitem ? <FlatList
        data={KeywordNotiitem}
        style={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<NodataView></NodataView>}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => (
          <TouchableOpacity style={{
            borderBottomWidth: 1, borderBottomColor: colors.GRAY_COLOR_3, flexDirection: 'row', paddingVertical: 17,
          }} onPress={() => navigation.navigate('Itempost', { pt_idx: item.pt_idx })}>
            <Image style={{ width: 70, height: 70, borderRadius: 8, marginRight: 15 }}
              source={item.pt_image1 ? { uri: Api.state.imageUrl + item.pt_image1 } : require('../../../assets/img/ico_logo2.png')}
            />
            <View>
              <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                <Text style={[style.text_me, { color: colors.GREEN_COLOR_2, fontSize: 12, backgroundColor: colors.GREEN_COLOR_4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 3 }]}>
                  {i18n.language == 'Id' ? item.ct_in_name : i18n.language == 'En' ? item.ct_en_name : item.ct_name}
                </Text>
              </View>
              <Text style={[style.text_me, { color: colors.BLACK_COLOR_2, fontSize: 15, paddingRight: 100 }]} numberOfLines={1} >
                {item.pt_title}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text style={[style.text_li, { color: colors.GRAY_COLOR_2, fontSize: 13 }]}>
                  {item.pt_area}
                </Text>
                <Text style={[style.text_li, { color: colors.GRAY_COLOR_2, fontSize: 13 }]}> / </Text>
                <Text style={[style.text_li, { color: colors.GRAY_COLOR_2, fontSize: 13 }]}>
                  {foramtDate(item.pt_wdate, i18n.language)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      /> : null}
    </SafeAreaView>
  );
};

export default KeywordNoti;
