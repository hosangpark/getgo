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
  SafeAreaView, ScrollView, Text, View,StyleSheet, FlatList, Image,TouchableOpacity
} from 'react-native';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { ReviewList } from '../../../components/layout/ReviewList';
import { ReviewItemType } from '../../../components/types/componentType'
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import client from '../../../api/client';
import LoadingIndicator from '../../../components/layout/Loading';
import { useSelector } from 'react-redux';
import cusToast from '../../../components/navigation/CusToast';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */






const ReviewSale = ({items,ReviewCount,Remove,rt_type}:{items:any,ReviewCount:number,Remove:(e:number)=>void,rt_type:string}) => {
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const {t} = useTranslation()
  
  const userInfo = useSelector((state:any) => state.userInfo);
  
  const [reviewData,setReviewData] = useState<ReviewItemType[]>([])

  const deleteReview = async(target:ReviewItemType) => {
    Alert.alert(
      t('후기를 삭제하시겠습니까?'),
      '',
      [
        {text: t('삭제'), onPress: async() => {
          await client({
            method: 'get',
            url: `/user/reviews-received?rt_idx=${target}`,
            }).then(
              res=>{
                const remove = reviewData.filter((item:ReviewItemType) => item.rt_idx !== target.rt_idx)
                setReviewData(remove)
                cusToast(t(res.data.message))
                navigation.goBack()
              }
            ).catch(
              err=>console.log(err)
          )
        }, style:'cancel'},
        {
          text: t('취소'),
          onPress: () => {
            console.log('d')
          },
          style: 'destructive',
        },
      ]
    )
    
  };

  const [listmodal, setListmodal] = useState({})
  const Toggle = (e:number)=>{
    setListmodal(e)
    if(e == listmodal){
      setListmodal(false)
    }
  }
  
    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
            <ScrollView style={{paddingHorizontal:20}}>
                <View style={{flexDirection:'row',paddingVertical:20}}>
                  <Image style={{width:22,height:22,marginRight:7}} source={require('../../../assets/img/ico_review.png')}/>
                  <Text style={[style.text_b,{fontSize:17,color:colors.BLACK_COLOR_2,marginRight:5}]}>
                  {t('판매자 후기')}
                  </Text>
                  <Text style={[style.text_b,{fontSize:17,color:colors.GREEN_COLOR_3}]}>
                    {ReviewCount}
                  </Text>
                </View>
                {items == undefined ?
                  <LoadingIndicator/>
                :
                <View>
                  {items.map((item:any)=>{
                  return(
                    <ReviewList key={item.rt_idx} item={item} deleteReview={deleteReview} Toggle={Toggle} 
                    listmodal={listmodal} setListmodal={setListmodal}/>
                    )
                  })}
                  <View style={{height:80}}></View>
                </View>
                }
            </ScrollView>
        </SafeAreaView>
    );
};

export default ReviewSale;
