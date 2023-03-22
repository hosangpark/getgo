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
  Linking,
  Share
} from 'react-native';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
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
import Api from '../../../api/Api';
import dynamicLinks from '@react-native-firebase/dynamic-links';

type Props = StackScreenProps<MainNavigatorParams, 'Itempost'>;
const Itempost = ({ route }: Props) => {
  const userInfo = useSelector((state: any) => state.userInfo);
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const myLocation = useSelector((state: any) => state.myLocation);
  const { t, i18n } = useTranslation();

  if (!route?.params?.pt_idx) {
    cusToast(t('잘못된 방법입니다'));
    navigation.goBack();
    return false;
  }

  const pt_idx = route?.params?.pt_idx ?? ''

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
  const [ChatAble, setChatAble] = useState(false);


  // const SHOWLOG = () => {
  //   console.log('share');
  //   console.log(profileToggle);
  // };

  const buildLink = async () => {
    const link = await dynamicLinks().buildLink({
      link: Api.state.siteUrl + '/bridge?type=product&code=' + items.data[0].pt_idx,
      // link: 'getgoid://?type=product&code=' + items.data[0].pt_idx,
      domainUriPrefix: 'https://getgo.page.link',
      social: {
        descriptionText: items?.data[0]?.pt_selling_price ? '￦' + items.data[0].pt_selling_price : '',
        imageUrl: filterslideImage.length ? filterslideImage[0].uri : null,
        title: items?.data[0]?.pt_title
      },
    });


    return link;
  }


  const SHOWLOG = async () => {
    try {
      // let shopUrl = '';
      // if (Platform.OS == 'android') {
      //   shopUrl = 'https://play.google.com/store/apps/details?id=com.getgo';
      // } else {
      //   shopUrl = 'https://apps.apple.com/kr/app/id1572757670';
      // }
      let fullcodeUrl = 'http://getgo.id:3000/download-app?type=product&code=' + items.data[0].pt_idx;
      // let fullcodeUrl = 'https://buzyrun.com/bridge.php?type=product&code=' + items.data[0].pt_idx;

      // let fullcodeUrl = await buildLink();
      console.log('urls', fullcodeUrl);
      // return;

      const result = await Share.share({
        message: `[Getgo] ${items.data[0].pt_title} / ￦ ${NumberComma(items.data[0].pt_selling_price)} ${fullcodeUrl}`,
        // message: fullcodeUrl,
        url: fullcodeUrl,
      });

      console.log('fullcodeUrl', fullcodeUrl);
      // Linking.openURL(fullcodeUrl);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
          //Toast.show('공유되었습니다.');
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };


  const ReportPost = (target: number, pt_idx: number) => {
    if (target == userInfo.idx) {
      Alert.alert(t('자신을 신고 할 수는 없습니다.'))
      return false;
    }
    navigation.navigate('ReportPost', { mt_declaration_idx: target, pt_idx: pt_idx });
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
        wp_idx: null,
      },
    ],
  });

  const [wp_idx, setWp_idx] = React.useState(items.data[0].wp_idx ?? null);

  const [filterslideImage, setfilterslideImage] = React.useState<any>([]);

  const getPostData = async () => {
    await client<any>({
      method: 'get',
      url: `/product/procudt-detail`,
      params: {
        pt_idx: pt_idx,
        mt_idx: userInfo.idx,
      },
    })
      .then(res => {
        console.log('res.data', res.data);

        if (!res.data?.data || !res.data?.data.length) {
          cusToast(t('삭제된 상품입니다.'));
          navigation.goBack();
          return false;
        }

        setitem(res.data);
        setWp_idx(res.data.wp_idx ?? null);
        setfilterslideImage(res.data.image_arr);
        setIsLoading(false);

        // items.data[0].mt_seller_idx
        if (userInfo.idx == res.data.data[0].mt_seller_idx) {//판매자
          setmyProduct(true);

          setChatAble(res.data.data[0].pt_chat ? true : false)
        } else {
          setmyProduct(false);
          setChatAble(true)
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  /** 상품 예약자 선택 & 자기상품 아닐시 예약전송 */
  const Reserve_choice = async (target: ChoiceType) => {

    //거래완료
    // if (items.data[0].pt_sale_now == '3') {
    //   cusToast(t('이미 거래가 완료된 상품입니다.'));
    //   return false;
    // }

    if (myLocation.select_location == 1 && myLocation.location1.mat_status !== "Y") {
      Certified()
    } else if (myLocation.select_location == 2 && myLocation.location2.mat_status !== "Y") {
      Certified()
    } else {
      if (myProduct) {
        navigation.navigate('Message')
        //채팅응답
      } else {
        await client({
          method: 'post',
          url: '/product/chat_add',
          data: {
            mt_idx: userInfo.idx,
            pt_idx: pt_idx,
          },
        })
          .then(res => {
            //{"crt_idx": 52, "ctt_room_id": "CzAuaGg4fxlXg"}
            console.log('res', res.data);
            if (res.data.crt_idx) navigation.navigate('MessageRoom', { items: { room_id: res.data.crt_idx }, type: 'messageChat' });
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };

  const Certified = () => {
    Alert.alert(t('현재동네 인증이 되어있지않습니다'), '',
      [
        {
          text: t('인증하기'), onPress: () => {
            navigation.navigate('SetMyLocation')
          }
        },
        {
          text: t('취소'), onPress: () => { }
        }
      ])
  }

  /** 상품 정보 가져오기 ${route.params.pt_idx}*/
  /** 상품 정보 가져오기 ${route.params.pt_idx} 상품상세에서 인텐트를 받아도 이동하게 수정 */
  useFocusEffect(React.useCallback(() => {
    getPostData();

  }, [pt_idx]))


  /** 관심상품 등록&제거 */
  const heartOnOff = async (pt_idx: any) => {

    console.log('heartOnOff', pt_idx, wp_idx)

    if (!wp_idx) {
      AddHeart(pt_idx)
    } else {
      DeleteHeart(wp_idx)
    }
  }



  const DeleteHeart = async (target: number) => {
    await client({
      method: 'get',
      url: `/product/add_like_delete`,
      params: {
        wp_idx: target,
      }
    }).then(res => {
      cusToast(t(res.data.message))
      setWp_idx(null)
      // action()
    }
    ).catch(error => {
      console.log(error);
    })
  }

  /** 관심상품 등록 */
  const AddHeart = async (e: number) => {
    await client<{ data: string; message: string, wt_idx: number }>({
      method: 'post',
      url: '/product/add_like',
      data: {
        pt_idx: e,
        mt_idx: userInfo.idx,
        area_show: 'Y',
      },
    })
      .then(res => {
        cusToast(t(res.data.message))
        setWp_idx(res.data.wt_idx)
      })
      .catch(error => {
        console.log(error);
      });
  };

  /** 상품 판매상태변경 */
  const ReserveSelect = async (item: OptionType) => {
    //예약중 이상이면서 바이어가 없으면 바이어 선택
    if ((item.sel_id == 3 || item.sel_id == 2) && !items.data[0].mt_buyer_idx) {
      navigation.navigate('Reserve_choice', {
        target: {
          id: items.data[0].pt_idx,
          image: items.data[0].pt_image1,
          title: items.data[0].pt_title,
        },
        type: 'Complete',
        pt_sale_now: item.sel_id
      });
      return;
    }

    await client({
      method: 'post',
      url: '/product/product_status',
      data: {
        pt_idx: items.data[0].pt_idx,
        pt_sale_now: item.sel_id,
        mt_idx: items.data[0].mt_buyer_idx ?? ''
      },
    })
      .then(res => {
        cusToast(t(res.data.message));
        setSelReserve(item);
        getPostData();
      })
      .catch(err => console.log(err));
  };


  return (
    <SafeAreaView style={[style.default_background, { flex: 1 }]}>
      <ItemPostHeader myProduct={myProduct} pt_idx={items.data[0].pt_idx} pt_sale_now={items.data[0].pt_sale_now} />
      <ScrollView>
        {isloading ? <LoadingIndicator /> : null}
        {filterslideImage.length ? (
          <SwiperSlide
            gofullscreen={gofullscreen}
            imageheight={410}
            SlideImage={filterslideImage}
          />
        ) : <View style={{ height: 50, backgroundColor: colors.GRAY_COLOR_4 }}></View>}
        <View style={{ marginVertical: 24, marginHorizontal: 20 }}>
          {myProduct && items.data[0].pt_sale_now != 3 ? (
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
          ) : null}
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
                {
                  i18n.language == 'Id' ? items.data[0].ct_in_name : i18n.language == 'En' ? items.data[0].ct_en_name : items.data[0].ct_name
                }
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
                  source={items.data[0].mt_image1 ? { uri: Api.state.imageUrl + items.data[0].mt_image1 } : require('../../../assets/img/img_profile.png')}
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
              onPress={() => ReportPost(items.data[0].mt_seller_idx, items.data[0].pt_idx)}>
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
          // height: 60,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}>
        <View style={{ justifyContent: 'center', flex: 1 }}>
          <Text style={[style.default_font_black, { fontSize: 18, flexWrap: 'wrap', flexShrink: 1 }]}>
            ￦ {NumberComma(items.data[0].pt_selling_price)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => heartOnOff(items.data[0].pt_idx)}
            style={{
              marginRight: 6,
              padding: 10,
              backgroundColor: colors.GRAY_COLOR_1,
              justifyContent: 'center',
              borderRadius: 5,
            }}>
            {!wp_idx ? (
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
            disabled={!ChatAble}
            style={[
              {
                alignItems: 'center',
                justifyContent: 'center',
                width: 100,
                borderRadius: 5,
                height: 45,
              },
              ChatAble ? {
                backgroundColor: colors.GREEN_COLOR_2,
              } : {
                  backgroundColor: colors.GREEN_COLOR_1,
                }
            ]
            }>
            <Text style={{ color: 'white' }}>{t('채팅하기')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BackHandlerCom />
    </SafeAreaView >
  );
};

export default Itempost;
