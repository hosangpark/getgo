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
  SafeAreaView, ScrollView, Text, View,StyleSheet, FlatList, Image, Button,ActivityIndicator,Linking
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp,StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { AnnounceDataType } from '../../../components/types/componentType';
import { QuestionHeader } from '../../../components/header/QuestionHeader'
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { widthPercentageToDP } from 'react-native-responsive-screen';



/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

interface QuestionDetailType {
  ft_title:string,
  ft_content:string
}

type Props = StackScreenProps<MainNavigatorParams, 'QuestionDetail'>
const QuestionDetail = ({route}:Props) => {
  const {t} = useTranslation()
  // const routeId = route.params
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  // const value = useSelector(state => state.count)
  const [posts, setPosts] = React.useState<QuestionDetailType>();

  React.useEffect(() => {
    const getData = async () => {
        await client({
          method: 'get',
          url: '/customer/faq-detail',
          params:{
            ft_idx:route.params.id
          }
          }).then(
            res=>
            setPosts(res.data.data[0])
          ).catch(
            err=>console.log(err)
          )
        };
      getData()
  }, []);

    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <QuestionHeader title={t('자주 묻는 질문')} subtitle={t('목록')} action={()=>navigation.goBack()}/>
            {posts == undefined?
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <ActivityIndicator color={'#00C379'} size={'large'}/> 
            </View>
            :
            <ScrollView style={{paddingHorizontal:20,paddingVertical:10}}>
              <View style={{justifyContent:'center',alignItems:'center',paddingVertical:18,borderBottomWidth:1,borderBottomColor:colors.GRAY_COLOR_3}}>
                <Text style={[style.text_sb,{fontSize:18,color:colors.BLACK_COLOR_1}]}>
                  {posts.ft_title}
                </Text>
                <Text style={[style.text_re,{fontSize:13,color:colors.GRAY_COLOR_2}]}>
                  {posts.ft_title}
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
                  source={{html: `<p style="font-weight: 400;font-style: normal;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;">Tags are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. <span style="background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));">If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn’t only tag the piece with “moving”. I’d also use the tags “pets”, “marriage”, “career change”, and “travel tips”.</span></p><p style="font-weight: 400;font-style: normal;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;">Tags are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. <span style="background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));">If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn’t only tag the piece with “moving”. I’d also use the tags “pets”, “marriage”, “career change”, and “travel tips”.</span></p><p style="font-weight: 400;font-style: normal;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;">Tags are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. <span style="background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));">If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn’t only tag the piece with “moving”. I’d also use the tags “pets”, “marriage”, “career change”, and “travel tips”.</span></p>`}}
                  scalesPageToFit={false}
                  viewportContent={
                    'width=device-width, user-scalable=no, initial-scale=1.0'
                  }
                />
              </View>
            </ScrollView>
            }
            <BackHandlerCom />
        </SafeAreaView>
    );
};

export default QuestionDetail;
