import React from 'react';
import { Text, View } from "react-native";
import Toast from 'react-native-toast-message';

export const toastConfig = {
    // 'push_type': (internalState) => (
    //   <View style={{ width: '100%',bottom:0, borderRadius: 0, paddingHorizontal: 16,opacity:0.9,paddingHorizontal:10,zIndex:999}}>
    //       <Pressable 
    //       style={{justifyContent:'center',alignItems:'center',flex:1,flexDirection:'row',height: 60, width: '100%', backgroundColor: "#F8F8F8",borderRadius:8,justifyContent:'center',paddingHorizontal:10,paddingVertical:10}} 
    //       activeOpacity={1} onPress={()=>{
    //         PushClickEvent(internalState.text1);
    //       }}>
    //         <Image style={{width:40,height:40,borderRadius:5}} source={require('../../assets/img/ic_logo.png')}>
    //         </Image>
    //         <View style={{flexDirection:'column',flex:1,marginLeft:10}}>
    //            <View style={{flex:1}}>
    //                <Text style={[cstyles.font_M,{color:colors.TITLE_COLOR,flex:1,fontSize:15}]}>{internalState.text1.title}</Text>
    //            </View>
    //            <View style={{flex:1}}>
    //                 <Text style={[cstyles.font_L,{color:colors.TITLE_COLOR,flex:1,fontSize:15}]} numberOfLines={1}>{internalState.text1.message}</Text>
    //             </View>
    //         </View>

            
    //       </Pressable>
    //   </View>
    // ),
    'custom_type': (internalState:any) => (
      <View style={{ width: '100%',bottom:0,backgroundColor: '#000', borderRadius: 0, paddingHorizontal: 16, paddingVertical: 17,opacity:0.9,zIndex:999}}>
        <Text style={{textAlign: 'center', color: '#fff', fontSize:13.5,opacity:1}}>{internalState.text1.message}</Text>
      </View>
    )
}