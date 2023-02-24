import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../types/routerTypes';
import {Image, Pressable, Text, View, TouchableOpacity} from 'react-native';
import style from '../../assets/style/style';
import { colors } from '../../assets/color';
import { QuestionHeaderType } from '../types/componentType';



export const QuestionHeader = ({title,subtitle,action}:QuestionHeaderType) => {
    
    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    return(
        <View style={[style.header_,{backgroundColor:'#ffffff'}]}>
            <TouchableOpacity onPress={()=>{navigation.goBack()}} style={[{position:'absolute',left:20,width:50,height:50,justifyContent:'center'}]}>
                <Image style={{width:28,height:28}} source={require('../../assets/img/top_back_b.png')}></Image>
            </TouchableOpacity>
            <View style={[{flex:1,justifyContent:'center',alignItems:'center'}]}>
                <Text style={[style.text_b,{color:'#222222',fontSize:16}]}>{title}</Text>
            </View>
            <TouchableOpacity onPress={action} 
            style={[{position:'absolute',right:20,justifyContent:'center'}]}>
                <Text style={[style.text_b,{color:colors.GREEN_COLOR_3,fontSize:16}]}>{subtitle}</Text>
            </TouchableOpacity>
        </View>
    )
}