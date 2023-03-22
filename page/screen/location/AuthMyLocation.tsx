/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    Alert, Modal,
    SafeAreaView, Image, Text, View, FlatList, ScrollView, Dimensions, TouchableOpacity
} from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { BackHeader } from '../../../components/header/BackHeader'
import { myLocationType, reduxStateType } from '../../../components/types/reduxTypes';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { CustomButton } from '../../../components/layout/CustomButton';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import * as MyLocationAction from '../../../redux/actions/MyLocationAction';
import client from '../../../api/client';
import { geoLocation } from '../../../components/utils/getLocation';
import { LocationType } from '../../../components/types/userType';
import cusToast from '../../../components/navigation/CusToast';
import Api from '../../../api/Api';


type RegionType = {
    latitude: number;
    latitudeDelta?: number;
    longitude: number;
    longitudeDelta?: number;

}
type Props = StackScreenProps<MainNavigatorParams, 'AuthMyLocation'>
const AuthMyLocation = ({ route }: Props) => {

    const { selectIdx, setLocation, mt_address } = route.params;

    // console.log('mt_address', mt_address);

    const { mt_lat: nowLat, mt_log: nowLng } = setLocation;
    const { t, i18n } = useTranslation()

    const myLocation = useSelector((state: any) => state.myLocation)
    const userInfo = useSelector((state: any) => state.userInfo);
    const dispatch = useDispatch();

    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    const [isLoading, setIsLoading] = React.useState(false);
    const [selLocation, setSelLocation] = React.useState<LocationType>({
        mt_lat: nowLat,
        mt_log: nowLng,
    });
    const [initialLocation, setNowLocation] = React.useState<LocationType>({
        mt_lat: 0,
        mt_log: 0,
    })

    const [nowLongName, setNowLongName] = React.useState('');
    const [distance, setDistance] = React.useState(999);
    const [selLongName, setSelLongName] = React.useState('');
    const [CountryName, setCountryName] = React.useState('');
    const [fulladdress, setFulladdress] = React.useState('');
    const [googleDataList, setGoogleDataList] = React.useState([])
    const [YorN, setYorN] = React.useState(distance < 5 ? "Y" : "N")
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [googleDataSelect, setGoogledataSelect] = useState(0)

    const onRegionChange = (region: RegionType) => {
        setSelLocation({
            mt_lat: region.latitude,
            mt_log: region.longitude,
        })
        //  console.log(getDistanceBetweenPoints(nowLocation.mt_lat, nowLocation.mt_log, selLocation.mt_lat, selLocation.mt_log, 'kilometers'))
    }

    //대한민국의 일반정보의 대략적인 경도범위는 125 - 132, 위도(lat)범위는 33 - 39입니다.
    const getGoogleLocData = async (lat, lng) => {
        // let result_type = (lng < 132 && lng > 125 && lat > 33 && lat < 39) ? 'sublocality_level_2' : 'administrative_area_level_4'

        return await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng
            + '&result_type=sublocality_level_2|administrative_area_level_4' + '&location_type=&key=' + Api.state.googleMapKey + '&language=' + i18n.language)
            .then((response) => response.json())
            .then((responseJson) => {
                // console.log('nowLocation2', responseJson);

                if (responseJson.status == 'OK') {
                    return responseJson.results.map((item, index) => {
                        return { area: item.formatted_address, zone: item.address_components[0].long_name, lat: item.geometry.location.lat, lng: item.geometry.location.lng }
                    })
                } else {
                    return []
                }
            }).catch((err) => {
                console.log("udonPeople error : " + err)
                return [];
            });

    }

    const checkAuth = async () => {

        let list = await getGoogleLocData(initialLocation.mt_lat, initialLocation.mt_log);
        setGoogleDataList(list);

        console.log('list', list);

        let tempfulladdress = '';
        let tempLong_name = '';
        for (let index = 0, cnt = list.length; index < cnt; index++) {
            let item = list[index];

            console.log('item', item)
            if (mt_address == item.zone) {
                tempfulladdress = item.area;
                tempLong_name = item.zone;

                setFulladdress(tempfulladdress)
                setSelLongName(tempLong_name)
                setYorN('Y')
                return;
            } else {
                if (index) tempLong_name += ', ';
                if (!index) tempfulladdress += item.area;

                tempLong_name += item.zone;
            }
        }


        setFulladdress(tempfulladdress)
        setSelLongName(tempLong_name)


        // for (var i = 0; i < 9; i++) {
        //     if (responseJson.results[0].address_components[i].types.includes('country')) {
        //         setCountryName(responseJson.results[0].address_components[i].long_name);
        //         break
        //     }
        // }

        // if (CountryName == "Indonesia") {
        //     for (var i = 0; i < 9; i++) {
        //         if (responseJson.results[i].address_components[0].types.includes('administrative_area_level_4')) {
        //             setSelLongName(responseJson.results[i].address_components[1].long_name);
        //             break
        //         }
        //     }
        // } else {
        //     for (var i = 0; i < 5; i++) {
        //         if (responseJson.results[i].address_components[0].types.includes('sublocality_level_2')) {
        //             setSelLongName(responseJson.results[i].address_components[0].long_name);
        //             break
        //         }
        //     }
        // }



    }

    /** server에 내지역등록 */
    const setMyLocation = async () => {
        await client({
            method: 'post',
            url: '/user/area_add',
            data: {
                mt_idx: userInfo.idx,
                mat_area: selLongName,
                mat_lat: initialLocation.mt_lat,
                mat_lon: initialLocation.mt_log,
                mat_status: YorN,
            }
        }).then(res => {
            SetLocationUpdate()
            navigation.navigate('Main')
        }).catch(error => {
            console.log(error)
        })
    }

    /** server에 내지역수정 */
    const ModifyLocation = async (target: number, zone: String, forceY: boolean = false) => {
        await client({
            method: 'post',
            url: '/user/area_edit',
            data: {
                mat_idx: target,
                mat_area: zone,
                mat_lat: initialLocation.mt_lat,
                mat_lon: initialLocation.mt_log,
                mat_status: forceY ? 'Y' : YorN
            }
        }).then(
            res => {
                SetLocationUpdate()
                if (YorN == 'Y') cusToast(t('인증되었습니다.'))
                else cusToast(t(res.data.message))
                navigation.navigate('SetMyLocation')
                setIsLoading(false)
            }
        ).catch(err => console.log(err))
        setIsLoading(false)
    };



    /** 현재거리&지정거리 계산 */
    const getDistanceBetweenPoints = ({ latitude1, longitude1, latitude2, longitude2, unit }: any) => {
        let theta = longitude1 - longitude2;
        let distance = 60 * 1.1515 * (180 / Math.PI) * Math.acos(
            Math.sin(latitude1 * (Math.PI / 180)) * Math.sin(latitude2 * (Math.PI / 180)) +
            Math.cos(latitude1 * (Math.PI / 180)) * Math.cos(latitude2 * (Math.PI / 180)) * Math.cos(theta * (Math.PI / 180))
        );

        if (unit == 'miles') {
            setDistance(Math.round(distance, 2))
        } else if (unit == 'kilometers') {
            console.log('setDistance', Math.round(distance * 1.609344, 2))
            setDistance(Math.round(distance * 1.609344, 2))
        }
    }

    const ChangeComplete = () => {
        console.log('ChangeComplete', selectIdx, myLocation);
        if (selectIdx == '1' && myLocation.location1.mat_idx !== '') {
            CheckChange(1)
        } else if (selectIdx == '2' && myLocation.location2.mat_idx !== '') {
            CheckChange(2)
        } else {
            //이제 여기로는 안들어올듯?
            setMyLocation()
        }
    }

    const ChangeComplete2 = () => {
        console.log('ChangeComplete2 ', googleDataSelect, googleDataList);

        if (selectIdx == '1' && myLocation.location1.mat_idx !== '') {
            let target = myLocation.location1
            let longname = googleDataList[googleDataSelect]?.zone;

            ModifyLocation(target.mat_idx, longname, true)
        } else if (selectIdx == '2' && myLocation.location2.mat_idx !== '') {
            let target = myLocation.location2
            let longname = googleDataList[googleDataSelect]?.zone;

            ModifyLocation(target.mat_idx, longname, true)
        } else {
            //이제 여기로는 안들어올듯?
            setMyLocation()
        }
    }

    const CheckChange = (targetindex: number) => {
        let target = targetindex == 1 ? myLocation.location1 : myLocation.location2
        // if (target.mat_status == 'Y' ) {
        //     Alert.alert(`${target.mt_area}` + ' ' + t('제됩니다.'), t('해당지역으로 변경하시겠습니까?'),
        //         [
        //             {
        //                 text: t('변경하기'), onPress: () => {
        //                     ModifyLocation(target.mat_idx)
        //                 }
        //             },
        //             {
        //                 text: t('취소'), onPress: () => {

        //                 }
        //             }
        //         ]
        //     )
        // } else {
        ModifyLocation(target.mat_idx, selLongName)
        // }
    }

    const SetLocationUpdate = () => {
        if (selectIdx == "1") {
            let params = {
                ...myLocation,
                isLocAuth1: true,
                select_location: 1,
                location1: {
                    ...myLocation.location1,
                    mt_address: fulladdress,
                    mt_area: selLongName,
                    mt_lat: selLocation.mt_lat,
                    mt_log: selLocation.mt_log,
                }
            }
            dispatch(MyLocationAction.updateMyLocation(JSON.stringify(params)));
        } else {
            let params = {
                ...myLocation,
                isLocAuth2: true,
                select_location: 2,
                location2: {
                    ...myLocation.location2,
                    mt_address: fulladdress,
                    mt_area: selLongName,
                    mt_lat: selLocation.mt_lat,
                    mt_log: selLocation.mt_log,
                    mat_status: YorN,
                }
            }
            dispatch(MyLocationAction.updateMyLocation(JSON.stringify(params)));
        }
    }

    /** 처음 위치 */
    React.useEffect(() => {
        geoLocation(setNowLocation, setIsLoading);
        /**2초마다 현재위치 리셋 */
        const LocationTimer = setInterval(() => {
            geoLocation(setNowLocation, setIsLoading);
        }, 10000);
        return () => {
            clearInterval(LocationTimer);
        }
    }, [])

    useFocusEffect(React.useCallback(() => {
        if (initialLocation.mt_lat && initialLocation.mt_log) checkAuth();

    }, [initialLocation]))

    /** 거리계산 */
    React.useEffect(() => {
        console.log('initialLocation', initialLocation);
        getDistanceBetweenPoints({
            latitude1: initialLocation.mt_lat,
            longitude1: initialLocation.mt_log,
            latitude2: selLocation.mt_lat,
            longitude2: selLocation.mt_log,
            unit: 'kilometers'
        })
    }, [selLocation, initialLocation])

    React.useEffect(() => {
        // setYorN(distance < 5 ? "Y" : "N")

    }, [distance])





    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <BackHeader title={t('동네인증하기')} />
            <ScrollView>
                <MapView
                    style={{ height: 412 }}
                    // provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: Number(nowLat),
                        longitude: Number(nowLng),
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    rotateEnabled={false}
                    toolbarEnabled={false}
                    onPress={(e) => { onRegionChange(e.nativeEvent.coordinate) }}
                    onRegionChangeComplete={onRegionChange}
                >
                    {/* <Marker
                    coordinate={{latitude: Number(initialLocation.mt_lat), longitude: Number(initialLocation.mt_log)}}
                >
                    <Image style={{width:30,height:30}} resizeMode={'contain'} source={require('../../../assets/img/marker_my.png')}/>
                </Marker> */}
                    <Marker coordinate={{ latitude: selLocation.mt_lat, longitude: selLocation.mt_log }}>
                        <Image style={{ width: 30, height: 50 }} resizeMode={'contain'} source={require('../../../assets/img/marker_town.png')} />
                    </Marker>
                    {/* <View style={{}}>
                        <Text style={{ color: 'blue' }}>{t('현재위치와의 거리')} {distance} {t('km')}</Text>
                    </View> */}
                </MapView>
                {YorN == 'Y' ?
                    <>
                        <View style={{ alignItems: 'center', marginTop: 20, width: '100%' }}>
                            <Text style={[style.text_sb, { fontSize: 18, color: colors.BLACK_COLOR_2 }]}>{t('현재 위치가')}</Text>
                            <Text style={[style.text_sb, { fontSize: 18, color: colors.BLACK_COLOR_2 }]}>
                                {t('내동네로 설정한')}
                                <Text style={{ color: colors.GREEN_COLOR_2 }}>`{selLongName}`</Text>{t('에 있습니다.')}</Text>
                        </View>
                        <View style={{ padding: 20 }}>
                            <CustomButton
                                buttonType='green'
                                title={t('동네인증완료')}
                                action={ChangeComplete}
                                disable={false}
                            />
                        </View>
                    </>
                    :
                    <>
                        <View style={{ alignItems: 'center', marginTop: 20 }}>
                            <Text style={[style.text_sb, { fontSize: 18, color: colors.BLACK_COLOR_2 }]}>{t('현재 위치가')}</Text>
                            <Text style={[style.text_sb, { fontSize: 18, color: colors.BLACK_COLOR_2 }]}><Text style={{ color: colors.GREEN_COLOR_2 }}>'{selLongName}'</Text>{t('이에요!')}</Text>

                            <Text style={[style.text_re, { fontSize: 13, color: colors.GRAY_COLOR_2, marginTop: 20 }]}>
                                {t('현재 내 동네로 설정되어 있는')} <Text style={{ color: colors.GREEN_COLOR_2 }}>'{mt_address}'</Text>'{t('에서만')}
                            </Text>
                            <Text style={[style.text_re, { fontSize: 13, color: colors.GRAY_COLOR_2 }]}>
                                {t('동네인증을 할 수 있어요. 현재 위치를 확인해주세요.')}
                            </Text>
                        </View>
                        <View style={{ padding: 20 }}>
                            <CustomButton
                                buttonType='green'
                                title={t('현재 위치로 동네변경하기')}
                                action={() => setIsModalVisible(true)}
                                disable={false}
                            />
                        </View>
                    </>
                }
            </ScrollView>
            <BackHandlerCom />

            <Modal visible={isModalVisible} transparent={true} onRequestClose={() => setIsModalVisible(false)}>
                <SafeAreaView style={{ flex: 1, }}>
                    <View style={{ flex: 1, backgroundColor: '#000', opacity: 0.3 }}></View>
                    <View style={{
                        width: 300,
                        position: 'absolute', zIndex: 10, elevation: 2, backgroundColor: 'white', borderRadius: 6,
                        left: Dimensions.get('screen').width / 2 - 150,
                        top: 100,
                        padding: 20,
                    }}>
                        <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_1 }]}>{t("현재 위치에 있는 동네는 아래와 같아요. 변경하려는 동네를 선택해주세요.")}</Text>
                        <View style={{ marginTop: 20, marginBottom: 20 }}>
                            {googleDataList.map((e, index) => {
                                return (
                                    <TouchableOpacity key={index} style={{ flexDirection: 'row', marginBottom: 15, paddingRight: 40 }} onPress={() => { setGoogledataSelect(index) }
                                    }>
                                        {googleDataSelect === index ? <Image style={{ width: 22, height: 22 }} source={require('../../../assets/img/check_on.png')} /> :
                                            <Image style={{ width: 22, height: 22, }} source={require('../../../assets/img/check_off.png')} />
                                        }
                                        < Text style={[style.text_me, { fontSize: 15, marginLeft: 10, color: colors.BLACK_COLOR_1 }]} > {e.zone}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>

                        <TouchableOpacity
                            style={[{ backgroundColor: colors.GREEN_COLOR_2, alignItems: 'center', justifyContent: 'center', height: 60 }]}
                            onPress={() => { setIsModalVisible(false); ChangeComplete2() }}
                        >
                            <Text style={[style.text_sb, { color: colors.WHITE_COLOR, fontSize: 18 }]}>
                                {t('동네변경')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setIsModalVisible(false)}
                            style={[{
                                marginTop: 10,
                                backgroundColor: colors.WHITE_COLOR, borderColor: colors.GREEN_COLOR_2, borderWidth: 1,
                                alignItems: 'center', justifyContent: 'center', height: 60
                            }]}>
                            <Text style={[style.text_sb, { color: colors.GREEN_COLOR_2, fontSize: 18 }]}>
                                {t('취소')}
                            </Text>
                        </TouchableOpacity>


                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};


export default AuthMyLocation