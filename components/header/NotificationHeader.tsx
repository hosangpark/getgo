import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../types/routerTypes';

import {Image, Pressable, Text, View, TouchableOpacity,} from 'react-native';
import style from '../../assets/style/style';
import { NotificationHeaderType } from '../types/componentType';
import { colors } from '../../assets/color';


export const NotificationHeader = ({title}:NotificationHeaderType) => {
    
    const KeywordSetting = () => {
        navigation.navigate('KeywordSetting');
    }

    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    
    return(
       <View style={[style.header_,{backgroundColor:'#ffffff'}]}>            
            <View style={[{flex:1,justifyContent:'center',alignItems:'center'}]}>
                <Text style={[style.text_b,{color:'#222222',fontSize:18}]}>{title}</Text>
            </View>
            <TouchableOpacity onPress={KeywordSetting} style={[{position:'absolute',right:0,width:50,height:50,justifyContent:'center'}]}>
                <Image style={{width:28,height:28}} source={require('../../assets/img/top__set.png')}></Image>
            </TouchableOpacity>
        </View>
    )
}