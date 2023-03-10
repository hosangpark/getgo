import React, { useState } from 'react';
import { View, ViewStyle, Text, ScrollView, SafeAreaView, Button, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHeader } from '../../../components/header/BackHeader';
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import SaledList_OnSale from './SaledList_OnSale';
import SaledList_Complete from './SaledList_Complete';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { CustomButton } from '../../../components/layout/CustomButton';
import { ProductItemType } from '../../../components/types/componentType';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import LoadingIndicator from '../../../components/layout/Loading';
import cusToast from '../../../components/navigation/CusToast';
import { useSelector } from 'react-redux';
import Api from '../../../api/Api';




type Props = StackScreenProps<MainNavigatorParams, 'SendReview'>
export default function SendReview({ route }: Props) {
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const [items, setitem] = useState<any>()
  const [value, setValue] = useState('')

  const userInfo = useSelector(state => state.userInfo)

  const [choose, setChoose] = useState(0)

  const bad_choice = () => {
    setChoose(1)
    if (choose == 1) {
      setChoose(0)
    }
  }
  const good_choice = () => {
    setChoose(2)
    if (choose == 2) {
      setChoose(0)
    }
  }
  const verygood_choice = () => {
    setChoose(3)
    if (choose == 3) {
      setChoose(0)
    }
  }
  const SendReviewComplete = async () => {
    await client({
      method: 'post',
      url: `/product/review_add`,
      data: {
        pt_idx: items.data[0].pt_idx,
        mt_idx: userInfo.idx,
        rt_content: value,
        rt_score: choose
      }
    }).then(res => {
      cusToast(t(res.data.message))

      if (res.data.rt_idx) navigation.replace('ReviewDetail', { rt_idx: res.data.rt_idx })
      // navigation.goBack()
      // navigation.goBack()
    }).catch(err => {
      console.log(err)
    })
  }
  const getReviewData = async () => {
    console.log('route.params', route.params);
    await client({
      method: 'get',
      url: `/product/review_basic?room_idx=${route.params?.item?.room_idx}`
    }).then(res => {
      setitem(res.data)
    }).catch(err => {
      console.log(err)
    })
  }

  React.useEffect(() => {
    getReviewData()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <BackHeader title={t('후기 작성')} />
      {items == undefined ?
        <LoadingIndicator />
        :
        <ScrollView style={{ paddingHorizontal: 20, flex: 1 }}>
          <View style={{
            flexDirection: 'row', backgroundColor: colors.GRAY_COLOR_1, padding: 20,
            borderRadius: 10, marginBottom: 35
          }}>
            {items?.data[0].pt_image1 ? <Image source={{ uri: Api.state.imageUrl + items.data[0].pt_image1 }} style={{ width: 65, height: 65, marginRight: 11, borderRadius: 5, }} /> : null}
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_1, marginBottom: 5 }]} numberOfLines={2}>
                {items.data[0].pt_title}
              </Text>
              <Text style={[style.text_re, { fontSize: 13, color: colors.BLACK_COLOR_1 }]}>
                {t('거래한 이웃')} : {items.data[0].mt_nickname}
              </Text>
            </View>
          </View>
          <View style={{}}>
            <View style={{ alignItems: 'center' }}>
              <Text style={[style.text_b, { fontSize: 22, color: colors.BLACK_COLOR_1 }]}>
                {/* User.Name{t('님')}  */}
              "{items.data[0].mt_nickname}" {t('님과')} </Text>
              <Text style={[style.text_b, { fontSize: 22, color: colors.GREEN_COLOR_3 }]}>
                {t('거래가 어떠셨나요?')}</Text>
              <Text style={[style.text_re, { fontSize: 13, color: colors.GRAY_COLOR_2 }]}>
                {t('거래만족도는 나만 확인할 수 있습니다.')}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 40 }}>
              <TouchableOpacity style={choose === 1 ? (styled.choosedBox) : (styled.chooseBox)}
                onPress={bad_choice}
              >
                <Image style={styled.ImageBox}
                  source={require('../../../assets/img/re_notgood.png')} />
                <Text style={[style.text_sb, choose === 1 ? (styled.choosedInnerText) : (styled.InnerText)]}>
                  {t('별로에요')}
                </Text>
                <Text style={[style.text_sb, choose === 1 ? (styled.choosedInnerText2) : (styled.InnerText2)]}>
                  {t('선택')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={choose === 2 ? (styled.choosedBox) : (styled.chooseBox)}
                onPress={good_choice}
              >
                <Image style={styled.ImageBox}
                  source={require('../../../assets/img/re_good.png')} />
                <Text style={[style.text_sb, choose === 2 ? (styled.choosedInnerText) : (styled.InnerText)]}>
                  {t('좋아요')}
                </Text>
                <Text style={[style.text_sb, choose === 2 ? (styled.choosedInnerText2) : (styled.InnerText2)]}>
                  {t('선택')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={choose === 3 ? (styled.choosedBox) : (styled.chooseBox)}
                onPress={verygood_choice}
              >
                <Image style={styled.ImageBox}
                  source={require('../../../assets/img/re_perfect.png')} />
                <Text style={[style.text_sb, choose === 3 ? (styled.choosedInnerText) : (styled.InnerText)]}>
                  {t('최고에요')}
                </Text>
                <Text style={[style.text_sb, choose === 3 ? (styled.choosedInnerText2) : (styled.InnerText2)]}>
                  {t('선택')}
                </Text>
              </TouchableOpacity>
            </View>
            {choose === 1 ?
              (<View>
                <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_1 }]}>
                  <Text style={{ color: colors.GREEN_COLOR_3 }}>
                    {t('아쉬웠던 점')} </Text>
                  {t('을 GETGO에게 알려주세요.')}</Text>
                <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_1 }]}>
                  {t('상대방에겐 전달되지 않습니다.')}</Text>
              </View>) : null
            }
            {choose === 2 || choose === 3 ?
              (<View>
                <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_1 }]}>
                  <Text style={{ color: colors.GREEN_COLOR_3 }}>
                    {t('좋았던')} </Text>
                  {t('거래 경험 내용을 알려 주세요!')}</Text>
                <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_1 }]}>
                  {t('남겨주신 거래 후기는 상대방이 확인 할 수 있습니다.')}</Text>
              </View>) : null
            }
            {choose === 1 || choose === 2 || choose === 3 ?
              (<TextInput
                style={{ borderRadius: 5, borderWidth: 1, borderColor: colors.GRAY_COLOR_3, minHeight: 95, paddingHorizontal: 20, marginVertical: 20, textAlignVertical: 'top', }}
                multiline={true}
                blurOnSubmit={false}
                value={value}
                onChangeText={setValue}
                placeholder={t('10자 이상 내용을 입력해주세요.')} />) : null
            }
          </View>
        </ScrollView>
      }
      <TouchableOpacity
        onPress={() => SendReviewComplete()}
        style={[{ alignItems: 'center', justifyContent: 'center', height: 60, backgroundColor: colors.GREEN_COLOR_2 }]}>
        <Text style={[style.text_sb, { color: colors.WHITE_COLOR, fontSize: 18 }]}>
          {t('후기 보내기')}
        </Text>
      </TouchableOpacity>
      <BackHandlerCom />
    </SafeAreaView>
  );
}

const styled = StyleSheet.create({
  chooseBox: {
    // width: 110,
    flex: 1,
    height: 153,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.GRAY_COLOR_1,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  choosedBox: {
    // width: 110,
    paddingHorizontal: 20,
    flex: 1,
    height: 153,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.GRAY_COLOR_1,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.GREEN_COLOR_3,
  },
  ImageBox: {
    width: 56, height: 56,
  },
  InnerText: {
    fontSize: 13,
    color: colors.BLACK_COLOR_2,
    marginTop: 15,
    marginBottom: 4
  },
  InnerText2: {
    fontSize: 13,
    color: colors.GRAY_COLOR_2
  },
  choosedInnerText: {
    fontSize: 13,
    color: colors.GREEN_COLOR_3,
    marginTop: 15,
    marginBottom: 4
  },
  choosedInnerText2: {
    fontSize: 13,
    color: colors.GREEN_COLOR_3,
  }


})