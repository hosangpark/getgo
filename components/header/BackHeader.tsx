import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { MainNavigatorParams } from '../types/routerTypes';

import { Image, Pressable, Text, View, TouchableOpacity } from 'react-native';
import style from '../../assets/style/style';
import { BackHeaderType } from '../types/componentType';


export const BackHeader = ({ title, goHome = false, goLogin = false }: BackHeaderType) => {

    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    return (
        <View style={[style.header_, { backgroundColor: '#ffffff' }]}>
            <TouchableOpacity onPress={() => {
                if (goHome) {
                    navigation.reset({ routes: [{ name: 'Main' }] });
                } else if (goLogin) {
                    navigation.navigate('SelectLogin');
                } else {
                    navigation.goBack();
                }


            }} style={[{ position: 'absolute', left: 20, width: 50, height: 50, justifyContent: 'center' }]}>
                <Image style={{ width: 28, height: 28 }} source={require('../../assets/img/top_back_b.png')}></Image>
            </TouchableOpacity>
            <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }]}>
                <Text style={[style.text_b, { color: '#222222', fontSize: 18 }]}>{title}</Text>
            </View>
        </View>
    )
}