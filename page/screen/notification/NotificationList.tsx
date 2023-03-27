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
  SafeAreaView, ScrollView, Text, View, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Linking
} from 'react-native';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import { useSelector } from 'react-redux';
import LoadingIndicator from '../../../components/layout/Loading';
import { NodataView } from '../../../api/Api';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const NotificationList = ({ Alert_datas }: any) => {
  const { t } = useTranslation()

  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  const [isLoading, setIsLoading] = useState(false);

  // console.log('Alert_datas', Alert_datas);

  const CheckitemType = (item: any) => {
    console.log('CheckitemType', item)
    if (item.push_type == 1) {
      navigation.navigate('NotificationDetail', { pst_idx: item.pst_idx })
    } else if (item.push_type == 2) {
      navigation.navigate('Itempost', { pt_idx: item.pt_idx })
    } else if (item.push_type == 3) {
      navigation.navigate('ReviewDetail', { rt_idx: item.rt_idx, isMy: false })
    } else if (item.push_type == 4) {
      navigation.navigate('Itempost', { pt_idx: item.pt_idx })
    } else if (item.push_type == 5) {
      navigation.navigate('Itempost', { pt_idx: item.pt_idx })
    } else {
      return false;
    }
    // if(item.pst_url == null){
    //   navigation.navigate('NotificationDetail',item)
    // } else {
    //   Linking.openURL(item.pst_url)
    // }

  }

  return (
    <SafeAreaView style={[style.default_background]}>
      {isLoading ?
        <LoadingIndicator />
        :
        <FlatList
          data={Alert_datas}
          ListEmptyComponent={<NodataView></NodataView>}
          keyExtractor={(item) => item.pst_idx}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            // console.log('tit', item);
            if (item.push_type == 1) {
              return (
                <TouchableOpacity onPress={() => navigation.navigate('NotificationDetail', item)}>
                  <View style={{ borderBottomColor: colors.GRAY_LINE, borderBottomWidth: 1 }}>
                  <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
                      <Image source={require('../../../assets/img/ico_logo.png')} style={{ borderRadius: 20, width: 55, height: 55 }} />
                      <View style={{ marginLeft: 15 }}>
                        <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_2 }]}>{t(item.pst_content)}</Text>
                        <Text style={[style.text_li, { fontSize: 15, color: colors.BLACK_COLOR_2 }]}>{t(item.pst_title)}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>)
            } else {
              return (
                <TouchableOpacity onPress={() => CheckitemType(item)}>
                  <View style={{
                    borderBottomWidth: 1, borderBottomColor: colors.GRAY_COLOR_3, paddingHorizontal: 20,
                    paddingVertical: 21
                  }}>
                    <Text style={[style.text_me, { color: colors.GREEN_COLOR_2, fontSize: 13 }]}>{t(item.pst_title)}</Text>
                    <Text style={[style.text_me, { color: colors.BLACK_COLOR_2, fontSize: 15 }]}>{t(item.pst_content)}</Text>
                    <Text style={[style.text_li, { color: colors.GRAY_COLOR_2, fontSize: 13 }]}>{(item.pst_wdate)}</Text>
                  </View>
                </TouchableOpacity>)
            }
          }}
        />
      }
    </SafeAreaView>
  );
};

export default NotificationList;
