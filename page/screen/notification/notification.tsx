/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState} from 'react';
import {
    Alert,
  SafeAreaView, ScrollView, Text, View,StyleSheet, FlatList, Image, TouchableOpacity,ActivityIndicator,Linking
} from 'react-native';
import style from '../../../assets/style/style';
import {colors} from '../../../assets/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import { useSelector } from 'react-redux';
import LoadingIndicator from '../../../components/layout/Loading';
import { foramtDate } from '../../../components/utils/funcKt';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */




const Notification = ({Alert_datas}:any) => {
  const {t} = useTranslation()

  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  const [isLoading, setIsLoading] = useState(false);



    const CheckitemType = (item:any)=>{
      if(item.push_type == 1){
        navigation.navigate('NotificationDetail',{pst_idx:item.pst_idx})
      } else if(item.push_type == 2){
        navigation.navigate('Itempost',item.pt_idx)
      } else if(item.push_type == 3){
        navigation.navigate('ReviewDetail',{rt_idx:item.rt_idx,})
      } else if(item.push_type == 4){
        navigation.navigate('Itempost',item.pt_idx)
      } else if(item.push_type == 5){
        navigation.navigate('Itempost',item.pt_idx)
      } 
      // if(item.pst_url == null){
      //   navigation.navigate('NotificationDetail',item)
      // } else {
      //   Linking.openURL(item.pst_url)
      // }
      
    }


    return (
        <SafeAreaView style={[style.default_background]}>
          {isLoading?
          <LoadingIndicator/>
          :
          <FlatList
            data={Alert_datas} 
            ListHeaderComponent={
            <View>
            {/* <TouchableOpacity onPress={()=>navigation.navigate('NotificationDetail',item)}> */}
              <View style={{borderBottomColor:colors.GRAY_LINE,borderBottomWidth:1}}>
                <View style={{padding:20,flexDirection:'row',alignItems:'center'}}>
                  <Image source={require('../../../assets/img/ico_logo.png')} style={{borderRadius:20,width:55,height:55}} />
                  <View style={{marginLeft:15}}>
                      <Text style={[style.text_b,{fontSize:15,color:colors.BLACK_COLOR_2}]}>{t('알림제목')}</Text>
                      <Text style={[style.text_li,{fontSize:15, color:colors.BLACK_COLOR_2}]}>{t('알림내용')}</Text>
                  </View>
                </View>
              </View>
            {/* </TouchableOpacity> */}
            </View>
            }
            showsVerticalScrollIndicator={false}
            renderItem={({item})=> (
              <TouchableOpacity key={item.pst_idx}
              onPress={()=> CheckitemType(item)}>
                <View style={{borderBottomWidth:1,borderBottomColor:colors.GRAY_COLOR_3,paddingHorizontal:20,
                paddingVertical:21
                }}>
                  <Text style={[style.text_me,{color:colors.GREEN_COLOR_2,fontSize:13}]}>{t(item.pst_title)}</Text>
                  <Text style={[style.text_me,{color:colors.BLACK_COLOR_2,fontSize:15}]}>{t(item.pst_content)}</Text>
                  <Text style={[style.text_li,{color:colors.GRAY_COLOR_2,fontSize:13}]}>{foramtDate(item.pst_wdate)}</Text>
                </View>
              </TouchableOpacity>
          )} 
          />

      }
        </SafeAreaView>
    );
};

export default Notification;
