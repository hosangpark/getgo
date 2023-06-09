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
  SafeAreaView, ScrollView, Text, View, StyleSheet, FlatList, Image, TouchableOpacity
} from 'react-native';

import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { BackHeader } from '../../../components/header/BackHeader'
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import Api, { NodataView } from '../../../api/Api';
import { useDispatch, useSelector } from 'react-redux';
import cusToast from '../../../components/navigation/CusToast';
import {
  ChoiceType,
  OptionType,
  Reserve_SelectBoxType,
} from '../../../components/types/componentType';
import { CustomButton } from '../../../components/layout/CustomButton';



/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */



type Props = StackScreenProps<MainNavigatorParams, 'Reserve_choice'>
const Reserve_choice = ({ route }: Props) => {
  const { t, i18n } = useTranslation()

  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const [loading, setLoading] = useState(false)
  const userInfo = useSelector((state: any) => state.userInfo);
  const [reserve_user_data, setreserve_user_data] = React.useState<any>([]);

  //기본값은 예약자 선택
  const type = 'reserveChat'
  const pt_idx = route?.params?.target?.id ?? '';
  const pt_sale_now = route?.params?.pt_sale_now ?? '3';

  // const Chat = async (item: any) => {

  //   await client({
  //     method: 'get',
  //     url: `/product/chat-rev?room_idx=${item.room_id}&mt_idx=${userInfo.idx}`,
  //   }).then(res => {

  //     setLoading(false);

  //     console.log('Chat', res.data);
  //     // cusToast(t('예약되었습니다.'))
  //     navigation.replace('MessageRoom', { items: { room_id: res.data.room_idx }, type: 'reserveChat' })
  //   })
  //     .catch(err => console.log(err))
  // }

  const Complete = ()=>{
    Alert.alert(t('거래대상 없이 거래완료 하시겠습니까?'),'',[{
      text:t('확인'),
      onPress:()=>ReserveSelect(0)
    },{
      text:t('취소'),
      onPress:()=>{}
    }
  ])
  }

  /** 상품 판매상태변경 */
  const ReserveSelect = async (mt_idx: any) => {
    await client({
      method: 'post',
      url: '/product/product_status',
      data: mt_idx !== 0? {
        pt_idx:pt_idx,
        pt_sale_now:pt_sale_now,
        mt_idx:mt_idx
      }:{
        pt_idx:pt_idx,
        pt_sale_now:pt_sale_now,
      }
    })
      .then(res => {
        cusToast(t(res.data.message));
        navigation.goBack()
      })
      .catch(err => console.log(err));
  };

  const getReserveData = async () => {
    await client({
      method: 'get',
      url: `/product/product-chat-list?pt_idx=${route.params.target.id}`,
    }).then(res => {
      setreserve_user_data(res.data)
      setLoading(false)
    })
      .catch(err => console.log(err))
  };

  /** 채팅예약자 리스트 가져오기 */
  React.useEffect(() => {
    setLoading(true)
    getReserveData();

    console.log('route.params.target.image', route.params.target.image);
  }, []);
  React.useEffect(() => {
   console.log('route.params',route.params)
  }, []);

  return (
    <SafeAreaView style={[style.default_background, { flex: 1 }]}>
      <BackHeader title={t('예약자 선택')} />
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ backgroundColor: colors.GREEN_COLOR_4, padding: 20, flexDirection: 'row', marginBottom: 5, borderRadius: 10 }}>
          {route.params && route.params.target && route.params.target.image ? <Image
            style={{ width: 44, height: 44, marginRight: 8, borderRadius: 5 }}
            source={{ uri: Api.state.imageUrl + route.params.target.image }} /> : null}
          <View style={{ justifyContent: 'center', flex: 1 }}>
            <Text style={[style.text_re, { color: colors.GREEN_COLOR_2 }]} >
              {t('거래할 상품')}</Text>
            <Text
              style={[style.text_b, { color: colors.BLACK_COLOR_1, }]} ellipsizeMode="tail" numberOfLines={1}>
              {route.params.target.title}</Text>
          </View>
        </View>
        <FlatList data={reserve_user_data}

          ListEmptyComponent={<NodataView />}
          renderItem={({ item }) =>
            <View key={item.mt_idx}
              style={{ flexDirection: 'row', minHeight: 77, alignItems: 'center',}}
            >
              <View style={{ flexDirection: 'row' }}>
                <Image source={
                  item.mt_image1 ?
                    { uri: Api.state.imageUrl + item.mt_image1 }
                    :
                    require('../../../assets/img/img_profile.png')
                } borderRadius={100} style={{ width: 40, height: 40,marginRight: 12, }} />
                <View style={{flex:1,flexShrink:1}}>
                  <Text style={[style.text_sb, { fontSize: 15, color: colors.BLACK_COLOR_1}]}>
                    {item.mt_nickname}
                  </Text>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={[style.text_re, { fontSize: 13, color: colors.GRAY_COLOR_2 }]}>
                      {item.mt_area} {item.crt_last_date == null ? '' : '/'+(item.crt_last_date)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={{
                  width: 85, height: 40, justifyContent: 'center',
                  alignItems: 'center', backgroundColor: colors.BLUE_COLOR_1, borderRadius: 5,
                }}
                  onPress={() => ReserveSelect(item.mt_idx)}
                >
                  <Text style={[style.text_sb, { color: colors.WHITE_COLOR }]}>{t('예약자 선택')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          } />
          {reserve_user_data.length == 0 &&
          <CustomButton
            buttonType='green'
            action={Complete}
            disable={false}
            title={t('거래완료')}
          />
          }

      </View>
      <BackHandlerCom />
    </SafeAreaView>
  );
};

export default Reserve_choice;
