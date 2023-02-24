import {ActivityIndicator, View,Text } from 'react-native';
import { colors } from '../../assets/color';
import { CustomTabType } from '../types/componentType';
import style from '../../assets/style/style';


const LoadingIndicator = ()=>{
  return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator color={'#00C379'} size={'large'}/> 
      <Text> loading... </Text>
    </View>
    )
}

export default LoadingIndicator