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
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Button,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { ItemPostHeader } from '../../../components/header/ItemPostHeader';
import {
  ChoiceType,
  OptionType,
  Reserve_SelectBoxType,
} from '../../../components/types/componentType';
import { SelectBox } from '../../../components/layout/SelectBox';
import SwiperSlide from '../../../components/layout/SwiperSlide';
import { ProfileBottomModal } from '../../../components/modal/ProfileBottomModal';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { foramtDate, NumberComma } from '../../../components/utils/funcKt';
import client from '../../../api/client';
import { useDispatch, useSelector } from 'react-redux';
import LoadingIndicator from '../../../components/layout/Loading';
import cusToast from '../../../components/navigation/CusToast';
import { useTranslation } from 'react-i18next';

type Props = StackScreenProps<MainNavigatorParams, 'Itempost'>;
const Itempost = ({ route }: Props) => {
  const userInfo = useSelector((state: any) => state.userInfo);
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  const { t } = useTranslation();

  const [selectReserve, setSelReserve] = React.useState<OptionType>({
    label: t('상태변경'),
    value: '예약상태변경',
    sel_id: 0,
  });
  const [ReserveOptions] = React.useState([
    { label: t('판매중'), value: '판매중', sel_id: 1 },
    { label: t('예약중'), value: '예약중', sel_id: 2 },
    { label: t('거래완료'), value: '거래완료', sel_id: 3 },
  ]);

  const [isloading, setIsLoading] = useState(false);
  const [profileToggle, setProfileToggle] = React.useState(false);

  /** 내가올린 게시글이면 수정버튼 보이기 */
  const [myProduct, setmyProduct] = useState(false);

  const SHOWLOG = () => {
    console.log('share');
    console.log(profileToggle);
  };
  const ReportPost = (target: number) => {
    navigation.navigate('ReportPost', { mt_declaration_idx: target });
  };
  const gofullscreen = () => {
    navigation.navigate('ItempostFullSlide', filterslideImage);
  };

  /** default 상품상태 */
  const [items, setitem] = useState<any>({
    data: [
      {
        pt_idx: 0,
        ct_name: '',
        pt_wdate: new Date(),
        pt_selling_price: 0,
        mt_seller_idx: 0,
      },
    ],
  });

  const [filterslideImage, setfilterslideImage] = React.useState<any>([]);

  const getPostData = async () => {
    await client<any>({
      method: 'get',
      url: `/product/procudt-detail`,
      params: {
        pt_idx: route.params.pt_idx,
        mt_idx: userInfo.idx,
      },
    })
      .then(res => {
        setitem(res.data);
        setfilterslideImage(res.data.image_arr);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  /** 상품 예약자 선택 & 자기상품 아닐시 예약전송 */
  const Reserve_choice = async (target: ChoiceType) => {
    if (userInfo.idx == items.data[0].mt_seller_idx) {
      navigation.navigate('Reserve_choice', { target });
    } else {
      await client({
        method: 'post',
        url: '/product/chat_add',
        data: {
          mt_idx: userInfo.idx,
          pt_idx: items.data[0].pt_idx,
        },
      })
        .then(res => {
          console.log(res.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  /** 상품 정보 가져오기 ${route.params.pt_idx}*/
  React.useEffect(() => {
    navigation.addListener('focus', () => {
      getPostData();
    });
  }, []);

  /** 관심상품 등록 */
  const heartOn = async (e: number) => {
    await client<{ data: string; message: string }>({
      method: 'post',
      url: '/product/add_like',
      data: {
        pt_idx: items.data[0].pt_idx,
        mt_idx: userInfo.idx,
        area_show: 'Y',
      },
    })
      .then(res => {
        cusToast(t(res.data.message));
      })
      .catch(error => {
        console.log(error);
      });
  };

  /** 상품 판매상태변경 */
  const ReserveSelect = async (item: OptionType) => {
    await client({
      method: 'post',
      url: '/product/product_status',
      data: {
        pt_idx: items.data[0].pt_idx,
        pt_sale_now: item.sel_id,
      },
    })
      .then(res => {
        cusToast(t(res.data.message));
        setSelReserve(item);
        getPostData();
      })
      .catch(err => console.log(err));
  };

  // items.data[0].mt_seller_idx
  React.useEffect(() => {
    if (userInfo.idx == items.data[0].mt_seller_idx) {
      setmyProduct(true);
    } else {
      setmyProduct(false);
    }
  }, [items]);

  return (
    <SafeAreaView style={[style.default_background, { flex: 1 }]}>
      <ItemPostHeader myProduct={myProduct} pt_idx={items.data[0].pt_idx} />
      <ScrollView>
        {isloading ? <LoadingIndicator /> : null}
        {filterslideImage.length ? (
          <SwiperSlide
            gofullscreen={gofullscreen}
            imageheight={410}
            SlideImage={filterslideImage}
          />
        ) : null}
        <View style={{ marginVertical: 24, marginHorizontal: 20 }}>
          {myProduct && (
            <View style={{ width: 100, height: 20, marginBottom: 12 }}>
              <SelectBox
                selOption={selectReserve}
                options={ReserveOptions}
                action={ReserveSelect}
                height={0}
                paddingVertical={7}
                overScrollEnable={() => { }}
              />
            </View>
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              {items.data[0].pt_sale_now == 1 && (
                <Text
                  style={[
                    style.text_me,
                    {
                      backgroundColor: colors.BLUE_COLOR_1,
                      borderRadius: 5,
                      color: colors.WHITE_COLOR,
                      marginRight: 7,
                      paddingVertical: 3,
                      paddingHorizontal: 6,
                      fontSize: 12,
                    },
                  ]}>
                  <Image
                    style={{ width: 13, height: 13 }}
                    source={require('../../../assets/img/ico_sale.png')}
                  />
                  {t('판매중')}
                </Text>
              )}
              {items.data[0].pt_sale_now == 2 && (
                <Text
                  style={[
                    style.text_me,
                    {
                      backgroundColor: colors.GREEN_COLOR_2,
                      borderRadius: 5,
                      color: colors.WHITE_COLOR,
                      marginRight: 7,
                      paddingVertical: 3,
                      paddingHorizontal: 6,
                      fontSize: 12,
                    },
                  ]}>
                  <Image
                    style={{ width: 13, height: 13 }}
                    source={require('../../../assets/img/ico_time.png')}
                  />
                  {t('예약중')}
                </Text>
              )}
              {items.data[0].pt_sale_now == 3 && (
                <Text
                  style={[
                    style.text_me,
                    {
                      backgroundColor: colors.GRAY_COLOR_5,
                      borderRadius: 5,
                      fontSize: 12,
                      marginRight: 7,
                      color: colors.WHITE_COLOR,
                      paddingVertical: 3,
                      paddingHorizontal: 5,
                    },
                  ]}>
                  <Image
                    style={{ width: 13, height: 13 }}
                    source={require('../../../assets/img/ico_time.png')}
                  />
                  {t('거래완료')}
                </Text>
              )}
              <Text
                style={[
                  style.text_me,
                  {
                    backgroundColor: colors.GRAY_COLOR_1,
                    borderRadius: 5,
                    color: colors.GRAY_COLOR_2,
                    paddingVertical: 3,
                    paddingHorizontal: 10,
                    fontSize: 12,
                  },
                ]}>
                {t(items.data[0].ct_name)}
              </Text>
            </View>
            <TouchableOpacity onPress={SHOWLOG}>
              <Image
                style={{ width: 25, height: 25 }}
                source={require('../../../assets/img/ico_share.png')}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: colors.GRAY_COLOR_3,
              marginBottom: 20,
            }}>
            <Text
              style={[
                style.text_me,
                { fontSize: 15, color: colors.BLACK_COLOR_2, marginBottom: 4 },
              ]}>
              {items.data[0].pt_title}
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              <Text
                style={[
                  style.text_li,
                  { color: colors.GRAY_COLOR_2, fontSize: 13 },
                ]}>
                {items.data[0].pt_area} / {foramtDate(items.data[0].pt_wdate)}
              </Text>
            </View>
          </View>
          <View>
            <Text style={[style.text_li, { color: colors.BLACK_COLOR_2 }]}>
              {items.data[0].pt_content}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end', marginVertical: 25 }}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                style={{
                  width: 15,
                  height: 15,
                  marginRight: 4,
                  marginLeft: 8,
                }}
                source={require('../../../assets/img/ico_view.png')}
              />
              <Text
                style={[
                  style.text_re,
                  { fontSize: 12, color: colors.GRAY_COLOR_2 },
                ]}>
                {items.data[0].pt_hit}
              </Text>
              <Image
                style={{
                  width: 15,
                  height: 15,
                  marginRight: 4,
                  marginLeft: 8,
                }}
                source={require('../../../assets/img/ico_comment.png')}
              />
              <Text
                style={[
                  style.text_re,
                  { fontSize: 12, color: colors.GRAY_COLOR_2 },
                ]}>
                {items.data[0].pt_chat}
              </Text>
              <Image
                style={{
                  width: 15,
                  height: 15,
                  marginRight: 4,
                  marginLeft: 8,
                }}
                source={require('../../../assets/img/ico_book2.png')}
              />
              <Text
                style={[
                  style.text_re,
                  { fontSize: 12, color: colors.GRAY_COLOR_2 },
                ]}>
                {items.data[0].pt_wish}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingHorizontal: 20,
              paddingVertical: 16,
              backgroundColor: colors.GRAY_COLOR_1,
              borderRadius: 5,
            }}>
            <View style={{ flex: 1, marginRight: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  setProfileToggle(true);
                }}
                style={{ flexDirection: 'row' }}>
                <Image
                  style={{ width: 44, height: 44, marginRight: 20 }}
                  source={require('../../../assets/img/img_profile.png')}
                  resizeMode="cover"
                  borderRadius={100}
                />
                <View style={{}}>
                  <Text style={[style.default_font_black, { marginBottom: 3 }]}>
                    {items.data[0].mt_seller_nickname}
                  </Text>
                  <Text
                    style={[
                      style.text_li,
                      { fontSize: 12, color: colors.GRAY_COLOR_2 },
                    ]}>
                    {t('판매상품수')} {items.selling_count} ·{' '}
                    {t('거래완료 횟수')}{' '}
                    {items.pt_end_cnt == undefined ? 0 : items.pt_end_cnt}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => ReportPost(items.data[0].mt_seller_idx)}>
              <Text
                style={[
                  style.text_me,
                  { fontSize: 13, color: colors.GRAY_COLOR_2 },
                ]}>
                {t('게시글 신고')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ProfileBottomModal
        isVisible={profileToggle}
        setVisible={setProfileToggle}
        action={() => { }}
        item={{
          mt_seller_nickname: items.data[0].mt_seller_nickname,
          pt_area: items.data[0].pt_area,
          pt_end_cnt: items.data[0].pt_end_cnt,
          mt_seller_idx: items.data[0].mt_seller_idx,
          selling_count: items.selling_count,
        }}
      />
      <View
        style={{
          borderTopWidth: 1,
          borderColor: colors.GRAY_COLOR_3,
          flexDirection: 'row',
          justifyContent: 'space-between',
          height: 60,
          paddingHorizontal: 20,
          paddingVertical: 12,
        }}>
        <View style={{ justifyContent: 'center' }}>
          <Text style={[style.default_font_black, { fontSize: 18 }]}>
            ￦ {NumberComma(items.data[0].pt_selling_price)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => heartOn(items.data[0].pt_idx)}
            style={{
              marginRight: 6,
              padding: 10,
              backgroundColor: colors.GRAY_COLOR_1,
              justifyContent: 'center',
              borderRadius: 5,
            }}>
            {items.wp_idx ? (
              <Image
                style={{ width: 25, height: 25 }}
                source={require('../../../assets/img/ico_book.png')}
              />
            ) : (
                <Image
                  style={{ width: 25, height: 25 }}
                  source={require('../../../assets/img/ico_book_on.png')}
                />
              )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Reserve_choice({
                id: items.data[0].pt_idx,
                image: items.data[0].pt_image1,
                title: items.data[0].pt_title,
              })
            }
            style={{
              backgroundColor: colors.GREEN_COLOR_2,
              alignItems: 'center',
              justifyContent: 'center',
              width: 100,
              borderRadius: 5,
            }}>
            <Text style={{ color: 'white' }}>{t('채팅하기')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BackHandlerCom />
    </SafeAreaView>
  );
};

export default Itempost;
