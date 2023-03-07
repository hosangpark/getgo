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
  SafeAreaView, ScrollView, Text, View,Linking
} from 'react-native';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { BackHeader } from '../../../components/header/BackHeader'
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import LoadingIndicator from '../../../components/layout/Loading';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { widthPercentageToDP } from 'react-native-responsive-screen';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */



const SettingTerms = () => {
  const {t} = useTranslation()  
  const [items, setitem] = useState<any>([])

  const getData = async () => {
    await client({
      method: 'get',
      url: '/user/agreetype?agree_type=1',
      }).then(
        res=>{
          setitem(res.data[0])
      }).catch(
        err=>console.log(err)
      )
    };
   
  React.useEffect(() => {
    getData();
    }, []);
    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <BackHeader title={t('이용약관')}/>
            <ScrollView style={{paddingHorizontal:20}}>
              <View style={{flex: 1}}>
              {items == undefined?
                <LoadingIndicator/>
                :
              <AutoHeightWebView
                style={{
                  width: widthPercentageToDP('100%') - 44,
                  overflow: 'hidden',
                  marginVertical: 25,

                  // marginHorizontal: 22,
                  minHeight: 300,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
                scrollEnabled={false}
                // onNavigationStateChange={e => {
                //   console.log('e', e);
                //   return false;
                // }}
                onShouldStartLoadWithRequest={e => {
                  console.log('eee', e);
                  if (e.url == 'about:blank') return true;
                  else {
                    Linking.openURL(e.url);
                  }
                  return false;
                }}
                // allowsLinkPreview={false}
                javaScriptEnabled={true}
                javaScriptCanOpenWindowsAutomatically={true}
                customStyle={`
                * {
                  // font-family: 'NotoSansKr';
                  font-size: 14px;
                  line-height: 20px;
                  color: '#323232';
                  word-break: break-word;
                  }
                  div {display:block;}
                  img { max-width: 100%;}
              `}
                source={{html: items.st_agree1}}
                scalesPageToFit={false}
                viewportContent={
                  'width=device-width, user-scalable=no, initial-scale=1.0'
                }
              />
              }
            </View>
            </ScrollView>
            <BackHandlerCom />
        </SafeAreaView>
    );
};

export default SettingTerms;
