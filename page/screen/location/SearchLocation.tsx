/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';

import { Alert, SafeAreaView, ScrollView, Text, View, Image, StyleSheet, Button, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
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



/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */


type Props = StackScreenProps<MainNavigatorParams, 'SearchLocation'>
const SearchLocation = ({ route }: Props) => {

    const { type, selectIdx, mt_type, sns_key } = route?.params;
    // type == 'join' = mt_type, sns_key
    const { t } = useTranslation()

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

    const searchPlace = () => {
        if (keyword != '') {
            setSearchKeyword(keyword);
            setKeyword('');
            setSearchType('search');
        }
    }

    const [tempPlaceList, setTempPlaceList] = React.useState([
        {
            area: t('불러오는중...'),
            zone: ''
        },
    ]);

    const FindLocation = (type: string) => {
        console.log('nowLocation', nowLocation)
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + (type == 'now' ? nowLocation.mt_lat : null) + ',' + (type == 'now' ? nowLocation.mt_log : null)
            + '&key=' + 'AIzaSyC-iZoncRIA4y1xF8zFRkTT2Kp8A3CPC0o' + '&language=ko')
            .then((response) => response.json())
            .then((responseJson) => {
                if (type == 'now') { //현재 동
                    console.log(responseJson.results[0].address_components[1].long_name);
                    FindNowLocation({
                        lat: nowLocation.mt_lat,
                        lng: nowLocation.mt_log,
                        area: responseJson.results[0].address_components[1].long_name
                    })
                    console.log(responseJson.results[0].address_components[3].long_name + ' ' + responseJson.results[0].address_components[2].long_name + ' ' + responseJson.results[0].address_components[1].long_name)
                }
                else if (type == 'sel') { //선택한 동
                    console.log(responseJson.results[0].address_components[1].long_name);
                    console.log(responseJson.results[0].address_components[3].long_name + ' ' + responseJson.results[0].address_components[2].long_name + ' ' + responseJson.results[0].address_components[1].long_name)
                }
            }).catch((err) => console.log("udonPeople error : " + err));

        setSearchType('location')
    }

    const getMylocationData = async () => {
        await client({
            method: 'get',
            url: '/user/myarealist?mt_idx=8&total_count&mat_idx&mat_area&mat_lat&mat_lon&mat_status',
            data: {
                mt_idx: userInfo.idx
            }
        }).then(res => console.log(res.data))
            .catch(err => {
                console.log(err)
            })
    };

    React.useEffect(() => {
        getMylocationData();
    }, []);


    const getLoaction = async () => {
        setIsLoading(true);
        geoLocation(setNowLocation, setIsLoading);
    }


    const selectLocationAccess = (item: any) => {
        SearchedLocation({ item })

    }

    React.useEffect(() => {
        getLoaction();
    }, [])

    React.useEffect(() => {
        console.log('nowLocation', nowLocation);

        //처음 로딩후 현재 위치 불러옴.
        if (type == 'join' && nowLocation.mt_lat) {
            FindLocation('now')
        }
    }, [nowLocation])

    const getSearchLocation = async () => {
        await client({
            method: 'post',
            url: '/user/search-area',
            data: {
                input: keyword,
                nat: "ko"
            }
        }).then(res => {
            setTempPlaceList(res.data.data)
        }
        )
            .catch(err => {
                console.log(err)
            })
    };

    /** 현재지역 위치기반 리스트 요청 */
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
    const SearchedLocation = async ({ item }: { item: { zone: string, area: string } }) => {
        await client({
            method: 'get',
            url: `/user/search-area_selected`,
            params: {
                area: item.area,
                zone: item.zone
            }
        }).then(res => {
            if (type == 'join') {
                navigation.navigate('JoinStep2', {
                    area: item.zone,
                    mt_lat: res.data.mt_lat,
                    mt_log: res.data.mt_log,
                    mt_type: mt_type ?? 1,
                    sns_key: sns_key ?? '',
                })
            }
            else if (type == 'set' && selectIdx) {
                navigation.navigate('AuthMyLocation', {
                    setLocation: {
                        mt_lat: res.data.mt_lat,
                        mt_log: res.data.mt_log,
                    },
                    selectIdx
                })
            }
        }
        )
            .catch(err => {
                console.log(err)
            })
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
        if (keyword.length >= 2) {
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
                {searchType &&
                    <View style={{ marginTop: 40, flex: 1 }}>
                        {searchType == 'location' ?
                            <Text style={[style.text_sb, { fontSize: 15, color: colors.GREEN_COLOR_2 }]}>{t('근처동네')}</Text>
                            :
                            <Text style={[style.text_sb, { fontSize: 15, color: colors.BLACK_COLOR_2 }]}><Text style={{ color: colors.GREEN_COLOR_2 }}>'{searchKeyword}'</Text>{t('검색결과')}</Text>
                        }
                        <View style={{ marginTop: 20 }}>
                            {tempPlaceList.map((item, index) => {
                                return (
                                    <TouchableOpacity onPress={() => {
                                        selectLocationAccess(item);
                                    }} key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                        <Image source={require('../../../assets/img/ico_map.png')} style={{ width: 17, height: 20.5 }} />
                                        <Text style={[style.text_me, { fontSize: 15, color: colors.BLACK_COLOR_2, marginLeft: 10 }]}>
                                            {item.area}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>
                }
            </ScrollView>


            <BackHandlerCom />
        </SafeAreaView>
    );
};

export default SearchLocation;