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
  SafeAreaView, ScrollView, Text, View,StyleSheet, FlatList, Image
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHeader } from '../../../components/header/BackHeader'
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */




const Announce = () => {
  const {t} = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  const [AnnounceData, setAnnounceData] = useState([])

  React.useEffect(() => {
    const getData = async () => {
      await client<any[],any>({
        method: 'get',
        url: '/customer/notice-list',
        }).then(
          res=>
            setAnnounceData(res.data)
        ).catch(
          err=>console.log(err)
        )
      };
    getData();
  }, []);

    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <BackHeader title={t('공지사항')}/>
            <FlatList data={AnnounceData}
              showsVerticalScrollIndicator={false}
              renderItem={({item}:any)=>(
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center',
                paddingVertical:20,borderBottomWidth:1,borderBottomColor:colors.GRAY_COLOR_3,paddingHorizontal:20,}}
                onPress={()=>{navigation.navigate('SettingAnnounceDetail',{
                  id : item.nt_idx,
                })}}>
                  <View>
                    <Text style={[style.text_sb,{fontSize:15,color:colors.BLACK_COLOR_1,paddingRight:70}]}>
                      {/* [{t(item.titletype)}]   */}
                      {item.nt_title}
                    </Text>
                    <Text style={[style.text_re,{fontSize:13,color:colors.GRAY_COLOR_2,marginTop:4}]}>
                      {item.nt_wdate}
                    </Text>
                  </View>
                  <Image 
                  style={{width:7,height:12,position:'absolute',right:25}}
                  source={require('../../../assets/img/arrow4_r.png')}/>
                </TouchableOpacity>
              )}
            />
            <BackHandlerCom />
        </SafeAreaView>
    );
};

export default Announce;
