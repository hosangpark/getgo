/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,{useState,useEffect} from 'react';
import {
    Alert,
  SafeAreaView, ScrollView, Text, View,StyleSheet, FlatList, Image,Button,ActivityIndicator
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHeader } from '../../../components/header/BackHeader'
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import AutoHeightImage from 'react-native-auto-height-image';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import client from '../../../api/client';
import { PaginationType,QuestionDataType } from '../../../components/types/componentType';
import LoadingIndicator from '../../../components/layout/Loading';


/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */


const Pagination = ({ postsPerPage, totalPosts, paginate, }:PaginationType) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  } 
  const [PageboxNumber, setPageboxNumber] = useState(0)

  const pagebox = (number:number)=>{
    if(number<4){
      setPageboxNumber(0)
    } else if (number>3) {
      return setPageboxNumber(number-3)
    } else {
      return setPageboxNumber(number)
    }
  }

  const pageView = pageNumbers.slice(PageboxNumber,PageboxNumber+6)
  return (
        <View style={{flexDirection:'row',paddingVertical:30,paddingHorizontal:80,justifyContent:'center'}}>
          {pageView.map((number) => (
            <View key={number}>
              <TouchableOpacity style={{width:40,height:40,justifyContent:'center',alignItems:'center'}}
              onPress={() =>{ paginate(number), pagebox(number)}}>
                <Text style={{fontSize:18,fontWeight:'bold'}}>{number}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
  );
};


const Question = () => {
  const {t} = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();

  // const QuestionDetail = (e:AnnounceDataType) => {
  //   navigation.navigate('QuestionDetail', e);
  // }
  const [posts, setPosts] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10)

  const getData = async () => {
    await client({
      method: 'get',
      url: '/customer/faq-list',
      }).then(
        res=>{
          setPosts(res.data)
          setIsLoading(false);
      }).catch(
        err=>console.log(err)
      )
    };
    
    useEffect(() => {
      setIsLoading(true)
      getData()
    }, []);



    const indexOfLast = currentPage * postsPerPage;
    const indexOfFirst = indexOfLast - postsPerPage;

    const currentPosts = (posts:any) => {
      let currentPosts = 0;
      currentPosts = posts.slice(indexOfFirst, indexOfLast);
      return currentPosts;
    };

    const Posts = ({ QuestionData, loading }:{QuestionData:any, loading:boolean}) => {
      return (
        <View style={{flex:1}}>
          <View>
            {QuestionData.map((item:QuestionDataType,index:number) => (
              <TouchableOpacity style={{justifyContent:'center',
                paddingVertical:20,borderBottomWidth:1,borderBottomColor:colors.GRAY_COLOR_3,paddingHorizontal:20,}}
                onPress={() => navigation.navigate('QuestionDetail', { 
                  id: item.ft_idx,
                })}
                key={index}
                >
                  <View style={{flexDirection:'row'}} key={item.ft_idx}>
                    <Image style={{width:26,height:26,marginRight:20}} source={require('../../../assets/img/ico_q.png')}/>
                    <Text style={[style.text_sb,{fontSize:15,color:colors.BLACK_COLOR_1,paddingRight:70}]}>
                      {item.ft_title}
                    </Text>
                  </View>
                  <Image 
                  style={{width:7,height:12,position:'absolute',right:25}}
                  source={require('../../../assets/img/arrow4_r.png')}/>
                </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    };
  

    return (
        <SafeAreaView style={{flex:1,backgroundColor:'#fff'}}>
          <BackHeader title={t('자주 묻는 질문')}/>
          {isloading?  
          <LoadingIndicator/>
          :
          <ScrollView>
            <Posts QuestionData={currentPosts(posts)} loading={isloading} />
            <Pagination
              postsPerPage={postsPerPage}
              totalPosts={posts.length}
              paginate={setCurrentPage}
            ></Pagination>
          </ScrollView>
          }
            <BackHandlerCom />
        </SafeAreaView>
    );
};

export default Question;
