/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React,{useState} from 'react';
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
import MapView,{ PROVIDER_GOOGLE , Marker } from 'react-native-maps';
import { CustomButton } from '../../../components/layout/CustomButton';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { useTranslation } from 'react-i18next';
import * as MyLocationAction from '../../../redux/actions/MyLocationAction';
import client from '../../../api/client';
import { geoLocation } from '../../../components/utils/getLocation';
import { LocationType } from '../../../components/types/userType';
import cusToast from '../../../components/navigation/CusToast';


type RegionType = {
    latitude : number;
    latitudeDelta?: number;
    longitude:number;
    longitudeDelta?:number;

}
type Props = StackScreenProps<MainNavigatorParams, 'AuthMyLocation'>
const AuthMyLocation = ({route}:Props) => {

    const {selectIdx, setLocation} = route.params;
    const {mt_lat:nowLat,mt_log:nowLng} = setLocation;
    const {t} = useTranslation()

    const myLocation = useSelector((state:any) => state.myLocation)
    const userInfo = useSelector((state:any) => state.userInfo);
    const dispatch = useDispatch();
    

    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    const [isLoading, setIsLoading] = React.useState(false);
    const [selLocation, setSelLocation] = React.useState<LocationType>({
        mt_lat:nowLat,
        mt_log:nowLng,
    });
    const [initialLocation, setNowLocation] = React.useState<LocationType>({
        mt_lat:0,
        mt_log:0,
    })

    const [nowLongName , setNowLongName] = React.useState('');
    const [distance , setDistance] = React.useState(0);
    const [selLongName, setSelLongName] = React.useState('');
    const [fulladdress, setFulladdress] = React.useState('');

    const onRegionChange = (region:RegionType) => {
        setSelLocation({
            mt_lat:region.latitude,
            mt_log:region.longitude,
        })
        //  console.log(getDistanceBetweenPoints(nowLocation.mt_lat, nowLocation.mt_log, selLocation.mt_lat, selLocation.mt_log, 'kilometers'))
    }

    const checkAuth = () => {
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + (selLocation.mt_lat) + ',' + (selLocation.mt_log)
        + '&key=' + 'AIzaSyC-iZoncRIA4y1xF8zFRkTT2Kp8A3CPC0o' + '&language=ko')
        .then((response) => response.json())
        .then((responseJson) => {
            setSelLongName(responseJson.results[0].address_components[1].long_name);
            setFulladdress(responseJson.results[0].address_components[3].long_name +' '+ responseJson.results[0].address_components[2].long_name +' '+ responseJson.results[0].address_components[1].long_name)
        }).catch((err) => console.log("udonPeople error : " + err));
    }

    /** server에 내지역등록 */
    const setMyLocation = async () => {
        await client({
            method: 'post',
            url: '/user/area_add',
            data:{
            mt_idx:userInfo.idx,
            mat_area:selLongName,
            mat_lat:selLocation.mt_lat,
            mat_lon:selLocation.mt_log,
            mat_status:"Y",
            }
            }).then(res=>{
                if(selectIdx == "1"){
                    let params={
                        ...myLocation,
                        isLocAuth1:true,
                        select_location:1,
                        location1:{
                            ...myLocation.location1,
                            mt_address:fulladdress,
                            mt_area:selLongName,
                            mt_lat:setLocation.mt_lat,
                            mt_log:setLocation.mt_log,
                            mat_idx:res.data.mat_idx
                        }
                    }
                    dispatch(MyLocationAction.updateMyLocation(JSON.stringify(params)));
                } else {
                    let params={
                        ...myLocation,
                        isLocAuth2:true,
                        select_location:2,
                        location2:{
                            ...myLocation.location2,
                            mt_address:fulladdress,
                            mt_area:selLongName,
                            mt_lat:setLocation.mt_lat,
                            mt_log:setLocation.mt_log,
                            mat_status:'Y',
                            mat_idx:res.data.mat_idx
                        }
                    }
                    dispatch(MyLocationAction.updateMyLocation(JSON.stringify(params)));
                }
                navigation.navigate('Main')
            }).catch(error=>{
            console.log(error)
            })
        }

    /** server에 내지역삭제 */
    const DeleteLocation = async(target:number) => {
        await client({
          method: 'post',
          url: '/user/area_delete',
          data:{
            mat_idx:target,
          }}).then(
            res=>{
                setIsLoading(false)
                setMyLocation()
            }
          ).catch(err=>console.log(err))
          setIsLoading(false)
    };
    
        /** 현재거리&지정거리 계산 */
    const getDistanceBetweenPoints = ({latitude1, longitude1, latitude2, longitude2, unit}:any) => {
        let theta = longitude1 - longitude2;
        let distance = 60 * 1.1515 * (180/Math.PI) * Math.acos(
            Math.sin(latitude1 * (Math.PI/180)) * Math.sin(latitude2 * (Math.PI/180)) + 
            Math.cos(latitude1 * (Math.PI/180)) * Math.cos(latitude2 * (Math.PI/180)) * Math.cos(theta * (Math.PI/180))
        );
        
        if (unit == 'miles') {
            setDistance(Math.round(distance, 2))
        } else if (unit == 'kilometers') {
            setDistance(Math.round(distance * 1.609344, 2))
        }
    }

    const ChangeComplete = () => {
        if(distance > 25){
            cusToast(t('25km이상 거리는 동네설정불가'))
        } else{
            if(selectIdx == '1' && myLocation.location1.mat_idx !== ''){
                DeleteLocation(myLocation.location1.mat_idx)
            } else if(selectIdx == '2' && myLocation.location2.mat_idx !== '') {
                DeleteLocation(myLocation.location2.mat_idx)
            } else{
                setMyLocation()
            }
        }
    }
    
    /** 처음 위치 */
    React.useEffect(()=>{
        geoLocation(setNowLocation,setIsLoading);
        /**2초마다 현재위치 리셋 */
        // const LocationTimer = setInterval(() => {
        //     geoLocation(setNowLocation,setIsLoading);
        //   }, 2000);
        // return () => {
        // clearInterval(LocationTimer);
        // }
    },[])
    
    /** 드래그시 위치 */
    React.useEffect(()=>{
        checkAuth();
    },[selLocation])

    /** 거리계산 */
    React.useEffect(()=>{
        console.log("nowLongName",nowLongName)
        getDistanceBetweenPoints({
            latitude1:initialLocation.mt_lat, 
            longitude1:initialLocation.mt_log, 
            latitude2:selLocation.mt_lat, 
            longitude2:selLocation.mt_log, 
            unit:'kilometers'})
    },[selLocation, initialLocation])





    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <BackHeader title={t('동네인증하기')}/>
            <ScrollView>
                <MapView
                    style={{height:412}}
                    // provider={PROVIDER_GOOGLE}
                    initialRegion={{
                        latitude: Number(nowLat),
                        longitude: Number(nowLng),
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                    rotateEnabled={false}
                    toolbarEnabled={false}
                    onPress={(e)=>{onRegionChange(e.nativeEvent.coordinate)}}
                    onRegionChangeComplete={onRegionChange}
                >
                <Marker
                    coordinate={{latitude: Number(initialLocation.mt_lat), longitude: Number(initialLocation.mt_log)}}
                >
                    <Image style={{width:30,height:30}} resizeMode={'contain'} source={require('../../../assets/img/marker_my.png')}/>
                </Marker>
                <Marker
                    coordinate={{latitude: selLocation.mt_lat, longitude: selLocation.mt_log}}
                >
                    <Image style={{width:30,height:50}} resizeMode={'contain'} source={require('../../../assets/img/marker_town.png')}/>
                </Marker>
                <View style={{marginTop:10,marginLeft:10}}>
                    <Text style={{color:'blue'}}>{t('현재위치와의 거리')} {distance} {t('km')}</Text>
                </View>
                </MapView>
                {selLongName == myLocation.location1.mt_area || selLongName == myLocation.location2.mt_area?
                <>
                <View style={{alignItems:'center',marginTop:20,width:'100%'}}>
                    <Text style={[style.text_sb,{fontSize:18,color:colors.BLACK_COLOR_2}]}>{t('현재 위치가')}</Text>
                    <Text style={[style.text_sb,{fontSize:18,color:colors.BLACK_COLOR_2}]}>{t('내동네로 설정한')}<Text style={{color:colors.GREEN_COLOR_2}}>`{selLongName}`</Text>{t('에 있습니다.')}</Text>
                </View>
                <View style={{padding:20}}>
                    <CustomButton 
                        buttonType='green'
                        title={t('동네인증완료')}
                        action={()=>navigation.navigate('Main')}
                        disable={false}
                    />
                </View>
                </>
                :
                <>
                    <View style={{alignItems:'center',marginTop:20}}>
                        <Text style={[style.text_sb,{fontSize:18,color:colors.BLACK_COLOR_2}]}>{t('현재 위치가')}</Text>
                        <Text style={[style.text_sb,{fontSize:18,color:colors.BLACK_COLOR_2}]}>'<Text style={{color:colors.GREEN_COLOR_2}}>{selLongName}'</Text>{t('이에요!')}</Text>
                    
                        <Text style={[style.text_re,{fontSize:13,color:colors.GRAY_COLOR_2,marginTop:20}]}>
                        {t('현재 내 동네로 설정되어 있는')} <Text style={{color:colors.GREEN_COLOR_2}}>{t('내동네 지역명')}'</Text>'{t('에서만')}
                        </Text>
                        <Text style={[style.text_re,{fontSize:13,color:colors.GRAY_COLOR_2}]}>
                        {t('동네인증을 할 수 있어요. 현재 위치를 확인해주세요.')}
                        </Text>
                    </View>
                    <View style={{padding:20}}>
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



