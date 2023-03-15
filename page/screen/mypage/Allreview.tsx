import React from 'react';


import { View, ViewStyle, Text, ScrollView, SafeAreaView, useWindowDimensions } from 'react-native';
import { BackHeader } from '../../../components/header/BackHeader';
import { useFocusEffect, } from '@react-navigation/native';
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ReviewBuy from './ReviewBuy';
import ReviewSale from './ReviewSale';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import cusToast from '../../../components/navigation/CusToast';
import { useSelector } from 'react-redux';



export default function AllreView() {

  const { t } = useTranslation()
  const layout = useWindowDimensions();
  const userInfo = useSelector((state: any) => state.userInfo);
  const [index, setIndex] = React.useState(0);
  const [reviewbuy, setReviewBuy] = React.useState([])
  const [reviewsale, setReviewSale] = React.useState([])
  const [rt_type_buy, setRt_type_buy] = React.useState('');
  const [rt_type_sale, setRt_type_sale] = React.useState('');
  const [routes] = React.useState([
    { key: "Recieved", title: t('구매자 후기') },
    { key: 'Send', title: t('판매자 후기') },
  ]);

  const NaviProceeding = () => {
    return (
      <ReviewBuy items={reviewbuy} ReviewCount={reviewbuy.length} Remove={RemoveOnsale} rt_type={rt_type_buy} data_reload={() => getReviewBuyData()} />
    )
  }

  const NaviEndEvent = () => {
    return (
      <ReviewSale items={reviewsale} ReviewCount={reviewsale.length} Remove={RemoveComplete} rt_type={rt_type_sale} data_reload={() => getReviewSaleData()} />
    )
  }

  const renderScene = SceneMap({
    Recieved: NaviProceeding,
    Send: NaviEndEvent,
  });

  const RemoveComplete = async (target: number) => {
    await client({
      method: 'get',
      url: `/product/sales_completed_delete`,
      params: {
        ot_idx: target
      }
    }).then(
      res => {
        cusToast(t(res.data.message))
        getReviewSaleData()
      }).catch(
        err => console.log(err)
      )
  };


  const RemoveOnsale = async (target: number) => {
    await client({
      method: 'get',
      url: `product/sales_delete`,
      params: {
        pt_idx: target
      }
    }).then(
      res => {
        cusToast(res.data.message)
        getReviewBuyData()
      }).catch(
        err => {
          console.log(err)
        })
  };

  const getReviewBuyData = async () => {
    await client({
      method: 'get',
      url: `/user/review_list?mt_idx=${userInfo.idx}`,
    }).then(
      res => {
        setReviewBuy(res.data.list.reverse())
        setRt_type_buy(res.data.rt_type)
      }
    ).catch(
      err => console.log(err)
    )
  };


  const getReviewSaleData = async () => {
    await client({
      method: 'get',
      url: `/user/seller_reviews_list?mt_idx=${userInfo.idx}`,
    }).then(
      res => {
        setReviewSale(res.data.list.reverse())
        setRt_type_sale(res.data.rt_type)
      }
    ).catch(
      err => {
        console.log('dd?')
      })
  };

  useFocusEffect(
    React.useCallback(() => {
      getReviewSaleData();
      getReviewBuyData()
      return () => { };
    }, []),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <BackHeader title={t('거래 후기 전체보기')} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: colors.GREEN_COLOR_2,
              borderColor: colors.GREEN_COLOR_2,
              borderWidth: 0,
            }}
            style={{
              backgroundColor: colors.GREEN_COLOR_2,
              // shadowOffset:{height:0,width:0},
            }}
            tabStyle={{
              backgroundColor: colors.GREEN_COLOR_2,
              marginVertical: -12,
            }}
            pressColor={"transparent"}
            renderLabel={({ route, focused }) => (
              <Text style={[focused ? style.text_b : style.text_re, { color: colors.WHITE_COLOR, fontSize: 15, borderBottomColor: colors.WHITE_COLOR, paddingVertical: 15, borderBottomWidth: focused ? 6 : 0, letterSpacing: focused ? -0.6 : 0, opacity: focused ? 1 : 0.7 }]}>
                {route.title}
              </Text>
            )}
          />
        )}
      />
      <BackHandlerCom />
    </SafeAreaView>
  );
}