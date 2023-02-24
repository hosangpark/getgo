/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp,StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { RouteProp } from '@react-navigation/native';

import {SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { BackHeader } from '../../../components/header/BackHeader';
import { CustomButton } from '../../../components/layout/CustomButton';
import cusToast from '../../../components/navigation/CusToast';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

type Props = StackScreenProps<MainNavigatorParams, 'ChangePhoneResult'>

const ChangePhoneResult = ({route}:Props) => {

    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

    const {t} = useTranslation()

    const {afterAreaCode,afterPhone,beforeAreaCode,beforePhone} = route.params;

    return (
        <SafeAreaView style={{flex:1}}>
            <BackHeader title=""/>
            <ScrollView style={[style.default_background,{ flexGrow: 1, paddingHorizontal:20}]}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:40}}>
                    <View style={{width:'50%'}}>
                        <Text style={[style.text_b,{fontSize:22,color:colors.BLACK_COLOR_2,}]}>{t('휴대폰 번호 변경이 완료되었습니다.')}</Text>
                    </View>
                    <Image source={require('../../../assets/img/img_mobile.png')} style={{width:64,height:64}} />
                </View>

                <View style={[style.gray_box,{alignItems:'center',justifyContent:'center',marginTop:30,paddingVertical:40,borderRadius:6}]}>
                    <View style={{alignItems:'center'}}>
                        <Text style={[style.text_re,{fontSize:15,color:colors.BLACK_COLOR_2}]}>{t('기존 휴대폰 번호')}</Text>
                        <Text style={[style.text_b,{fontSize:20,color:colors.BLACK_COLOR_2}]}>{beforeAreaCode} {beforePhone}</Text>
                    </View>
                    <Image source={require('../../../assets/img/ico_select.png')} style={{width:20,height:20,marginVertical:10}} />
                    <View style={{alignItems:'center'}}>
                        <Text style={[style.text_re,{fontSize:15,color:colors.GREEN_COLOR_2}]}>{t('변경된 휴대폰 번호')}</Text>
                        <Text style={[style.text_b,{fontSize:20,color:colors.GREEN_COLOR_2}]}>{afterAreaCode} {afterPhone}</Text>
                    </View>
                </View>
            </ScrollView>
            <View style={style.bottom_wrapper}>
                <TouchableOpacity 
                    onPress={()=>{
                        navigation.navigate('SelectLogin');
                    }} 
                    disabled={false} 
                    style={[style.bottom_btn, style.bottom_btn_green]}
                >
                    <Text style={[style.text_sb,{fontSize:18, color:colors.WHITE_COLOR}]}>{t('확인')}</Text>
                </TouchableOpacity>
            </View>
            <BackHandlerCom />
        </SafeAreaView>
    );
};

export default ChangePhoneResult;

const btnStyle= StyleSheet.create({
    green_btn : {
        backgroundColor:colors.GREEN_COLOR_2,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        height:45,
    },
    green_font : {
        fontSize:15,
        color:colors.WHITE_COLOR,
    },
})