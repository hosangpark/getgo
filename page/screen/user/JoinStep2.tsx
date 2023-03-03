/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { SafeAreaView, ScrollView, Text, View, TextInput, TouchableOpacity, StyleSheet, } from 'react-native';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { SelectBox } from '../../../components/layout/SelectBox';
import { OptionType } from '../../../components/types/componentType';
import { CustomButton } from '../../../components/layout/CustomButton';
import { BackHeader } from '../../../components/header/BackHeader';
import Timer from '../../../components/utils/Timer';
import { AgreeBottomModal } from '../../../components/modal/AgreeBottomModal';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { frontPhoneList } from '../../../components/static/staticList';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as UserInfoAction from '../../../redux/actions/UserInfoAction';
import { reduxStateType } from '../../../components/types/reduxTypes';
import client from '../../../api/client';
import logsStorage from '../../../components/utils/logStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cusToast from '../../../components/navigation/CusToast';


// import { useAuthActions } from '../../../redux/actions/UserInfoAction';
// import { RootState } from '../../../redux/reducers';


// const user = useSelector((state: RootState)=> state.UserInfo.user)

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */


type Props = StackScreenProps<MainNavigatorParams, 'JoinStep2'>
const JoinStep2 = ({ route }: any) => {


    const userInfo = useSelector((state: any) => state.userInfo);
    const myLocation = useSelector((state: any) => state.myLocation);

    const { t } = useTranslation()


    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

    const [selectPhone, setSelPhone] = React.useState<OptionType>({
        label: '+82', value: '82', sel_id: 1
    })

    const [inputLoginInfo, setInputLoginInfo] = React.useState<any>({ //
        areaCode: '',
        mt_hp: '',
    });

    const [agreeList, setAgreeList] = React.useState({
        agree1: true,
        agree2: true,
        agree3: true,
        agree4: true,
        allCheck: true,
    })

    const [authCode, setAuthCode] = React.useState(''); //발송된 인증번호
    const [inputAuth, setInputAuth] = React.useState(''); //인증번호 입력

    const [timer, setTimer] = React.useState<boolean>(false); //타이머 시작/끝 감지
    const [timerReset, setTimerReset] = React.useState<boolean>(false); //타이머 리셋

    const [agreeModalVisible, setAgreeModalVisible] = React.useState(false); //약관동의 모달

    const [authSuccess, setAuthSuccess] = React.useState<boolean>(false)

    const inputControl = (type: string, text: string) => {
        setInputLoginInfo({
            ...inputLoginInfo, [type]: text, areaCode: selectPhone.value
        });

    }

    const phoneSelect = (item: OptionType) => {
        setSelPhone({ ...item });
    }

    const getAuthPhoceCode = async () => {
        await client<{ data: string, auth_number: string }>({
            method: 'post',
            url: '/user/auth-send',
            data: {
                mt_na: inputLoginInfo.areaCode,
                mt_hp: inputLoginInfo.mt_hp,
            }
        }).then(res => {
            console.log(res.data)
            setAuthCode(res.data.auth_number);
            setInputAuth(res.data.auth_number);
        }).catch(error => {
            console.log('getAuthPhoceCode')
        })
    }
    /** 인증번호 전송 */
    const sendCode = () => {
        /** 중복체크 & 핸드폰 인증 정보 저장 */
        getAuthPhoceCode();
        setTimer(true);
        setTimerReset(true)
    }

    /** 인증코드 재발송 */
    const resendCode = () => {
        /** 핸드폰 중복 확인 */
        getAuthPhoceCode();
        setTimerReset(true);
        // setTimer(false);
    }


    /** 약관동의 */
    const setAgree = (type: string, check: boolean) => {
        if (type == 'allCheck') {
            if (check) {
                setAgreeList({ allCheck: true, agree1: true, agree2: true, agree3: true, agree4: true })
            }
            else {
                setAgreeList({ allCheck: false, agree1: false, agree2: false, agree3: false, agree4: false })
            }
        }
        else {
            setAgreeList({
                ...agreeList,
                [type]: check,
            })
        }
    }

    /** useridx값 저장 */
    const setAutoUserData = async (userdata: string) => {
        await AsyncStorage.setItem('userIdx', JSON.stringify(userdata))
    }


    /** 회원가입 */
    const getUserAccount = async () => {
        await client<{ data: string, user_idx: number, message: string }>({
            method: 'post',
            url: '/user/account',
            data: {
                mt_na: inputLoginInfo.areaCode,
                mt_hp: inputLoginInfo.mt_hp,
                auth_number: authCode,
                mt_area: route.params.area,
                mt_lat: route.params.mt_lat,
                mt_log: route.params.mt_log,
                mat_status: 'N'
            }
        }).then((res) => {
            if (res.data) {
                let params = {
                    ...userInfo,
                    idx: res.data.user_idx,
                }
                dispatch(UserInfoAction.updateUserInfo(JSON.stringify(params)));
                setAutoUserData(params)
                cusToast(res.data.message)
                navigation.navigate('JoinStep3');
            }
        }).catch(error => {
            console.log(error);
        })
    }

    /** 번호&지역&위도경도로 임시 회원가입 */
    const dispatch = useDispatch();
    const accessJoin = () => {
        setAgreeModalVisible(false);
        getUserAccount();
    }

    /** 인증번호 일치여부 확인 */
    useEffect(() => {
        if (inputAuth != '' && authCode != '') {
            if (authCode == inputAuth) {
                setAuthSuccess(true);
                setAgreeModalVisible(true)
            }
            else {
                setAuthSuccess(false);
            }
        }
    }, [inputAuth])

    useEffect(() => {
        if (agreeList.agree1 && agreeList.agree2 && agreeList.agree3 && agreeList.agree4) {
            setAgreeList({
                ...agreeList,
                allCheck: true,
            })
        }
        else {
            setAgreeList({
                ...agreeList,
                allCheck: false,
            })
        }
    }, [agreeList.agree1, agreeList.agree2, agreeList.agree3, agreeList.agree4])


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BackHeader title={t('회원가입')} />
            <ScrollView style={[style.default_background, { flexGrow: 1, paddingHorizontal: 20 }]}>
                <View style={{ marginTop: 20 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_2 }]}>{t('휴대폰번호')}</Text>
                        <Text style={[style.text_me, { fontSize: 15, color: colors.GREEN_COLOR_3 }]}> *</Text>
                    </View>
                </View>
                <View style={{ marginTop: 10, flexDirection: 'row' }}>
                    <View style={{ flex: 4 }}>
                        <SelectBox
                            selOption={selectPhone}
                            options={frontPhoneList}
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
                            placeholder={t("번호를 입력해주세요.")}
                            keyboardType={'number-pad'}
                        />
                    </View>
                </View>
                <View style={{ marginTop: 8 }}>
                    {authCode == '' ?
                        <CustomButton title={t("인증요청")} buttonType='green' action={sendCode} disable={inputLoginInfo.mt_hp == ''} />
                        :
                        <TouchableOpacity
                            onPress={resendCode}
                            style={[btnStyle.green_btn, { flexDirection: 'row' }]}
                        >
                            <Text style={btnStyle.green_font}>
                                {t('인증번호 다시받기')}
                            </Text>
                            <View style={{ width: 45, marginLeft: 5 }}>
                                <Timer
                                    mm={5}
                                    ss={0}
                                    timeover={() => setTimer(false)}
                                    reset={timerReset}
                                    setReset={setTimerReset}
                                />
                            </View>
                        </TouchableOpacity>
                    }
                </View>
                {authCode !== '' &&
                    <View style={{ marginTop: 10 }}>
                        <TextInput
                            style={style.input_container}
                            value={inputAuth}
                            onChangeText={text => { setInputAuth(text) }}
                            placeholder={t('인증번호 입력')}
                            keyboardType='number-pad'
                        />
                    </View>
                }

                {/* <View style={{flexDirection:'row',marginTop:20,justifyContent:'center'}}>
                    <Text style={[style.text_re,{fontSize:13,color:colors.GRAY_COLOR_2}]}>{t('휴대폰 번호가 변경되었나요?')}</Text>
                    <TouchableOpacity onPress={()=>{navigation.navigate('ChangePhoneAuth')}}>
                        <Text style={[style.text_b,{marginLeft:10,color:colors.GREEN_COLOR_2,textDecorationLine:'underline'}]}>
                        {t('번호변경하기')}</Text>
                    </TouchableOpacity>
                </View> */}
            </ScrollView>
            <View style={style.bottom_wrapper}>
                <TouchableOpacity onPress={() => { setAgreeModalVisible(true) }} disabled={!authSuccess} style={[style.bottom_btn, authSuccess ? style.bottom_btn_green : style.bottom_btn_gray]}>
                    <Text style={[style.text_sb, { fontSize: 18, color: authSuccess ? colors.WHITE_COLOR : colors.GRAY_COLOR_4 }]}>{t('확인')}</Text>
                </TouchableOpacity>
            </View>
            <AgreeBottomModal
                isVisible={agreeModalVisible}
                setVisible={setAgreeModalVisible}
                agreeList={agreeList}
                setAgreeList={setAgree}
                action={accessJoin}
            />
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


export default JoinStep2
