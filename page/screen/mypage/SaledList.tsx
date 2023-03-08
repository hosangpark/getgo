import React from 'react';


import {View, ViewStyle,Text, ScrollView, SafeAreaView, useWindowDimensions } from 'react-native';
import { BackHeader } from '../../../components/header/BackHeader';
import { TabView, SceneMap,TabBar } from "react-native-tab-view";
import SaledList_OnSale from './SaledList_OnSale';
import SaledList_Complete from './SaledList_Complete';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import { useSelector } from 'react-redux';
import cusToast from '../../../components/navigation/CusToast';
import LoadingIndicator from '../../../components/layout/Loading';





export default function SaledList({route}) {

  const {t} = useTranslation()
  const layout = useWindowDimensions();
  const userInfo = useSelector((state:any) => state.userInfo);
  const [index, setIndex] = React.useState(0);
  const [Saleitems, setsaleitem] = React.useState([])
  const [Completeitems, setCompleteitem] = React.useState([])
  const [isloading, setIsLoading] = React.useState(true);
  const [routes] = React.useState([
      {key:"OnSale" , title :t('판매중')},
      {key:'Complete', title:t('거래완료')},
  ]);
  
const OnSale = () => {
    return(
        <SaledList_OnSale items={Saleitems} ReviewCount={Saleitems.length} Remove={RemoveOnsale} Rerender={rerendering}/>
    )
}
const Complete = () => {
    return(
        <SaledList_Complete items={Completeitems} ReviewCount={Completeitems.length} Remove={RemoveComplete} Rerender={rerendering}/>
    )
}
  const renderScene = SceneMap({
    Complete: Complete,
    OnSale: OnSale,
  });

  const RemoveComplete = async(target:number) => {
    await client({
      method: 'get',
      url: `/product/sales_completed_delete`,
      params:{
        ot_idx:target
      }
      }).then(
        res=>{
          cusToast(t(res.data.message))
          getCompleteData()
      }).catch(
        err=>console.log(err)
      )
    };


  const RemoveOnsale = async (target:number) => {
    await client({
      method: 'get',
      url: `product/sales_delete`,
      params:{
        pt_idx:target
      }
      }).then(
        res=>{
          cusToast(res.data.message)
          getOnsaleData()
      }).catch(
        err=>{console.log(err)
    })
  };

  const getOnsaleData = async () => {
    await client({
      method: 'get',
      url: '/product/sales',
      params:{
        mt_idx:userInfo.idx
      }
      }).then(
        res=>{
          setsaleitem(res.data)
          console.log(route.params.target)
          if(route.params.target == 1){
            setIndex(1)
          }
          setIsLoading(false)
      }).catch(
        err=>{
          console.log('getOnsaleData')
      })
    };

  const getCompleteData = async () => {
    await client({
      method: 'get',
      url: '/product/sales_completed',
      params:{
        mt_idx:userInfo.idx
      }
      }).then(
        res=>{
          setCompleteitem(res.data)
          
        }
      ).catch(
        err=>{console.log('getOnsaleData')
      })
    };
  const rerendering =()=> {
    getCompleteData(),
    getOnsaleData()
  }
  React.useEffect(() => {
    getCompleteData();
    getOnsaleData()
  }, []);


  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
        <BackHeader title={t('나의 판매내역')} />
        {isloading ? 
        <LoadingIndicator />
        : 
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
                borderColor:colors.GREEN_COLOR_2,
                borderWidth:0,
              }}
              style={{
                  backgroundColor:colors.GREEN_COLOR_2,
              }}
              tabStyle={{
                backgroundColor:colors.GREEN_COLOR_2,
                marginVertical:-12,
              }}
              pressColor={"transparent"}
              renderLabel={({ route, focused }) => (
                  <Text style={[focused ? style.text_b : style.text_re,{color:colors.WHITE_COLOR,fontSize:15,paddingVertical:15,borderBottomColor:colors.WHITE_COLOR,borderBottomWidth:focused ? 6 : 0, opacity:focused? 1:0.7, letterSpacing:focused? -0.6:0}]}>{route.title}</Text>
              )}
            />
          )}
        />
        }
        <BackHandlerCom />
    </SafeAreaView>
  );
}