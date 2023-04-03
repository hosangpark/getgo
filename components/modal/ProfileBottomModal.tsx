import { useIsFocused, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableWithoutFeedback, View, TouchableOpacity, BackHandler, Alert } from 'react-native';
import Modal from "react-native-modal";
import { colors } from '../../assets/color';
import style from '../../assets/style/style';
import { CustomButton } from '../layout/CustomButton';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../components/types/routerTypes';
import { useTranslation } from 'react-i18next';
import cusToast from '../navigation/CusToast';
import { useSelector } from 'react-redux';
import Api from '../../api/Api';
interface ModalType {
    isVisible: boolean;
    setVisible: (visible: boolean) => void;
    action: () => void;
    item: {
        mt_image1:string
        pt_area: string
        mt_seller_nickname: string
        pt_end_cnt: number
        selling_count: number
        mt_seller_idx: number
    }
}

export const ProfileBottomModal = ({ isVisible, setVisible, action, item }: ModalType) => {
    const { t, i18n } = useTranslation()
    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    const userInfo = useSelector((state: any) => state.userInfo);


    const Report = (target: number) => {
        if (target == userInfo.idx) {
            Alert.alert(t('자신을 신고 할 수는 없습니다.'))
            return false;
        }

        setVisible(false)
        navigation.navigate('ReportUser', { mt_declaration_idx: target })
    }

    // const isFocused = useIsFocused();

    // function handleBackButtonClick(){
    //     console.log('ddd');
    //     setVisible(false);
    //     return true;
    // }

    // React.useEffect(() => {
    //     if(isFocused){
    //         BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    //         return () => {
    //         BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    //         };
    //     }
    // }, [isFocused]);


    return (
        <Modal
            animationIn={"slideInUp"}
            animationOut={"slideOutDown"}
            animationInTiming={300}
            animationOutTiming={800}
            isVisible={isVisible}
            useNativeDriver={true}
            style={[{ justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column', width: '100%', margin: 0 }]}
            onRequestClose={() => {

                setVisible(false);

            }}
        >
            <View style={{ flex: 1, width: '100%', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <View style={[{ flex: 1 }]}>
                    <View style={[{ flexDirection: 'column', width: '100%', minHeight: 150, flex: 1 }]}>
                        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => {
                            setVisible(false);
                        }}>
                            <View style={{ flex: 1 }}>

                            </View>
                        </TouchableWithoutFeedback>
                        <View style={{ padding: 20, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={[style.text_b, { fontSize: 20, color: colors.BLACK_COLOR_2 }]}>
                                    {t('프로필')}
                                </Text>
                                <TouchableOpacity onPress={() => { setVisible(false) }}>
                                    <Image source={require('../../assets/img/ico_close3.png')} style={{ width: 32, height: 32 }} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ marginTop: 10, flexDirection: 'column', alignItems: 'center' }}>
                                <Image source={item.mt_image1? { uri: Api.state.imageUrl + item.mt_image1 } : require('../../assets/img/img_profile.png')} borderRadius={100} style={{ width: 85, height: 85 }} />
                                <Text style={[style.text_b, { marginTop: 10, fontSize: 20, color: colors.BLACK_COLOR_2 }]}>
                                    {item.mt_seller_nickname}</Text>
                                <Text style={[style.text_li, { marginTop: 5, fontSize: 13, color: colors.GRAY_COLOR_2 }]}>
                                    {item.pt_area} </Text>
                                <TouchableOpacity style={[{ marginTop: 10, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: colors.GRAY_LINE, borderRadius: 150 }]}
                                    onPress={() => Report(item.mt_seller_idx)}>
                                    <Text style={[style.text_me, { fontSize: 13, color: colors.GRAY_COLOR_2 }]}>
                                        {t('사용자 신고')} </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[style.gray_box, { marginTop: 10, flexDirection: 'row', borderRadius: 6, justifyContent: 'space-around', alignItems: 'center' }]}>
                                <View style={{ alignItems: 'center', flex: 1 }}>
                                    <Text style={[style.text_li, { fontSize: 15, color: colors.GRAY_COLOR_2, textAlign: 'center', }]}>
                                        {t('판매상품수')}</Text>
                                    <Text style={[style.text_b, { fontSize: 17, color: colors.BLACK_COLOR_2 }]}>
                                        {item.selling_count ? item.selling_count : 0}</Text>
                                </View>
                                <View style={[style.vertical_line, { height: 35 }]} />
                                <View style={{ alignItems: 'center', flex: 1 }}>
                                    <Text style={[style.text_li, { fontSize: 15, color: colors.GRAY_COLOR_2, textAlign: 'center' }]}>
                                        {t('거래완료 횟수')}</Text>
                                    <Text style={[style.text_b, { fontSize: 17, color: colors.BLACK_COLOR_2 }]}>
                                        {item.pt_end_cnt ? item.pt_end_cnt : 0}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}