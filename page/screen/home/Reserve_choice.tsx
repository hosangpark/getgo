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
  SafeAreaView, ScrollView, Text, View,StyleSheet, FlatList, Image, TouchableOpacity
} from 'react-native';

import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import {BackHeader} from '../../../components/header/BackHeader'
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp,StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { foramtDate } from '../../../components/utils/funcKt';





/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */



type Props = StackScreenProps<MainNavigatorParams, 'Reserve_choice'>
const Reserve_choice = ({route}:Props) => {
  const {t} = useTranslation()

  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const [loading,setLoading] = useState(false)
  const [reserve_user_data,setreserve_user_data] = React.useState<any>([]);

    const Chat = (items:any)=>{
      // navigation.navigate('MessageRoom', {items, type:'reserveChat'})
    }

    const getReserveData = async () => {
      await client({
        method: 'get',
        url: `/product/product-chat-list?pt_idx=${route.params.target.id}`,
        }).then(res=>{
          setreserve_user_data(res.data)
          setLoading(false)
        })
        .catch(err=>console.log(err))
    };

    /** 채팅예약자 리스트 가져오기 */
    React.useEffect(() => {
      setLoading(true)
      getReserveData();
    }, []);
  
    return (
        <SafeAreaView style={[style.default_background ,{flex:1}]}>
          <BackHeader title={t('예약자 선택')}/>
          <View style={{paddingHorizontal:20}}>
            <View style={{backgroundColor:colors.GREEN_COLOR_4, padding:20, flexDirection:'row', marginBottom:5, borderRadius:10}}>
              <Image 
              style={{width:44, height:44, marginRight:8, borderRadius:5}}
              source={{uri:'http://ec2-13-125-251-68.ap-northeast-2.compute.amazonaws.com:4000/uploads/'+route.params.target.image}}/>
              <View style={{justifyContent:'center',width:280}}>
                <Text style={[style.text_re, {color:colors.GREEN_COLOR_2}]}>
                {t('거래할 상품')}</Text>
                <Text numberOfLines={1}
                style={[style.text_b, {color:colors.BLACK_COLOR_1}]}>
                 {route.params.target.title}</Text>
              </View>
            </View>
            <FlatList data={reserve_user_data}
            renderItem={({item}) => 
                <View key={item.mt_idx}
                style={{flexDirection:'row',justifyContent:'space-between',height:77,alignItems:'center'}}
                >
                  <View style={{flexDirection:'row'}}>
                      <View style={{marginRight:12,justifyContent:'center', alignItems:'center'}}>
                        <Image source={
                          item.mt_image1?
                          {uri:'http://ec2-13-125-251-68.ap-northeast-2.compute.amazonaws.com:4000/uploads/'+item.mt_image1}
                          :
                          require('../../../assets/img/img_profile.png')
                        } borderRadius={100} style={{width:40,height:40}} />
                      </View>
                      <View>
                        <Text style={[style.text_sb, {fontSize:15,color:colors.BLACK_COLOR_1}]}>
                          {item.mt_nickname}</Text>
                        <View style={{flexDirection:'row'}}>
                          <Text style={[style.text_re, {fontSize:13,color:colors.GRAY_COLOR_2}]}>
                            {item.mt_area} / {item.crt_last_date == null? '': foramtDate(item.crt_last_date) }
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View>
                      <TouchableOpacity style={{width:85, height:36 ,justifyContent:'center', 
                      alignItems:'center', backgroundColor:colors.BLUE_COLOR_1,borderRadius:5}}
                      onPress={()=>Chat(item)}
                      >
                        <Text style={[style.text_sb, {color:colors.WHITE_COLOR}]}>{t('예약자 선택')}</Text>
                      </TouchableOpacity>
                    </View>
                </View>
                }/>
          </View>
          <BackHandlerCom />
        </SafeAreaView>
    );
};

export default Reserve_choice;
