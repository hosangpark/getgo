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
import Timer from '../../../components/utils/Timer';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import { useDispatch, useSelector } from 'react-redux';
import logsStorage from '../../../components/utils/logStorage';
import * as UserInfoAction from '../../../redux/actions/UserInfoAction';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */


type Props = StackScreenProps<MainNavigatorParams, 'ChangePhone'>

const ChangePhone = ({route}:Props) => {

    const {phone,areaCode,email,areaCodeLabel} = route.params;
    const {t} = useTranslation()

    const userInfo = useSelector((state:any) => state.userInfo);
    const dispatch = useDispatch()
    
    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

    const [selectPhone, setSelPhone] = React.useState<OptionType>({
        label : '+82', value : '82' , sel_id:1
    })

    const [inputPhoneInfo, setInputPhoneInfo] = React.useState({ //
        areaCode : '',
        mt_hp : '',
    });

    const [authCode, setAuthCode] = React.useState(''); //발송된 인증번호
    const [inputAuth, setInputAuth] = React.useState(''); //인증번호 입력

    const [timer, setTimer] = React.useState<boolean>(false); //타이머 시작/끝 감지
    const [timerReset, setTimerReset] = React.useState<boolean>(false); //타이머 리셋

    const [authSuccess, setAuthSuccess] = React.useState<boolean>(false)

    const inputControl = (type:string,text:string) => {
        setInputPhoneInfo({...inputPhoneInfo, [type]:text,areaCode:selectPhone.value});
    }

    const phoneSelect = (item:OptionType) => {
        setSelPhone({...item});
    }

    const sendCode = () => {
        /** 중복체크 & 핸드폰 인증 정보 저장 */
        const getCode = async() => {
            await client<{data:string,auth_number:string}>({
                method: 'post',
                url: '/user/auth-send-hp',
                data:{
                    mt_na:inputPhoneInfo.areaCode,
                    mt_hp:inputPhoneInfo.mt_hp,
                }
                }).then(res=>{
                console.log(res.data)
                setAuthCode(res.data.auth_number);
                }).catch(error=>{
                console.log(error)
                })
            }
            getCode();
        setTimer(true);
    }

    const resendCode = () => {
        setTimerReset(true);
        const getRecode = async () => {
            await client<{data:string,auth_number:string}>({
                method: 'post',
                url: '/user/auth-send-hp',
                data:{
                    mt_na:inputPhoneInfo.areaCode,
                    mt_hp:inputPhoneInfo.mt_hp,
                }
                }).then(res=>{
                console.log(res.data)
                setAuthCode(res.data.auth_number);
                }).catch(error=>{
                console.log(error)
                })
            }
            getRecode();
        // setTimer(false);
    }

    const changePhoneAccess = () => {
        const getAuthPhoneChange = async () => {
            await client<{data:string,auth_number:string}>({
                method: 'post',
                url: '/user/change_hp',
                data:{
                    pre_mt_hp:route.params.areaCode+route.params.phone,
                    mt_na:inputPhoneInfo.areaCode,
                    mt_hp:inputPhoneInfo.mt_hp,
                    auth_number:authCode,
                }
                }).then(res=>{
                console.log(res.data)
                }).catch(error=>{
                console.log(error)
                })
            }
            getAuthPhoneChange();
        if(userInfo){
            let params={
                ...userInfo,
                mt_na:inputPhoneInfo.areaCode,
                mt_hp:inputPhoneInfo.mt_hp,
            }
            dispatch(UserInfoAction.updateUserInfo(JSON.stringify(params)));
            logsStorage.set(userInfo)
        }
        navigation.navigate('ChangePhoneResult',{
            beforePhone:phone,
            beforeAreaCode:areaCodeLabel,
            afterPhone:inputPhoneInfo.mt_hp,
            afterAreaCode:selectPhone.label,
        })
    }

    React.useEffect(()=>{
        if(inputAuth != '' && authCode != ''){
            if(authCode == inputAuth){
                setAuthSuccess(true);
            }
            else{
                setAuthSuccess(false);
            }
        }
    },[inputAuth])
    React.useEffect(()=>{
        console.log(route.params.areaCode+route.params.phone)
    },[])

    return (
        <SafeAreaView style={{flex:1}}>
            <BackHeader title={t('휴대폰 번호 변경하기')}/>
            <ScrollView style={[style.default_background,{ flexGrow: 1, paddingHorizontal:20}]}>
                <View style={{marginTop:20}}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={[style.text_b,{fontSize:15,color:colors.BLACK_COLOR_2}]}>{t('휴대폰번호')}</Text>
                        <Text style={[style.text_me,{fontSize:15,color:colors.GREEN_COLOR_3}]}> *</Text>
                    </View>
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
                        value={inputPhoneInfo.mt_hp} 
                        onChangeText={text=>{inputControl('mt_hp',text)}}
                        placeholder={t('번호를 입력해주세요.')}
                        keyboardType={'number-pad'}
                    />
                    </View>
                </View>

                <View style={{marginTop:8}}>
                    {authCode == '' ?
                        <CustomButton title={t('인증요청')}buttonType='green' action={sendCode} disable={inputPhoneInfo.mt_hp == ''}/>
                        :
                        <View>
                            <TouchableOpacity 
                                onPress={resendCode}
                                style={[btnStyle.green_btn,{flexDirection:'row'}]}
                            >
                                <Text style={btnStyle.green_font}>{t('인증번호 다시받기')}(</Text>
                                <Timer 
                                    mm={5}
                                    ss={0}
                                    timeover={()=>setTimer(false)}
                                    reset={timerReset}
                                    setReset={setTimerReset}
                                />
                                <Text style={btnStyle.green_font}>)</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                {authCode !== '' &&
                    <View style={{marginTop:10}}>
                        <TextInput 
                            style={style.input_container} 
                            value={inputAuth} 
                            onChangeText={text=>{setInputAuth(text)}}
                            placeholder={t('인증번호 입력')}
                            keyboardType='number-pad'
                        />
                    </View>
                }
            </ScrollView>
            <View style={style.bottom_wrapper}>
                <TouchableOpacity 
                    onPress={()=>{changePhoneAccess();}} 
                    disabled={inputPhoneInfo.mt_hp == '' || inputAuth == ''} 
                    style={[style.bottom_btn, inputPhoneInfo.mt_hp != '' && authSuccess ? style.bottom_btn_green : style.bottom_btn_gray]}
                >
                    <Text style={[style.text_sb,{fontSize:18, color:inputPhoneInfo.mt_hp != '' && authSuccess ? colors.WHITE_COLOR : colors.GRAY_COLOR_4}]}>{t('변경하기')}</Text>
                </TouchableOpacity>
            </View>
            <BackHandlerCom />
        </SafeAreaView>
    );
};

export default ChangePhone;

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