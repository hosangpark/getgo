import React, {useState} from 'react';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../types/routerTypes';


import {Image, Pressable, Text, View, TouchableOpacity,TextInput} from 'react-native';
import style from '../../assets/style/style';
import {colors} from '../../assets/color'
import { BackHeaderType, SearchHeaderType } from '../types/componentType';
import { useTranslation } from 'react-i18next';

type PropsType = {
    search_action : (text:string) => void;
    searchKeyword? : string;
    setSelectWord? : (text:string) => void;
    searchRef: any
}

export const SearchHeader = ({search_action,searchKeyword,setSelectWord,searchRef }:PropsType) => {
    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

    const [text, setText] = React.useState('');

    const {t} = useTranslation()
    const SearchOn = () => {
        // if(search_action){
            search_action(text)
            // setText('')
        // }
    }

    React.useEffect(()=>{
        search_action(text);
    },[text])

    React.useEffect(()=>{
        if(searchKeyword){
            setText(searchKeyword);
        }
    },[searchKeyword])
    
    return(
        <View style={[style.header_,{backgroundColor:'#ffffff',justifyContent:'flex-end',paddingHorizontal:20}]}>
            <TouchableOpacity 
            onPress={()=>{
                if(searchKeyword != ''){
                    search_action(''); 
                if(setSelectWord)setText('')}else{navigation.goBack();}}} 
            style={[{position:'absolute',left:20,width:50,height:50,justifyContent:'center'}]}>
                <Image style={{width:28,height:28}} source={require('../../assets/img/top_back_b.png')}></Image>
            </TouchableOpacity>
            <View style={[{backgroundColor:colors.GRAY_COLOR_1,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderWidth:1,borderColor:colors.GRAY_COLOR_3,paddingHorizontal:20,borderRadius:75,width:'85%',height:38}]}>
                <TextInput style={{width:'80%',height:38}} 
                blurOnSubmit={false}
                numberOfLines={1}
                maxLength={40}
                value={text} placeholder={t("지역명 근처에서 검색")}
                onChangeText={(text)=>{setText(text)}}
                onSubmitEditing={()=>{if(setSelectWord)setSelectWord(text)}}
                ref={searchRef}
                />
                <TouchableOpacity onPress={()=>{if(setSelectWord)setSelectWord(text)}} style={{width:30,height:30,alignItems:'flex-end',justifyContent:'center'}}>
                    <Image source={require('../../assets/img/top_search.png')} style={{width:24,height:24}}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}