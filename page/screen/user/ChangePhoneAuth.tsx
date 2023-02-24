/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { RouteProp } from '@react-navigation/native';

import {SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { BackHeader } from '../../../components/header/BackHeader';
import { CustomButton } from '../../../components/layout/CustomButton';
import cusToast from '../../../components/navigation/CusToast';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { SelectBox } from '../../../components/layout/SelectBox';
import { OptionType } from '../../../components/types/componentType';
import { frontPhoneList } from '../../../components/static/staticList';
import { useTranslation } from 'react-i18next';
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const ChangePhoneAuth = () => {

    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    const {t} = useTranslation()
    const [inputInfo, setInputInfo] = React.useState({
        phone : '',
        email : '',
    })
    const [emailAuth, setEmailAuth] = React.useState<boolean>(false);

    const [selectPhone, setSelPhone] = React.useState<OptionType>({
        label : '+82', value : '82' , sel_id:1
    })

    const phoneSelect = (item:OptionType) => {
        setSelPhone({...item});
    }
    const inputControl = (type:string,text:string) => {
        setInputInfo({...inputInfo, [type]:text});
    }

    const action = () =>{
        navigation.navigate('Main');
    }

    React.useEffect(()=>{
        console.log(emailAuth);
    },[emailAuth])

    return (
        <SafeAreaView style={{flex:1}}>
            <BackHeader title={t('휴대폰 번호 변경하기')}/>
            <ScrollView style={[style.default_background,{ flexGrow: 1, paddingHorizontal:20}]}>
                <View style={{marginTop:20,flexDirection:'row'}}>
                    <Text style={[style.text_b,{fontSize:15,color:colors.BLACK_COLOR_2}]}>{t('기존 휴대폰 번호')} 
                    </Text>
                    <Text style={[style.text_sb,{color:colors.GREEN_COLOR_3,marginLeft:3}]}>*</Text>
                </View>
                <View style={{marginTop:10,flexDirection:'row'}}>
                    <View style={{flex:4}}>
                        <SelectBox 
                            selOption={selectPhone}
                            options={frontPhoneList}
                            action={phoneSelect}
                            height={45}
                            paddingVertical={10}
                            overScrollEnable={()=>{}}
                        />
                    </View>
                    <View style={{flex:7,marginLeft:10}}>
                    <TextInput 
                        style={style.input_container} 
                        value={inputInfo.phone} 
                        onChangeText={text=>{inputControl('phone',text)}}
                        placeholder={t('번호를 입력해주세요.')}
                        keyboardType={'number-pad'}
                    />
                    </View>
                </View>

                <View style={{marginTop:30}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={[style.text_b,{fontSize:15,color:colors.BLACK_COLOR_2}]}>{t('이메일주소')}
                        </Text>
                        <Text style={[style.text_sb,{color:colors.GREEN_COLOR_3,marginLeft:3}]}>*</Text>
                    </View>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={{flex:8}}>
                            <TextInput 
                                style={[style.input_container,{marginTop:5}]}
                                placeholder={t('이메일을 입력해주세요.')}
                                value={inputInfo.email}
                                onChangeText={(text)=>{inputControl('email',text)}}
                                keyboardType={'email-address'}
                            />
                        </View>
                        <View style={{flex:3,marginTop:5,marginLeft:10}}>
                            <CustomButton 
                                disable={inputInfo.email == ''}
                                title={t('인증요청')}
                                buttonType={'green'}
                                action={()=>{setEmailAuth(true)}}
                            />
                        </View>
                    </View>
                    
                    {emailAuth &&
                        <Text style={[style.text_re,{marginTop:5,fontSize:13,color:colors.BLUE_COLOR_1}]}>{t('인증되었습니다!')}</Text>
                    }
                </View>
                <View style={[style.gray_box,{marginTop:20,paddingHorizontal:20,paddingVertical:20,borderRadius:6,alignItems:'center',justifyContent:'center'}]}>
                    <Text style={[style.text_re,{lineHeight:20, textAlign:'center',fontSize:13,color:colors.GRAY_COLOR_2}]}>
                    {t('앱 사용시 이메일주소(인증완료) 등록을 하지 않으셨다면 GETGO 고객센터로 바로 문의해주세요.')}</Text>
                </View>
            </ScrollView>
            <View style={style.bottom_wrapper}>
                <TouchableOpacity 
                    onPress={()=>{
                        navigation.navigate('ChangePhone',{
                            phone:inputInfo.phone,
                            email:inputInfo.email,
                            areaCode:selectPhone.value,
                            areaCodeLabel:selectPhone.label,
                        })
                    }} 
                    disabled={inputInfo.phone == '' || !emailAuth} 
                    style={[style.bottom_btn, inputInfo.phone != '' && emailAuth ? style.bottom_btn_green : style.bottom_btn_gray]}
                >
                    <Text style={[style.text_sb,{fontSize:18, color:inputInfo.phone != '' && emailAuth ? colors.WHITE_COLOR : colors.GRAY_COLOR_4}]}>{t('다음')}</Text>
                </TouchableOpacity>
            </View>
            <BackHandlerCom />
        </SafeAreaView>
    );
};

export default ChangePhoneAuth;

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