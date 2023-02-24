/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
    Alert,
  Image,
  SafeAreaView, Text, View,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Login from './screen/user/SelectLogin';
import Itemlist from './screen/home/Itemlist';
import HomeScreen from './screen/home/Itemlist';
import Category from './screen/category/Category';
import Message from './screen/Message/Message';
import NotificationIndex from './screen/notification/NotificationIndex';
import Mypage from './screen/mypage/Mypage'
import { useSelector } from 'react-redux';
import { RootState } from '../redux/reducers';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const Main = () => {

  const Tab = createBottomTabNavigator();
  const [tabIndex,setTabIndex] = React.useState(1);
  // const Isloginn = useSelector((state: RootState) => state.auth.isLogin);

  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
      <View style={{flex:1}}>
        <Tab.Navigator initialRouteName="Home">
          <Tab.Screen
            name="Home"
            // component={Itemlist}
            children={()=>
              <Itemlist 
                setTabIndex={setTabIndex}
              />
            }
            listeners={{
              tabPress : (e:any)=>{
                setTabIndex(1);
              }
            }}
            
            options={{
              headerShown:false,
              tabBarShowLabel:false,
              tabBarIcon: ({}) => (
                <Image style={{width:50,height:50}} source={tabIndex == 1 ? require('../assets/img/f_menu1_on.png') : require('../assets/img/f_menu1_off.png')} />
                
              ),
            }}
          />
          <Tab.Screen
            name="NotificationIndex"
            component={NotificationIndex}
            listeners={{
              tabPress : (e)=>{
                setTabIndex(2);
              }
            }}
            options={{
              // title: '로그인구현중',
              headerShown:false,
              tabBarShowLabel:false,
              tabBarIcon: ({color, size}) => (
                <Image style={{width:50,height:50}} source={tabIndex == 2 ? require('../assets/img/f_menu2_on.png') : require('../assets/img/f_menu2_off.png')} />
              ),
            }}
          />
          <Tab.Screen
            name="Category"
            children={()=>
              <Category 
                setTabIndex = {setTabIndex}
              />
            }
            listeners={{
              tabPress : (e)=>{
                setTabIndex(3);
              }
            }}
            options={{
              // title: '로그인구현중',
              headerShown:false,
              tabBarShowLabel:false,
              tabBarIcon: ({color, size}) => (
                <Image style={{width:50,height:50}} source={tabIndex == 3 ? require('../assets/img/f_menu3_on.png') : require('../assets/img/f_menu3_off.png')} />
              ),
            }}
          />
          <Tab.Screen
            name="Message"
            component={Message}
            listeners={{
              tabPress : (e)=>{
                setTabIndex(4);
              }
            }}
            options={{
              // title: '검색',
              headerShown:false,
              tabBarShowLabel:false,
              tabBarIcon: ({color, size}) => (
                <Image style={{width:50,height:50}} source={tabIndex == 4 ? require('../assets/img/f_menu4_on.png') : require('../assets/img/f_menu4_off.png')} />
              ),
            }}
          />
          <Tab.Screen
            name="Mypage"
            component={Mypage}
            listeners={{
              tabPress : (e)=>{
                setTabIndex(5);
              }
            }}
            options={{
              headerShown:false,
              tabBarShowLabel:false,
              tabBarIcon: ({color, size}) => (
                <Image style={{width:50,height:50}} source={tabIndex == 5 ? require('../assets/img/f_menu5_on.png') : require('../assets/img/f_menu5_off.png')} />

              ),
            }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default Main;
