import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableWithoutFeedback, View ,TouchableOpacity, BackHandler} from 'react-native';
import Modal from "react-native-modal";
import { colors } from '../../assets/color';
import style from '../../assets/style/style';
import { CustomButton } from '../layout/CustomButton';
import { useTranslation } from 'react-i18next';


interface ModalType{
    isVisible:boolean;
    setVisible:(visible:boolean)=>void;
    action:()=>void;
    action2:()=>void;
}

export const QuitChatRoomModal = ({isVisible,setVisible,action,action2}:ModalType) => {
  const {t} = useTranslation()
    return(
        <Modal 
            animationIn  ={"slideInUp"}
            animationOut ={"slideOutDown"}
            animationInTiming  = {300}
            animationOutTiming = {800}
            isVisible={isVisible}
            useNativeDriver={true}
            style={[{justifyContent:'center',alignItems:'center',flex:1,flexDirection : 'column',width:'100%',margin:0}]}
            // onRequestClose={() => {
            //     if(isVisible){
            //         setVisible(false);
            //     }                                                                                          
            // }}
        >
          <View style={{flex:1,width:'100%',flexDirection:'column',justifyContent:'flex-end',}}>
            <View style={{backgroundColor:'#fff',borderTopLeftRadius:30, borderTopRightRadius:30,paddingHorizontal:20}}>
              <View style={{justifyContent:'center',alignItems:'center',marginBottom:25,
                  padding:20,}}>
                <Image style={{width:50,height:50,marginTop:45}} source={require('../../assets/img/img_door.png')} resizeMode='cover' />
                <Text style={[style.text_b,{fontSize:22,color:colors.BLACK_COLOR_1,marginVertical:17}]}>
                {t('채팅방에서 나가시겠습니까?')}</Text>
                <Text style={[
                  style.text_re,{fontSize:15,color:colors.BLACK_COLOR_1,paddingHorizontal:15,textAlign:'center',lineHeight:22}]}>
                  {t('채팅방을 나가면 채팅 목록 및 대화 내용이 삭제되고 복구 할 수 없습니다.')}</Text>
              </View>
              <View style={{marginBottom:15}}>
                <TouchableOpacity style={{
                  backgroundColor:colors.GREEN_COLOR_2,height:54,borderRadius:5,justifyContent:'center',alignItems:'center'}}
                onPress={action}
                >
                  <Text style={[style.text_b,{fontSize:18,color:colors.WHITE_COLOR}]}>
                  {t('네, 나갈래요')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  backgroundColor:colors.WHITE_COLOR,height:54,borderWidth:2,borderColor:colors.GRAY_COLOR_3,borderRadius:5,justifyContent:'center',alignItems:'center',marginTop:10}}
                onPress={action2}
                >
                  <Text style={[style.text_b,{fontSize:18,color:colors.BLACK_COLOR_1}]}>
                  {t('취소')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
    )
}

