import React, { useState } from "react";
import {
  Alert,
  SafeAreaView, Image, Text, View, FlatList, ScrollView
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../assets/style/style';
import { colors } from '../../assets/color';
import { ReviewItemType } from "../types/componentType";
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../components/types/routerTypes';
import Api from "../../api/Api";



export const ReviewList = ({ item, deleteReview, Toggle, listmodal, setListmodal }:
  ({ item: ReviewItemType, deleteReview: (item: ReviewItemType) => void, Toggle: (itemid: number) => void, listmodal: any, setListmodal: (e: boolean) => void })
) => {
  const { t, i18n } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const [noticeState, noticeToggle] = useState(false)

  const enterReview = () => {
    navigation.navigate('ReviewDetail', { rt_idx: item.rt_idx, isMy: false })
  }

  return (
    <View
      style={{
        paddingVertical: 17, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', overflow: 'visible',
        flex: 1, position: 'relative',
      }}
    >
      <View style={{ flexDirection: 'row', flex: 10 }}>
        <TouchableOpacity style={{ flexDirection: 'row' }}
          onPress={() => enterReview(item)}>
          {/* onPress={()=>navigation.navigate('ReviewDetail',item)}> */}
          <Image style={{ width: 40, height: 40, borderRadius: 50, marginRight: 20 }} source={item.review_image1 ? {
            uri: Api.state.imageUrl + item.review_image1
          }
            : item.mt_image1 ? { uri: Api.state.imageUrl + item.mt_image1 }
              :
              require('../../assets/img/img_profile.png')
          } />
          <View style={{ width: '80%' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[style.text_sb, { fontSize: 12, color: colors.BLACK_COLOR_1 }]}>
                {item.mt_nickname || item.review_nickname}
              </Text>
              <Text style={[style.text_li, { fontSize: 12, color: colors.GRAY_COLOR_2, marginLeft: 5 }]}>
                {item.pt_area} / {(item.rt_wdate)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, }}>
              <Text style={[style.text_re, { fontSize: 15, color: colors.BLACK_COLOR_2 }]} numberOfLines={1}>
                {item.rt_content}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <TouchableOpacity onPress={() => Toggle(item.rt_idx)} style={{ flex: 3 }}>
          <Image style={{ width: 28, height: 28 }} source={require('../../assets/img/top_menu.png')} />
        </TouchableOpacity>
      </View>
      {listmodal == item.rt_idx ?
        <View style={{
          position: 'absolute', backgroundColor: colors.WHITE_COLOR, right: 35, top: 20, borderRadius: 5, elevation: 10,
          paddingVertical: 15, zIndex: 999
        }}>
          <TouchableOpacity style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 25 }}
            onPress={() => deleteReview(item.rt_idx)}
          >
            <Text style={[style.text_me, { fontSize: 14, color: colors.BLACK_COLOR_1 }]}>
              {t('리뷰삭제')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 25 }}
            onPress={() => Toggle(item.rt_idx)}
          >
            <Text style={[style.text_me, { fontSize: 14, color: colors.BLACK_COLOR_1 }]}>
              {t('닫기')}
            </Text>
          </TouchableOpacity>

        </View> : null
      }
    </View>
  )

}