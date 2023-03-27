import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { Image, Text, TouchableWithoutFeedback, View ,TouchableOpacity, BackHandler,} from 'react-native';
import Modal from "react-native-modal";
import { colors } from '../../assets/color';
import style from '../../assets/style/style';
import { CustomButton } from '../layout/CustomButton';
import { useTranslation } from 'react-i18next';


interface ModalType{
    isVisible:boolean;
    action:()=>void;
    action2:()=>void;
    selectLag:(e:string)=>void
}





export const LangugaeChange = ({isVisible,selectLag,action,action2}:ModalType) => {

  const {t} = useTranslation()
  const [langList, setLangList] = React.useState([
    {label : '한국어', img : require('../../assets/img/lang_kr.png') , value : 'Ko',},
    {label : 'English' , img : require('../../assets/img/lang_in.png') , value : 'En', },
    {label : 'Bahasa Indonesia' , img : require('../../assets/img/lang_us.png') , value : 'Id',},
  ])
  const [selectItem,setselectItem] = React.useState({})
  const ChangeSet = (target:string) => {
    selectLag(target)
    setselectItem(target)
  }
  return(

    <Modal 
      animationIn ={"slideInUp"}
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
    <TouchableWithoutFeedback style={{flex:1, backgroundColor:'aqua'}} onPress={action2}>
      <View style={{flex:1,width:'100%',flexDirection:'column',justifyContent:'flex-end',}}>
        <View style={{backgroundColor:'#fff',borderTopLeftRadius:30, borderTopRightRadius:30,}}>
          <View style={{justifyContent:'center',alignItems:'flex-start',marginBottom:25,
              paddingVertical:20,}}>
              {langList.map((item,index)=>{
                return(
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center',paddingHorizontal:40,paddingVertical:10,width:'100%',
                backgroundColor:selectItem==item.value? colors.GREEN_COLOR_4 : colors.WHITE_COLOR,
                }}
                onPress={()=>ChangeSet(item.value)} key={index}
                >
                  <Image style={{width:40,height:40,marginRight:30}} source={item.img}/>
                  <Text style={{}}>{t(item.label)}</Text>
                </TouchableOpacity>
                )})}
          </View>
          <View style={{marginBottom:15,paddingHorizontal:20}}>
            <TouchableOpacity style={{
              backgroundColor:colors.GREEN_COLOR_2,height:54,borderRadius:5,justifyContent:'center',alignItems:'center'}}
            onPress={action}
            >
              <Text style={[style.text_b,{fontSize:18,color:colors.WHITE_COLOR}]}>
              {t('언어변경')}
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
    </TouchableWithoutFeedback>
    </Modal>
  )
}

