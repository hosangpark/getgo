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

import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { BackHeader } from '../../../components/header/BackHeader';
import { CustomButton } from '../../../components/layout/CustomButton';
import cusToast from '../../../components/navigation/CusToast';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';


import { connect, useDispatch, useSelector } from 'react-redux';
import { reduxStateType } from '../../../components/types/reduxTypes';
import * as UserInfoAction from '../../../redux/actions/UserInfoAction';
import { validateEmail } from '../../../components/utils/funcKt';
import client from '../../../api/client';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const JoinStep4 = () => {

    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    const { t } = useTranslation()
    const [inputEmail, setInputEmail] = React.useState('');
    const [isAuthEmail, setIsAuthEmail] = React.useState(false);
    const [emailcheck, setEmailcheck] = React.useState(false)
    const [change, setChange] = React.useState(false)
    const userInfo = useSelector((state: any) => state.userInfo);
    const dispatch = useDispatch()
    // const {authorize,logout} = useAuthActions()
    // const user = useSelector((state:RootState)=>state.UserInfo.user)


    const EmailAuthSend = () => {
        if (inputEmail !== '') {
            setIsAuthEmail(true)
            validateEmail(inputEmail) ?
                [setEmailcheck(true), getEmailApi()]
                :
                [setEmailcheck(false)]
        }

    }
    /** 인증메일 보내기 */
    const getEmailApi = async () => {
        await client({
            method: 'post',
            url: '/user/auth-email',
            data: {
                mt_idx: userInfo.idx,
                mt_email: inputEmail,
            }
        }).then((res) => {
            cusToast(t(res.data.message))
        }).catch(error => {
            console.log(error);
        })
    }

    /** 인증메일 확인 */
    const getEmailCheckApi = async () => {
        await client({
            method: 'get',
            url: '/user/email-check',
            params: {
                mt_idx: userInfo.idx,
                mt_email: inputEmail,
            }
        }).then((res) => {
            cusToast(t(res.data.message))
            setChange(true)

        }).catch(error => {
            console.log(error);
        })
    }
    const ChangeCheck = () => {
        getEmailCheckApi()
        if (change !== false) {
            cusToast('인증이 완료되지 않았습니다.')
        } else {
            let params = {
                ...userInfo,
                mt_email: inputEmail,
            }
            dispatch(UserInfoAction.updateUserInfo(JSON.stringify(params)));
            NextPage()
        }
    }
    const NextPage = () => {
        navigation.navigate('SelectLogin');
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BackHeader title="" goLogin={true} />
            <ScrollView style={[style.default_background, { flexGrow: 1, paddingHorizontal: 20 }]}>
                <View style={{ flex: 1, justifyContent: 'center', marginTop: 40 }}>
                    <Text style={[style.text_b, { fontSize: 22, color: colors.BLACK_COLOR_2, paddingRight: 100 }]}>{t('계정 찾기시 사용될 이메일 주소 인증이 필요합니다.')}</Text>
                    <Text style={[style.text_re, { fontSize: 15, color: colors.BLACK_COLOR_2, marginTop: 10, paddingRight: 80 }]}>{t('이메일을 인증하지 않을 경우, 휴대폰 번호 변경시 기존의 모든 거래 정보를 잃게 됩니다.')}</Text>

                </View>
                <View style={{ marginTop: 50 }}>
                    <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_2 }]}>{t('이메일주소(선택)')}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 8 }}>
                            <TextInput
                                style={[style.input_container, { marginTop: 5 }]}
                                placeholder={t('이메일을 입력해주세요.')}
                                value={inputEmail}
                                onChangeText={(e) => { setInputEmail(e) }}
                                keyboardType={'email-address'}
                            />
                        </View>
                        <View style={{ flex: 3, marginTop: 5, marginLeft: 10 }}>
                            <CustomButton
                                disable={inputEmail == ''}
                                title={t('인증요청')}
                                buttonType={'green'}
                                action={EmailAuthSend}
                            />
                        </View>
                    </View>
                    {isAuthEmail &&
                        <View>
                            {emailcheck ?
                                <Text style={[style.text_re, { marginTop: 5, fontSize: 13, color: colors.BLUE_COLOR_1 }]}>
                                    {t('보낸 메일을 확인해주세요!')}</Text>
                                :
                                <Text style={[style.text_re, { marginTop: 5, fontSize: 13, color: colors.RED_COLOR_1 }]}>
                                    {t('이메일을 형식을 확인해주세요!')}</Text>
                            }
                        </View>
                    }
                </View>

                <View style={{ marginTop: 30 }}>
                    <CustomButton
                        buttonType='green'
                        action={ChangeCheck}
                        disable={!emailcheck}
                        title={t('확인')}
                    />
                    <View style={{ marginTop: 10 }}>
                        <CustomButton
                            buttonType='white'
                            // action={()=>{
                            //     navigation.reset({routes:[{name:'Main'}]});
                            // }}
                            action={NextPage}
                            disable={false}
                            title={t('다음에 하기')}
                        />
                    </View>
                </View>
            </ScrollView>
            <BackHandlerCom goLogin={true} />
        </SafeAreaView>
    );
};


export default JoinStep4

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