
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React,{ useEffect } from "react";
import { BackHandler } from "react-native";
import { BackHandlerType } from "./types/componentType";
import { MainNavigatorParams } from "./types/routerTypes";



export function BackHandlerCom ({goHome,noRetrun}:BackHandlerType){

    const isFocused = useIsFocused();

    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();


    function handleBackButtonClick() {
        if(!goHome && !noRetrun){
            navigation.goBack();
            return true;
        }
        else if(noRetrun){
            return true;
        }
        else if(goHome && noRetrun){
            navigation.navigate('Main');
            return true;
        }
    }
      
    useEffect(() => {
        if(isFocused){
            BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
            return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
            };
        }
    }, [isFocused]);

    return (
        <>
        </>
    )
}