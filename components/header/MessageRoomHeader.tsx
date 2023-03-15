import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MainNavigatorParams } from '../types/routerTypes';
import { Image, Pressable, Text, View, TouchableOpacity } from 'react-native';
import style from '../../assets/style/style';
import { MessageRoomType, OptionType } from '../types/componentType';
import { colors } from '../../assets/color';
import { ProductItemType } from '../types/componentType';
import AutoHeightImage from 'react-native-auto-height-image';
import { CustomButton } from '../layout/CustomButton';
import { NumberComma } from '../utils/funcKt';
import { useSelector } from 'react-redux';
import client from '../../api/client';
import cusToast from '../navigation/CusToast';
import { SelectBox } from '../../components/layout/SelectBox';


interface MessageRoomItemType {
    item: {
        room_idx: number
        username: string
        rt_idx: number
        tradeImg: string
        producttitle: string
        price: string
        salestate: number
        mt_seller_idx: number
        ctt_push: string
        mt_idx: number
        pt_idx: number
    },
    getRoomData: () => void
    tradeDoneSend: () => void
    targetOutSend: () => void

}

export const MessageRoomHeader = ({ item, getRoomData, tradeDoneSend, targetOutSend }:
    MessageRoomItemType) => {

    const { t, i18n } = useTranslation()
    const userInfo = useSelector((state: any) => state.userInfo)
    const [toggle, setToggle] = useState(false)
    const [topboxopen, setTopboxopen] = useState(true)
    // const [salestate,setSalestate] = useState(true)

    // console.log('item', item, userInfo.idx);



    const productDetailClose = () => {
        setTopboxopen(!topboxopen)
        setToggle(!toggle)
    }
    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

    const SendReview = (room_idx: number) => {
        navigation.navigate('SendReview', { item: { room_idx: room_idx } })
    }
    const ReviewDetail = (rt_idx: number) => {
        navigation.navigate('ReviewDetail', { rt_idx: rt_idx, isMy: true })
    }


    const ChatReport = () => {
        navigation.navigate('ReportChat', {
            room_idx: item.room_idx,
            mt_declaration_idx: item.mt_seller_idx
        });
    }
    const quitroom = async () => {
        Alert.alert(t('채팅방에서 나가시겠습니까?'), t('채팅방을 나가면 채팅 목록 및 대화 내용이 삭제되고 복구 할 수 없습니다.'),
            [
                {
                    text: t('나가기'), onPress: async () => {
                        await client({
                            method: 'get',
                            url: `/product/chat-list-delete?chr_idx=${item.room_idx}`
                        }).then(res => {
                            cusToast(t(res.data.message))
                            //상대방 채팅방 아웃
                            targetOutSend();
                            navigation.goBack()
                        }).catch(err => {
                            console.log(err)
                        })

                    }, style: 'cancel'
                },
                {
                    text: t('취소'),
                    onPress: () => {
                        console.log('d')
                    },
                    style: 'destructive',
                },
            ])
    }

    const [selectReserve, setSelReserve] = React.useState({
        label: t('상태변경'),
        value: '예약상태변경',
        sel_id: 0,
    });
    const [ReserveOptions] = React.useState([
        { label: t('판매중'), value: '판매중', sel_id: 1 },
        { label: t('예약중'), value: '예약중', sel_id: 2 },
        { label: t('거래완료'), value: '거래완료', sel_id: 3 },
    ]);

    const ReserveSelect = async (val: OptionType) => {

        // console.log('asdasdas', {
        //     pt_idx: item.pt_idx,
        //     pt_sale_now: val.sel_id,
        //     mt_idx: item.mt_idx,
        // });
        await client({
            method: 'post',
            url: '/product/product_status',
            data: {
                pt_idx: item.pt_idx,
                pt_sale_now: val.sel_id,
                mt_idx: item.mt_idx,
            },
        })
            .then(res => {
                cusToast(t(res.data.message));
                getRoomData(item.room_idx);

                // console.log('eeeee', item.room_idx, val.sel_id == 3)
                if (val.sel_id == 3) tradeDoneSend();
            })
            .catch(err => console.log(err));
    };

    React.useEffect(() => {
        if (item.salestate) {
            let no = item.salestate - 1;
            setSelReserve({
                label: ReserveOptions[no].label,
                value: ReserveOptions[no].value,
                sel_id: ReserveOptions[no].sel_id
            })
        }
    }, [item.salestate])

    // React.useEffect(() => {
    //     console.log('dadadasdqw', item.pt_sale_now)
    //     setSelReserve(ReserveOptions[item.pt_sale_now - 1])
    // }, [])

    return (
        <View>
            <View style={[style.header_, { backgroundColor: '#ffffff', paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: colors.GRAY_COLOR_3 }]}>
                <TouchableOpacity onPress={() => { navigation.goBack(); }} style={[{ marginRight: 6 }]}>
                    <AutoHeightImage width={28} source={require('../../assets/img/top_back_b.png')} />
                </TouchableOpacity>
                <View style={[{ flex: 1, justifyContent: 'flex-start' }]}>
                    <Text style={[style.text_b, { color: '#222222', fontSize: 16 }]}>{item.username}</Text>
                </View>
                <TouchableOpacity onPress={() => { setToggle(!toggle) }} style={[{}]}>
                    <AutoHeightImage width={28} source={require('../../assets/img/top_menu.png')} />
                </TouchableOpacity>
            </View>
            {toggle ?
                <View style={{
                    position: 'absolute', zIndex: 70, right: 50, top: 20, backgroundColor: 'white', borderWidth: 1, borderColor: colors.GRAY_COLOR_2, borderRadius: 10, paddingHorizontal: 15, paddingVertical: 10,
                }}>
                    <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => ChatReport()}>
                        <Text style={[style.text_me, { fontSize: 14, color: colors.BLACK_COLOR_1 }]}>
                            {t('신고하기')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingVertical: 10 }} onPress={() => quitroom()}>
                        <Text style={[style.text_me, { fontSize: 14, color: colors.BLACK_COLOR_1 }]}>
                            {t('채팅방 나가기')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingVertical: 10 }}
                        onPress={productDetailClose}>
                        <Text style={[style.text_me, { fontSize: 14, color: colors.BLACK_COLOR_1 }]}>
                            {topboxopen ?
                                t('상품상세 숨기기')
                                :
                                t('상품상세 보이기')
                            }
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ paddingVertical: 10 }}
                        onPress={() => { setToggle(!toggle) }}>
                        <Text style={[style.text_me, { fontSize: 14, color: colors.BLACK_COLOR_1 }]}>
                            {t('취소')}
                        </Text>
                    </TouchableOpacity>
                </View> : null
            }
            {topboxopen ?
                <View style={{ padding: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 70, height: 70, borderRadius: 6 }} source={{ uri: 'http://ec2-13-125-251-68.ap-northeast-2.compute.amazonaws.com:4000/uploads/' + item.tradeImg }} />
                        <View style={{ marginLeft: 15 }}>
                            {item.mt_seller_idx === userInfo.idx && item.salestate != 3 ?
                                <View style={{ width: 100, height: 15, marginBottom: 18 }}>
                                    <SelectBox
                                        selOption={selectReserve}
                                        options={ReserveOptions}
                                        action={ReserveSelect}
                                        height={0}
                                        paddingVertical={5}
                                        overScrollEnable={() => { }}
                                    />
                                </View>
                                :
                                <View style={{ flexDirection: 'row' }}>
                                    {item.salestate == 3 && (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: colors.GRAY_COLOR_5,
                                                borderRadius: 3,
                                                paddingHorizontal: 5,
                                                paddingVertical: 3,
                                            }}>
                                            <Image
                                                style={{ width: 10, height: 10 }}
                                                source={require('../../assets/img/ico_time.png')}
                                            />
                                            <Text
                                                style={[
                                                    style.text_me,
                                                    { marginLeft: 3, fontSize: 13, color: colors.WHITE_COLOR },
                                                ]}>
                                                {t('거래완료')}
                                            </Text>
                                        </View>
                                    )}
                                    {item.salestate == 1 && (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: colors.BLUE_COLOR_1,
                                                borderRadius: 3,
                                                paddingHorizontal: 5,
                                                paddingVertical: 3,
                                            }}>
                                            <Image
                                                style={{ width: 10, height: 10 }}
                                                source={require('../../assets/img/ico_time.png')}
                                            />
                                            <Text style={[style.text_me, { fontSize: 13, color: colors.WHITE_COLOR, marginLeft: 3 }]}>
                                                {t('판매중')}
                                            </Text>
                                        </View>
                                    )}
                                    {item.salestate == 2 && (
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: colors.GREEN_COLOR_3,
                                                borderRadius: 3,
                                                paddingHorizontal: 5,
                                                paddingVertical: 3,
                                            }}>
                                            <Image
                                                style={{ width: 10, height: 10 }}
                                                source={require('../../assets/img/ico_time.png')}
                                            />
                                            <Text style={[style.text_me, { fontSize: 13, color: colors.WHITE_COLOR, marginLeft: 3 }]}>
                                                {t('예약중')}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            }
                            <Text style={[style.text_me, { fontSize: 15, color: colors.BLACK_COLOR_2, paddingRight: 85 }]}
                                numberOfLines={2}
                            >{item.producttitle}</Text>
                            <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_2 }]}>
                                ￦ {item.price} {t('원')}</Text>
                        </View>
                    </View>
                    <View>
                        {item.salestate == 3 ?
                            <>
                                {item.rt_idx ?
                                    <TouchableOpacity
                                        onPress={() => ReviewDetail(item.rt_idx)}
                                        style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 40, backgroundColor: colors.WHITE_COLOR, borderRadius: 5, marginTop: 10, borderWidth: 1, borderColor: colors.GRAY_COLOR_3 }]}>
                                        <Image style={{ width: 20, height: 20, marginRight: 5 }} source={require('../../assets/img/ico_note.png')} />
                                        <Text style={[style.text_sb, { color: colors.BLACK_COLOR_1, fontSize: 15 }]}>
                                            {t('후기 보기')}
                                        </Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={() => SendReview(item.room_idx)}
                                        style={[{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 40, backgroundColor: colors.WHITE_COLOR, borderRadius: 5, marginTop: 10, borderWidth: 1, borderColor: colors.GRAY_COLOR_3 }]}>
                                        <Image style={{ width: 20, height: 20, marginRight: 5 }} source={require('../../assets/img/ico_note.png')} />
                                        <Text style={[style.text_sb, { color: colors.BLACK_COLOR_1, fontSize: 15 }]}>
                                            {t('후기 보내기')}
                                        </Text>
                                    </TouchableOpacity>
                                }
                            </>
                            : null}
                    </View>
                </View> : null}
        </View>

    )
}


