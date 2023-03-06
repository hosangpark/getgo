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
  SafeAreaView, ScrollView, Text, View, StyleSheet, FlatList, Image
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHeader } from '../../../components/header/BackHeader'
import ProductSaledList from '../../../components/layout/ProductSaledList';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import { useSelector } from 'react-redux';
import LoadingIndicator from '../../../components/layout/Loading';
import cusToast from '../../../components/navigation/CusToast';
import { NodataView } from '../../../api/Api';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */






const SaledList_OnSale = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const [items, setitem] = useState<any>([])
  const [isloading, setIsLoading] = useState(false);
  const userInfo = useSelector((state: any) => state.userInfo);
  const enterReview = () => {
    console.log('d')
  }

  const Modify = () => {
    navigation.navigate('Itemupload')
  }

  const Remove = async (target: number) => {
    await client({
      method: 'get',
      url: `/product/purchase-completed_delete?ot_idx=${target}`,
      params: {
        ot_idx: target
      }
    }).then(
      res => {
        cusToast(t(res.data.message))
        const remove = items.filter((item: any) => item.ot_idx !== target)
        setitem(remove)
      }).catch(
        err => console.log(err)
      )
  }



  const getData = async () => {
    await client({
      method: 'get',
      url: '/product/purchase-completed',
      params: {
        mt_idx: userInfo.idx
      }
    }).then(
      res => {
        setitem(res.data)
        setIsLoading(false)
      }).catch(
        err => console.log(err)
      )
  };

  React.useEffect(() => {
    setIsLoading(true)
    getData();
  }, []);

  const ReviewCount = items.length

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <BackHeader title={t('구매내역')} />
      {isloading ?
        <LoadingIndicator />
        :
        <FlatList data={items}
          style={{ paddingHorizontal: 20 }}
          ListEmptyComponent={<NodataView></NodataView>}
          ListHeaderComponent={
            <View style={{ flexDirection: 'row', paddingTop: 15 }}>
              <Image style={{ width: 22, height: 22, marginRight: 7 }} source={require('../../../assets/img/ico_review.png')} />
              <Text style={[style.text_b, { fontSize: 14, color: colors.BLACK_COLOR_2, marginRight: 5 }]}>
                {t('총')}
              </Text>
              <Text style={[style.text_b, { fontSize: 14, color: colors.GREEN_COLOR_3 }]}>
                {ReviewCount}
              </Text>
              <Text style={[style.text_b, { fontSize: 14, color: colors.BLACK_COLOR_2, marginRight: 5 }]}>
                {t('건')}
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductSaledList item={item} Remove={Remove} Modify={Modify} />
          )}
        />
      }
      <BackHandlerCom />
    </SafeAreaView>
  );
};

export default SaledList_OnSale;
