/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useEffect } from 'react';
import { Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { RouteProp } from '@react-navigation/native';

import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { BackHeader } from '../../../components/header/BackHeader';
import { CustomButton } from '../../../components/layout/CustomButton';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';

import { connect, useDispatch, useSelector } from 'react-redux';
import { reduxStateType } from '../../../components/types/reduxTypes';
import * as UserInfoAction from '../../../redux/actions/UserInfoAction';
import client from '../../../api/client';
import logsStorage from '../../../components/utils/logStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Textreplace } from '../../../components/utils/funcKt';

// import { RootState } from '../../../redux/reducers';
// import { useAuthActions } from '../../../redux/actions/UserInfoAction';
// import { logout } from '../../../redux/reducers/UserInfoReducer';



/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const JoinStep3 = () => {


    // const {authorize,InputName} = useAuthActions()

    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    const { t } = useTranslation()
    const [inputName, setInputName] = React.useState('');
    const [isOverName, setIsOverName] = React.useState(false);
    const userInfo = useSelector((state: any) => state.userInfo);
    const dispatch = useDispatch()

    const NextPage = async () => {
        if (userInfo) {
            const form = new FormData();
            form.append('mt_idx', userInfo.idx);
            form.append(`mt_nickname`, inputName);

            await client({
                method: 'post',
                url: '/user/profile-edit',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: form,
            }).then(res => {


                let params = {
                    ...userInfo,
                    mt_nickname: inputName
                }
                dispatch(UserInfoAction.updateUserInfo(JSON.stringify(params)));
                navigation.navigate('JoinStep4');


            }).catch(error => {
                console.log("getUserNickName")
            })
        }
    }

    /** 닉네임 중복체크 */
    const IdCheck = async () => {
        console.log(userInfo)
        if (Textreplace(inputName)) {
            await client({
                method: 'post',
                url: '/user/nickname-check',
                data: {
                    mt_idx: userInfo.idx,
                    mt_nickname: inputName,
                }
            }).then(res =>
                Alert.alert(
                    t(res.data.message), '', [
                    {
                        text: t('계속하기'),
                        onPress: () => { NextPage() },
                    },
                    {
                        text: t('취소'),
                        onPress: () => { },
                        style: 'cancel',
                    }
                ])
            ).catch(error => {
                console.log(error)
                setIsOverName(true)
            }
            )
        } else {
            Alert.alert(t('특수문자,단일자음,빈칸은 입력불가합니다.'))
        }

    }
    const Cancel = () => {
        navigation.navigate('SelectLogin');
    }
    React.useEffect(() => {
        AsyncStorage.getItem('userIdx', (err, result) => {
            if (result) {
                console.log(result)
            }
        })
    }, [])


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BackHeader title="" goLogin={true} />
            <ScrollView style={[style.default_background, { flexGrow: 1, paddingHorizontal: 20 }]}>
                <View style={{ flex: 1, justifyContent: 'center', marginTop: 40 }}>
                    <Text style={[style.text_b, { fontSize: 15, color: colors.GREEN_COLOR_3 }]}>{t('회원가입 완료')}</Text>
                    <Text style={[style.text_b, { fontSize: 22, color: colors.BLACK_COLOR_2, paddingRight: 170 }]}>
                        {t('GETGO에서 사용하실 닉네임을 알려주세요.')}</Text>
                </View>
                <View style={{ marginTop: 50 }}>
                    <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_2 }]}>
                        {t('닉네임')}
                    </Text>
                    <TextInput
                        style={[style.input_container, { marginTop: 5 }]}
                        placeholder={t('닉네임을 입력해주세요.')}
                        value={inputName}
                        onChangeText={(text) => { setIsOverName(false), setInputName(text) }}
                    />
                    {isOverName &&
                        <Text style={[style.text_re, { marginTop: 5, fontSize: 13, color: colors.RED_COLOR_1 }]}>
                            {t('이미 사용중인 닉네임입니다.')}</Text>
                    }
                </View>

                <View style={{ marginTop: 30 }}>
                    <CustomButton
                        buttonType='green'
                        action={IdCheck}
                        disable={isOverName}
                        title={t('확인')}
                    />
                    <View style={{ marginTop: 10 }}>
                        <CustomButton
                            buttonType='white'
                            action={Cancel}
                            disable={false}
                            title={t('취소')}
                        />
                    </View>
                </View>
            </ScrollView>
            <BackHandlerCom goLogin={true} />
        </SafeAreaView>
    );
};



export default JoinStep3;

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