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
  StyleSheet,
  FlatList,
  Image,
  Button,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import style from '../../../assets/style/style';
import {colors} from '../../../assets/color';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {MainNavigatorParams} from '../../../components/types/routerTypes';
import {QuestionHeader} from '../../../components/header/QuestionHeader';
import {CustomButton} from '../../../components/layout/CustomButton';
import {BackHandlerCom} from '../../../components/BackHandlerCom';
import {useTranslation} from 'react-i18next';
import client from '../../../api/client';
import {useSelector} from 'react-redux';
import {InquiryDetailData} from '../../../components/types/componentType';
import cusToast from '../../../components/navigation/CusToast';
import LoadingIndicator from '../../../components/layout/Loading';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

type Props = StackScreenProps<MainNavigatorParams, 'Inquiry_1_1Detail'>;
const InquiryDetail = ({route}: Props) => {
  const {t} = useTranslation();
  const userInfo = useSelector((state: any) => state.userInfo);
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const [items, setItems] = useState<InquiryDetailData>();
  const [image_arr, setImage_arr] = useState([]);

  const qt_idx = (route && route.params && route.params.qt_idx) ?? '';

  const Delete = async () => {
    console.log();
    await client({
      method: 'get',
      url: '/customer/qna-delete',
      params: {
        qt_idx: qt_idx,
      },
    })
      .then(res => {
        cusToast(t(res.data.message));
        navigation.goBack();
      })
      .catch(err => console.log(err));
  };

  const getData = async () => {
    await client({
      method: 'get',
      url: `/customer/qna-detail?qt_idx=${qt_idx}`,
    })
      .then(res => {
        console.log(res.data.data[0], res.data.image_arr);
        setItems(res.data.data[0]);
        setImage_arr(res.data.image_arr);
      })
      .catch(err => console.log(err));
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <QuestionHeader
        title={t('문의상세')}
        subtitle={t('삭제')}
        action={Delete}
      />
      {!items || !items.qt_idx ? (
        <LoadingIndicator></LoadingIndicator>
      ) : (
        <ScrollView style={{paddingHorizontal: 20, paddingVertical: 10}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 18,
              borderBottomWidth: 1,
              borderBottomColor: colors.GRAY_COLOR_3,
            }}>
            {items.qt_answer == null ? (
              <Text
                style={[
                  style.text_sb,
                  {
                    fontSize: 13,
                    color: colors.GRAY_COLOR_2,
                    backgroundColor: colors.GRAY_COLOR_1,
                    paddingHorizontal: 15,
                    paddingVertical: 4,
                    borderRadius: 20,
                    marginBottom: 5,
                  },
                ]}>
                {t('미답변')}
              </Text>
            ) : (
              <Text
                style={[
                  style.text_sb,
                  {
                    fontSize: 13,
                    color: colors.BLUE_COLOR_1,
                    backgroundColor: colors.GRAY_COLOR_1,
                    paddingHorizontal: 15,
                    paddingVertical: 4,
                    borderRadius: 20,
                    marginBottom: 5,
                  },
                ]}>
                {t('답변완료')}
              </Text>
            )}
            <Text
              style={[
                style.text_sb,
                {fontSize: 18, color: colors.BLACK_COLOR_1, marginBottom: 5},
              ]}>
              {items.qt_title}
            </Text>
            <Text
              style={[
                style.text_re,
                {fontSize: 13, color: colors.GRAY_COLOR_2},
              ]}>
              {items.qt_content}
            </Text>
          </View>
          <View style={{marginTop: 10}}></View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {image_arr.length > 0 &&
              image_arr.map((v, i) => (
                <Image
                  key={'img_' + i}
                  style={{
                    width: 100,
                    height: 100,
                    marginBottom: 10,
                    marginRight: 10,
                  }}
                  source={{
                    uri: v.uri,
                  }}
                />
              ))}
          </View>
          <View style={{marginVertical: 20}}>
            <Text
              style={[
                style.text_re,
                {fontSize: 15, lineHeight: 30, color: colors.BLACK_COLOR_1},
              ]}>
              {items.qt_content}
            </Text>
          </View>

          {items.qt_answer == null ? null : (
            <View
              style={{
                padding: 20,
                backgroundColor: colors.GRAY_COLOR_1,
                borderRadius: 5,
                marginBottom: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 20,
                }}>
                <Text
                  style={[
                    style.text_sb,
                    {fontSize: 18, color: colors.GREEN_COLOR_2},
                  ]}>
                  {t('GETGO고객센터')}
                </Text>
                <Image
                  style={{width: 28, height: 28, borderRadius: 50}}
                  source={require('../../../assets/img/ico_logo2.png')}
                />
              </View>
              {/* <Text
              style={[
                style.text_re,
                {color: colors.BLACK_COLOR_1, fontSize: 15, lineHeight: 30},
              ]}> */}

              {/* {route.params.answertext} */}
              {/* </Text> */}
            </View>
          )}
        </ScrollView>
      )}
      <BackHandlerCom />
    </SafeAreaView>
  );
};

export default InquiryDetail;
