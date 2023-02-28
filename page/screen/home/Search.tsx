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
  SafeAreaView, ScrollView, Text, View, Image, TouchableOpacity, StyleSheet, FlatList ,Button, ActivityIndicator, BackHandler
} from 'react-native';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';

import { useIsFocused, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { SearchHeader } from '../../../components/header/SearchHeader';
import ProductItem from '../../../components/layout/ProductItem';
import {SearchNone} from '../../../components/animations';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import client from '../../../api/client';
import { useSelector } from 'react-redux';
import Timer from '../../../components/utils/Timer';
import LoadingIndicator from '../../../components/layout/Loading';
import { useTranslation } from 'react-i18next';
// import Reserve_choice from "../../../
// import { color } from 'native-base/lib/typescript/theme/styled-system';


// import ItemList from './Itemlist'

interface SearchItem {
  slt_idx:number,
  slt_txt:string
}

const Search = () => {

    const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
    // value,setValue,searchPlace
    const userInfo = useSelector((state:any) => state.userInfo);
    const isFocuesd = useIsFocused();
    const [searchKeyword, setSearchKeyword] = React.useState(''); //입력한 검색키워드
    const [isListLoading ,  setIsListLoading] = React.useState<boolean>(false);
    const [searchText,setsearchText] = React.useState<SearchItem[]>([])//임시 검색목록 리스트
    
    const [isSearch, setIsSearch] = React.useState(false); //최종검색했는지 판단
    const [selectWord, setSelectWord] = React.useState(''); //최종검색단어

    const [timer, setTimer] = React.useState<boolean>(true); //타이머 시작/끝 감지
    const {t} = useTranslation()
    const [tempSearchList,setTempSearchList] = React.useState([
      {search_slt_txt:""}
    ]);

    const [itemList, setItemList] = React.useState([]); // 상품목록
    const [isLoading, setIsLoading] = React.useState(false);
    const searchRef = React.useRef(null); /**검색 인풋 창 ref */

    const Research = (item:string)=>{
      setIsSearch(true)
      setSearchKeyword(item)
      setSelectWord(item)
    }

    /** 최근검색어 삭제 요청 */
    const DeleteSearchedData = async(item:SearchItem)=>{
      await client({
        method: 'get',
        url: `/product/slt_txt_delete`,
        params:{
          slt_idx : item.slt_idx,
        }
        }).then(res=>{
          const remove = searchText.filter(e => e.slt_idx !== item.slt_idx)
          setsearchText(remove);
        }).catch(error=>{
        console.log('DeleteSearchedData')
        })
    }

    /** 검색어 입력 */
    const searchput = async () => {
      await client({
          method: 'get',
          url: `/product/slt_txt_search`,
          params:{
            slt_txt : selectWord,
          }
          }).then(res=>{
            setTempSearchList(res.data)
          }).catch(error=>{
          console.log('searchput')
          })
      }

    /** 최근검색어 요청 */
    const getSearchedData = async () => {
      await client({
          method: 'get',
          url: `/product/latest_search`,
          params:{
            mt_idx : userInfo.idx,
          }
          }).then(res=>{
            setsearchText(res.data)
          }).catch(error=>{
          console.log('getSearchedData')
          })
      }

    /** 검색시 키워드 알림받기설정 */
    const KeywordNotice = async()=>{
      await client<{data:string},any>({
          method: 'post',
          url: '/product/push_keyword_add',
          data:{
            slt_txt : selectWord,
            mt_idx : userInfo.idx
          }
          }).then(res=>{
          console.log(res.data)
          }).catch(error=>{
          console.log('KeywordNotice')
        })
    }
    const getSearchData = async () => {
      await client({
          method: 'post',
          url: '/product/search_result',
          data:{
            slt_txt : selectWord,
            mt_idx : userInfo.idx
          }
          }).then(res=>{
          setIsLoading(false)
          console.log(res.data)
          setItemList(res.data)
          }).catch(error=>{
          setIsLoading(false)
          console.log('getSearchData')
          })
      }
    
    function handleBackButtonClick() {
    if(selectWord == '' && selectWord == '' && !isSearch){
        navigation.goBack();
        return true;
      }
      else{
        setSelectWord('');
        setIsSearch(false);
        setSearchKeyword('');
        getSearchedData()
        return false;
      }
    }

    React.useEffect(()=>{
      // searchput()
      if(searchKeyword == ''){
        setSelectWord('')
      }
    },[searchKeyword])

/** 검색 시 상품 리스트 가져오기 */
    React.useEffect(()=>{
      if(selectWord != ''){
        getSearchedData();
        setIsSearch(true);
        setIsLoading(true)
        setTimer(true)
        getSearchData();
        setsearchText(searchText.concat({slt_idx:1,slt_txt:selectWord}))
        searchRef.current?.blur()
        setSeconds(4)
      }
      else{
        setIsSearch(false);
        getSearchedData()
      }
    },[selectWord])

    // React.useEffect(()=>{
    //   console.log('now ? ' , searchKeyword);
    //   if(searchKeyword != selectWord){
    //     setIsSearch(false);
    //   }
    //   else{
    //     setIsSearch(true);
    //   }
    //   // setSelectWord('');
    // },[searchKeyword]);

    React.useEffect(() => {
      if(isFocuesd){
          BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
          return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
          }
      }
    }, [selectWord,selectWord,isSearch,isFocuesd]);

    const [seconds, setSeconds] = React.useState<number>(4);
    //타이머 시작
    React.useEffect(() => {
      const countdown = setInterval(() => {
          if (seconds > 0) {
          setSeconds(seconds - 1);
          }
          if (seconds === 0) {
            setTimer(false)
          }
      }, 1000);
      return () => {clearInterval(countdown);}
    }, [seconds]);

    return (
    <SafeAreaView style={[style.default_background , {flex:1}]}>
        <SearchHeader search_action={setSearchKeyword} searchKeyword={searchKeyword} setSelectWord={setSelectWord} searchRef={searchRef}/>      
            {searchKeyword == '' ? //검색키워드 없을때 (검색기록)
            <ScrollView style={{paddingHorizontal:20}}>
              <Text style={[style.text_sb, {color:colors.GREEN_COLOR_2,fontSize:15,marginTop:28, marginBottom:14,}]}>
                  {t("최근검색어")}
              </Text>
              <View style={{flexWrap:'wrap',flexDirection:'row'}}>
                {
                  searchText.map((item,index)=>{
                    return (
                      <TouchableOpacity key={item.slt_txt+index}
                        style={{borderWidth:1, borderColor:colors.GRAY_COLOR_3, borderRadius:150,flexDirection:'row', justifyContent:'center',alignItems:'center',marginRight:14,marginBottom:14, paddingHorizontal:15,paddingVertical:10}}
                        onPress={()=>{Research(item.slt_txt)}}
                      >
                        <Text style={[style.text_me, {fontSize:15,color:colors.BLACK_COLOR_1,marginRight:5}]}>
                          {item.slt_txt}
                          </Text>
                        <TouchableOpacity style={{padding:4}} onPress={()=>DeleteSearchedData(item)}>
                          <Image style={{width:15,height:15}} source={require('../../../assets/img/ico_x.png')}/>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
            </ScrollView>
            : //검색기록 있을때
            <View style={{flex:1}}>
              {!isSearch ? //최종검색을 하지 않았을때(enter, 검색버튼 누르지 않음)
              <ScrollView style={{paddingHorizontal:20}}>
                <Text style={[style.text_sb, {color:colors.GREEN_COLOR_2,fontSize:15,marginTop:28, marginBottom:14,}]}>
                  관련검색어
                </Text>
                {tempSearchList.map((item,index) => {
                  return(
                    <TouchableOpacity onPress={()=>Research(item.search_slt_txt)}
                    key={index} style={{flexDirection:'row',marginBottom:20,justifyContent:'space-between',alignItems:'center'}}>
                      <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={{backgroundColor:colors.GRAY_COLOR_1,width:35,height:35,justifyContent:'center',alignItems:'center',borderRadius:150}}>
                          <Image source={require('../../../assets/img/top_search.png')} style={{width:20,height:20}} />
                        </View>
                      <Text style={[style.text_b,{fontSize:15,color:colors.BLACK_COLOR_2,marginLeft:10}]}>
                        {item.search_slt_txt}
                      </Text>
                      </View>
                      <View style={{width:20,height:20,alignItems:'center',justifyContent:'center'}}>
                          <Image source={require('../../../assets/img/arrow2.png')} style={{width:12,height:10}}/>
                      </View>
                    </TouchableOpacity>
                  )
              })}
              </ScrollView>
              : //최종 검색 했을때
              <View style={{flex:1}}>
              {!isLoading?
              <View style={{flex:1}}>
                {itemList.length > 0 ? //검색결과가 있을 경우
                  <View style={{paddingHorizontal:20}}>
                    <FlatList
                      data={itemList}
                      renderItem={({item}) => <ProductItem item={item} action={()=>{}}/>}
                      showsVerticalScrollIndicator={false}
                      ListFooterComponent={
                        isListLoading? 
                        <LoadingIndicator/>
                        : 
                        null
                      }
                    />
                  </View>
                  : //검색결과 없음
                  <View style={[{ flexGrow: 1, paddingHorizontal:20,alignItems:'center',justifyContent:'center'}]}>
                      {/* <SearchNone /> */}
                      <Image source={require('../../../assets/animations/no_search.gif')} style={{width:102,height:102}} />
                      <Text style={[style.text_me,{fontSize:20,color:colors.BLACK_COLOR_2,marginTop:30}]}><Text style={{color:colors.GREEN_COLOR_3}}>검색결과</Text>가 없습니다.</Text>
                  </View> 
                }
                {timer&&
                <View style={{position:'absolute',bottom:30,left:0,right:0,justifyContent:'center',alignItems:'center'}}>
                  <TouchableOpacity 
                  onPress={KeywordNotice}
                  style={{backgroundColor:colors.GREEN_COLOR_4,borderColor:colors.GREEN_COLOR_2,borderWidth:1,borderRadius:150,minWidth:190,height:50,flexDirection:'row',alignItems:'center',justifyContent:'center',paddingHorizontal:20}}>
                    <Image source={require('../../../assets/img/ico_bell.png')} style={{width:20,height:20}}/>
                    <Text style={[style.text_me,{marginLeft:10,color:'#222',fontSize:15}]}>"<Text style={{color:colors.GREEN_COLOR_2}}>{selectWord}</Text>" 알림 받기</Text>
                  </TouchableOpacity>
                </View>
                }
              </View>
              :
              <View style={{flex:1,justifyContent:'center'}}>
                <ActivityIndicator size='large'/>
              </View>
              }
            </View>
            }
            </View>
            }
          <BackHandlerCom noRetrun={true} />
    </SafeAreaView>
    );
};


export default Search;
