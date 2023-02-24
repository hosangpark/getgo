import React from 'react'
import { Text, View, Image, Dimensions, StyleSheet, Pressable,useWindowDimensions } from 'react-native'
import Swiper from 'react-native-swiper'
import { colors } from '../../assets/color';
import AutoHeightImage from 'react-native-auto-height-image'
import { SlickSlideType } from '../../components/types/componentType';
import { Route } from 'react-native-tab-view';


const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
})

const swiperslide = ({imageheight,gofullscreen,SlideImage,}:SlickSlideType) => {
  const { width } = useWindowDimensions();
  const navigate = ()=>{
    gofullscreen()
  }
    return (
      
        <Swiper
            style={{height:imageheight}}
            renderPagination={
                (index:number,total:number)=>{
                return(
                <View style={{position:'absolute',right:20,bottom:15,backgroundColor:'rgba(0,0,0,0.7)',opacity:0.75,paddingHorizontal:10,paddingVertical:4,borderRadius:30}}>
                    <Text style={{color:colors.WHITE_COLOR}}>
                    <Text style={{color:colors.WHITE_COLOR}}>{index + 1} </Text>/ {total}
                    </Text>
                </View>
                )
            }}
            loop
            >
            {SlideImage.map((e:any,index:any)=>{
              return(
              <View style={styles.slide} key={index}>
                <Pressable onPress={navigate} delayLongPress={1000}>
                  <AutoHeightImage
                  width={width}
                  resizeMode={'cover'}
                  source={{uri:'http://ec2-13-125-251-68.ap-northeast-2.compute.amazonaws.com:4000/uploads/'+e}}
                  />
                </Pressable>
              </View>
              )
            })
            }

        </Swiper>
   
    )
  }

export default swiperslide