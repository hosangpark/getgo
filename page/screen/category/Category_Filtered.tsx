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
  SafeAreaView, Text, View, FlatList, Image, Button
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { CategoryType } from '../../../components/types/componentType';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { CategoryFilterHeader } from '../../../components/header/CategoryFilterHeader'
import ProductItem from '../../../components/layout/ProductItem'
import { ProductItemType } from '../../../components/types/componentType'
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import { useSelector } from 'react-redux';
import { NodataView } from '../../../api/Api';



/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */



type Props = StackScreenProps<MainNavigatorParams, 'Category_Filter'>


const Category_Filter = ({ route }: any) => {
  const { t } = useTranslation()
  const [isloading, setIsLoading] = React.useState<boolean>(false);
  const [items, setitem] = useState([])
  const userInfo = useSelector((state: any) => state.userInfo);
  const myLocation = useSelector((state: any) => state.myLocation);


  const rerendering = () => {
    if (myLocation.select_location == 1) {
      getData(myLocation.location1.mt_area)
    } else if (myLocation.select_location == 2) {
      getData(myLocation.location2.mt_area)
    } else {
      console.log('noArea')
    }
  }

  const getData = async (event: any) => {
    await client({
      method: 'get',
      url: `/product/procudt-list?mt_idx=${userInfo.idx}&pt_area=${event}&ct_idx=${route.params.ct_idx}`
    }).then(res => {
      setitem(res.data)
      setIsLoading(false)
    }).catch(err => {
      console.log(err)
    })
    setIsLoading(false)
  }

  React.useEffect(() => {
    rerendering()
  }, []);
  /** 지역 상품목록 */

  return (
    <SafeAreaView style={[style.default_background, { flex: 1, position: 'relative' }]}>
      <CategoryFilterHeader title={t(route.params.ct_name)} />
      <FlatList
        style={{ paddingHorizontal: 20 }}
        data={items}
        ListEmptyComponent={<NodataView></NodataView>}
        renderItem={({ item }) => (
          <ProductItem item={item} action={rerendering} />
        )}
      />
      {/* <TouchableOpacity 
              style={{alignItems:'flex-end', marginRight:20, marginBottom:25}}>
                <Image 
                style={{width:50, height:50,}}
                source={require('../../../assets/img/ico_write.png')} />
          </TouchableOpacity> */}
      <BackHandlerCom />
    </SafeAreaView>
  );
};

export default Category_Filter;


