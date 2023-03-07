import Geolocation from "@react-native-community/geolocation";
import { PermissionsAndroid, Platform } from "react-native";


export async function requestPermission(){
    try {
        if(Platform.OS === 'ios'){
            console.log('thisIs Ios');
        }
        else{
            return await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            )
        }
    }
    catch(e){
        console.log(e);
    }
}

type SetLocationType = {
    mt_lat:number;
    mt_log:number;
}

export const geoLocation = (setLocation:({}:SetLocationType)=>void,setIsLoading:(loading:boolean)=>void) => { // 경위도 가져오기
    requestPermission().then(result => {
        if(result === 'granted'){
            Geolocation.getCurrentPosition((position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
    
                const coordParam = {
                    mt_lat : latitude,
                    mt_log : longitude,
                }

                setLocation(coordParam);
                setIsLoading(false);
            },
            error => {
                console.log('code ? ', error.code);
                if(error.code === 1){
                    console.log('위치정보제공 x');
                }
                else if(error.code === 2){
                    console.log('gps꺼져있음');
                }
                else{
                    console.log('error 333333333? ' , error);
                }
                
            },
            { enableHighAccuracy: false, timeout: 1000000, maximumAge: 10000 });
        }
    })
    
}