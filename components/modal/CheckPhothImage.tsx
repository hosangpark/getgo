import React from 'react';
import { Text, View ,TouchableOpacity,Dimensions} from 'react-native';
import Modal from "react-native-modal";
import { colors } from '../../assets/color';
import style from '../../assets/style/style';
import { useTranslation } from 'react-i18next';



export const CheckPhotoImage = ({photoModalVisible,setPhotoModalVisible,action,action2}:{photoModalVisible:boolean,setPhotoModalVisible:(e:boolean)=>void,action:(e:string)=>void,action2:(e:string)=>void}) => {
  
  const { t } = useTranslation()

  return(
    <Modal 
    isVisible={photoModalVisible}
    transparent={true} 
    onRequestClose={() => setPhotoModalVisible(false)}
    style={[{flex:1,margin:0}]}
    >
          <TouchableOpacity style={{
            flex: 1, justifyContent: 'center', alignItems: 'center',
            backgroundColor: '#000', opacity: 0.1,
          }} onPress={() => setPhotoModalVisible(false)}>
          </TouchableOpacity>
          <View style={{
            backgroundColor: colors.WHITE_COLOR,
            width: Dimensions.get('screen').width - 100,
            position: 'absolute',
            zIndex: 10,
            elevation: 1,
            justifyContent: 'space-around',
            alignItems: 'center',
            flexDirection: 'row',
            borderRadius: 6,
            left: 50,
            height: 100,
            paddingHorizontal: 10,
            top: Dimensions.get('screen').height / 2 - 100
          }}>
            <TouchableOpacity style={{ flex:1,padding: 20, borderColor: colors.GRAY_COLOR_5, borderWidth: 1, borderRadius: 6,marginHorizontal:10,alignItems:'center' }}>
              <Text style={[style.text_sb, { color: colors.BLACK_COLOR_2, fontSize: 18 }]} onPress={() => {
                action('camera')
                setPhotoModalVisible(false)
              }}>
                {t('카메라')}</Text></TouchableOpacity>

            <TouchableOpacity style={{ flex:1,padding: 20, borderColor: colors.GRAY_COLOR_5, borderWidth: 1, borderRadius: 6 ,marginHorizontal:10,alignItems:'center' }}>
              <Text style={[style.text_sb, { color: colors.BLACK_COLOR_2, fontSize: 18 }]} onPress={() => {
                action2('gallery')
                setPhotoModalVisible(false)
              }}>
                {t('갤러리')}</Text></TouchableOpacity>
          </View>
    </Modal>
)}