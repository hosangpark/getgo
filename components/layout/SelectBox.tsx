import React from 'react';
import { useSSR } from 'react-i18next';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from '../../assets/color';
import { SelectBoxType, CategoryOptionType } from '../types/componentType';

export const SelectBox = ({ selOption, options, height, paddingVertical, action, overScrollEnable }: SelectBoxType) => {

    const [isOpen, setIsOpen] = React.useState(false);
    const [optionList, setOptionList] = React.useState([...options]);


    const open = () => {
        setIsOpen(!isOpen)
        overScrollEnable()
    }
    const selectOptionAccess = (item: CategoryOptionType) => {
        action(item);
        setIsOpen(false);
    }

    React.useEffect(() => {
        setOptionList(options)
    }, [options])

    return (
        <View style={[selectBoxStyle.container, { paddingVertical: paddingVertical, minHeight: height }]}>
            <TouchableOpacity onPress={open} style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <Text>{selOption.label}</Text>
                <Image style={selectBoxStyle.ic_select} source={require('../../assets/img/ico_select.png')} />
            </TouchableOpacity>
            <ScrollView style={{ maxHeight: 200 }}>
                {isOpen && optionList.length > 0 && optionList.map((item, index) => {
                    return (
                        <TouchableOpacity key={index} onPress={() => { selectOptionAccess(item) }} style={{ paddingTop: 10 }}>
                            <Text>{item.label}</Text>
                        </TouchableOpacity>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const selectBoxStyle = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        borderColor: colors.GRAY_LINE,
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 15,
        zIndex: 10,
        backgroundColor: '#fff',
    },
    options_box: {
        position: 'absolute',
        top: 45,
        left: 0,
        borderColor: colors.GRAY_LINE,
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 15,
        width: '100%',
        zIndex: 10,
        backgroundColor: '#fff',
    },
    ic_select: {
        width: 20,
        height: 15,
    },
})