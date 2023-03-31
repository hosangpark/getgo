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
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ProductItem from '../../../components/layout/ProductItem';
import style from '../../../assets/style/style';

import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { MainHeader } from '../../../components/header/MainHeader';
import cusToast from '../../../components/navigation/CusToast';
import client from '../../../api/client';
import { useDispatch, useSelector } from 'react-redux';
import * as UserInfoAction from '../../../redux/actions/UserInfoAction';
import * as MyLocationAction from '../../../redux/actions/MyLocationAction';
import LoadingIndicator from '../../../components/layout/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import Api, { NodataView } from '../../../api/Api';
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

interface itemListType {
  setTabIndex: (index: number) => void;
}

const ItemList = ({ setTabIndex }: itemListType) => {
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  const [exitApp, setExitApp] = React.useState(false);
  const [isloading, setIsLoading] = React.useState<boolean>(false);
  const [isListLoading, setIsListLoading] = React.useState<boolean>(false);
  const [locationProductList, setLocationProductList] = React.useState();
  const dispatch = useDispatch();

  const [items, setitem] = useState([]);

  const userInfo = useSelector((state: any) => state.userInfo);
  const myLocation = useSelector((state: any) => state.myLocation);


  const Itemupload = () => {
    if (myLocation.select_location == 1 && myLocation.location1.mat_status !== "Y") {
      Certified()
    } else if (myLocation.select_location == 2 && myLocation.location2.mat_status !== "Y") {
      Certified()
    } else {
      navigation.navigate('Itemupload', { type: 'ProductUpload', pt_idx: 0 });
    }
  };

  const Certified = () => {
    Alert.alert(t('현재동네 인증이 되어있지않습니다'), '',
      [
        {
          text: t('인증하기'), onPress: () => {
            navigation.navigate('SetMyLocation')
          }
        },
        {
          text: '취소', onPress: () => {
          }
        }
      ])
  }

  const backAction = () => {
    var timeout;
    let tmp = 0;
    if (tmp == 0) {
      if ((exitApp == undefined || !exitApp) && isFocused) {
        cusToast(t('한번 더 누르시면 종료됩니다'));
        setExitApp(true);
        timeout = setTimeout(() => {
          setExitApp(false);
        }, 1000);
      } else {
        // appTimeSave();
        clearTimeout(timeout);
        BackHandler.exitApp(); // 앱 종료
      }
      return true;
    }
  };

  /** 위로 드래그 새로고침 */
  const [refreshing, setRefreshing] = useState(false);
  const getRefreshData = () => {
    console.log('refresh', '');
    rerendering();
  };
  const onRefresh = () => {
    if (!refreshing) {
      getRefreshData();
    }
  };

  const getSelect_location = async () => {
    let locTarget = await AsyncStorage.getItem('@locTarget');
    if (!locTarget) locTarget = '1';
    dispatch(MyLocationAction.select_loaction(locTarget));
  }

  /** 데이터 리렌더링 */
  const rerendering = () => {
    console.log('myLocation ItemList', myLocation.select_location, myLocation.location1.mt_area, myLocation.location2.mt_area);
    if (!myLocation.select_location) {
      getSelect_location();
    } else if (myLocation.select_location == 1) {
      setListChanege(1);
    } else if (myLocation.select_location == 2) {
      setListChanege(2);
    } else {
      console.log('noArea');
    }
  };

  /** 지역 상품목록 */
  const getProductListData = async (event: any) => {
    console.log('getProductListData', event, userInfo.idx);

    if (!event.mt_area) return;

    await client({
      method: 'get',
      url: `/product/procudt-list?mt_idx=${userInfo.idx}&pt_area=${event.mt_area}&mt_lat=${event.mt_lat}&mt_log=${event.mt_log}`,
    }).then(
      res => {
        //if (items !== res.data) {
        setitem(res.data);
        //}
        setIsLoading(false);
      })
      .catch(err => {
        console.log('getProductListData');
      });
    setIsLoading(false);
  };

  const setListChanege = (target: number) => {
    if (target == 1) {
      getProductListData(myLocation.location1);
      dispatch(MyLocationAction.select_loaction(JSON.stringify(1)));
      AsyncStorage.setItem('@locTarget', '1');
    } else if (target == 2) {
      getProductListData(myLocation.location2);
      dispatch(MyLocationAction.select_loaction(JSON.stringify(2)));
      AsyncStorage.setItem('@locTarget', '2');
    } else {
      console.log('getProduct');
      return;
    }
  };

  // React.useEffect(() => {
  //   setIsLoading(true);
  //   rerendering();
  // }, [myLocation.location1.mt_area, myLocation.location2.mt_area, myLocation.select_location]);


  // React.useEffect(() => {
  //   setIsLoading(true);
  //   rerendering();
  // }, [myLocation.location2.mt_area]);

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    if (!isFocused) {
      backHandler.remove();
    }
  }, [isFocused, exitApp]);

  useFocusEffect(
    React.useCallback(() => {

      rerendering();

      return () => { };
    }, [myLocation.location1.mt_area, myLocation.location2.mt_area, myLocation.select_location]),
  );



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <MainHeader setTabIndex={setTabIndex} setListChanege={setListChanege} />
      {isloading ? (
        <LoadingIndicator />
      ) : (
          <FlatList
            style={{ paddingHorizontal: 20 }}
            data={items}
            initialNumToRender={8}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={({ item }) => (
              <ProductItem item={item} action={rerendering} />
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<NodataView />}
            // onEndReached={()=>{
            //   setIsListLoading(true)
            // }}
            ListFooterComponent={isListLoading ? <LoadingIndicator /> : null}
          />
        )}
      <View
        style={{ position: 'absolute', right: 20, bottom: 25, borderRadius: 50 }}>
        <TouchableOpacity onPress={Itemupload}>
          <Image
            style={{ width: 75, height: 75 }}
            source={require('../../../assets/img/ico_write.png')}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ItemList;
