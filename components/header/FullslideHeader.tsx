import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { MainNavigatorParams } from '../types/routerTypes';

import {Image, Pressable, Text, View, TouchableOpacity} from 'react-native';
import style from '../../assets/style/style';


export const FullslideHeader = () => {
    
    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    return(
        <View style={[style.header_,{position:'absolute', zIndex:100,justifyContent:'space-between',width:'100%',paddingHorizontal:20,}]}>
            <TouchableOpacity onPress={()=>{navigation.goBack();}} style={[{position:'absolute',left:20,width:50,height:50,justifyContent:'center'}]}>
                <Image style={{width:28,height:28}} source={require('../../assets/img/top_back_b.png')}></Image>
            </TouchableOpacity>
        </View>
    )
}