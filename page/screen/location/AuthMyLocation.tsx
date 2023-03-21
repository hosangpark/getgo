/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView, Image, Text, View, FlatList, ScrollView
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
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


type RegionType = {
    latitude: number;
    latitudeDelta?: number;
    longitude: number;
    longitudeDelta?: number;

}
type Props = StackScreenProps<MainNavigatorParams, 'AuthMyLocation'>
const AuthMyLocation = ({ route }: Props) => {

    const { selectIdx, setLocation } = route.params;
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
    const [distance, setDistance] = React.useState(0);
    const [selLongName, setSelLongName] = React.useState('');
    const [CountryName, setCountryName] = React.useState('');
    const [fulladdress, setFulladdress] = React.useState('');
    const YorN = distance < 25 ? "Y" : "N"
    const onRegionChange = (region: RegionType) => {
        setSelLocation({
            mt_lat: region.latitude,
            mt_log: region.longitude,
        })
        //  console.log(getDistanceBetweenPoints(nowLocation.mt_lat, nowLocation.mt_log, selLocation.mt_lat, selLocation.mt_log, 'kilometers'))
    }

    const checkAuth = async() => {
     await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + (selLocation.mt_lat) + ',' + (selLocation.mt_log)
            + '&key=' + 'AIzaSyC-iZoncRIA4y1xF8zFRkTT2Kp8A3CPC0o' + `&language=${i18n.language}`)
            .then((response) => response.json())
            .then((responseJson) => {
                for (var i = 0; i<9; i++){
                    if(responseJson.results[0].address_components[i].types.includes('country')){
                        setCountryName(responseJson.results[0].address_components[i].long_name);
                        break
                    }
                }

                if(CountryName == "Indonesia"){
                    for (var i = 0; i<9; i++){
                        if(responseJson.results[i].address_components[0].types.includes('administrative_area_level_4')){
                            setSelLongName(responseJson.results[i].address_components[1].long_name);
                            break
                        }
                    }
                } else {
                    for (var i = 0; i<5; i++){
                        if(responseJson.results[i].address_components[0].types.includes('sublocality_level_2')){
                            setSelLongName(responseJson.results[i].address_components[0].long_name);
                            break
                        }
                    }
                }


                setFulladdress(responseJson.results[0].address_components[3].long_name + ' ' + responseJson.results[0].address_components[2].long_name + ' ' + responseJson.results[0].address_components[1].long_name)
            }).catch((err) => console.log("udonPeople error : " + err));
    }

    /** server에 내지역등록 */
    const setMyLocation = async () => {
        await client({
            method: 'post',
            url: '/user/area_add',
            data: {
                mt_idx: userInfo.idx,
                mat_area: selLongName,
                mat_lat: selLocation.mt_lat,
                mat_lon: selLocation.mt_log,
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
    const ModifyLocation = async (target: number) => {
        await client({
            method: 'post',
            url: '/user/area_edit',
            data: {
                mat_idx: target,
                mat_area: selLongName,
                mat_lat: selLocation.mt_lat,
                mat_lon: selLocation.mt_log,
                mat_status: YorN
            }
        }).then(
            res => {
                SetLocationUpdate()
                cusToast(t(res.data.message))
                navigation.navigate('Main')
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
            setDistance(Math.round(distance * 1.609344, 2))
        }
    }

    const ChangeComplete = () => {
        console.log('selectIdx', selectIdx, myLocation);
        if (selectIdx == '1' && myLocation.location1.mat_idx !== '') {
            CheckChange(1)
        } else if (selectIdx == '2' && myLocation.location2.mat_idx !== '') {
            CheckChange(2)
        } else {
            setMyLocation()
        }
    }

    const CheckChange = (targetindex: number) => {
        let target = targetindex == 1 ? myLocation.location1 : myLocation.location2
        if (target.mat_status == 'Y') {
            Alert.alert(`${target.mt_area}` + ' ' + t('인증이 삭제됩니다.'), t('해당지역으로 변경하시겠습니까?'),
                [
                    {
                        text: t('변경하기'), onPress: () => {
                            ModifyLocation(target.mat_idx)
                        }
                    },
                    {
                        text: t('취소'), onPress: () => {

                        }
                    }
                ]
            )
        } else {
            ModifyLocation(target.mat_idx)
        }
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
        }, 2000);
        return () => {
            clearInterval(LocationTimer);
        }
    }, [])

    /** 드래그시 위치 */
    React.useEffect(() => {
        checkAuth();
    }, [selLocation])

    /** 거리계산 */
    React.useEffect(() => {
        getDistanceBetweenPoints({
            latitude1: initialLocation.mt_lat,
            longitude1: initialLocation.mt_log,
            latitude2: selLocation.mt_lat,
            longitude2: selLocation.mt_log,
            unit: 'kilometers'
        })
    }, [selLocation, initialLocation])





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
                    <Marker
                        coordinate={{ latitude: selLocation.mt_lat, longitude: selLocation.mt_log }}
                    >
                        <Image style={{ width: 30, height: 50 }} resizeMode={'contain'} source={require('../../../assets/img/marker_town.png')} />
                    </Marker>
                    <View style={{flex:1,backgroundColor:'auqa'}}>
                        <Text style={{ color: 'blue' }}>{t('현재위치와의 거리')} {distance} {t('km')}</Text>
                    </View>
                </MapView>
                {distance < 25 ?
                    <>
                        <View style={{ alignItems: 'center', marginTop: 20, width: '100%' }}>
                            <Text style={[style.text_sb, { fontSize: 18, color: colors.BLACK_COLOR_2 }]}>{t('현재 위치가')}</Text>
                            <Text style={[style.text_sb, { fontSize: 18, color: colors.BLACK_COLOR_2 }]}>
                                {/* {t('내동네로 설정한')} */}
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
                            <Text style={[style.text_sb, { fontSize: 18, color: colors.BLACK_COLOR_2 }]}>'<Text style={{ color: colors.GREEN_COLOR_2 }}>{selLongName}'</Text>{t('이에요!')}</Text>

                            <Text style={[style.text_re, { fontSize: 13, color: colors.GRAY_COLOR_2, marginTop: 20 }]}>
                                {t('현재 내 동네로 설정되어 있는')} <Text style={{ color: colors.GREEN_COLOR_2 }}>{t('내동네 지역명')}'</Text>'{t('에서만')}
                            </Text>
                            <Text style={[style.text_re, { fontSize: 13, color: colors.GRAY_COLOR_2 }]}>
                                {t('동네인증을 할 수 있어요. 현재 위치를 확인해주세요.')}
                            </Text>
                        </View>
                        <View style={{ padding: 20 }}>
                            <CustomButton
                                buttonType='green'
                                title={t('현재 위치로 동네변경하기')}
                                action={ChangeComplete}
                                disable={false}
                            />
                        </View>
                    </>
                }
            </ScrollView>
            <BackHandlerCom />
        </SafeAreaView>
    );
};


export default AuthMyLocation