/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState, useEffect} from 'react';
import {
    Alert,
  SafeAreaView, ScrollView, Text, View,StyleSheet, FlatList, Image, Keyboard
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../../assets/style/style';

import {BackHeader} from  '../../../components/header/BackHeader'
import { colors } from '../../../assets/color';
import { CustomButton } from '../../../components/layout/CustomButton';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import { useSelector } from 'react-redux';
import cusToast from '../../../components/navigation/CusToast';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */




const KeywordSetting = () => {
  const {t} = useTranslation()
  const userInfo = useSelector((state:any) => state.userInfo);
  const [text, setText] = useState<any>('')
  const [textInputs, settextInput] = React.useState<any>([])
  const [MaxTextCount,setMaxTextCount] = React.useState<number>(0)
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  const InputValue = () => {
    if (text == ''){
      cusToast('입력내용이 없습니다.')
    } else if (MaxTextCount < 30) {
      keywordAdd()
      setText('')
    } else {
      cusToast('더 이상 키워드를 추가할 수 없습니다.')
    }
    Keyboard.dismiss()
  }
const keywordList = async() =>{
  await client({
    method: 'get',
    url: '/user/push_keyword_list',
    params:{
      mt_idx:userInfo.idx
    }
    }).then(
      res=>{
        console.log('rrr:',res.data)
        settextInput(res.data.list)
        setMaxTextCount(res.data.total_count)
      }
    ).catch(
      err=>console.log('keywordList')
    )
  };
const keywordAdd = async() =>{
  await client({
    method: 'post',
    url: '/product/push_keyword_add',
    data:{
      slt_txt : text,
      mt_idx : userInfo.idx
      // mt_idx : userInfo.idx
    }
    }).then(
      res=>{
        cusToast(res.data.message)
        keywordList()
      }
    ).catch(
      err=>console.log('keywordAdd')
    )
  };
const keywordDelete = async(item:number) =>{
  await client({
    method: 'get',
    url: `/user/push_keyword_delete?pt_idx=${item}`,
    params:{
      pkt_idx:item
    }
    }).then(
      res=>{
        cusToast(t(res.data.message))
        keywordList()
      }
    ).catch(
      err=>console.log('keywordDelete')
    )
  };

  React.useEffect(()=>{
      keywordList;
      navigation.addListener('focus',()=>{
        keywordList()
      })
  },[])


    return (
        <SafeAreaView style={[style.default_background,{flex:1, position:'relative'}]}>
        <BackHeader title={t('알림 키워드 설정')}/>
          <View style={{marginHorizontal:20,marginTop:20}}>
            <Text style={[style.text_b,{fontSize:15,color:colors.BLACK_COLOR_2}]}>{t('등록할 키워드 입력')}</Text>
            <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:31,marginTop:6}}> 
              <View style={{flex:7}}>
                <TextInput 
                    style={style.input_container} 
                    value={text} 
                    onChangeText={text =>{setText(text)}}
                    placeholder={t('예) 자전거')}
                />
              </View>
              <View style={{flex:3,marginLeft:10}}>
                    <CustomButton 
                        buttonType='green'
                        title={t('등록')}
                        disable={false}
                        action={InputValue}
                    />
              </View>
            </View>
            <Text style={[style.text_sb,{fontSize:15,color:colors.GREEN_COLOR_2,marginBottom:14}]}>
            {t('등록한 키워드')} ({MaxTextCount? MaxTextCount:0}/ 30)
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={{flexWrap:'wrap',flexDirection:'row'}}>
                {
                  textInputs.map((item:any)=>{
                    return (
                      <View key={item.pkt_idx}
                      style={{borderWidth:1, borderColor:colors.GRAY_LINE, borderRadius:150,flexDirection:'row', justifyContent:'center',alignItems:'center',marginRight:14,marginBottom:14, paddingHorizontal:15,paddingVertical:10}}>
                        <Text style={[style.text_me, {fontSize:15,color:colors.BLACK_COLOR_1,marginRight:5}]}>
                          {item.push_keyword}
                          </Text>
                        <TouchableOpacity style={{padding:4}} onPress={()=>{
                          keywordDelete(item.pkt_idx)
                        }}>
                          <Image style={{width:12,height:12}} source={require('../../../assets/img/ico_x.png')}/>
                        </TouchableOpacity>
                      </View>
                    )
                  })
                }
              </View>
            </ScrollView>
          </View>
          <BackHandlerCom />
        </SafeAreaView>
    );
};

export default KeywordSetting;
