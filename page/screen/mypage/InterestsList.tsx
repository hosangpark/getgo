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
import ProductItem from '../../../components/layout/ProductItem'
import style from '../../../assets/style/style';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { MainHeader } from '../../../components/header/MainHeader'


import { BackHeader } from '../../../components/header/BackHeader';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import { useSelector } from 'react-redux';
import LoadingIndicator from '../../../components/layout/Loading';
import { NodataView } from '../../../api/Api';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */



const InterestsList = () => {
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  const userInfo = useSelector((state: any) => state.userInfo);
  const [isloading, setIsLoading] = useState(false)
  const [items, setitem] = useState([])

  // const heartOn = (e:number) =>{
  //   const nextitem = items.map(item => item.id === e? {...item, Btn:!item.Btn} : item,)
  //   setitem(nextitem)
  // }
  // const Itemupload = () => {
  //     navigation.navigate('Itemupload');
  // }
  const Delete = async () => {
    await client<any>({
      method: 'get',
      url: `/product/add_like_delete`,
      params: {
        wp_idx: userInfo.idx
      }
    }).then(
      res => {
        setitem(res.data)
        // getData()
      }).catch(
        err => console.log(err)
      )
  };



  const getListData = async () => {
    await client({
      method: 'get',
      url: `/product/add_like_list??mt_idx=${userInfo.idx}`,
      params: {
        mt_idx: userInfo.idx
      }
    }).then(
      res => {
        setitem(res.data)
        setIsLoading(false);
      }).catch(
        err => console.log(err)
      )
  };

  React.useEffect(() => {
    setIsLoading(true);
    getListData()
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <BackHeader title={t('관심목록')} />
      {isloading ?
        <LoadingIndicator />
        :
        <FlatList
          style={{ paddingHorizontal: 20 }}
          data={items}
          ListEmptyComponent={<NodataView></NodataView>}
          renderItem={({ item }) => (
            <ProductItem item={item} action={getListData} />
          )}
        />
      }
      <BackHandlerCom />
    </SafeAreaView>
  );
};

export default InterestsList;
