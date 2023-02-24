/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState} from 'react';
import {
    Alert,
  SafeAreaView, ScrollView, Text, View, Image ,StyleSheet, Button, TouchableOpacity
} from 'react-native';
import style from '../../assets/style/style';
import { colors } from '../../assets/color';


import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../types/routerTypes';
import { ProductItemType } from '../types/componentType';
import { useTranslation } from 'react-i18next';
import { foramtDate, NumberComma } from '../utils/funcKt';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */


interface ToggleType {
  
}


const ProductSaledList = ({item , Remove , Modify}:
  {item:ProductItemType, Remove:(e:number)=>void, Modify:(e:number)=>void}) => {
  const {t} = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const Itempost = () => {
    navigation.navigate('Itempost',item.pt_idx);
  }
  
  const SendReview = () => {
    navigation.navigate('SendReview',item)
  }
  const Action1 = ()=>{
    console.log('판매중')
  }
  const Action2 = ()=>{
    console.log('예약중')
  }
  const Action3 = ()=>{
    console.log('거래완료')
  }

  const ToggleAction = (target:any) =>{
    if(target.type == "modify"){
      Modify(target.idx)
    } else if(target.type == "delete"){
      Remove(target.idx)
    } else {
      console.log('에러에러')
    }
    setToggleOpen(!toggleOpen)
  }

  const [toggleOpen,setToggleOpen] = useState(false)
  const Toggle = () => {
    setToggleOpen(!toggleOpen)
  }


    return (
    <View style={{borderBottomWidth:2 , borderBottomColor:'#D8D8D8' , paddingVertical:17,}}>
      <View style={{flexDirection:'row',}}>
        <View style={{marginRight:20, flex:3}}>
          <TouchableOpacity onPress={Itempost}>
            <Image style={{width: 103, height: 113 , borderRadius:10, }} 
            resizeMode="cover"
            source={{uri:'http://ec2-13-125-251-68.ap-northeast-2.compute.amazonaws.com:4000/uploads/'+item.pt_image1}}/>
          </TouchableOpacity>
        </View>
        <View style={{flex:7}}>
          <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
            <Text style={[style.text_b, {color:colors.GREEN_COLOR_2, backgroundColor:colors.GREEN_COLOR_1, fontSize:12, paddingHorizontal:6, paddingVertical:3, borderRadius:5
              }]}>
                {t(item.ct_name)}
            </Text>
            {toggleOpen? (
              <View style={{position:'absolute',width:110,backgroundColor:'white',zIndex:2,top:-5,
              left:100,elevation:10,borderRadius:5,justifyContent:'center'
              }}>
                {item.pt_sale_now !== "3" &&
                <TouchableOpacity style={{paddingHorizontal:20,flex:1,justifyContent:'center',height:51}}
                onPress={()=>ToggleAction({idx:item.pt_idx,type:'modify'})}>
                  <Text style={[style.text_me,{color:colors.BLACK_COLOR_1,fontSize:14}]}>
                  {t('게시글 수정')}
                  </Text>
                </TouchableOpacity>
                } 
                <TouchableOpacity style={{paddingHorizontal:20,flex:1,justifyContent:'center',height:51}}
                onPress={()=>ToggleAction({idx:item.ot_idx? item.ot_idx:item.pt_idx,type:'delete'})}>
                  <Text style={[style.text_me,{color:colors.BLACK_COLOR_1,fontSize:14}]}>
                  {t('삭제')}
                  </Text>
                </TouchableOpacity>
              </View>
             ):null}
            <View>
              <TouchableOpacity onPress={Toggle}>
              <Image style={{width: 30 , height: 30 ,}} source={require('../../assets/img/top_menu.png')}/>
              </TouchableOpacity>
            </View>
          </View>
          <View>
          <TouchableOpacity onPress={Itempost}>
            <Text style={[style.text_me, { color:colors.BLACK_COLOR_2, fontSize:15, paddingRight:30}]}
            numberOfLines={1}
            >
              {item.pt_title}
            </Text>
            <Text style={[style.text_li, { color:colors.GRAY_COLOR_2, fontSize:13}]}>
              {item.pt_area} / {foramtDate(item.pt_wdate)}
            </Text>
            
            <View style={{ flexDirection:'row' , marginTop:5}}>
              {item.pt_sale_now == "1" ? 
                  <Text style={[style.text_me,{backgroundColor:colors.BLUE_COLOR_1, 
                    borderRadius:5, fontSize:12, marginRight:8, color:colors.WHITE_COLOR, 
                    paddingVertical:3,paddingHorizontal:5}]}>
                    <Image style={{width: 13 , height: 13,}}
                      source={require('../../assets/img/ico_sale.png')} /> 
                      {t('판매중')}
                  </Text>
                : 
                item.pt_sale_now == "2" ?
                <Text style={[style.text_me,{backgroundColor:colors.GREEN_COLOR_2, 
                  borderRadius:5, fontSize:12, marginRight:8, color:colors.WHITE_COLOR, 
                  paddingVertical:3,paddingHorizontal:5}]}>
                  <Image style={{width: 13 , height: 13,}}
                    source={require('../../assets/img/ico_time.png')} /> 
                    {t('예약중')}
                </Text>
                : 
                <Text style={[style.text_me,{backgroundColor:colors.GRAY_COLOR_4, 
                  borderRadius:5, fontSize:12, marginRight:8, color:colors.WHITE_COLOR, 
                  paddingVertical:3,paddingHorizontal:5}]}>
                  <Image style={{width: 13 , height: 13,}}
                      source={require('../../assets/img/ico_time.png')} /> 
                      {t('거래완료')}
                  </Text>
                }
              <Text style={[style.text_b, {fontSize:15, color:colors.BLACK_COLOR_2}]}>
                ￦ {NumberComma(item.pt_selling_price)}
              </Text>
            </View>
          </TouchableOpacity>
          </View>
          <View style={{alignItems:'flex-end',}}>
            <View style={{flexDirection:'row',}}>
            <Image style={{width: 15 , height: 15, marginRight:4, marginLeft:8}} source={require('../../assets/img/ico_view.png')}/>
            <Text style={[style.text_li, { color:colors.GRAY_COLOR_2, fontSize:12}]}>
              {item.pt_hit}
            </Text>
            <Image style={{width: 15 , height: 15, marginRight:4, marginLeft:8}} source={require('../../assets/img/ico_comment.png')}/>
            <Text style={[style.text_li, { color:colors.GRAY_COLOR_2, fontSize:12}]}>
              {item.pt_chat}
            </Text>
            <Image style={{width: 15 , height: 15, marginRight:4, marginLeft:8}} source={require('../../assets/img/ico_book2.png')}/>
            <Text style={[style.text_li, { color:colors.GRAY_COLOR_2, fontSize:12}]}>
              {item.pt_wish}
            </Text>
            </View>
          </View>
        </View>
      </View>
        {item.pt_sale_now == "3" ? 
          <View style={{flexDirection:'row',height:44, justifyContent:'space-between',marginTop:15}}>
            <TouchableOpacity style={{flex:1,borderWidth:1,borderColor:colors.GRAY_COLOR_3,
              justifyContent:'center',alignItems:'center',borderRadius:5}}
              onPress={SendReview}
              >
              <Text style={[style.text_sb,{fontSize:15,color:colors.BLACK_COLOR_2}]}>
              {t('후기 보내기')}
              </Text>
            </TouchableOpacity>
          </View>
          : 
          <View style={{flexDirection:'row',height:44, justifyContent:'space-between',marginTop:15}}>
            {item.pt_sale_now == "1" ? 
            <TouchableOpacity onPress={Action1}
            style={{flex:1,borderWidth:1,borderColor:colors.GRAY_COLOR_3,
              justifyContent:'center',alignItems:'center',borderRadius:5,marginRight:10}}>
              <Text style={[style.text_sb,{fontSize:15,color:colors.BLACK_COLOR_2}]}>
              {t('판매중')}
              </Text>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={Action2}
            style={{flex:1,borderWidth:1,borderColor:colors.GRAY_COLOR_3,
              justifyContent:'center',alignItems:'center',borderRadius:5,marginRight:10}}>
              <Text style={[style.text_sb,{fontSize:15,color:colors.BLACK_COLOR_2}]}>
              {t('예약중')}
              </Text>
            </TouchableOpacity>
            }
            <TouchableOpacity  onPress={Action3}
             style={{flex:1,borderWidth:1,borderColor:colors.GRAY_COLOR_3,
              justifyContent:'center',alignItems:'center',borderRadius:5}}>
              <Text style={[style.text_sb,{fontSize:15,color:colors.BLACK_COLOR_2}]}>
              {t('거래완료')}
              </Text>
            </TouchableOpacity>
          </View>
        }
    </View>
    );
};

export default ProductSaledList;

