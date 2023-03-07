/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React,{useState} from 'react';
import {
    Alert,
  SafeAreaView, Image, Text, View, FlatList, ScrollView
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect, useDispatch, useSelector } from 'react-redux';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { BackHeader } from '../../../components/header/BackHeader'
import { myLocationType, reduxStateType } from '../../../components/types/reduxTypes';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { LocationType } from '../../../components/types/userType';
import { geoLocation } from '../../../components/utils/getLocation';
import { useTranslation } from 'react-i18next';


import * as MyLocationAction from '../../../redux/actions/MyLocationAction';
import client from '../../../api/client';
import cusToast from '../../../components/navigation/CusToast';



const SetMyLocation = () => {

    const myLocation = useSelector((state:any) => state.myLocation)
    const userInfo = useSelector((state:any) => state.userInfo);
    const dispatch = useDispatch();

    const {t} = useTranslation()
    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

    const [isLoading, setIsLoading] = React.useState(false);

    const [nowLocation, setNowLocation] = React.useState<LocationType>({
        mt_lat:0,
        mt_log:0,
    })

    const getLocationData = async () => {
        await client({
          method: 'get',
          url: `/user/myarealist?mt_idx=${userInfo.idx}&total_count&mat_idx&mat_area&mat_lat&mat_lon&mat_status`,
          }).then(
            res=>
            {
              if(res.data.list.length == 1){
                let params={
                  ...myLocation,
                    isLocAuth1:true,
                    isLocAuth2:false,
                    select_location:"1",
                    location1:{
                        mt_area:res.data.list[0].mat_area,
                        mt_address:res.data.list[0].mat_area,
                        mt_lat:res.data.list[0].mat_lat,
                        mt_log:res.data.list[0].mat_log,
                        mat_status:res.data.list[0].mat_status,
                        mat_idx:res.data.list[0].mat_idx
                    },
                  }
                  dispatch(MyLocationAction.deleteLocation(JSON.stringify(params)))
                } else if(res.data.list.length == 2) {
                  let params={
                    ...myLocation,
                      isLocAuth1:true,
                      isLocAuth2:true,
                      location1:{
                          mt_area:res.data.list[0].mat_area,
                          mt_address:res.data.list[0].mat_area,
                          mt_lat:res.data.list[0].mat_lat,
                          mt_log:res.data.list[0].mat_lon,
                          mat_status:res.data.list[0].mat_status,
                          mat_idx:res.data.list[0].mat_idx
                      },
                      location2:{
                          mt_area:res.data.list[1].mat_area,
                          mt_address:res.data.list[1].mat_area,
                          mt_lat:res.data.list[1].mat_lat,
                          mt_log:res.data.list[1].mat_lon,
                          mat_status:res.data.list[1].mat_status,
                          mat_idx:res.data.list[1].mat_idx
                      }
                  }
                  dispatch(MyLocationAction.updateMyLocation(JSON.stringify(params)))
                } else {
                dispatch(MyLocationAction.deleteAll())
                }
            }).
            catch(
            err=>{
                console.log(err)
                // cusToast('사용자 지역 데이터를 불러오지 못했습니다.')
            }
            )
            setIsLoading(false)
    };
    
    const DeleteLocation = async(target:number) => {
        await client({
          method: 'post',
          url: '/user/area_delete',
          data:{
            mat_idx:target,
          }}).then(
            res=>{
                cusToast(t(res.data.message))
                setIsLoading(false)
                getLocationData()
            }
          ).catch(err=>console.log(err))
          setIsLoading(false)
    };

    const getLoaction = async() => {
        setIsLoading(true);
        geoLocation(setNowLocation,setIsLoading);
    }
    React.useEffect(()=>{
        getLocationData()
        getLoaction();
    },[])





    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <BackHeader title={t('내 동네 설정')}/>
          
          <View style={{paddingHorizontal:20,marginTop:40}}>
            <Text style={[style.text_b,{color:colors.BLACK_COLOR_2,fontSize:15}]}>{t('동네선택')}</Text>
            <View style={{marginTop:10}}>
                {myLocation.location1.mt_address != '' ? 
                    <TouchableOpacity onPress={()=>{

                            setIsLoading(true);
                            geoLocation(setNowLocation,setIsLoading);
                            navigation.navigate('AuthMyLocation',{
                                setLocation:{
                                mt_lat:JSON.parse(myLocation.location1.mt_lat),
                                mt_log:JSON.parse(myLocation.location1.mt_log),
                            },selectIdx:'1'})
                        
                    }} style={[myLocation.select_location == myLocation.location1.mt_address ? style.green_button : style.white_button_gb,{flexDirection:'row',justifyContent:'space-between',}]}>
                        <Text style={[style.text_b,{fontSize:15,color:myLocation.isLocAuth1 ? colors.GREEN_COLOR_2 : colors.GRAY_COLOR_2}]}>{myLocation.location1.mt_address}</Text>
                        <TouchableOpacity onPress={()=>{DeleteLocation(myLocation.location1.mat_idx)}}
                        style={{zIndex:10,width:30,height:30, alignItems:'flex-end',justifyContent:'center'}}>
                            <Image source={myLocation.select_location == myLocation.location1.mt_address ? require('../../../assets/img/ico_close2_w.png') : require('../../../assets/img/ico_close2_g.png')} style={{width:25,height:25}}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                :
                <TouchableOpacity onPress={()=>{navigation.navigate('SearchLocation',{type:'set',selectIdx:'1'})}}style={{backgroundColor:colors.WHITE_COLOR,borderWidth:1,borderColor:colors.GRAY_LINE,borderRadius:6,flexDirection:'row',alignItems:'center',justifyContent:'center',height:60}}>
                    <Text style={[style.text_sb,{fontSize:16,color:colors.GREEN_COLOR_2}]}>{t('동네 추가하기')}</Text>
                    <Image source={require('../../../assets/img/ico_plus_g.png')} style={{width:20,height:20,marginLeft:3,marginTop:2}} />
                </TouchableOpacity>
                }
            </View>
            <View style={{marginTop:5}}>
                {myLocation.location2.mt_address != '' ? 
                    <TouchableOpacity onPress={()=>{

                            setIsLoading(true);
                            geoLocation(setNowLocation,setIsLoading);
                            navigation.navigate('AuthMyLocation',{
                                setLocation:{
                                mt_lat:JSON.parse(myLocation.location2.mt_lat),
                                mt_log:JSON.parse(myLocation.location2.mt_log),
                            },selectIdx:'2'})

                    }}
                    style={[myLocation.select_location == myLocation.location2.mt_address ? style.green_button : style.white_button_gb,{flexDirection:'row',justifyContent:'space-between',}]}>
                        <Text style={[style.text_b,{fontSize:15,color:myLocation.isLocAuth2 ? colors.GREEN_COLOR_2 : colors.GRAY_COLOR_2}]}>{myLocation.location2.mt_address}</Text>
                        <TouchableOpacity onPress={()=>{DeleteLocation(myLocation.location2.mat_idx)}}
                        style={{zIndex:10,width:30,height:30, alignItems:'flex-end',justifyContent:'center'}}>
                            <Image source={myLocation.select_location == myLocation.location2.mt_address ? require('../../../assets/img/ico_close2_w.png') : require('../../../assets/img/ico_close2_g.png')} style={{width:25,height:25}}/>
                        </TouchableOpacity>
                    </TouchableOpacity>
                :
                    <TouchableOpacity onPress={()=>{navigation.navigate('SearchLocation',{type:'set',selectIdx:'2'})}}style={{backgroundColor:colors.WHITE_COLOR,borderWidth:1,borderColor:colors.GRAY_LINE,borderRadius:6,flexDirection:'row',alignItems:'center',justifyContent:'center',height:60}}>
                        <Text style={[style.text_sb,{fontSize:16,color:colors.GREEN_COLOR_2}]}>{t('동네 추가하기')}</Text>
                        <Image source={require('../../../assets/img/ico_plus_g.png')} style={{width:20,height:20,marginLeft:3,marginTop:2}} />
                    </TouchableOpacity>
                }
            </View>
          </View>
          <BackHandlerCom />
        </SafeAreaView>
    );
};



export default SetMyLocation



