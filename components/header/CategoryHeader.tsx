import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { MainNavigatorParams } from '../types/routerTypes';

import {Image, Pressable, Text, View, TouchableOpacity} from 'react-native';
import style from '../../assets/style/style';


interface CategoryHeaderType{
    title : String;
    setTabIndex:(index:number)=>void
}
export const CategoryHeader = ({title,setTabIndex}:CategoryHeaderType) => {
    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    const Notification = () => {
        navigation.navigate('NotificationIndex');
    }
    
    return(
        <View style={[style.header_,{backgroundColor:'#ffffff'}]}>
            <View style={[{flex:1,justifyContent:'center',alignItems:'center'}]}>
                <Text style={[style.text_b,{color:'#222222',fontSize:18}]}>{title}</Text>
            </View>
            <TouchableOpacity onPress={()=>{Notification();setTabIndex(2);}} style={[{position:'absolute',right:0,width:50,height:50,justifyContent:'center'}]}>
                <Image style={{width:28,height:28}} source={require('../../assets/img/top_alim.png')}/>
            </TouchableOpacity>
        </View>
    )
}