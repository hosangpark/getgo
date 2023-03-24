import React, { useState } from "react";
import {
  Alert,
  SafeAreaView, Image, Text, View, FlatList, ScrollView
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../assets/style/style';
import { colors } from '../../assets/color';
import { ChatItemType } from "../types/componentType";
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../types/routerTypes';
import { foramtDate } from "../utils/funcKt";
import Api from '../../api/Api';



export const ChatList = ({ item, Delete, Enter, Toggle, noticeOnOff, listmodal, isSeller }:
  ({ item: ChatItemType, Delete: (e: number) => void, Enter: (e: ChatItemType) => void, Toggle: (itemid: number) => void, noticeOnOff: (e: { chr_id: number, ctt_push: string }) => void, listmodal: any, isSeller: Boolean })
) => {
  const { t, i18n } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const ToggleBridge = (e: { chr_id: number, ctt_push: string }) => {
    noticeOnOff(e)
  }


  console.log('item', item)

  const newCttPush = isSeller ? item.ctt_push_seller : item.ctt_push;

  i18n
  return (
    <View key={item.chr_id}
      style={{
        paddingVertical: 17, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', overflow: 'visible',
        flex: 1, position: 'relative',
      }}
    >
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <TouchableOpacity style={{ flexDirection: 'row' }}
          onPress={() => Enter(item)}>
          {/* onPress={()=>navigation.navigate('ReviewDetail',item)}> */}
          <Image style={{ width: 40, height: 40, borderRadius: 50, marginRight: 20 }} source={item.mt_image1 ? {
            uri: Api.state.imageUrl + item.mt_image1
          }
            : require('../../assets/img/img_profile.png')
          } />
          <View style={{ width: '80%' }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', }}>
              <Text style={[style.text_sb, { fontSize: 12, color: colors.BLACK_COLOR_1, marginRight: 5, }]}>
                {item.mt_nickname}
              </Text>
              <Text style={[style.text_li, { fontSize: 12, color: colors.GRAY_COLOR_2 }]}>
                {item.mt_area} / {foramtDate(item.crt_last_date, i18n.language)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, }}>
              {newCttPush == "Y" ?
                null
                :
                <Text style={{ color: 'red', marginRight: 5, justifyContent: 'center' }}>
                  {t("차단중")}
                  {/* <Image style={{width:20,height:20}} source={require('../../assets/img/top_alim.png')}/> */}
                </Text>
              }
              <Text style={[style.text_re, { fontSize: 15, color: colors.BLACK_COLOR_2 }]} numberOfLines={1}>
                {item.ctt_msg}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', }}>
        <TouchableOpacity onPress={() => Toggle(item.chr_id)} style={{ flex: 3 }}>
          <Image style={{ width: 28, height: 28 }} source={require('../../assets/img/top_menu.png')} />
        </TouchableOpacity>
      </View>
      <View style={{
        position: 'absolute', backgroundColor: colors.WHITE_COLOR, right: 35, top: 20, borderRadius: 5, elevation: 10, paddingVertical: 15
      }}>
        {listmodal == item.chr_id &&
          <>
            <TouchableOpacity style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 25 }}
              onPress={() => ToggleBridge({ chr_id: item.chr_id, ctt_push: newCttPush })}
            >
              <Text style={[style.text_me, { fontSize: 14, color: colors.BLACK_COLOR_1 }]}>
                {newCttPush == 'Y' ?
                  t('알림 끄기')
                  :
                  t('알림 켜기')
                }
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, paddingVertical: 10, paddingHorizontal: 25 }}
              onPress={() => Delete(item.chr_id)}
            >
              <Text style={[style.text_me, { fontSize: 14, color: colors.BLACK_COLOR_1 }]}>
                {t('채팅방삭제')}
              </Text>
            </TouchableOpacity>
          </>
        }
      </View>
    </View>
  )

}