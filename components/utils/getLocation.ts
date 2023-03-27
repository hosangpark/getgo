import Geolocation from "@react-native-community/geolocation";
import { PermissionsAndroid, Platform, Linking, Alert } from "react-native";
import cusToast from "../navigation/CusToast";
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../types/routerTypes';

export async function requestPermission() {
    try {
        if (Platform.OS === 'ios') {
            console.log('thisIs Ios');
        }
        else {
            return await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            )
        }
    }
    catch (e) {
        console.log(e);
    }
}

type SetLocationType = {
    mt_lat: number;
    mt_log: number;
}

export const geoLocation = (setLocation: ({ }: SetLocationType) => void, setIsLoading: (loading: boolean) => void, t: any, navigation: any) => { // 경위도 가져오기


    requestPermission().then(result => {
        console.log('result', result);
        if (result === 'granted') {
            Geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                const coordParam = {
                    mt_lat: latitude,
                    mt_log: longitude,
                }

                setLocation(coordParam);
                setIsLoading(false);
            },
                error => {
                    console.log('code ? ', error.code);
                    if (error.code === 1) {
                        console.log('위치정보제공 x');
                    }
                    else if (error.code === 2) {
                        console.log('gps꺼져있음');
                    }
                    else {
                        console.log('error 333333333? ', error);
                    }

                },
                { enableHighAccuracy: false, timeout: 1000000, maximumAge: 10000 });
        } else {


            if (result == 'never_ask_again') {
                Alert.alert(t('앱을 이용하시려면 위치권한이 필요합니다.'), '', [{ text: t('확인'), onPress: () => { navigation.goBack(); Linking.openSettings(); } }]);
                //     // cusToast(t('위치 허용 설정을 해주세요'));
                //     // navigation.goBack();

            } else if (result == 'denied') {
                Alert.alert(t('앱을 이용하시려면 위치권한이 필요합니다.'), '', [{ text: t('확인'), onPress: () => navigation.goBack() }]);

            }
        }
    })

}