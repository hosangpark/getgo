/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useState } from 'react';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';

import { Alert, SafeAreaView, ScrollView, Text, View, Image, StyleSheet, Button, TouchableOpacity, TextInput, ActivityIndicator, AppState } from 'react-native';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { LocationHeader } from '../../../components/header/LocationHeader';
import { geoLocation, } from '../../../components/utils/getLocation';
import Geolocation from '@react-native-community/geolocation';
import { LocationType } from '../../../components/types/userType';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import Modal from "react-native-modal";
import * as MyLocationAction from '../../../redux/actions/MyLocationAction';
import { connect, useDispatch, useSelector } from 'react-redux';
import { reduxStateType, myLocationType, userInfoType } from '../../../components/types/reduxTypes';
import { useTranslation } from 'react-i18next';
import MapView, { Marker } from 'react-native-maps';
import client from '../../../api/client';
import LoadingIndicator from '../../../components/layout/Loading';
import Api, { NodataView } from '../../../api/Api';
import cusToast from '../../../components/navigation/CusToast';



/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */


type Props = StackScreenProps<MainNavigatorParams, 'SearchLocation'>
const SearchLocation = ({ route }: Props) => {

    const { type, selectIdx, mt_type, sns_key } = route?.params;
    // type == 'join' = mt_type, sns_key
    const { t, i18n } = useTranslation()

    const dispatch = useDispatch();
    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

    const [keyword, setKeyword] = React.useState<string>('');
    const [searchType, setSearchType] = React.useState<string>('');
    const [searchKeyword, setSearchKeyword] = React.useState<string>('');

    const [nowLocation, setNowLocation] = React.useState<LocationType>({
        mt_lat: 0,
        mt_log: 0,
    })
    const [selAddress, setSelAddress] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const myLocation = useSelector((state: any) => state.myLocation)
    const userInfo = useSelector((state: any) => state.userInfo);

    const [CountryName, setCountryName] = React.useState(i18n.language == 'Id' ? 'Indonesia' : i18n.language == 'En' ? 'English' : 'Korea');

    const searchPlace = () => {
        if (keyword.trim().length >= 2) {
            setSearchKeyword(keyword);
            setKeyword('');
            setSearchType('search');
        } else {
            cusToast(t('2자 이상 입력해주세요.'))
        }
    }

    const [CheckList, setCheckList] = React.useState([]);
    const [tempPlaceList, setTempPlaceList] = React.useState([
        {
            area: t('불러오는중...'),
            zone: '',
            lat: 0,
            lng: 0,
        },
    ]);

    const FindLocation = async (type: string) => {
        console.log('nowLocation', nowLocation)

        setIsLoading(true)

        if (nowLocation.mt_lat && nowLocation.mt_log) {
            let lat = nowLocation.mt_lat;
            let lng = nowLocation.mt_log;

            const Center = { lat: lat, lng: lng }
            const East = DestinationPoint(lat, lng, 90, 1);
            const South = DestinationPoint(lat, lng, 180, 1);
            const North = DestinationPoint(lat, lng, 0, 1);
            const West = DestinationPoint(lat, lng, 270, 1);

            let list = [];

            let tempData = await getGoogleLocData(Center.lat, Center.lng);
            list = [...list, ...tempData]
            list = [... new Map(list.map(item => [item.zone, item])).values()]
            setCheckList(tempData);

            tempData = await getGoogleLocData(East?.lat, East?.lng);
            list = [...list, ...tempData]

            tempData = await getGoogleLocData(South?.lat, South?.lng);
            list = [...list, ...tempData]

            tempData = await getGoogleLocData(North?.lat, North?.lng);
            list = [...list, ...tempData]

            tempData = await getGoogleLocData(West?.lat, West?.lng);
            list = [...list, ...tempData]

            const unique = [... new Map(list.map(item => [item.zone, item])).values()]

            console.log('unique', unique);

            setTempPlaceList(unique);
        } else {
            Alert.alert(t('위치정보를 받아올 수 없습니다.'));
        }

        setIsLoading(false)

        // https://maps.googleapis.com/maps/api/geocode/json?latlng=35.2441162,129.0902836&result_type=sublocality_level_2&location_type=&key=AIzaSyC-iZoncRIA4y1xF8zFRkTT2Kp8A3CPC0o&language=Ko



        setSearchType('location')
    }

    const getGoogleLocData = async (lat, lng) => {
        // lng = 106.759478;
        // lat = -6.2295712;

        // let result_type = (lng < 132 && lng > 125 && lat > 33 && lat < 39) ? 'sublocality_level_2' : 'administrative_area_level_4'
        return await fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng
            + '&result_type=sublocality_level_2|administrative_area_level_4' + '&location_type=&key=' + Api.state.googleMapKey + '&language=' + i18n.language)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('nowLocation2', responseJson);

                if (responseJson.status == 'OK') {
                    return responseJson.results.map((item, index) => {
                        // console.log('tei', item)
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

    const locDataRebuild = (responseJson) => {
        for (var i = 0; i < 9; i++) {
            if (responseJson.results[0].address_components[i].types.includes('country')) {
                setCountryName(responseJson.results[0].address_components[i].long_name);
                break
            }
        }
    }

    // const getMylocationData = async () => {
    //     await client({
    //         method: 'get',
    //         url: '/user/myarealist?mt_idx=' + userInfo.idx,
    //     }).then(res => console.log('/user/myarealist?mt_idx=' + userInfo.idx, res.data))
    //         .catch(err => {
    //             console.log(err)
    //         })
    // };

    // React.useEffect(() => {
    //     // getMylocationData();

    //     const subscribe = AppState.addEventListener('change', (nextAppState) => {

    //         console.log('nextAppState', nextAppState);
    //         if (nextAppState === 'active') {
    //             getLoaction();
    //         }
    //     });

    //     getLoaction();

    //     return () => {
    //         subscribe.remove();
    //     }
    // }, []);


    const getLoaction = async () => {
        setIsLoading(true);
        console.log('e')
        geoLocation(setNowLocation, setIsLoading, t, navigation);
    }


    React.useEffect(() => {
        //현재위치
        getLoaction();
    }, [])

    React.useEffect(() => {
        console.log('nowLocation', nowLocation);

        //처음 로딩후 현재 위치버튼 누름.
        if (nowLocation.mt_lat) {
            FindLocation('now')
        }
    }, [nowLocation])

    const getSearchLocation = async () => {
        await client({
            method: 'post',
            url: '/user/search-area',
            data: {
                input: keyword,
                nat: i18n.language
            }
        }).then(res => {
            console.log('user/search-area', res.data)
            setTempPlaceList(res.data.data)
        })
            .catch(err => {
                console.log(err)
            })
    };

    //거리이격 좌표구하기
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }

    Number.prototype.toDeg = function () {
        return this * 180 / Math.PI;
    }

    const DestinationPoint = function (lat: Number, lng: Number, brng: Number, dist: any) {
        dist = dist / 6371;
        brng = brng.toRad();

        var lat1 = lat.toRad(), lon1 = lng.toRad();

        var lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
            Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));

        var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
            Math.cos(lat1),
            Math.cos(dist) - Math.sin(lat1) *
            Math.sin(lat2));

        if (isNaN(lat2) || isNaN(lon2)) return null;

        return { lat: lat2.toDeg(), lng: lon2.toDeg() }
    }


    /** 현재지역 위치기반 리스트 요청 -> 안씀 */
    const FindNowLocation = async ({ lat, lng, area }: { lat: number, lng: number, area: string }) => {
        await client({
            method: 'get',
            url: `/user/around-town?lng=${lng}&lat=${lat}&area=${area}`,
        }).then(res => {
            setTempPlaceList(res.data.data)
        }
        )
            .catch(err => {
                console.log(err)
            })
    };
    /** 선택지역 위치요청 */
    const SearchedLocation = (item: { zone: string, area: string, lat: any, lng: any }) => {

        console.log('SearchedLocation, ', item)
        console.log('CheckList.length', CheckList.length)
        let mat_status = 'N';
        if (CheckList.length) {
            CheckList.forEach(({ zone }) => {
                if (item.zone == zone) mat_status = 'Y'
            })
        }

        client({
            method: 'get',
            url: `/user/search-area_selected`,
            params: {
                area: item.area,
                zone: item.zone
            }
        }).then(res => {
            console.log('res', res.data);
            if (type == 'join') {
                navigation.navigate('JoinStep2', {
                    area: item.zone,
                    mt_lat: res.data.mt_lat,
                    mt_log: res.data.mt_log,
                    mt_type: mt_type ?? 1,
                    sns_key: sns_key ?? '',
                    mat_status: mat_status,
                })
            }
            else if (type == 'set' && selectIdx) {
                // navigation.navigate('AuthMyLocation', {
                //     setLocation: {
                //         mt_lat: res.data.mt_lat,
                //         mt_log: res.data.mt_log,
                //     },
                //     selectIdx
                // })
                client({
                    method: 'post',
                    url: '/user/area_add',
                    data: {
                        mt_idx: userInfo.idx,
                        mat_area: item.zone,
                        mat_lat: res.data.mt_lat,
                        mat_lon: res.data.mt_log,
                        mat_status: mat_status,
                    }
                }).then(res => {
                    navigation.navigate('SetMyLocation')
                }).catch(error => {
                    console.log(error)
                })
            }
        });

    };


    const ListCoordinate = async ({ area, zone }: { area: string, zone: string }) => {
        await client({
            method: 'get',
            url: `/user/search-area_selected?area=${area}&zone=${zone}`,
        }).then(res => {
            setTempPlaceList(res.data.data)
        }
        )
            .catch(err => {
                console.log(err)
            })
    };

    /** 글자 검색 시 마다 api 호출 */
    React.useEffect(() => {
        if (keyword.trim().length >= 2) {
            getSearchLocation();
            setSearchKeyword(keyword);
            setSearchType('search');
        }
    }, [keyword])


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <LocationHeader value={keyword} setValue={setKeyword} searchPlace={searchPlace} />
            <ScrollView style={[style.default_background, { flexGrow: 1, paddingHorizontal: 20 }]}>
                <View style={{ marginTop: 10 }}>
                    {(nowLocation.mt_lat == 0 && nowLocation.mt_log == 0) ?
                        <TouchableOpacity onPress={() => { getLoaction() }} style={{ flexDirection: 'row', borderWidth: 1, borderColor: colors.GRAY_COLOR_3, borderRadius: 5, height: 45, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={require('../../../assets/img/ico_location.png')} style={{ width: 18, height: 18 }} />
                            <Text style={[style.text_sb, { fontSize: 15, marginLeft: 10 }]}>{t('내위치 찾기')}</Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={() => FindLocation('now')} style={{ flexDirection: 'row', borderWidth: 1, borderColor: colors.GRAY_COLOR_3, borderRadius: 5, height: 45, alignItems: 'center', justifyContent: 'center' }}>
                            <Image source={require('../../../assets/img/ico_location.png')} style={{ width: 18, height: 18 }} />
                            <Text style={[style.text_sb, { fontSize: 15, marginLeft: 10 }]}>{t('현재위치로 찾기')}</Text>
                        </TouchableOpacity>
                    }
                </View>
                {isLoading &&
                    <LoadingIndicator />
                }
                {searchType &&
                    <View style={{ marginTop: 40, flex: 1 }}>
                        {searchType == 'location' ?
                            <Text style={[style.text_sb, { fontSize: 15, color: colors.GREEN_COLOR_2 }]}>{t('근처동네')}</Text>
                            :
                            <Text style={[style.text_sb, { fontSize: 15, color: colors.BLACK_COLOR_2 }]}><Text style={{ color: colors.GREEN_COLOR_2 }}>'{searchKeyword}'</Text>{t('검색결과')}</Text>
                        }
                        <View style={{ marginTop: 20 }}>
                            {tempPlaceList.length ?
                                tempPlaceList.map((item, index) => {
                                    return (
                                        <TouchableOpacity onPress={() => SearchedLocation(item)} key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                            <Image source={require('../../../assets/img/ico_map.png')} style={{ width: 17, height: 20.5 }} />
                                            <Text style={[style.text_me, { fontSize: 15, color: colors.BLACK_COLOR_2, marginLeft: 10 }]}>
                                                {item.area}</Text>
                                        </TouchableOpacity>
                                    )
                                }) : <NodataView></NodataView>}
                        </View>
                    </View>
                }
            </ScrollView>


            <BackHandlerCom />
        </SafeAreaView>
    );
};

export default SearchLocation;