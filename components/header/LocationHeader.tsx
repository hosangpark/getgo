import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { MainNavigatorParams } from '../types/routerTypes';

import {Image, Pressable, Text, View, TouchableOpacity,TextInput, NativeSyntheticEvent, TextInputTextInputEventData} from 'react-native';
import style from '../../assets/style/style';
import { BackHeaderType, LocationHeaderType } from '../types/componentType';
import { colors } from '../../assets/color';
import Geolocation from '@react-native-community/geolocation';
import { requestPermission } from '../utils/getLocation';
import { useTranslation } from 'react-i18next';

export const LocationHeader = ({value,setValue,searchPlace}:LocationHeaderType) => {
    
    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

    const {t} = useTranslation()

    const changeSearch = (text:string) => {
        setValue(text);
    }

    

    return(
        <View style={[style.header_,{backgroundColor:'#ffffff',justifyContent:'flex-end',paddingHorizontal:20}]}>
            <TouchableOpacity onPress={()=>{navigation.goBack();}} style={[{position:'absolute',left:20,width:50,height:50,justifyContent:'center'}]}>
                <Image style={{width:28,height:28}} source={require('../../assets/img/top_back_b.png')}></Image>
            </TouchableOpacity>
            <View style={[{backgroundColor:colors.GRAY_COLOR_1,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:colors.GRAY_COLOR_3,paddingHorizontal:20,borderRadius:75,width:'85%',height:38}]}>
                <TextInput onChangeText={(text)=>changeSearch(text)} onSubmitEditing={()=>searchPlace?.()} style={{height:38}} value={value} 
                placeholder={t("동명으로 검색 (ex. Cimohong)")}/>
                <TouchableOpacity onPress={()=>{searchPlace?.()}} style={{width:30,height:30,alignItems:'flex-end',justifyContent:'center'}}>
                    <Image source={require('../../assets/img/top_search.png')} style={{width:24,height:24}}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}