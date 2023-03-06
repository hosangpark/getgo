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
  SafeAreaView, ScrollView, Text, View, StyleSheet, FlatList, Image
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { QuestionHeader } from '../../../components/header/QuestionHeader'
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import { useSelector } from 'react-redux';
import { foramtDate } from '../../../components/utils/funcKt';
import LoadingIndicator from '../../../components/layout/Loading';
import { NodataView } from '../../../api/Api';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

export interface ddtype {
  qt_idx: number,
  qt_title: string,
  qt_status: boolean,
  qt_wdate: string
}


const Inquiry = () => {

  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const userInfo = useSelector((state: any) => state.userInfo);
  const { t } = useTranslation()
  const [isloading, setIsLoading] = useState(true);
  /** todo */
  const Inquiry_1_1Detail = (item: any) => {
    navigation.navigate('Inquiry_1_1Detail', item);
  }
  const InquiryUpload = () => {
    navigation.navigate('Inquiry_1_1Upload', { type: '1_1Upload' });
  }

  const [inquiry, setInquiry] = React.useState([
  ])
  const getData = async () => {
    await client({
      method: 'get',
      url: '/customer/qna-list?',
      params: {
        mt_idx: userInfo.idx
      }
    }).then(
      res => {
        setInquiry(res.data)
        setIsLoading(false)
      }
    ).catch(
      err => {
        console.log(err)
        setIsLoading(false)
      }
    )
  };

  /** 정보 받아오기 */
  React.useEffect(() => {
    navigation.addListener('focus', () => {
      getData();
    })
  }, []);



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <QuestionHeader title={t('1:1 문의하기')} subtitle={t('문의하기')} action={InquiryUpload} />
      {isloading ?
        <LoadingIndicator />
        :

        <FlatList data={inquiry}
          ListEmptyComponent={<NodataView></NodataView>}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }: any) => (
            <TouchableOpacity style={{
              flexDirection: 'row', alignItems: 'center',
              paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: colors.GRAY_COLOR_3, paddingHorizontal: 20,
            }}
              onPress={() => { Inquiry_1_1Detail(item) }}
            >
              <View style={{ flex: 5 }} key={item.qt_idx}>
                <Text style={[style.text_sb, { fontSize: 15, color: colors.BLACK_COLOR_1 }]}>
                  {item.qt_title}
                </Text>
                <Text style={[style.text_re, { fontSize: 13, color: colors.GRAY_COLOR_2, marginTop: 4 }]}>
                  {foramtDate(item.qt_wdate)}
                </Text>
              </View>
              <View style={{ flex: 2, flexDirection: 'column', alignItems: 'flex-end' }}>
                {item.qt_status == 'N' ? (
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={[style.text_me, { color: colors.GRAY_COLOR_2, fontSize: 13, backgroundColor: colors.GRAY_COLOR_1, paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20 }]}>
                      {t('미답변')}
                    </Text>
                  </View>
                ) : (
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={[style.text_me, { color: colors.BLUE_COLOR_1, fontSize: 13, backgroundColor: colors.GRAY_COLOR_1, paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20 }]}>
                        {t('답변완료')}
                      </Text>
                    </View>
                  )}
              </View>
            </TouchableOpacity>
          )}
        />
        // <View style={{flex:1}}>
        //   <Text style={[style.text_sb,{fontSize:15,color:colors.BLACK_COLOR_1}]}>
        //   {t('문의내용없음')}
        //   </Text>
        // </View>
      }
      <BackHandlerCom />
    </SafeAreaView>
  );
};

export default Inquiry;
