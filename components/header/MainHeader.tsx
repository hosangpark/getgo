import React from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../types/routerTypes';

import { Image, Pressable, Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import style from '../../assets/style/style';
import { BackHeaderType } from '../types/componentType';
import { colors } from '../../assets/color';
import { CustomButton } from '../layout/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import * as MyLocationAction from '../../redux/actions/MyLocationAction';
import client from '../../api/client';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MainHeaderType {
    setTabIndex: (index: number) => void
    setListChanege: (e: number) => void
}

export const MainHeader = ({ setTabIndex, setListChanege }: MainHeaderType) => {

    const chartHeight = Dimensions.get('window').height;
    const chartWidth = Dimensions.get('window').width;
    const { t } = useTranslation()
    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

    const Search = () => {
        navigation.navigate('Search');
    }
    const Notification = () => {
        navigation.navigate('NotificationIndex');
    }
    const Category = () => {
        navigation.navigate('Category');
    }

    const [placeListToggle, setPlaceListToggle] = React.useState(false);

    const myLocation = useSelector((state: any) => state.myLocation)
    const userInfo = useSelector((state: any) => state.userInfo);
    const dispatch = useDispatch();

    /** id값 받아서 내 지역리스트 추가 */
    const getLocationData = async () => {
        await client({
            method: 'get',
            url: `/user/myarealist`,
            params: {
                mt_idx: userInfo.idx
            }
        }).then(
            async res => {
                console.log("user/myarealist res.data", res.data)
                if (res.data.list.length === 1) {
                    let params = {
                        ...myLocation,
                        isLocAuth1: true,
                        isLocAuth2: false,
                        select_location: 1,
                        location1: {
                            mt_area: res.data.list[0].mat_area,
                            mt_address: res.data.list[0].mat_area,
                            mt_lat: res.data.list[0].mat_lat,
                            mt_log: res.data.list[0].mat_lon,
                            mat_status: res.data.list[0].mat_status,
                            mat_idx: res.data.list[0].mat_idx
                        },
                    }

                    await AsyncStorage.setItem('@locTarget', '1');

                    if (myLocation.location1.mat_idx !== res.data.list[0].mat_idx) {
                        dispatch(MyLocationAction.deleteLocation(JSON.stringify(params)))
                    }
                } else if (res.data.list.length === 2) {

                    let locTarget = await AsyncStorage.getItem('@locTarget').then((val) => {
                        //최초 실행시 순서를 저장값에서 가져옴
                        console.log('@locTarget', val)
                        return val;
                    });

                    let params = {
                        ...myLocation,
                        isLocAuth1: true,
                        isLocAuth2: true,
                        select_location: locTarget ? locTarget : myLocation.select_location,
                        location1: {
                            mt_area: res.data.list[0].mat_area,
                            mt_address: res.data.list[0].mat_area,
                            mt_lat: res.data.list[0].mat_lat,
                            mt_log: res.data.list[0].mat_lon,
                            mat_status: res.data.list[0].mat_status,
                            mat_idx: res.data.list[0].mat_idx
                        },
                        location2: {
                            mt_area: res.data.list[1].mat_area,
                            mt_address: res.data.list[1].mat_area,
                            mt_lat: res.data.list[1].mat_lat,
                            mt_log: res.data.list[1].mat_lon,
                            mat_status: res.data.list[1].mat_status,
                            mat_idx: res.data.list[1].mat_idx
                        }
                    }
                    if (myLocation.location2.mat_idx !== res.data.list[1].mat_idx) {
                        dispatch(MyLocationAction.updateMyLocation(JSON.stringify(params)))
                    }
                } else {
                    dispatch(MyLocationAction.deleteAll())
                }
            }).
            catch(
                err => {
                    console.log(err)
                    // cusToast('사용자 지역 데이터를 불러오지 못했습니다.')
                }
            )
    };

    React.useEffect(() => {
        // if (myLocation.select_location) {
        //     console.log('@locTarget save', myLocation.select_location);
        //     AsyncStorage.setItem('@locTarget', myLocation.select_location.toString());
        // }
    }, [myLocation.select_location])



    const ChangeLocation1 = () => {
        if (myLocation.location1.mat_idx == "") {
            setPlaceListToggle(false); navigation.navigate('SetMyLocation')
        } else if (myLocation.select_location == "1") {
            setPlaceListToggle(false); navigation.navigate('SetMyLocation')
        } else {
            setListChanege(1)
        }
        setPlaceListToggle(false)
    }

    const ChangeLocation2 = () => {
        if (myLocation.location2.mat_idx == "") {
            setPlaceListToggle(false); navigation.navigate('SetMyLocation')
        } else if (myLocation.select_location == "2") {
            setPlaceListToggle(false); navigation.navigate('SetMyLocation')
        } else {
            setListChanege(2)
        }
        setPlaceListToggle(false)
    }

    useFocusEffect(
        React.useCallback(() => {
    
            getLocationData()
    
          return () => { };
        ;
    }, [myLocation.location1.mt_area, myLocation.location2.mt_area])
    )



    return (
        <View style={[{ zIndex: 2, backgroundColor: '#ffffff', height: 60, justifyContent: 'center', paddingHorizontal: 20 }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                    <TouchableOpacity onPress={() => { setPlaceListToggle(!placeListToggle) }}
                        style={{ flexDirection: 'row', alignItems: 'center', zIndex: 3 }}>
                        <Image source={require('../../assets/img/ico_map2.png')} style={{ width: 23, height: 23 }} />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[style.text_b, { fontSize: 16, color: colors.BLACK_COLOR_2, marginLeft: 5 }]}>
                                {myLocation.select_location == "1" && myLocation.location1.mat_idx ?
                                    [myLocation.location1.mt_area]
                                    :
                                    (myLocation.select_location == "2" ?
                                        myLocation.location2.mt_area
                                        :
                                        t('동네설정필요')
                                    )
                                }
                            </Text>
                            <Image source={require('../../assets/img/arrow1_down.png')} style={{ width: 20, height: 10, marginLeft: 4 }} />
                        </View>
                    </TouchableOpacity>
                    {placeListToggle &&
                        <View style={{ position: 'absolute', top: 0, left: 0, margin: -20, backgroundColor: 'rgba(0,0,0,0)', width: chartWidth, height: chartHeight, paddingRight: 100 }}>
                            <View style={[mainHeaderStyle.more_box, { position: 'absolute', top: 50, left: 20 }]}>
                                <TouchableOpacity onPress={() => { setPlaceListToggle(!placeListToggle) }}
                                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: 10 }}>
                                    <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_2 }]}>{t("내 동네")}</Text>
                                    <View style={{ flexDirection: 'row', width: 30, height: 30, alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <Image source={require('../../assets/img/ico_close2.png')} style={{ width: 25, height: 25 }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={ChangeLocation1}
                                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingHorizontal: 15 }}>
                                    <Text style={[myLocation.isLocAuth1 ? style.text_b : style.text_me,
                                    { fontSize: 15, color: myLocation.select_location == "1" && myLocation.location1.mat_idx ? colors.GREEN_COLOR_2 : colors.GRAY_COLOR_2 }]}>
                                        {myLocation.location1.mat_idx ? myLocation.location1.mt_area : t('동네1 설정')}
                                    </Text>
                                    <View style={{ flexDirection: 'row', width: 30, height: 30, alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <Image source={myLocation.select_location == "1" && myLocation.location1.mat_idx ? require('../../assets/img/ico_check2_on.png') : require('../../assets/img/ico_check2_off.png')} style={{ width: 20, height: 15 }} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={ChangeLocation2}
                                    style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, marginBottom: 5, paddingHorizontal: 15 }}>
                                    <Text style={[myLocation.isLocAuth2 ? style.text_b : style.text_me,
                                    { fontSize: 15, color: myLocation.select_location == "2" ? colors.GREEN_COLOR_2 : colors.GRAY_COLOR_2 }]}>
                                        {myLocation.location2.mat_idx ? myLocation.location2.mt_area : t('동네2 설정')}
                                    </Text>
                                    <View style={{ flexDirection: 'row', width: 30, height: 30, alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <Image source={myLocation.select_location == "2" ? require('../../assets/img/ico_check2_on.png') : require('../../assets/img/ico_check2_off.png')} style={{ width: 20, height: 15 }} />
                                    </View>
                                </TouchableOpacity>
                                <View style={{ backgroundColor: colors.GRAY_COLOR_1, alignItems: 'center', justifyContent: 'center' }}>
                                    <TouchableOpacity onPress={() => { setPlaceListToggle(false); navigation.navigate('SetMyLocation') }} style={{ backgroundColor: '#fff', margin: 10, minWidth: 175, height: 36, borderWidth: 1, borderColor: colors.GRAY_LINE, alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                        <Text style={[style.text_me, { fontSize: 13, color: colors.GRAY_COLOR_2, paddingHorizontal: 10 }]}>{t("내 동네 설정하기")}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    }
                </View>
                <View style={[{ flexDirection: 'row' }]}>
                    <TouchableOpacity
                        onPress={Search}>
                        <Image style={{ width: 28, height: 28 }} source={require('../../assets/img/top_search.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { Notification(); setTabIndex(2); }}>
                        <Image style={{ width: 28, height: 28, marginHorizontal: 10 }}
                            source={require('../../assets/img/top_alim.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { Category(); setTabIndex(3); }}>
                        <Image style={{ width: 28, height: 28 }} source={require('../../assets/img/top__category.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const mainHeaderStyle = StyleSheet.create({
    more_box: {
        minWidth: 200,
        backgroundColor: colors.WHITE_COLOR,
        borderWidth: 1,
        borderColor: colors.GRAY_LINE,
        shadowColor: '#000',
        borderRadius: 6,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 8,

        elevation: 5,
    }
})
