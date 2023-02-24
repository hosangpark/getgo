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
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { BackHeader } from '../../../components/header/BackHeader'
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import LoadingIndicator from '../../../components/layout/Loading';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */



const SettingTerms = () => {
  const {t} = useTranslation()  
  const [items, setitem] = useState<any>([])
  const [isloading, setIsLoading] = useState(false);

  const getData = async () => {
    await client({
      method: 'get',
      url: '/user/agreetype?agree_type=1',
      }).then(
        res=>{
          setitem(res.data)
          setIsLoading(false)
      }).catch(
        err=>console.log(err)
      )
    };

   
  React.useEffect(() => {
    setIsLoading(true)
    getData();
    }, []);
    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <BackHeader title={t('이용약관')}/>
          {isloading?
          <LoadingIndicator/>
            :
            <ScrollView style={{paddingHorizontal:20}}>
              <Text style={[style.text_b,{fontSize:13,color:colors.BLACK_COLOR_1,paddingTop:30,paddingBottom:20}]}>제 1조(목적)</Text>
              <Text style={[style.text_re,{fontSize:15,color:colors.BLACK_COLOR_1}]}>
             {/* {items[0] == undefined?  'd' :items[0].st_agree1} */}
              </Text>
            </ScrollView>
          }
            <BackHandlerCom />
        </SafeAreaView>
    );
};

export default SettingTerms;
