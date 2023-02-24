import React from 'react';
import { Image, Text, TouchableWithoutFeedback, View ,TouchableOpacity} from 'react-native';
import Modal from "react-native-modal";
import { colors } from '../../assets/color';
import style from '../../assets/style/style';
import { CustomButton } from '../layout/CustomButton';
import { useTranslation } from 'react-i18next';

interface ModalType{
    isVisible:boolean;
    setVisible:(visible:boolean)=>void;
    agreeList:{
        agree1:boolean;
        agree2:boolean;
        agree3:boolean;
        agree4:boolean;
        allCheck:boolean;
    }
    setAgreeList:(type:string,check:boolean)=>void;
    action:()=>void;
}

export const AgreeBottomModal = ({isVisible,setVisible,agreeList,setAgreeList,action}:ModalType) => {
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
            <View style={{flex:1,width:'100%',flexDirection:'column',justifyContent:'flex-end'}}>
                <View style={[{flex:1}]}>
                    <View style={[{flexDirection:'column',width:'100%',minHeight:150,flex:1}]}>
                        <TouchableWithoutFeedback style={{flex:1}} onPress={()=>{
                            setVisible(false);
                        }}>
                            <View style={{flex:1}}>

                            </View>
                        </TouchableWithoutFeedback>
                        <View style={{padding:20,backgroundColor:'#fff',borderTopLeftRadius:30, borderTopRightRadius:30}}>
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <Text style={[style.text_b,{fontSize:20,color:colors.BLACK_COLOR_2}]}>
                                {t('약관동의')}</Text>
                                <TouchableOpacity onPress={()=>{setVisible(false)}}>
                                    <Image source={require('../../assets/img/ico_close3.png')} style={{width:32,height:32}}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:20}}>
                                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>{setAgreeList('allCheck',!agreeList.allCheck)}}>
                                        <Image source={agreeList.allCheck ? require('../../assets/img/check_on.png') :require('../../assets/img/check_off.png')} style={{width:22,height:22}}/>
                                        <Text style={[style.text_b,{fontSize:15,marginLeft:10}]}>
                                        {t('모두 동의합니다.')}</Text>
                                </TouchableOpacity>

                                <View style={{borderTopWidth:1,borderColor:colors.GRAY_LINE,width:'100%',marginVertical:20}}/>
                                
                                <TouchableOpacity style={{flexDirection:'row',alignItems:'center',marginBottom:20}} onPress={()=>{setAgreeList('agree1',!agreeList.agree1)}}>
                                    <Image source={agreeList.agree1 ? require('../../assets/img/check_on.png') : require('../../assets/img/check_off.png')} style={{width:22,height:22}}/>
                                    <Text style={[style.text_me,{fontSize:15,marginLeft:10,color:colors.BLACK_COLOR_2}]}>
                                    {t('서비스 약관동의')} <Text style={{color:colors.GREEN_COLOR_3}}>({t('필수')})</Text></Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{flexDirection:'row',alignItems:'center',marginBottom:20}} onPress={()=>{setAgreeList('agree2',!agreeList.agree2)}}>
                                    <Image source={agreeList.agree2 ? require('../../assets/img/check_on.png') : require('../../assets/img/check_off.png')} style={{width:22,height:22}}/>
                                    <Text style={[style.text_me,{fontSize:15,marginLeft:10,color:colors.BLACK_COLOR_2}]}>
                                    {t('개인정보 처리방침')} <Text style={{color:colors.GREEN_COLOR_3}}>({t('필수')})</Text></Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>{setAgreeList('agree3',!agreeList.agree3)}}>
                                    <Image source={agreeList.agree3 ? require('../../assets/img/check_on.png') : require('../../assets/img/check_off.png')} style={{width:22,height:22}}/>
                                    <Text style={[style.text_me,{fontSize:15,marginLeft:10,color:colors.BLACK_COLOR_2}]}>{t('위치기반서비스')} <Text style={{color:colors.GREEN_COLOR_3}}>({t('필수')})</Text></Text>
                                </TouchableOpacity>

                                <View style={{borderTopWidth:1,borderColor:colors.GRAY_LINE,width:'100%',marginVertical:20}}/>

                                <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={()=>{setAgreeList('agree4',!agreeList.agree4)}}>
                                    <Image source={agreeList.agree4 ? require('../../assets/img/check_on.png') : require('../../assets/img/check_off.png')} style={{width:22,height:22}}/>
                                    <Text style={[style.text_me,{fontSize:15,marginLeft:10,color:colors.BLACK_COLOR_2}]}>
                                    {t('만 14세 이상만 가입이 가능합니다.')} <Text style={{color:colors.GREEN_COLOR_3}}>({t('필수')})</Text></Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:20}}>
                                <CustomButton 
                                    buttonType='green'
                                    action={action}
                                    title="시작하기"
                                    disable={!agreeList.allCheck}
                                />
                            </View>
                        </View>
                    </View>
                </View>    
            </View>
        </Modal>
    )
}