/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{ useState } from 'react';
import {
    Alert,
  SafeAreaView, Text, View, FlatList, Image, ScrollView
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { CategoryType } from '../../../components/types/componentType';
import { colors } from '../../../assets/color';
import style from '../../../assets/style/style';
import { CategoryHeader } from '../../../components/header/CategoryHeader'
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import LoadingIndicator from '../../../components/layout/Loading';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */



interface MainHeaderType{
  setTabIndex : (index:number)=>void
}

const Category = ({setTabIndex}:MainHeaderType) => {

  const {t} = useTranslation()

  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  const [isLoading, setIsLoading] = React.useState(false);
  const [category_data, setCategory_data] = useState<any>()

  const getData = async () => {
    await client<{data: string}>({
      method: 'get',
      url: '/product/category-list?ct_idx&ct_name&ct_en_name&ct_in_name&ct_file1',
      }).then(
        res=>{
          setCategory_data(res.data)
          setIsLoading(false)
        }
      ).catch(
        err=>console.log(err)
      )
    };


  React.useEffect(() => {
    setIsLoading(true)
    getData();
    }, []);


  const Category_Filter = (categorytype:CategoryType) => {
    navigation.navigate('Category_Filter',categorytype);
  }
    return (
        <SafeAreaView style={[style.default_background]}>
          <CategoryHeader title={t('카테고리')} setTabIndex={setTabIndex} />
          {isLoading ? 
            <LoadingIndicator/>
            :
           <FlatList data={category_data} 
           numColumns = {4}
           showsVerticalScrollIndicator={false}
           style={{marginHorizontal:13,marginVertical:20}}
           renderItem={({item}) => 
           <View style={{width:'25%',justifyContent:'center',alignItems:'center'}} key={item.ct_idx}>
                <TouchableOpacity onPress={()=>Category_Filter(item)}
                style={{justifyContent:'flex-start',alignItems:'center',height:120}}
                >
                  <Image style={{width:68, height:68,marginBottom:10}} source={{uri:'http://ec2-13-125-251-68.ap-northeast-2.compute.amazonaws.com:4000/uploads/'+item.ct_file1}}/>
                  
                  <Text style={[style.text_sb, {fontSize:14, color:colors.BLACK_COLOR_1,paddingHorizontal:5}]}>{t(item.ct_name)}</Text>
                </TouchableOpacity>
            </View>
            }
            />
          }
        </SafeAreaView>
    );
};

export default Category;


