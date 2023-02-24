

import React,{useState} from 'react';
import { NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputChangeEventData, TextInputProps, TouchableOpacity, View } from 'react-native';
import { colors } from '../../assets/color';
import { CustomTabType } from '../types/componentType';
import style from '../../assets/style/style';

export const CustomTab = ({title1, title2 }:CustomTabType) => {

    /**탭 버튼 */
    const [NotiTap, serNotif1] = useState(false)
    const Noti_tap1_on = () => {
      if(!NotiTap) serNotif1(!NotiTap)
    }
    const Noti_tap2_on = () => {
      if(NotiTap) serNotif1(!NotiTap)
    }
    return(
      <View style={{flexDirection:'row',backgroundColor:colors.GREEN_COLOR_2, height:44,alignItems:'center'}}>
        <View style={{flex:1,alignItems:'center'}}>
          <TouchableOpacity 
          onPress={Noti_tap1_on}>
            <Text style={
              NotiTap? [style.text_b , {color:colors.WHITE_COLOR, fontSize:15, borderBottomWidth:4, borderColor:colors.WHITE_COLOR,paddingVertical:10
              }] : [style.text_re , {color:colors.WHITE_COLOR, fontSize:15}]
            }>
            {title1}</Text>
          </TouchableOpacity>
        </View>
        <View style={{flex:1,alignItems:'center'}}>
        <TouchableOpacity 
        onPress={Noti_tap2_on}>
          <Text style={
            !NotiTap? [style.text_b , {color:colors.WHITE_COLOR, fontSize:15, borderBottomWidth:4, borderColor:colors.WHITE_COLOR,paddingVertical:10
            }] : [style.text_re , {color:colors.WHITE_COLOR, fontSize:15}]
          }>
            {title2}</Text>
        </TouchableOpacity>
        </View>
      </View>
    )
}
