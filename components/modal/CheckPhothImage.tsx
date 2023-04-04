import React from 'react';
import { Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Modal from "react-native-modal";
import { colors } from '../../assets/color';
import style from '../../assets/style/style';
import { useTranslation } from 'react-i18next';



export const CheckPhotoImage = ({ photoModalVisible, setPhotoModalVisible, action, action2 }: { photoModalVisible: boolean, setPhotoModalVisible: (e: boolean) => void, action: (e: string) => void, action2: (e: string) => void }) => {

  const { t } = useTranslation()

  return (
    <Modal
      isVisible={photoModalVisible}
      transparent={true}
      onBackdropPress={() => {
        setPhotoModalVisible(false)
      }}

      animationIn="fadeIn"
      animationOut="fadeOut"
      animationInTiming={1}
      animationOutTiming={1}

      onRequestClose={() => setPhotoModalVisible(false)}
      style={[{ flex: 1, margin: 0, justifyContent: 'center', alignItems: 'center' }]}
    >
      {/* <TouchableOpacity style={{
        flex: 1, justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#000', opacity: 0.2,
      }} onPress={() => setPhotoModalVisible(false)}>
      </TouchableOpacity> */}
      <View style={{
        backgroundColor: colors.WHITE_COLOR,
        padding: 20,
        margin: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 6,
        paddingHorizontal: 10,
      }}>
        <TouchableOpacity style={{ flex: 1, paddingHorizontal: 6, paddingVertical: 20, borderColor: colors.GRAY_COLOR_5, borderWidth: 1, borderRadius: 6, marginHorizontal: 10, alignItems: 'center' }} onPress={() => {
          action()
          // setPhotoModalVisible(false)
        }}>
          <Text style={[style.text_sb, { color: colors.BLACK_COLOR_2, fontSize: 16 }]} >{t('카메라')}</Text></TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, paddingHorizontal: 6, paddingVertical: 20, borderColor: colors.GRAY_COLOR_5, borderWidth: 1, borderRadius: 6, marginHorizontal: 10, alignItems: 'center' }} onPress={() => {
          action2()
          // setPhotoModalVisible(false)
        }}>
          <Text style={[style.text_sb, { color: colors.BLACK_COLOR_2, fontSize: 16 }]}>{t('갤러리')}</Text></TouchableOpacity>
      </View>
    </Modal>
  )
}