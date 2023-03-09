/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView, ScrollView, Text, View, Image, StyleSheet, Button, TouchableOpacity
} from 'react-native';
import style from '../../assets/style/style';
import { colors } from '../../assets/color';


import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../types/routerTypes';
import { ProductItemType } from '../types/componentType';
import { useTranslation } from 'react-i18next';
import { foramtDate, NumberComma } from '../utils/funcKt';
import Api from '../../api/Api';
import client from '../../api/client';
import cusToast from '../navigation/CusToast';
import { useSelector } from 'react-redux';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */


interface ToggleType {

}


const ProductSaledList = ({ item, Remove, Modify, getOnsaleData, getCompleteData }:
  { item: ProductItemType, Remove: (e: number) => void, Modify: (e: number) => void, getOnsaleData: (e: any) => void, getCompleteData: (e: any) => void }) => {
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  const userInfo = useSelector((state: any) => state.userInfo);

  const Itempost = () => {
    if (item.pt_idx) {
      navigation.navigate('Itempost', { pt_idx: item.pt_idx });
    } else {
      // navigation.navigate('Itempost',{pt_idx:item.ot_idx});
      console.log(item)
    }
    // 
  }

  const SendReview = () => {
    navigation.navigate('SendReview', {item})
  }
  const ReviewDetail = (rt_idx:number) => {
    navigation.navigate('ReviewDetail', { rt_idx: rt_idx })
  }
  const Action1 = () => {
    console.log('판매중')

    ReserveSelect(item.pt_idx, 1);

  }
  const Action2 = () => {
    console.log('예약중')
    ReserveSelect(item.pt_idx, 2);

  }
  const Action3 = () => {
    console.log('거래완료')

    // ReserveSelect(item.pt_idx, '3');

    navigation.navigate('Reserve_choice', {
      target: {
        id: item.pt_idx,
        image: item.pt_image1,
        title: item.pt_title,
      }, type: 'Complete'
    });
    return;

  }

  /** 상품 판매상태변경 */
  const ReserveSelect = async (pt_idx:number, pt_sale_now:number) => {
    if (!pt_idx || !pt_sale_now) return;


    await client({
      method: 'post',
      url: '/product/product_status',
      data: {
        pt_idx: pt_idx,
        pt_sale_now: pt_sale_now,
      },
    })
      .then(res => {
        cusToast(t(res.data.message));
        if (typeof getOnsaleData == 'function') getOnsaleData();
        if (typeof getCompleteData == 'function') getCompleteData();
      })
      .catch(err => console.log(err));
  };

  const ToggleAction = (target:{type:string,idx:number}) => {

    if (target.type == "modify") {
      Modify(target.idx)
    } else if (target.type == "delete") {
      Remove(target.idx)
    } else {
      console.log('에러에러')
    }
    setToggleOpen(!toggleOpen)
  }

  const [toggleOpen, setToggleOpen] = useState(false)
  const Toggle = () => {
    setToggleOpen(!toggleOpen)
    console.log(item)
  }


  return (
    <View style={{ borderBottomWidth: 2, borderBottomColor: '#D8D8D8', paddingVertical: 17, }}>
      <View style={{ flexDirection: 'row', }}>
        {item.pt_image1 ? <View style={{ marginRight: 20, flex: 3 }}>
          <TouchableOpacity onPress={Itempost}>
            <Image style={{ width: 103, height: 113, borderRadius: 10, }}
              resizeMode="cover"
              source={{ uri: Api.state.imageUrl + item.pt_image1 }} />
          </TouchableOpacity>
        </View> : null}
        <View style={{ flex: 7 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[style.text_b, {
              color: colors.GREEN_COLOR_2, backgroundColor: colors.GREEN_COLOR_1, fontSize: 12, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5
            }]}>
              {t(item.ct_name)}
            </Text>
            {toggleOpen ? (
              <View style={{
                position: 'absolute', width: 110, backgroundColor: 'white', zIndex: 2, top: -5,
                right: 30, elevation: 10, borderRadius: 5, justifyContent: 'center'
              }}>
                {item.pt_sale_now !== "3" && item.mt_seller_id == userInfo.idx ?
                  <TouchableOpacity style={{ paddingHorizontal: 20, flex: 1, justifyContent: 'center', height: 51 }}
                    onPress={() => ToggleAction({ idx: item.pt_idx, type: 'modify' })}>
                    <Text style={[style.text_me, { color: colors.BLACK_COLOR_1, fontSize: 14 }]}>
                      {t('게시글 수정')}
                    </Text>
                  </TouchableOpacity> : null}
                <TouchableOpacity style={{ paddingHorizontal: 20, flex: 1, justifyContent: 'center', height: 51 }}
                  onPress={() => ToggleAction({ idx: item.ot_idx ? item.ot_idx : item.pt_idx, type: 'delete' })}>
                  <Text style={[style.text_me, { color: colors.BLACK_COLOR_1, fontSize: 14 }]}>
                    {t('삭제')}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            <View>
              <TouchableOpacity onPress={Toggle}>
                <Image style={{ width: 30, height: 30, }} source={require('../../assets/img/top_menu.png')} />
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={Itempost}>
              <Text style={[style.text_me, { color: colors.BLACK_COLOR_2, fontSize: 15, paddingRight: 30 }]}
                numberOfLines={1}
              >
                {item.pt_title}
              </Text>
              <Text style={[style.text_li, { color: colors.GRAY_COLOR_2, fontSize: 13 }]}>
                {item.pt_area} / {foramtDate(item.pt_wdate)}
              </Text>

              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                {item.pt_sale_now == "1" ?
                  <Text style={[style.text_me, {
                    backgroundColor: colors.BLUE_COLOR_1,
                    borderRadius: 5, fontSize: 12, marginRight: 8, color: colors.WHITE_COLOR,
                    paddingVertical: 3, paddingHorizontal: 5,flexShrink:1 
                  }]}>
                    <Image style={{ width: 13, height: 13, }}
                      source={require('../../assets/img/ico_sale.png')} />
                    {t('판매중')}
                  </Text>
                  :
                  item.pt_sale_now == "2" ?
                    <Text style={[style.text_me, {
                      backgroundColor: colors.GREEN_COLOR_2,
                      borderRadius: 5, fontSize: 12, marginRight: 8, color: colors.WHITE_COLOR,
                      paddingVertical: 3, paddingHorizontal: 5,flexShrink:1 
                    }]}>
                      <Image style={{ width: 13, height: 13, }}
                        source={require('../../assets/img/ico_time.png')} />
                      {t('예약중')}
                    </Text>
                    :
                    <Text style={[style.text_me, {
                      backgroundColor: colors.GRAY_COLOR_4,
                      borderRadius: 5, fontSize: 12, marginRight: 8, color: colors.WHITE_COLOR,
                      paddingVertical: 3, paddingHorizontal: 5,flexShrink:1 
                    }]}>
                      <Image style={{ width: 13, height: 13, }}
                        source={require('../../assets/img/ico_time.png')} />
                      {t('거래완료')}
                    </Text>
                }
                <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_2,flexShrink:1 }]}>
                  ￦ {NumberComma(item.pt_selling_price)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'flex-end', }}>
            <View style={{ flexDirection: 'row', }}>
              <Image style={{ width: 15, height: 15, marginRight: 4, marginLeft: 8 }} source={require('../../assets/img/ico_view.png')} />
              <Text style={[style.text_li, { color: colors.GRAY_COLOR_2, fontSize: 12 }]}>
                {item.pt_hit}
              </Text>
              <Image style={{ width: 15, height: 15, marginRight: 4, marginLeft: 8 }} source={require('../../assets/img/ico_comment.png')} />
              <Text style={[style.text_li, { color: colors.GRAY_COLOR_2, fontSize: 12 }]}>
                {item.pt_chat}
              </Text>
              <Image style={{ width: 15, height: 15, marginRight: 4, marginLeft: 8 }} source={require('../../assets/img/ico_book2.png')} />
              <Text style={[style.text_li, { color: colors.GRAY_COLOR_2, fontSize: 12 }]}>
                {item.pt_wish}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {item.pt_sale_now == "3" ?
        <View style={{ flexDirection: 'row', height: 44, justifyContent: 'space-between', marginTop: 15 }}>
          {!item.rt_idx ?
            <TouchableOpacity style={{
              flex: 1, borderWidth: 1, borderColor: colors.GRAY_COLOR_3,
              justifyContent: 'center', alignItems: 'center', borderRadius: 5
            }}
              onPress={SendReview}
            >
              <Text style={[style.text_sb, { fontSize: 15, color: colors.BLACK_COLOR_2 }]}>
                {t('후기 보내기')}
              </Text>
            </TouchableOpacity>
            :
            <TouchableOpacity style={{
              flex: 1, borderWidth: 1, borderColor: colors.GRAY_COLOR_3,
              justifyContent: 'center', alignItems: 'center', borderRadius: 5
            }}
              onPress={() => ReviewDetail(item.rt_idx)}
            >
              <Text style={[style.text_sb, { fontSize: 15, color: colors.BLACK_COLOR_2 }]}>
                {t('보낸 후기 보기')}
              </Text>
            </TouchableOpacity>}
        </View>
        :
        <View style={{ flexDirection: 'row', height: 44, justifyContent: 'space-between', marginTop: 15 }}>
          {item.pt_sale_now == "1" ?
            <TouchableOpacity onPress={Action2}
              style={{
                flex: 1, borderWidth: 1, borderColor: colors.GRAY_COLOR_3,
                justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginRight: 10
              }}>
              <Text style={[style.text_sb, { fontSize: 15, color: colors.BLACK_COLOR_2 }]}>
                {t('예약중')}
              </Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={Action1}
              style={{
                flex: 1, borderWidth: 1, borderColor: colors.GRAY_COLOR_3,
                justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginRight: 10
              }}>
              <Text style={[style.text_sb, { fontSize: 15, color: colors.BLACK_COLOR_2 }]}>
                {t('판매중')}
              </Text>
            </TouchableOpacity>
          }
          <TouchableOpacity onPress={Action3}
            style={{
              flex: 1, borderWidth: 1, borderColor: colors.GRAY_COLOR_3,
              justifyContent: 'center', alignItems: 'center', borderRadius: 5
            }}>
            <Text style={[style.text_sb, { fontSize: 15, color: colors.BLACK_COLOR_2 }]}>
              {t('거래완료')}
            </Text>
          </TouchableOpacity>
        </View>
      }
    </View>
  );
};

export default ProductSaledList;

