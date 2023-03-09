/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';

import { Alert, SafeAreaView, ScrollView, Text, View, Image, StyleSheet, Button, TouchableOpacity, BackHandler, Platform } from 'react-native';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import DropDownPicker from 'react-native-dropdown-picker';
import { SelectLangType } from '../../../components/types/userType';
import cusToast from '../../../components/navigation/CusToast';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import * as UserInfoAction from '../../../redux/actions/UserInfoAction';
import * as MyLocationAction from '../../../redux/actions/MyLocationAction';
import client from '../../../api/client';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { liff } from '@line/liff';
import PushNotification from "react-native-push-notification";
import Api from '../../../api/Api';
import messaging from '@react-native-firebase/messaging';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

/*

@mt_type: 1:일반, 2:구글, 3:애플, 4:라인, 5:왓츠앱

GoogleSignin.configure({
   webClientId: "447554062576-7glm9t0v5restn3b0kh0c8916vl7fa01.apps.googleusercontent.com",
   offlineAccess: true,
   forceCodeForRefreshToken: true,
})

*/



const SelectLogin = () => {

    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    const isFocused = useIsFocused();
    const [isOpen, setIsOpen] = React.useState(false);
    const [state, setState] = React.useState<any>();
    const [exitApp, setExitApp] = React.useState(false);
    const dispatch = useDispatch()


    const { t, i18n } = useTranslation()

    const [langList, setLangList] = React.useState([
        { label: '한국어', img: require('../../../assets/img/lang_kr.png'), value: 'Ko' },
        { label: 'English', img: require('../../../assets/img/lang_in.png'), value: 'En' },
        { label: 'Indonesia', img: require('../../../assets/img/lang_us.png'), value: 'Id' },
    ])
    const [selLang, setSelLang] = React.useState<SelectLangType>({
        label: langList[0].label,
        img: langList[0].img,
        value: langList[0].value,
    });
    const selectLang = (item: SelectLangType) => {
        setSelLang({ ...item });
        i18n.changeLanguage(item.value)
        setIsOpen(false);
    }

    /** useridx값 저장 */
    const setAutoUserData = async (userdata: string) => {
        await AsyncStorage.setItem('userIdx', JSON.stringify(userdata))
    }

    /** google 로그인 */
    const googleLogin = async () => {
        let mt_type = 2;
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            setState(userInfo);

            let sns_key = userInfo.user.id;

            if (!sns_key) {
                cusToast(t('실패했습니다'));
                return;
            }

            await client({
                method: 'get',
                url: `/user/sns_login?mt_type=${mt_type}&sns_key=${sns_key}&mt_app_token=${Api.state.mb_fcm}`,
            }).then(res => {
                console.log('resdata', res.data.user_data);
                dispatch(UserInfoAction.userlogin(JSON.stringify(res.data.user_data)));
                setAutoUserData({ idx: res.data.user_idx, mt_app_token: Api.state.mb_fcm })

            }).catch(error => {
                if (error.response) {
                    console.log(error.response.message);
                    if (error.response.status == '409') {
                        //회원가입으로 이동
                        navigation.navigate('SearchLocation', { type: 'join', mt_type, sns_key });
                    }
                    return;
                }
                cusToast(t('실패했습니다'));
            });

            // Alert.alert(`${userInfo.user.name}`, `${userInfo.user.email},${userInfo.user.id},${userInfo.user.photo}`)
            console.log("user:", userInfo)



        } catch (error: any) {
            console.log("error:", error)
            console.log("error:", error.code)
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                console.log(error.code)
                Alert.alert(t('취소되었습니다'));
                return;
                // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                console.log(error.code)
                // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log(error.code)
                // play services not available or outdated
            } else {
                console.log(error.code)
                // some other error happened
            }

            Alert.alert(t('실패했습니다'));
        }
    }

    const userInfo = useSelector((state: any) => state.userInfo);
    /** 라인 로그인 */
    const lineLogin = async () => {
        console.log('2')
    }

    const backAction = () => {
        var timeout;
        let tmp = 0;
        if (tmp == 0) {
            if ((exitApp == undefined || !exitApp) && isFocused) {
                cusToast(t("한번 더 누르시면 종료됩니다"));
                setExitApp(true);
                timeout = setTimeout(
                    () => {
                        setExitApp(false);
                    },
                    4000
                );
            } else {
                // appTimeSave();
                clearTimeout(timeout);
                BackHandler.exitApp();  // 앱 종료
            }
            return true;
        }
    }

    React.useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        if (!isFocused) {
            backHandler.remove();
        }
    }, [isFocused, exitApp])




    const onLogin = async () => {
        // const token = await fbToken();
        // if (!loginInfo.email || !loginInfo.password) {
        //     return setWarnLabel(prev => ({
        //     ...prev,
        //     password: '아이디 또는 비밀번호를 확인바랍니다.',
        //     }));
    }


    /** 자동로그인 설정 */
    React.useEffect(() => {
        navigation.addListener('focus', async () => {
            await AsyncStorage.getItem('userIdx', async (err, result) => {
                if (result) {

                    //비동기라서 app에서 못 가져오는 경우가 발생되므로 로그인시 여기서도 발급
                    const fcmToken = await messaging().getToken();
                    Api.state.mb_fcm = fcmToken;

                    let autoUserData = JSON.parse(result);

                    console.log('userIdx', autoUserData);

                    await client({
                        method: 'get',
                        url: '/user/auto-login?token=' + Api.state.mb_fcm,
                    }).then(res => {
                        console.log('resdata', res.data.user_data);
                        dispatch(UserInfoAction.userlogin(JSON.stringify(res.data.user_data)));
                    }).catch(error => {
                        cusToast(t('자동로그인에 실패했습니다.'))
                        console.log(error);

                        //실패시 자동로그인 삭제
                        dispatch(UserInfoAction.logOut());

                        // cusToast(
                        //     t('기존 정보가 없습니다.')
                        // )
                    })

                    // await client({
                    //     method: 'get',
                    //     url: `/user/mypage?mt_idx=${result}`,
                    // }).then(
                    //     res => {
                    //         console.log('resdata', res.data.data[0]);
                    //         dispatch(UserInfoAction.userlogin(JSON.stringify(res.data.data[0])));
                    //     }
                    // ).catch(
                    //     cusToast(t('자동로그인에 실패했습니다.'))
                    // )


                }
            })
        })
    }, [])

    const Visitapi = async () => {
        await client({
            method: 'get',
            url: '/user/visit',
        })
            .then(res => {
                console.log('visit')
            })
            .catch(error => {
                console.log(error);
            });
    };

    React.useEffect(() => {
        Visitapi()
    }, [])

    return (
        <ScrollView contentContainerStyle={[style.default_background, { flexGrow: 1, paddingHorizontal: 20 }]}>
            <View style={{ flex: 1, alignItems: 'flex-end', zIndex: 10 }}>
                <View style={[style.lang_sel_back, { marginTop: 20 }]}>
                    <TouchableOpacity onPress={() => { setIsOpen(!isOpen) }}>
                        <View style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 5 }]}>
                            <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                <Image style={style.lang_icon} source={selLang.img} />
                                <Text style={{ marginLeft: 5 }}>{selLang.label}</Text>
                            </View>
                            <Image style={[style.sel_arrow, { marginLeft: 10 }]} source={require('../../../assets/img/arrow1_down.png')} />
                        </View>
                    </TouchableOpacity>
                    {isOpen && langList.map((item, index) => {
                        return (
                            <View key={item.value + index}>
                                {item.value != selLang.value &&
                                    <TouchableOpacity onPress={() => { selectLang(item) }} style={{ paddingVertical: 8 }}>
                                        <View style={[{ flexDirection: 'row', alignItems: 'center' }]}>
                                            <Image style={style.lang_icon} source={item.img} />
                                            <Text style={{ marginLeft: 5 }}>{item.label}</Text>
                                        </View>
                                    </TouchableOpacity>
                                }
                            </View>
                        )
                    })}

                </View>
            </View>
            <View style={[{ flex: 9, alignItems: 'center', justifyContent: 'center' }]}>
                <Image source={require('../../../assets/img/logo.png')} style={loginStyle.logo} />
                <Text style={[style.text_re, { marginTop: 40, color: colors.GRAY_COLOR_2, fontSize: 14 }]}>
                    {t('내주변 안전한 중고거래는 GETGO와 함께 시작하세요')}
                </Text>

                <View style={{ marginTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1, width: '100%', borderBottomColor: colors.GRAY_COLOR_2, borderBottomWidth: 1 }} />
                    <Text style={[style.text_re, { fontSize: 14, color: colors.GRAY_COLOR_2, marginHorizontal: 10 }]}>
                        {t('SNS 간편 로그인')}
                    </Text>
                    <View style={{ flex: 1, width: '100%', borderBottomColor: colors.GRAY_COLOR_2, borderBottomWidth: 1 }} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 30 }}>
                    <TouchableOpacity
                        onPress={() => { console.log('1') }}
                    >
                        <Image source={require('../../../assets/img/sns_whatsapp.png')} style={[loginStyle.login_ic]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={lineLogin}
                    >
                        <Image source={require('../../../assets/img/sns_line.png')} style={[loginStyle.login_ic, { marginLeft: 20 }]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={googleLogin}
                    >
                        <Image source={require('../../../assets/img/sns_google.png')} style={[loginStyle.login_ic, { marginLeft: 20 }]} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { console.log('4') }}
                    >
                        <Image source={require('../../../assets/img/sns_apple.png')} style={[loginStyle.login_ic, { marginLeft: 20 }]} />
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 30, flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('SearchLocation', { type: 'join', mt_type: 1, sns_key: '' }) }} style={[style.custom_button, { alignItems: 'center', justifyContent: 'center' }]} >
                        <Text style={[style.text_b, { color: colors.WHITE_COLOR, fontSize: 18 }]}>
                            {t('시작하기')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <Text style={[style.text_re, { fontSize: 13, color: colors.GRAY_COLOR_2 }]}>
                        {t('이미 계정이 있나요?')}
                    </Text>
                    <TouchableOpacity onPress={() => { navigation.navigate('Login') }}>
                        <Text style={[style.text_b, { marginLeft: 10, color: colors.GREEN_COLOR_2, textDecorationLine: 'underline' }]}>
                            {t('로그인')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>


        </ScrollView>
    );
};

export default SelectLogin;

const loginStyle = StyleSheet.create({
    logo: {
        width: 220,
        height: 130,
    },
    login_ic: {
        width: 56,
        height: 56,
    }

})
