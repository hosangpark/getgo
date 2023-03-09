import React from 'react';
import { NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputChangeEventData, TextInputProps, TouchableOpacity, View } from 'react-native';
import { colors } from '../../assets/color';
import { CustomButtonType} from '../types/componentType';

export const CustomButton = ({buttonType,title,action,disable}:CustomButtonType) => {

    return(
        <View>
            <TouchableOpacity 
                onPress={action}
                style={disable ? btnStyle.gray_btn : buttonType == 'green'? btnStyle.green_btn : btnStyle.white_btn}
                disabled={disable}
            >
                <Text style={[disable ? btnStyle.gray_font : buttonType == 'green' ? btnStyle.green_font : btnStyle.white_font,{textAlign:'center'}]}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

const btnStyle= StyleSheet.create({
    green_btn : {
        backgroundColor:colors.GREEN_COLOR_2,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        height:45,
    },
    green_font : {
        fontSize:15,
        color:colors.WHITE_COLOR,
    },
    white_btn : {
        backgroundColor:colors.WHITE_COLOR,
        borderWidth:1,
        borderColor:colors.GRAY_LINE,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        height:45
    },
    white_font : {
        fontSize:15,
        color:colors.BLACK_COLOR_2,
    },
    gray_btn : {
        backgroundColor:colors.GRAY_COLOR_3,
        borderRadius:5,
        alignItems:'center',
        justifyContent:'center',
        height:45,
    },
    gray_font : {
        fontSize:15,
        color:colors.GRAY_COLOR_4,
    },
})