/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import style from '../../assets/style/style';
import {colors} from '../../assets/color';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainNavigatorParams} from '../types/routerTypes';
import {ProductItemType} from '../types/componentType';
import {color} from 'native-base/lib/typescript/theme/styled-system';
import {foramtDate, NumberComma} from '../utils/funcKt';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import client from '../../api/client';
import cusToast from '../navigation/CusToast';
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const ProductItem = ({
  item, action
}: {
  item: ProductItemType;
  action:()=>void
}) => {
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const userInfo = useSelector((state:any) => state.userInfo);
  const [hearton,setHearton] = React.useState(false)
  const Itempost = (pt_idx:any) => {
    navigation.navigate('Itempost',{pt_idx:pt_idx});
  };

  const {t} = useTranslation()


  const AddHeart = async(target:number)=>{
    await client({
      method: 'post',
      url: '/product/add_like',
      data:{
        pt_idx : target,
        mt_idx : userInfo.idx,
        area_show : "Y"
        }
      }).then(res=>{
        cusToast(t(res.data.message))
        setHearton(true)
        action()
        }
      ).catch(error=>{
        cusToast("이미 등록된 상품입니다")
        // console.log(error);
        // setHearton(!hearton)
        setHearton(false)
        
      })
  }

  const DeleteHeart = async(target:number)=>{
    await client({
      method: 'get',
      url: `/product/add_like_delete`,
      params:{
        wp_idx:target,
        }
      }).then(res=>{
        cusToast(t(res.data.message))
        setHearton(!hearton)
        action()
        }
      ).catch(error=>{
        console.log(error);
      })
  }
  
    /** 관심상품 등록&제거 */
  const heartOnOff = async(target:any)=>{
    console.log(item.wish_cnt)
    console.log(target)
    if(target.wp_idx == undefined){
      AddHeart(target.pt_idx)
    } else {
      DeleteHeart(target.wp_idx)
    }    
  }


  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.GRAY_LINE,
        flex: 1,
      }}>
      <TouchableOpacity onPress={()=>Itempost(item.pt_idx)}>
        <Image
          style={{width: 103, height: 113, borderRadius: 10}}
          resizeMode="cover"
          source={{uri:'http://ec2-13-125-251-68.ap-northeast-2.compute.amazonaws.com:4000/uploads/'+item.pt_image1}}
        />
      </TouchableOpacity>
      <View style={{marginLeft: 20, justifyContent: 'space-between', flex: 1}}>
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={[
                style.text_b,
                {
                  color: colors.GREEN_COLOR_2,
                  backgroundColor: colors.GREEN_COLOR_1,
                  fontSize: 12,
                  paddingHorizontal: 6,
                  paddingVertical: 3,
                  borderRadius:3,
                },
              ]}>
              {t(item.ct_name)}
            </Text>
            <TouchableOpacity onPress={() => heartOnOff({
                wp_idx:item.wp_idx,
                pt_idx:item.pt_idx,
                wish_cnt:item.wish_cnt
            })}>
              <Image
                style={{width: 25, height: 22}}
                source={
                  item.wish_cnt == 0 && hearton==false?
                     require('../../assets/img/ico_book.png')
                    : require('../../assets/img/ico_book_on.png')
                  // item.wp_idx == undefined ?
                  //    require('../../assets/img/ico_book.png')
                  //   : require('../../assets/img/ico_book_on.png')
                }
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={()=>Itempost(item.pt_idx)}>
            <Text
              style={[style.text_me, {color: colors.BLACK_COLOR_1, fontSize: 15,marginTop:5}]}
              numberOfLines={1}>
              {item.pt_title}
            </Text>
            <Text
              style={[style.text_li, {color: colors.GRAY_COLOR_2, fontSize: 13}]}>
              {item.pt_area} / {foramtDate(item.pt_wdate)}
            </Text>
            <View
              style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
              {item.pt_sale_now && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: (item.pt_sale_now ="1" ?
                       colors.BLUE_COLOR_1
                      : item.pt_sale_now ="2"? colors.GRAY_COLOR_5: colors.GREEN_COLOR_2),
                    borderRadius: 3,
                    paddingHorizontal: 5,
                    paddingVertical: 3,
                    marginRight: 5,
                  }}>
                  <Image
                    style={{width: 10, height: 10}}
                    source={item.pt_sale_now = "1" ? require('../../assets/img/ico_sale.png') : require('../../assets/img/ico_time.png')}
                  />
                  <Text
                    style={[
                      style.text_me,
                      {marginLeft: 2, fontSize: 12, color: colors.WHITE_COLOR},
                    ]}>
                    {item.pt_sale_now = "1" ?
                    t('판매중') : 
                    item.pt_sale_now = "2" ? 
                    t('예약중') : t('거래완료')
                    }
                  </Text>
                </View>
              )}
              <Text
                style={[
                  style.text_b,
                  {fontSize: 15, color: colors.BLACK_COLOR_2},
                ]}>
                ￦ {NumberComma(item.pt_selling_price)}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{alignItems: 'flex-end',marginTop:3}}>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={{width: 15, height: 15, marginRight: 4, marginLeft: 8}}
                source={require('../../assets/img/ico_view.png')}
              />
              <Text
                style={[
                  style.text_li,
                  {color: colors.GRAY_COLOR_2, fontSize: 12},
                ]}>
                {item.pt_hit}
              </Text>
              <Image
                style={{width: 15, height: 15, marginRight: 4, marginLeft: 8}}
                source={require('../../assets/img/ico_comment.png')}
              />
              <Text
                style={[
                  style.text_li,
                  {color: colors.GRAY_COLOR_2, fontSize: 12},
                ]}>
                {item.pt_chat}
              </Text>
              <Image
                style={{width: 15, height: 15, marginRight: 4, marginLeft: 8}}
                source={require('../../assets/img/ico_book2.png')}
              />
              <Text
                style={[
                  style.text_li,
                  {color: colors.GRAY_COLOR_2, fontSize: 12},
                ]}>
                {item.pt_wish}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProductItem;
