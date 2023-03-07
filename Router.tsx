/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { MainNavigatorParams } from './components/types/routerTypes';
import Toast from 'react-native-toast-message';
import { toastConfig } from './components/navigation/toastConfig';
import { TransitionPresets } from '@react-navigation/stack';

import Main from './page/Main';

/* user */
import SelectLogin from './page/screen/user/SelectLogin';
import Login from './page/screen/user/Login';
import JoinStep2 from './page/screen/user/JoinStep2';
import JoinStep3 from './page/screen/user/JoinStep3';
import JoinStep4 from './page/screen/user/JoinStep4';
import ChangePhoneAuth from './page/screen/user/ChangePhoneAuth';
import ChangePhone from './page/screen/user/ChangePhone';

/* home */
import Itemupload from './page/screen/home/Itemupload'
import Itempost from './page/screen/home/Itempost'
import ItempostFullSlide from './page/screen/home/ItempostFullSlide'
import Search from './page/screen/home/Search'
import ReportUser from './page/screen/home/ReportUser'
import ReportPost from './page/screen/home/ReportPost'
import ReportChat from './page/screen/home/ReportChat'
import Reserve_choice from './page/screen/home/Reserve_choice'
import ChangePhoneResult from './page/screen/user/ChangePhoneResult';
// import useSelector from


/** Notification 알림 */
import NotificationIndex from './page/screen/notification/NotificationIndex';
import KeywordSetting from './page/screen/notification/KeywordSetting';
import NotificationDetail from './page/screen/notification/NotificationDetail';

/** Category 카테고리 */
import Category_Filter from './page/screen/category/Category_Filtered'

/** Message 메세지 */
import MessageRoom from './page/screen/Message/MessageRoom'


/** Mypage 마이페이지 */
import ProfileModify from './page/screen/mypage/ProfileModify'
import Allreview from './page/screen/mypage/Allreview'
import ReviewDetail from './page/screen/mypage/ReviewDetail'


/** Mypage 나의 거래 */
import SaledList from './page/screen/mypage/SaledList'
import SendReview from './page/screen/mypage/SendReview'
import PurchaseList from './page/screen/mypage/PurchaseList'
import InterestsList from './page/screen/mypage/InterestsList'

/** Mypage 동네 인증 */

/** Mypage Q & A */
import Question from './page/screen/mypage/Question'
import QuestionDetail from './page/screen/mypage/QuestionDetail'
import Inquiry_1_1 from './page/screen/mypage/Inquiry_1_1'
import Inquiry_1_1Detail from './page/screen/mypage/Inquiry_1_1Detail'
import Inquiry_1_1Upload from './page/screen/mypage/Inquiry_1_1Upload'


/** Mypage - Setting */
import MypageSetting from './page/screen/mypage/Setting'
import SettingModifyEmail from './page/screen/mypage/SettingModifyEmail'
import SettingModifyPhone from './page/screen/mypage/SettingModifyPhone'
import SettingAnnounce from './page/screen/mypage/SettingAnnounce'
import SettingAnnounceDetail from './page/screen/mypage/SettingAnnounceDetail'
import SettingTerms from './page/screen/mypage/SettingTerms'
import SettingServiceLocation from './page/screen/mypage/SettingServiceLocation'
import SettingPolicy from './page/screen/mypage/SettingPolicy'
import SettingWithdrawal from './page/screen/mypage/SettingWithdrawal'

import SearchLocation from './page/screen/location/SearchLocation';
import SetMyLocation from './page/screen/location/SetMyLocation';
import AuthMyLocation from './page/screen/location/AuthMyLocation';




import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import * as UserInfoAction from './redux/actions/UserInfoAction';
import * as MyLocationAction from './redux/actions/MyLocationAction';


const MainStack = createStackNavigator<MainNavigatorParams>();




