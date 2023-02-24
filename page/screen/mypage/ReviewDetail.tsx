import React from 'react';


import {View, ViewStyle,Text, ScrollView, SafeAreaView, useWindowDimensions,Image,Button,TouchableOpacity } from 'react-native';
import { BackHeader } from '../../../components/header/BackHeader';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { useSelector } from 'react-redux';
import client from '../../../api/client';
import { ReviewItemDetailType } from '../../../components/types/componentType';




export default function ReviewDetail({route}:any) {
  const {t} = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const userInfo = useSelector((state:any) => state.userInfo);
  const [isLoading ,  setIsLoading] = React.useState<boolean>(true);
  const [rt_type ,  setRt_type] = React.useState('');
  const [reviewDetailData,setReviewDetailData] = React.useState<ReviewItemDetailType>([])

  const getReviewDetailData = async() =>{
    await client({
      method: 'get',
      url: `/user/review_detail?rt_idx=${route.params.rt_idx}&rt_type=${route.params.rt_type}`,
      }).then(
        res=>{
          setReviewDetailData(res.data.data[0])
          setIsLoading(false)
        }
      ).catch(
        err=>console.log(err)
      )
    };
    React.useEffect(()=>{
      setIsLoading(true)
      getReviewDetailData()
    },[])
  return (
    <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
        <BackHeader title={t('보낸 후기 보기')} />
        <ScrollView style={{paddingHorizontal:20}}>
          <View style={{backgroundColor:colors.GRAY_COLOR_1,flexDirection:'row',padding:20,borderRadius:10,marginVertical:20}}>
            <Image style={{width:44,height:44,borderRadius:5,marginRight:10}} source={
              reviewDetailData.pt_image1?{
                uri:'http://ec2-13-125-251-68.ap-northeast-2.compute.amazonaws.com:4000/uploads/'+reviewDetailData.pt_image1}
                :require('../../../assets/img/ico_x.png')
            }/>
            <View style={{justifyContent:'center'}}>
              <Text style={[style.text_b,{fontSize:15,color:colors.BLACK_COLOR_1}]}>{reviewDetailData.pt_title}</Text>
              <Text style={[style.text_re,{fontSize:13,color:colors.BLACK_COLOR_1}]}>
              {t('거래한 이웃')} : {reviewDetailData.mt_nickname}</Text>
            </View>
          </View>
          <View>
            <Text style={[style.text_re,{fontSize:14,color:colors.BLACK_COLOR_1,lineHeight:22}]}>
            {reviewDetailData.rt_content}
            </Text>
          </View>
          <TouchableOpacity 
              onPress = {()=>{navigation.goBack()}}
              style={[{alignItems:'center',justifyContent:'center', height:44,borderWidth:1,borderRadius:5,borderColor:colors.GRAY_COLOR_3,marginBottom:50}]}>
              <Text style={[style.text_sb,{color:colors.BLACK_COLOR_1, fontSize:15}]}> 
              {t('거래 후기 취소하기')}
              </Text>
          </TouchableOpacity>

        </ScrollView>
    </SafeAreaView>
  );
}