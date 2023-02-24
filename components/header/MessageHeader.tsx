import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { MainNavigatorParams } from '../types/routerTypes';

import {Image, Pressable, Text, View, TouchableOpacity} from 'react-native';
import style from '../../assets/style/style';



export const MessageHeader = ({title}:{title:string}) => {
    
    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    return(
        <View style={[style.header_,{backgroundColor:'#ffffff'}]}>
            <View style={[{flex:1,justifyContent:'center',alignItems:'center'}]}>
                <Text style={[style.text_b,{color:'#222222',fontSize:18}]}>{title}</Text>
            </View>
        </View>
    )
}