const Router = () => {


/** 토큰 */
const fbToken = async () => {
// const authStatus = await messaging().requestPermission();
// const token = await messaging().getToken();

// return token;
};

/** AutoLogin */
//     const getAutoLogin = async () => {
//         const item = await AsyncStorage.getItem('userId');
//         const token = await fbToken();
//         if (item) {
//           autoLogin({
//             mt_id: item,
//             mt_app_token: token,
//             vi_os: Platform.OS,
//           });
//         }
//       };
// const setAutoLogin = async (id: string) => {
//     await AsyncStorage.setItem('userId', id); 
//     };


const userInfo = useSelector((state:any) => state.userInfo);
const dispatch = useDispatch()



  return (
    <MainStack.Navigator>
      {userInfo.islogin? 
        <MainStack.Screen 
            name={"Main"}
            component={Main}
            options={{headerShown:false}}
        />
        :
        // 회원가입 & 로그인 & 유저정보 
        <MainStack.Screen
          name={"SelectLogin"}
          component={SelectLogin}
          options={{headerShown:false}}
        />
      }
        <MainStack.Screen
          name={"Login"}
          component={Login}
          options={{headerShown:false}}
        />
        <MainStack.Screen
          name={"JoinStep2"}
          component={JoinStep2}
          options={{headerShown:false}}
        />
        <MainStack.Screen
          name={"JoinStep3"}
          component={JoinStep3}
          options={{headerShown:false}}
        />
        <MainStack.Screen
          name={"JoinStep4"}
          component={JoinStep4}
          options={{headerShown:false}}
        />
        <MainStack.Screen
          name={"ChangePhoneAuth"}
          component={ChangePhoneAuth}
          options={{headerShown:false}}
        />
        <MainStack.Screen
          name={"ChangePhone"}
          component={ChangePhone}
          options={{headerShown:false}}
        />
        <MainStack.Screen
          name={"ChangePhoneResult"}
          component={ChangePhoneResult}
          options={{headerShown:false}}
        />

        {/* 내동네 설정 */}
        <MainStack.Screen
          name={"SearchLocation"}
          component={SearchLocation}
          options={{headerShown:false}}
        />
        <MainStack.Screen 
          name={"SetMyLocation"}
          component={SetMyLocation}
          options={{headerShown:false}}
        />
        <MainStack.Screen
          name={"AuthMyLocation"}
          component={AuthMyLocation}
          options={{headerShown:false}}
        />

        {/* home 라우팅 */}
        <MainStack.Screen
          name={"Itemupload"}
          component={Itemupload}
          options={{headerShown:false}}
        />
        <MainStack.Screen
          name={"Itempost"}
          component={Itempost}
          options={{headerShown:false}}
        />
        <MainStack.Screen
          name={"ItempostFullSlide"}
          component={ItempostFullSlide}
          options={{headerShown:false}}
        />
        <MainStack.Screen
          name={"Search"}
          component={Search}
          options={{
            headerShown:false,
            ...TransitionPresets.SlideFromRightIOS
          }}
        />
        <MainStack.Screen
          name={"Reserve_choice"}
          component={Reserve_choice}
          options={{headerShown:false}}
        />
        <MainStack.Screen
          name={"ReportUser"}
          component={ReportUser}
          options={{headerShown:false}}
        />
        <MainStack.Screen
          name={"ReportPost"}
          component={ReportPost}
          options={{headerShown:false}}
        />
        <MainStack.Screen
          name={"ReportChat"}
          component={ReportChat}
          options={{headerShown:false}}
        />

        {/* Notification 알림 라우팅 */}
        <MainStack.Screen
          name={"NotificationIndex"}
          component={NotificationIndex}
          options={{headerShown:false}}
        />
        <MainStack.Screen
          name={"KeywordSetting"}
          component={KeywordSetting}
          options={{headerShown:false}}
        />
        <MainStack.Screen
          name={"NotificationDetail"}
          component={NotificationDetail}
          options={{headerShown:false}}
        />

        {/* Category 카테고리 라우팅 */}
        <MainStack.Screen
          name={"Category_Filter"}
          component={Category_Filter}
          options={{headerShown:false}}
        />

        {/* 알림*/}
        <MainStack.Screen
          name={"MessageRoom"}
          component={MessageRoom}
          options={{headerShown:false}}
        />

        
        {/* Mypage 라우팅 */}
        <MainStack.Screen
          name={"Allreview"}
          component={Allreview}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"ProfileModify"}
          component={ProfileModify}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"ReviewDetail"}
          component={ReviewDetail}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />

        {/* Mypage - Setting */}
        <MainStack.Screen
          name={"MypageSetting"}
          component={MypageSetting}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"SettingModifyEmail"}
          component={SettingModifyEmail}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"SettingModifyPhone"}
          component={SettingModifyPhone}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"SettingAnnounce"}
          component={SettingAnnounce}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"SettingAnnounceDetail"}
          component={SettingAnnounceDetail}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"SettingTerms"}
          component={SettingTerms}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"SettingServiceLocation"}
          component={SettingServiceLocation}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"SettingPolicy"}
          component={SettingPolicy}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"SettingWithdrawal"}
          component={SettingWithdrawal}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />

        
        {/* Mypage - Transaction 나의거래*/}
        <MainStack.Screen
          name={"SaledList"}
          component={SaledList}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"SendReview"}
          component={SendReview}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"PurchaseList"}
          component={PurchaseList}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"InterestsList"}
          component={InterestsList}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        {/* Mypage - Neighborhood */}
        {/* <MainStack.Screen
          name={"Neighborhood"}
          component={Neighborhood}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        /> */}

        {/* Mypage - Q & A */}
        <MainStack.Screen
          name={"Question"}
          component={Question}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"QuestionDetail"}
          component={QuestionDetail}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"Inquiry_1_1"}
          component={Inquiry_1_1}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"Inquiry_1_1Detail"}
          component={Inquiry_1_1Detail}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />
        <MainStack.Screen
          name={"Inquiry_1_1Upload"}
          component={Inquiry_1_1Upload}
          options={{headerShown:false,...TransitionPresets.SlideFromRightIOS}}
        />

    </MainStack.Navigator>
  );
};

export default Router;
