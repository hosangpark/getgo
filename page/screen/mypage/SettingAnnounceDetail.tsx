/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState} from 'react';
import {
  SafeAreaView, Text, View,Linking,ScrollView
} from 'react-native';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp,StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHeader } from '../../../components/header/BackHeader'
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import client from '../../../api/client';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

interface data {
  nt_title:string,
  nt_wdate:string,
  nt_content:string
}

type Props = StackScreenProps<MainNavigatorParams, 'SettingAnnounceDetail'>

const AnnounceDetail = ({route}:Props) => {
  const {t} = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  const Detail = route.params

  const [loading,setLoading] = useState(false)
  const [AnnounceDetailData,setAnnounceDetailData] = useState<any>([])

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

  React.useEffect(() => {
    console.log(AnnounceDetailData)
    getData();
    }, []);
    

    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <BackHeader title={t('공지사항')}/>
            <ScrollView style={{paddingHorizontal:20,paddingVertical:10}}>
              <View style={{justifyContent:'center',alignItems:'center',paddingVertical:18,borderBottomWidth:1,borderBottomColor:colors.GRAY_COLOR_3}}>
                <Text style={[style.text_sb,{fontSize:18,color:colors.BLACK_COLOR_1,paddingHorizontal:15,lineHeight:26}]}>
                  {AnnounceDetailData.nt_title}
                </Text>
                <Text style={[style.text_re,{fontSize:13,color:colors.GRAY_COLOR_2}]}>
                  {AnnounceDetailData.nt_wdate}
                </Text>
              </View>
              <View style={{flex: 1}}>
                <AutoHeightWebView
                  style={{
                    width: widthPercentageToDP('100%') - 44,
                    overflow: 'hidden',
                    marginVertical: 25,
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
                  source={{html: AnnounceDetailData.nt_content}}
                  scalesPageToFit={false}
                  viewportContent={
                    'width=device-width, user-scalable=no, initial-scale=1.0'
                  }
                />
              </View>
            </ScrollView>
            <BackHandlerCom />
        </SafeAreaView>
    );
};

export default AnnounceDetail;
