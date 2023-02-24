/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState} from 'react';
import {
    Alert,
  SafeAreaView, ScrollView, Text, View, Image, TouchableOpacity, StyleSheet, FlatList ,Button, Dimensions,
} from 'react-native';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp,StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { FullslideHeader } from '../../../components/header/FullslideHeader';
import SwiperSlide from '../../../components/layout/SwiperSlide';
import { BackHandlerCom } from '../../../components/BackHandlerCom';




type Props = StackScreenProps<MainNavigatorParams, 'ItempostFullSlide'>


const ItempostFullSlide = ({route}:Props) => {
    return (
    <SafeAreaView style={[style.default_background , {flex:1}]}>
        <FullslideHeader/>
        <SwiperSlide imageheight={1000} gofullscreen={()=>{}} SlideImage={route.params}/>
        <BackHandlerCom />
    </SafeAreaView>
    );
};


export default ItempostFullSlide;
