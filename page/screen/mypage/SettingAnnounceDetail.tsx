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
  SafeAreaView, ScrollView, Text, View,StyleSheet, FlatList, Image,Button
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp,StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHeader } from '../../../components/header/BackHeader'
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import client from '../../../api/client';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

interface data {
  nt_title:string,
  nt_wdate:string,
  nt_content:string
}

type Props = StackScreenProps<MainNavigatorParams, 'SettingAnnounceDetail'>

const AnnounceDetail = ({route}:Props) => {

  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  const Detail = route.params

  const [loading,setLoading] = useState(false)
  const [AnnounceDetailData,setAnnounceDetailData] = useState<any>()


  React.useEffect(() => {
    const getData = async () => {
      await client<{data:string},any>({
        method: 'get',
        url: '/customer/notice-detail',
        params:{
          nt_idx:Detail.id,
        }
        }).then(
          res=>{
            setAnnounceDetailData(res.data.data[0])
          }
        ).catch(
          err=>console.log(err)
        )
      };
    getData();
    }, []);
    

    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <BackHeader title={'공지사항'}/>
            <View style={{paddingHorizontal:20,paddingVertical:10}}>
              <View style={{justifyContent:'center',alignItems:'center',paddingVertical:18,borderBottomWidth:1,borderBottomColor:colors.GRAY_COLOR_3}}>
                <Text style={[style.text_sb,{fontSize:18,color:colors.BLACK_COLOR_1,paddingHorizontal:15,lineHeight:26}]}>
                  {/* [{Detail.titletype}]  */}
                  {AnnounceDetailData==undefined? null: AnnounceDetailData.nt_title}
                </Text>
                <Text style={[style.text_re,{fontSize:13,color:colors.GRAY_COLOR_2}]}>
                  {AnnounceDetailData==undefined? null:AnnounceDetailData.nt_wdate}
                </Text>
              </View>
              <Text style={[style.text_re,{paddingVertical:18, color:colors.BLACK_COLOR_2,lineHeight:20}]}>
              {AnnounceDetailData==undefined? null:AnnounceDetailData.nt_content}
              </Text>
            </View>
            <BackHandlerCom />
        </SafeAreaView>
    );
};

export default AnnounceDetail;
