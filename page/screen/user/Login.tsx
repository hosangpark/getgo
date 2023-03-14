/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import Timer from '../../../components/utils/Timer';
import { SafeAreaView, ScrollView, Text, View, Image, StyleSheet, Button, TouchableOpacity, TextInput, Linking } from 'react-native';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { BackHeader } from '../../../components/header/BackHeader';
import { SelectBox } from '../../../components/layout/SelectBox';
import { OptionType } from '../../../components/types/componentType';
import { CustomButton } from '../../../components/layout/CustomButton';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import logsStorage from '../../../components/utils/logStorage';
import client from '../../../api/client';
import * as UserInfoAction from '../../../redux/actions/UserInfoAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cusToast from '../../../components/navigation/CusToast';
import Api from '../../../api/Api';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const Login = () => {
    const { t,i18n } = useTranslation()
    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

    const [phoneOptions] = React.useState([
        { label: '+82', value: '82', sel_id: 1 },
        { label: '+62', value: '62', sel_id: 2 },
    ])
    const [selectPhone, setSelPhone] = React.useState<OptionType>({
        label: '+82', value: '82', sel_id: 1
    })
    const [timer, setTimer] = React.useState<boolean>(false); //타이머 시작/끝 감지
    const [timerReset, setTimerReset] = React.useState<boolean>(false); //타이머 리셋

    const [inputLoginInfo, setInputLoginInfo] = React.useState<any>({
        areaCode: '',
        mt_hp: '',
    })
    const [authBtnTitle, setAuthBtnTitle] = React.useState('인증요청');
    const [authCode, setAuthCode] = React.useState('');
    const [inputAuth, setInputAuth] = React.useState('');
    const inputControl = (type: string, text: string) => {
        setInputLoginInfo({ ...inputLoginInfo, [type]: text, areaCode: selectPhone.value });
    }
    const [isInputEnd, setIsInputEnd] = React.useState(false);

    const phoneSelect = (item: OptionType) => {
        setSelPhone({ ...item });
    }



    const sendCode = () => {
        const getAuthPhoneCode = async () => {
            await client<{ data: string, auth_number: string }>({
                method: 'post',
                url: '/user/auth-login_send',
                data: {
                    mt_na: inputLoginInfo.areaCode,
                    mt_hp: inputLoginInfo.mt_hp,
                }
            }).then(res => {
                console.log(res.data)
                setAuthCode("1234")
                setAuthCode(res.data.auth_number);
                /**자동 인증번호 입력 (임시) */
                setInputAuth(res.data.auth_number)
                // setInputAuth("1234")
            }).catch(error => {
                console.log(error)
            })
        }
        getAuthPhoneCode();

    }
    const resendCode = () => {
        setTimerReset(true);
        const getRecode = async () => {
            await client<{ data: string, auth_number: string }>({
                method: 'post',
                url: '/user/auth-login_send',
                data: {
                    mt_na: inputLoginInfo.areaCode,
                    mt_hp: inputLoginInfo.mt_hp,
                }
            }).then(res => {
                console.log(res.data)
                // setAuthCode("1234")
                setAuthCode(res.data.auth_number);
                /**자동 인증번호 입력 (임시완) */
                setInputAuth(res.data.auth_number)
                // setInputAuth("1234")
            }).catch(error => {
                console.log(error)
            })
        }
        getRecode();
        // setTimer(false);
    }
    /**자동로그인 */
    const setAutoUserData = async (userdata: { [key: string]: string }) => {
        await AsyncStorage.setItem('userIdx', JSON.stringify(userdata))
    }


    const LoginComplete = async () => {
        await client<{ message: string, user_idx: string, idx: string }>({
            method: 'post',
            url: '/user/auth',
            data: {
                mt_na: inputLoginInfo.areaCode,
                mt_hp: inputLoginInfo.mt_hp,
                // auth_number: '1234'
                auth_number: authCode,
                mt_app_token: Api.state.mb_fcm
            }
        }).then(res => {
            setAutoUserData({ idx: res.data.user_idx, mt_app_token: Api.state.mb_fcm,language:i18n.language })
            navigation.navigate('SelectLogin')
            cusToast(t(res.data.message))
        }).catch(error => {
            console.log(error)
            // cusToast(
            //     t('기존 정보가 없습니다.')
            // )
        })
    }



    React.useEffect(() => {
        if (inputAuth && inputAuth == authCode) {
            setIsInputEnd(true);
        }
        else {
            setIsInputEnd(false);
        }
    }, [inputAuth])


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BackHeader title="" />
            <ScrollView style={[style.default_background, { flexGrow: 1, paddingHorizontal: 20 }]}>

                <View style={{ marginTop: 40 }}>
                    <Text style={[style.text_b, { fontSize: 22, color: colors.BLACK_COLOR_2 }]}>
                        {t('어서오세요!')}
                    </Text>
                    <Text style={[style.text_b, { fontSize: 22, color: colors.BLACK_COLOR_2 }]}>
                        {t('휴대폰 번호로 로그인해주세요.')}
                    </Text>
                    <Text style={[style.text_b, { fontSize: 22, color: colors.BLACK_COLOR_2 }]}>
                        {t('인증번호')}
                    </Text>
                </View>

                <View style={{ marginTop: 60 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_2 }]}>
                            {t('휴대폰번호')}
                        </Text>
                        <Text style={[style.text_me, { fontSize: 15, color: colors.GREEN_COLOR_3 }]}> *</Text>
                    </View>
                </View>
                <View style={{ marginTop: 10, flexDirection: 'row' }}>
                    <View style={{ flex: 4 }}>
                        <SelectBox
                            selOption={selectPhone}
                            options={phoneOptions}
                            action={phoneSelect}
                            height={45}
                            paddingVertical={10}
                            overScrollEnable={() => { }}
                        />
                    </View>
                    <View style={{ flex: 7, marginLeft: 10 }}>
                        <TextInput
                            style={style.input_container}
                            value={inputLoginInfo.mt_hp}
                            onChangeText={text => { inputControl('mt_hp', text) }}
                            placeholder={t('번호를 입력해주세요.')}
                            keyboardType='number-pad'
                        />
                    </View>
                </View>

                <View style={{ marginTop: 8 }}>
                    {authCode == '' ?
                        <CustomButton title={t('인증요청')} buttonType='green' action={sendCode} disable={inputLoginInfo.mt_hp == ''} />
                        :
                        <View>
                            <TouchableOpacity
                                onPress={resendCode}
                                style={[btnStyle.green_btn, { flexDirection: 'row' }]}
                            >
                                <Text style={btnStyle.green_font}>{t('인증번호 다시받기')}
                                </Text>
                                <View style={{ width: 50, marginLeft: 5 }}>
                                    <Timer
                                        mm={5}
                                        ss={0}
                                        timeover={() => setTimer(false)}
                                        reset={timerReset}
                                        setReset={setTimerReset}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    }
                </View>

                <View style={{ marginTop: 10 }}>
                    <TextInput
                        style={style.input_container}
                        value={inputAuth}
                        onChangeText={text => { setInputAuth(text) }}
                        placeholder={t('인증번호 입력')}
                        keyboardType='number-pad'
                    />
                </View>

                <View style={[style.gray_box, { borderRadius: 6, marginTop: 20 }]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={[style.text_me, { fontSize: 13 }]}>
                            {t('서비스 약관동의')}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SettingTerms')}>
                            <Text style={[style.text_re, { fontSize: 13, textDecorationLine: 'underline', color: colors.GRAY_COLOR_2 }]}>
                                {t('자세히 보기')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={[style.text_me, { fontSize: 13 }]}>{t('개인정보 처리방침')}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SettingPolicy')}>
                            <Text style={[style.text_re, { fontSize: 13, textDecorationLine: 'underline', color: colors.GRAY_COLOR_2 }]}>
                                {t('자세히 보기')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={[style.text_me, { fontSize: 13 }]}>{t('위치기반서비스')}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SettingServiceLocation')}>
                            <Text style={[style.text_re, { fontSize: 13, textDecorationLine: 'underline', color: colors.GRAY_COLOR_2 }]}>
                                {t('자세히 보기')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: 20, justifyContent: 'center' }}>
                    <Text style={[style.text_re, { fontSize: 13, color: colors.GRAY_COLOR_2 }]}>
                        {t('휴대폰 번호가 변경되었나요?')}
                    </Text>
                    <TouchableOpacity onPress={() => { navigation.navigate('ChangePhoneAuth') }}>
                        <Text style={[style.text_b, { marginLeft: 10, color: colors.GREEN_COLOR_2, textDecorationLine: 'underline', fontSize: 13 }]}>
                            {t('번호변경하기')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={style.bottom_wrapper}>
                <TouchableOpacity onPress={LoginComplete} disabled={!isInputEnd} style={[style.bottom_btn, isInputEnd ? style.bottom_btn_green : style.bottom_btn_gray]}>
                    <Text style={[style.text_sb, { fontSize: 18, color: isInputEnd ? colors.WHITE_COLOR : colors.GRAY_COLOR_4 }]}>
                        {t('동의하고 시작하기')}</Text>
                </TouchableOpacity>
            </View>
            <BackHandlerCom />
        </SafeAreaView>
    );
};

const btnStyle = StyleSheet.create({
    green_btn: {
        backgroundColor: colors.GREEN_COLOR_2,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
    },
    green_font: {
        fontSize: 15,
        color: colors.WHITE_COLOR,
    },
})

export default Login;