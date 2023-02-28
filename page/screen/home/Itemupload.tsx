/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useRef, useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Button,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from 'react-native';
import style from '../../../assets/style/style';
import {colors} from '../../../assets/color';

import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {MainNavigatorParams} from '../../../components/types/routerTypes';
// import { color } from 'native-base/lib/typescript/theme/styled-system';
import {BackHeader} from '../../../components/header/BackHeader';
import {
  CategoryOptionType,
  Reserve_SelectBoxType,
} from '../../../components/types/componentType';
import {SelectBox} from '../../../components/layout/SelectBox';

import ProductUpload from '../../../components/layout/ProductUpload';
import {BackHandlerCom} from '../../../components/BackHandlerCom';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import {useTranslation} from 'react-i18next';

import {formatDistanceToNow} from 'date-fns/esm';
import {ko} from 'date-fns/locale';
import {connect, useDispatch, useSelector} from 'react-redux';
import client from '../../../api/client';
import cusToast from '../../../components/navigation/CusToast';
import axios from 'axios';
import {launchImageLibrary} from 'react-native-image-picker';
import SetMyLocation from '../location/SetMyLocation';

type Props = StackScreenProps<MainNavigatorParams, 'Itemupload'>;
const Itemupload = ({route}: Props) => {
  const userInfo = useSelector((state: any) => state.userInfo);
  const myLocation = useSelector((state: any) => state.myLocation);

  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  const [title, setTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [price, setPrice] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const {t} = useTranslation();
  const bodyRef = useRef<TextInput | null>(null);
  const [uploadpictures, setUploadpictures] = useState<any>([]);
  const pt_idx = route?.params?.pt_idx;

  const dispatch = useDispatch();

  const openPicker = async () => {
    if (uploadpictures.length == 10) {
      cusToast(t('사진은 10장까지 등록할수 있습니다.'));
      return false;
    }

    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        selectionLimit: 10,
        // includeBase64: Platform.OS === 'android'
      },
      (res: any) => {
        console.log('res.assets', res);

        if (res.didCancel) {
        } else if (res.assets) {
          let newres = [...uploadpictures];
          res.assets.forEach((item, index) => {
            newres.push({
              uri: item.uri,
              fileName: item.fileName,
              type: item.type,
              img_idx: '',
            });
          });

          if (newres.length >= 10) {
            newres = newres.slice(0, 10);
          }

          setUploadpictures(newres);
        }
      },
    );
    // try {
    // const response = await MultipleImagePicker.openPicker({
    //     usedCameraButton: false,
    // });
    // if(response.length <= 10){
    //     setUploadpictures(response)
    // } else {
    //     const newres = response.slice(0,10)
    //     setUploadpictures(newres)
    //     Alert.alert(
    //         t("사진은 최대 10장까지만 업로드 가능합니다.")
    //         )
    // }
    // } catch (e:any) {
    // console.log(e.code, e.message);
    // }
  };

  const [selectCategory, setSelCategory] = React.useState<CategoryOptionType>({
    label: t('디지털기기'),
    value: '디지털기기',
    sel_id: 1,
  });

  const [CategoryOptions] = React.useState([
    {label: t('디지털기기'), value: '디지털기기', sel_id: 1},
    {label: t('생활가전'), value: '생활가전', sel_id: 2},
    {label: t('가구/인테리어'), value: '가구/인테리어', sel_id: 3},
    {label: t('생활/주방'), value: '생활/주방', sel_id: 4},
    {label: t('유아동'), value: '유아동', sel_id: 5},
    {label: t('유아도서'), value: '유아도서', sel_id: 6},
    {label: t('여성의류'), value: '여성의류', sel_id: 7},
    {label: t('여성잡화'), value: '여성잡화', sel_id: 8},
    {label: t('남성패션/잡화'), value: '남성패션/잡화', sel_id: 9},
    {label: t('뷰티/미용'), value: '뷰티/미용', sel_id: 10},
    {label: t('스포츠/레저'), value: '스포츠/레저', sel_id: 11},
    {label: t('골프'), value: '골프', sel_id: 21},
    {label: t('취미/게임/음반'), value: '취미/게임/음반', sel_id: 12},
    {label: t('도서'), value: '도서', sel_id: 13},
    {label: t('자동차'), value: '자동차', sel_id: 20},
    {label: t('중고차'), value: '중고차', sel_id: 14},
    {label: t('티켓/교환권'), value: '티켓/교환권', sel_id: 15},
    {label: t('가공식품'), value: '가공식품', sel_id: 16},
    {label: t('반려동물용품'), value: '반려동물용품', sel_id: 17},
    {label: t('식품'), value: '식품', sel_id: 18},
    {label: t('기타'), value: '기타', sel_id: 19},
  ]);

  const [overScroll, setOverScroll] = useState(true);
  const overScrollEnable = () => {
    setOverScroll(!overScroll);
  };
  const CategorySelect = (item: CategoryOptionType) => {
    setOverScroll(!overScroll);
    setSelCategory({...item});
  };

  // const Delete = (e: any) => {
  //   const remove = uploadpictures.filter(
  //     (item: any) => item.fileName !== e.fileName,
  //   );
  //   setUploadpictures(remove);
  // };

  //이미지 삭제(idx:배열번호)
  const Delete = async (idx: any) => {
    let arr_idx = idx;
    let temp_img = [...uploadpictures];
    console.log('del', idx, temp_img.length);

    // if (item.uri.indexOf('http') != -1) return;
    //서버 업로드된 파일이면 파일 삭제와 DB순서 업데이트
    if (
      temp_img[arr_idx].img_idx &&
      temp_img[arr_idx].uri.indexOf('http') != -1
    ) {
      setLoading(true);

      await client({
        method: 'post',
        url: '/product/product_image_del',
        data: {
          key_idx: pt_idx,
          // mt_idx: userInfo.idx,
          img_idx: idx + 1,
        },
      })
        .then(res => {
          setLoading(false);
          setUploadpictures(temp_img.filter((el, index) => index !== arr_idx));
        })
        .catch(error => {
          console.log(error);
          setLoading(false);
        });
    } else {
      setUploadpictures(temp_img.filter((el, index) => index !== arr_idx));
    }
  };

  const Complete = () => {
    // setLoading(true)

    console.log('Complete', '');

    if (
      title == '' ||
      bodyText == '' ||
      price == '' ||
      uploadpictures == undefined
    ) {
      Alert.alert('', t('사진 추가') + ' or ' + t('내용입력해주세요'));
      setLoading(false);
      return;
    } else {
      console.log('Complete', '2', uploadpictures.length);
      const form = new FormData();
      form.append('mt_idx', userInfo.idx);
      form.append(`ct_id`, selectCategory.sel_id);
      form.append(`pt_title`, title);
      form.append(`pt_content`, bodyText);
      form.append(`pt_selling_price`, price);
      form.append(`pt_area`, myLocation.location1.mt_area);
      form.append(`pt_lat`, myLocation.location1.mt_lat);
      form.append(`pt_lon`, myLocation.location1.mt_log);
      let image_list = [];
      // const idxs = Object.keys(uploadpictures);
      for (let i = 0, cnt = uploadpictures.length; i < cnt; i++) {
        const item = uploadpictures[i];

        if (item.uri.indexOf('http') == -1) {
          let data = {
            img_idx: i + 1,
            name: item.fileName,
            type: item.type,
            uri:
              Platform.OS === 'ios'
                ? item.uri.replace('file://', '')
                : item.uri,
          };
          // let s_idx = parseInt(idx) + 1;
          // form.append(`pt_image${s_idx}`, data);
          form.append(`pt_image[]`, data);
          // image_list.push(item.fileName);
        }
      }

      // if (!image_list.length) form.append(`pt_image[]`, null);

      console.log('Complete', '3');

      console.log('form', route.params.type, form);

      if (route.params.type == 'ProductUpload') {
        const setUpload = async () => {
          await client({
            method: 'post',
            url: '/product/product_add',
            headers: {'Content-Type': 'multipart/form-data'},
            data: form,
          })
            .then(res => {
              navigation.goBack();
              cusToast(res.data.message);
              setLoading(false);
            })
            .catch(error => {
              console.log(error);
              setLoading(false);
            });
        };
        setUpload();
      } else {
        const setModify = async () => {
          form.append(`pt_idx`, pt_idx);

          await client({
            method: 'post',
            url: '/product/product_edit',
            headers: {'Content-Type': 'multipart/form-data'},
            data: form,
          })
            .then(res => {
              cusToast(res.data.message);
              setLoading(false);
              navigation.goBack();
            })
            .catch(error => {
              console.log(error);
              setLoading(false);
            });
        };
        setModify();
      }
    }
  };

  const getPostData = async () => {
    setLoading(true);
    await client<any>({
      method: 'get',
      url: `/product/procudt-detail`,
      params: {
        pt_idx: pt_idx,
        mt_idx: userInfo.idx,
      },
    })
      .then(res => {
        const item = res.data.data[0];
        let image_arr = res.data.image_arr;

        console.log('item', item);

        if (item.ct_id) {
          CategoryOptions.forEach(v => {
            console.log(v, item.ct_id);
            let {label, value, sel_id} = v;
            if (sel_id == item.ct_id) {
              setSelCategory(v);
              return false;
            }
          });
        }

        // selectCategory.sel_id

        setTitle(item.pt_title);
        setBodyText(item.pt_content);
        console.log('item.pt_selling_price', item.pt_selling_price);
        setPrice(item.pt_selling_price?.toString());

        // let tempImage = [];

        // for (let i = 0, cnt = image_arr.length; i < cnt; i++) {
        //   tempImage.push({
        //     uri:
        //       'http://ec2-13-125-251-68.ap-northeast-2.compute.amazonaws.com:4000/uploads/' +
        //       image_arr[i],
        //     fileName: image_arr[i],
        //     type: 'image/png',
        // id,
        // img_idx,
        //   });
        // }
        if (image_arr.length) setUploadpictures(image_arr);

        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  //type:'ProductModify',pt_idx:pt_idx
  useEffect(() => {
    if (pt_idx) {
      console.log('rotue', pt_idx, route);
      getPostData();
    }
  }, [route]);

  return (
    <SafeAreaView style={[style.default_background, {flex: 1}]}>
      <BackHeader
        title={
          route.params.type == 'ProductUpload'
            ? t('판매 상품 등록')
            : t('등록 상품 수정')
        }
      />
      <ScrollView
        scrollEnabled={overScroll}
        showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView style={{marginHorizontal: 20}}>
          <Text
            style={[
              style.text_b,
              {
                color: colors.BLACK_COLOR_1,
                fontSize: 15,
                marginTop: 20,
                marginBottom: 10,
              },
            ]}>
            {t('상품 이미지 (1장 이상)')}
            <Text style={{color: colors.GREEN_COLOR_2}}> *</Text>
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.GREEN_COLOR_2,
              height: 45,
              borderRadius: 5,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 17,
            }}
            onPress={openPicker}>
            <Text
              style={[
                style.text_sb,
                {color: colors.WHITE_COLOR, fontSize: 15},
              ]}>
              {t('사진 추가')} ({uploadpictures ? uploadpictures.length : 0}
              /10)
            </Text>
          </TouchableOpacity>
          <FlatList
            showsHorizontalScrollIndicator={false}
            style={{marginBottom: 30}}
            data={uploadpictures}
            renderItem={({item, index}) => (
              <View style={{marginRight: 8, width: 100, height: 100}}>
                <ImageBackground
                  style={{flex: 1}}
                  source={{uri: item.uri}}
                  resizeMode="cover"
                  imageStyle={{borderRadius: 10}}>
                  <TouchableOpacity
                    style={{alignItems: 'flex-end', right: 10, top: 10}}
                    onPress={() => Delete(index)}>
                    <Image
                      style={{width: 25, height: 25}}
                      source={require('../../../assets/img/ico_close1.png')}
                    />
                  </TouchableOpacity>
                </ImageBackground>
                {index == 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      backgroundColor: colors.GREEN_COLOR_2,
                      width: '100%',
                      alignItems: 'center',
                      height: 25,
                      justifyContent: 'center',
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                    }}>
                    <Text
                      style={[
                        style.text_sb,
                        {fontSize: 13, color: colors.WHITE_COLOR},
                      ]}>
                      {t('대표사진')}
                    </Text>
                  </View>
                )}
              </View>
            )}
            horizontal={true}
          />

          <View style={{marginBottom: 20}}>
            <Text
              style={[
                style.text_sb,
                {color: colors.BLACK_COLOR_1, fontSize: 15, marginBottom: 6},
              ]}>
              {t('카테고리')}
              <Text style={{color: colors.GREEN_COLOR_2}}> *</Text>
            </Text>
            <View style={{height: 45}}>
              <SelectBox
                selOption={selectCategory} // 선택한 옵션 정보
                options={CategoryOptions} //옵션 리스트
                action={CategorySelect} //선택한 옵션 변경
                overScrollEnable={overScrollEnable} //중복스크롤방지
                height={45}
                paddingVertical={10}
              />
            </View>
          </View>

          <View style={{marginBottom: 20}}>
            <Text
              style={[
                style.text_sb,
                {color: colors.BLACK_COLOR_1, fontSize: 15, marginBottom: 6},
              ]}>
              {t('제목')}
              <Text style={{color: colors.GREEN_COLOR_2}}> *</Text>
            </Text>
            <TextInput
              style={{
                height: 44,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: colors.GRAY_COLOR_3,
                paddingHorizontal: 15,
              }}
              placeholder={t('제목 입력')}
              blurOnSubmit={false}
              numberOfLines={1}
              onSubmitEditing={() => {
                bodyRef.current?.focus();
              }}
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View style={{marginBottom: 20}}>
            <Text
              style={[
                style.text_sb,
                {color: colors.BLACK_COLOR_1, fontSize: 15, marginBottom: 6},
              ]}>
              {t('내용')}
              <Text style={{color: colors.GREEN_COLOR_2}}> *</Text>
            </Text>
            <TextInput
              style={{
                height: 150,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: colors.GRAY_COLOR_3,
                paddingHorizontal: 15,
                textAlignVertical: 'top',
              }}
              placeholder={t('내용 입력')}
              multiline={true}
              blurOnSubmit={false}
              value={bodyText}
              onChangeText={setBodyText}
              ref={bodyRef}
            />
          </View>
          <View style={{marginBottom: 30}}>
            <Text
              style={[
                style.text_sb,
                {color: colors.BLACK_COLOR_1, fontSize: 15, marginBottom: 6},
              ]}>
              {t('가격')}
              <Text style={{color: colors.GREEN_COLOR_2}}> *</Text>
            </Text>
            <TextInput
              style={{
                height: 44,
                borderWidth: 1,
                borderRadius: 5,
                borderColor: colors.GRAY_COLOR_3,
                paddingHorizontal: 15,
              }}
              placeholder={t('가격 입력')}
              numberOfLines={1}
              blurOnSubmit={false}
              keyboardType="number-pad"
              value={price}
              onChangeText={setPrice}
              onSubmitEditing={Complete}
            />
          </View>
        </KeyboardAvoidingView>
        <View style={{backgroundColor: colors.GREEN_COLOR_2}}>
          <TouchableOpacity
            onPress={Complete}
            style={[
              {alignItems: 'center', justifyContent: 'center', height: 60},
            ]}>
            <Text
              style={[
                style.text_sb,
                {color: colors.WHITE_COLOR, fontSize: 18},
              ]}>
              {t('완료')}
            </Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              top: '50%',
              left: '50%',
              right: '50%',
            }}>
            <ActivityIndicator size="large" color="#02A256" />
          </View>
        ) : null}
      </ScrollView>

      <BackHandlerCom />
    </SafeAreaView>
  );
};

export default Itemupload;
