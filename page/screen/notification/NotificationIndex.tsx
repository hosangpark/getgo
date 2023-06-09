import React from 'react';
import { View, ViewStyle, Text, ScrollView, SafeAreaView, useWindowDimensions, BackHandler } from 'react-native';
import { NotificationHeader } from '../../../components/header/NotificationHeader';
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import NotificationList from './NotificationList';
import KeywordNoti from './KeywordNoti';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import { useSelector } from 'react-redux';
import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import LoadingIndicator from '../../../components/layout/Loading';
import cusToast from '../../../components/navigation/CusToast';



export default function NotificationIndex() {

  const { t,i18n } = useTranslation()
  const layout = useWindowDimensions();
  const isFocused = useIsFocused();
  const [exitApp, setExitApp] = React.useState(false);
  const userInfo = useSelector((state: any) => state.userInfo);
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const [index, setIndex] = React.useState(0);

  const [routes, setRoutes] = React.useState([
    { key: "noti", title: t('상품/후기 알림') },
    { key: 'keyword', title: t('키워드알림') },
  ]);

  const [Alert_datas, setAlert_datas] = React.useState()
  const [KeywordNotiitem, setKeywordNotiitem] = React.useState([]);
  const [MaxTextCount, setMaxTextCount] = React.useState<number>(0)
  const [isLoading, setIsLoading] = React.useState(true);

  const NaviProceeding = () => {
    return (
      isLoading ?
        <LoadingIndicator />
        :
        <NotificationList Alert_datas={Alert_datas} />

    )
  }

  const NaviEndEvent = () => {
    return (
      <KeywordNoti KeywordNotiitem={KeywordNotiitem} MaxTextCount={MaxTextCount} />
    )
  }


  const renderScene = SceneMap({
    noti: NaviProceeding,
    keyword: NaviEndEvent,
  });

  const NoticeList = async () => {
    await client({
      method: 'get',
      url: '/user/push_list',
      params: {
        mt_idx: userInfo.idx
      }
    }).then(
      res => {
        setAlert_datas(res.data.list)
        setIsLoading(false)
      }
    ).catch(
      err => console.log(err)
    )
  };

  const KeywordList = async () => {
    await client({
      method: 'get',
      url: `/user/keyword_push_list?mt_idx=${userInfo.idx}`,
      params: {
        mt_idx: userInfo.idx
      }
    }).then(
      res => {
        console.log('res.data.total_list', res.data.total_list);
        setMaxTextCount(res.data.total)
        setKeywordNotiitem(res.data.total_list)
      }
    ).catch(
      err => {
        console.log('NoticeList')
      }
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

  React.useEffect(() => {
    NoticeList()
    KeywordList()
    const unsubscribe = navigation.addListener('focus', () => {
      NoticeList()
      KeywordList()
    })
    return unsubscribe
  }, [])

  React.useEffect(() => {
    setRoutes([
      { key: "noti", title: t('상품/후기 알림') },
      { key: 'keyword', title: t('키워드알림') }
    ])
  }, [t])


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <NotificationHeader title={t('알림')} />
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
              <Text style={[focused ? style.text_b : style.text_re, { color: colors.WHITE_COLOR, fontSize: 15, paddingVertical: 15, paddingHorizontal: 5, borderBottomColor: colors.WHITE_COLOR, borderBottomWidth: focused ? 6 : 0, opacity: focused ? 1 : 0.7, letterSpacing: focused ? -1 :-0.4 }]}>{route.title}</Text>
            )}
          />
        )}
      />
    </SafeAreaView>
  );
}