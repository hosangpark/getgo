import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { MainNavigatorParams } from '../types/routerTypes';

import { Image, Pressable, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import style from '../../assets/style/style';
import { colors } from '../../assets/color';
import LinearGradient from 'react-native-linear-gradient';
import cusToast from '../navigation/CusToast';
import { useTranslation } from 'react-i18next';


export const ItemPostHeader = ({ myProduct, pt_idx, pt_sale_now }: any) => {

    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    const { t } = useTranslation();

    const Itemupload = () => {
        if (pt_sale_now == '3') {
            cusToast(t('이미 거래가 완료된 상품입니다.'));
            return;
        }

        navigation.navigate('Itemupload', { type: 'ProductModify', pt_idx: pt_idx });
    }

    return (
        <LinearGradient colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.1)', 'rgba(255, 255, 255, 0)']}
            start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
            style={[style.header_, { position: 'absolute', zIndex: 10, justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, opacity: 0.9 }]}>
            <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                <Image style={{ width: 28, height: 28 }} source={require('../../assets/img/top_back_w.png')}></Image>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {myProduct &&
                    <TouchableOpacity onPress={Itemupload}>
                        <Text style={[style.text_sb, { fontSize: 15, color: colors.WHITE_COLOR, marginRight: 20 }]}>{t("수정")}</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => { navigation.goBack(); }}>
                    <Image style={{ width: 30, height: 30 }} source={require('../../assets/img/top_home_w.png')} />
                </TouchableOpacity>
            </View>
        </LinearGradient>

    )
}