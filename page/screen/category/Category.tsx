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
  SafeAreaView, Text, View, FlatList, Image, ScrollView, BackHandler
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { CategoryType } from '../../../components/types/componentType';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { CategoryHeader } from '../../../components/header/CategoryHeader'
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import LoadingIndicator from '../../../components/layout/Loading';
import cusToast from '../../../components/navigation/CusToast';
import Api from '../../../api/Api';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */



interface MainHeaderType {
  setTabIndex: (index: number) => void
}

const Category = ({ setTabIndex }: MainHeaderType) => {

  const { t, i18n } = useTranslation()
  const isFocused = useIsFocused();
  const [exitApp, setExitApp] = React.useState(false);
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  const [isLoading, setIsLoading] = React.useState(false);
  const [category_data, setCategory_data] = useState<any>()

  const getData = async () => {
    await client<{ data: string }>({
      method: 'get',
      url: '/product/category-list',
    }).then(
      res => {
        setCategory_data(res.data)
        Api.state.baseCode.category = res.data;
        setIsLoading(false)
      }
    ).catch(
      err => console.log(err)
    )
  };

  const backAction = () => {
    var timeout;
    let tmp = 0;
    if (tmp == 0) {
      if ((exitApp == undefined || !exitApp) && isFocused) {
        navigation.goBack();
        // cusToast(t('한번 더 누르시면 종료됩니다'));
        // setExitApp(true);
        // timeout = setTimeout(() => {
        //   setExitApp(false);
        // }, 2000);
      } else {
        // appTimeSave();
        clearTimeout(timeout);
        BackHandler.exitApp(); // 앱 종료
      }
      return true;
    }
  };
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    if (!isFocused) {
      backHandler.remove();
    }
  }, [isFocused, exitApp]);

  // React.useEffect(() => {

  // }, []);

  useFocusEffect(React.useCallback(() => {
    setIsLoading(true)
    getData();
    console.log("i18n", i18n.language)
  }, []))


  const Category_Filter = (categorytype: CategoryType) => {
    navigation.navigate('Category_Filter', categorytype);
  }
  return (
    <SafeAreaView style={[style.default_background]}>
      <CategoryHeader title={t('카테고리')} setTabIndex={setTabIndex} />
      {isLoading ?
        <LoadingIndicator />
        :
        <View style={{ flex: 1, marginVertical: 20 }}>
          <FlatList data={category_data}
            extraData={category_data}
            numColumns={4}
            showsVerticalScrollIndicator={false}
            style={{ paddingHorizontal: 13, }}
            renderItem={({ item }) =>
              <View style={{ width: '25%', justifyContent: 'flex-start', alignItems: 'center', marginBottom: 10 }} key={item.ct_idx}>
                <TouchableOpacity onPress={() => Category_Filter(item)}
                  style={{ justifyContent: 'center', alignItems: 'center', overflow: 'hidden', }}
                >
                  {item.ct_file1 ? <View style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 5, }}><Image style={{ width: 68, height: 68, resizeMode: 'cover' }} source={{ uri: Api.state.imageUrl + item.ct_file1 }} /></View> : null}
                  <Text style={[style.text_sb, { fontSize: 14, color: colors.BLACK_COLOR_1, paddingHorizontal: 5, textAlign: 'center', }]}>
                    {i18n.language == 'In' ? item.ct_in_name : i18n.language == 'En' ? item.ct_en_name : item.ct_name}
                  </Text>
                </TouchableOpacity>
              </View>
            }
          /></View>
      }

    </SafeAreaView>
  );
};

export default Category;


