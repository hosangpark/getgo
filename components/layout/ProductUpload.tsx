/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState} from 'react';
import {
   Text, View, Image , TouchableOpacity, ImageBackground , StyleSheet
} from 'react-native';
import { UploadItemType } from '../../components/types/componentType';

const ProductUpload = (item:any) => {
    return (
    <View style={{borderRadius:10,marginRight:8,width:100,height:100}}>
        <ImageBackground style={{flex:1}} source={item.image} resizeMode="cover">
        {/* {deletepicture &&  */}
        <TouchableOpacity 
        style={{alignItems:'flex-end', right:10, top:10}}>
            <Image style={{width:20,height:20}} source={{uri:item.uri}}/>
        </TouchableOpacity>
        </ImageBackground>
    </View>
    )
    
};

export default ProductUpload;

