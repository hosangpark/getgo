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
  SafeAreaView, ScrollView, Text, View,StyleSheet, FlatList, Image, Button,ActivityIndicator
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
            <View style={{paddingHorizontal:20,paddingVertical:10}}>
              <View style={{justifyContent:'center',alignItems:'center',paddingVertical:18,borderBottomWidth:1,borderBottomColor:colors.GRAY_COLOR_3}}>
                <Text style={[style.text_sb,{fontSize:18,color:colors.BLACK_COLOR_1}]}>
                  {posts.ft_title}
                </Text>
                <Text style={[style.text_re,{fontSize:13,color:colors.GRAY_COLOR_2}]}>
                  {posts.ft_title}
                </Text>
              </View>
              <Text style={[style.text_re,{paddingVertical:18, color:colors.BLACK_COLOR_2}]}>
                {posts.ft_content}
              </Text>
            </View>
            }
            <BackHandlerCom />
        </SafeAreaView>
    );
};

export default QuestionDetail;
