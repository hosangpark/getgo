/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  Alert, Keyboard,
  SafeAreaView, Image, Text, View, FlatList, ScrollView, ActivityIndicator, Platform, PermissionsAndroid,
  Modal, TouchableOpacity, TextInput, Dimensions
} from 'react-native';

import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { useIsFocused, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHeader } from '../../../components/header/BackHeader'
import { CustomButton } from '../../../components/layout/CustomButton';
import { ReviewList } from '../../../components/layout/ReviewList';
import { ReviewItemType } from '../../../components/types/componentType';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import { ImagePickerResponse, launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as UserInfoAction from '../../../redux/actions/UserInfoAction';
import client from '../../../api/client';
import logsStorage from '../../../components/utils/logStorage';
import cusToast from '../../../components/navigation/CusToast';
import Api, { NodataView } from '../../../api/Api';
import { Textreplace } from '../../../components/utils/funcKt';
import { CheckPhotoImage } from '../../../components/modal/CheckPhothImage';




const MypageSetting = () => {
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const { t, i18n } = useTranslation()

  const [modifyName, setModifyName] = React.useState('')
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [profileimg, setProfileimg] = useState<any>(undefined)
  const [ProfileData, setProfileData] = useState<any>([])
  const [reviewData, setReviewData] = useState<ReviewItemType[]>([])

  const Allreview = () => {
    navigation.navigate('Allreview');
  }
  /** redux */
  const userInfo = useSelector((state: any) => state.userInfo);
  const myLocation = useSelector((state: any) => state.myLocation);
  const dispatch = useDispatch()

  const [photoModalVisible, setPhotoModalVisible] = useState(false)

  const getProfileDetailData = async () => {
    await client({
      method: 'get',
      url: `/user/myprofile?mt_idx=${userInfo.idx}`
    }).then((res) => {
      console.log('res.data.list', res.data);
      setProfileData(res.data.data[0])
      setReviewData(res.data.list)
      setIsLoading(false)
    }).catch(
      err => console.log(err)
    );
  };

  const deleteReview = async (target: ReviewItemType) => {
    await client({
      method: 'get',
      url: `/user/reviews-received-delete?rt_idx=${target}`
    }).then(
      res => {
        // const remove = reviewData.filter((item:ReviewItemType) => item.rt_idx !== target.rt_idx)
        // setReviewData(remove)
        cusToast(t(res.data.message))
        getProfileDetailData();
      }
    );
  };




  const ModifyImage = (type: any) => {

    if (type == 'camera') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs",
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      )

      launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        maxWidth: 512,
        maxHeight: 512,
        saveToPhotos: true
      }, (res) => {
        console.log(res)
        if (res.didCancel != true) {
          setProfileimg(res.assets)
          console.log('ModifyImage')
        }

      });

    } else {
      launchImageLibrary(
        {
          mediaType: 'photo',
          maxWidth: 512,
          maxHeight: 512,
          selectionLimit: 1,
        },
        (res: any) => {
          console.log(res)
          if (res.didCancel != true) {
            setProfileimg(res.assets)
            console.log('ModifyImage')
          }
        }
      )
    }

  }




  /** 닉네임 변경 */
  const getUserNickName = async (rrrtype: string) => {


    const form = new FormData();
    form.append('mt_idx', userInfo.idx);
    if (rrrtype === 'onlyphoto') {
      form.append("mt_image1", {
        name: profileimg[0].fileName,
        type: profileimg[0].type,
        uri: Platform.OS === 'ios' ? profileimg[0].uri.replace('file://', '') : profileimg[0].uri,
      });
    } else if (rrrtype == 'onlynickname') {
      form.append(`mt_nickname`, modifyName);
    } else {
      form.append(`mt_nickname`, modifyName);
      form.append("mt_image1", {
        name: profileimg[0].fileName,
        type: profileimg[0].type,
        uri: Platform.OS === 'ios' ? profileimg[0].uri.replace('file://', '') : profileimg[0].uri,
      });
    }
    // console.log('rrrtype', rrrtype, form);

    await client({
      method: 'post',
      url: '/user/profile-edit',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: form,
    }).then(res => {
      cusToast(t(res.data.message))
      setModifyName('')
      Keyboard.dismiss()



      // console.log('res.data', res.data)

      let params = { ...userInfo }
      if (res.data.nickname) params.mt_nickname = res.data.nickname
      if (res.data.mt_image1) params.mt_profile_img = res.data.mt_image1

      if (rrrtype != 'onlynickname') {
        setProfileimg(undefined);
      }

      //post와 get을 연속으로 던지니까 에러가 나옵니다...
      getProfileDetailData()
      // setTimeout(() => {
      //   getProfileDetailData()
      // }, 1300)
      dispatch(UserInfoAction.updateUserInfo(JSON.stringify(params)));

    }).catch(error => {
      console.log("getUserNickName", error)
    })
  }

  /** profile 수정 */
  const ModifyProfile = async () => {
    if (modifyName !== '' || profileimg !== undefined) {
      if (modifyName == '') {
        /** 사진만 변경 */

        getUserNickName("onlyphoto")
        // getProfileDetailData()
      } else if (profileimg == undefined) {
        /** 닉네임만 변경 */
        /** 닉네임 중복체크 */
        console.log(modifyName.length)
        NicknameCheck("onlynickname")
        // if (modifyName.length < 13) {
        // } else {
        //   Alert.alert(t('닉네임은 12자 이내로 제한됩니다.'))
        // }
      } else {
        /** 닉네임 & 사진 둘다 변경 */
        NicknameCheck("both")
      }
    }
  }

  const NicknameCheck = async (type: string) => {
    await client({
      method: 'post',
      url: '/user/nickname-check',
      data: {
        mt_idx: userInfo.idx,
        mt_nickname: modifyName,
      }
    }).then(res => {
      getUserNickName(type)
    }).catch(error => {

      console.log('err', error);
    });
  }

  const enterReview = (item: ReviewItemType) => {
    console.log(item)
  }

  const ReviewCount = reviewData.length

  const [listmodal, setListmodal] = useState({})
  const Toggle = (e: number) => {
    setListmodal(e)
    if (e == listmodal) {
      setListmodal(false)
    }
  }

  useFocusEffect(React.useCallback(() => {
    setIsLoading(true)
    getProfileDetailData()
  }, []))

  React.useEffect(() => {
    console.log('profileimg', profileimg)
    if (ProfileData == undefined) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [])




  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <BackHeader title={t('프로필')} />
      {/* <ScrollView> */}
      <View style={[{ padding: 20, borderBottomWidth: 1, borderColor: colors.GRAY_COLOR_1, }]}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setPhotoModalVisible(true)}>
            <Image style={{ width: 85, height: 85, borderRadius: 50 }} source={
              profileimg ?
                { uri: profileimg[0]?.uri }
                :
                ProfileData.mt_image1 ? { uri: Api.state.imageUrl + ProfileData.mt_image1 } : require('../../../assets/img/img_profile.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={{ borderWidth: 1, borderColor: colors.GRAY_COLOR_3, borderRadius: 15, marginVertical: 7 }}
            onPress={() => setPhotoModalVisible(true)}>
            <Text style={[style.text_me, { fontSize: 13, color: colors.GRAY_COLOR_2, marginHorizontal: 15, marginVertical: 4 }]}>
              {t('프로필사진 변경')}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          {ProfileData !== undefined ?
            <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_2, }]}>
              {ProfileData.mt_nickname ? ProfileData.mt_nickname : t('이름을지정해주세요')}
            </Text>
            :
            <Text style={[style.text_b, { fontSize: 15, color: colors.BLACK_COLOR_2, }]}>
              {t('이름을지정해주세요')}
            </Text>
          }
          <TextInput
            value={modifyName}
            onChangeText={(e: string) => setModifyName(e)}
            style={{ marginVertical: 10, paddingHorizontal: 15, borderWidth: 1, borderColor: colors.GRAY_COLOR_2, borderRadius: 6 }}
            onSubmitEditing={ModifyProfile}
            placeholder={t('변경할 닉네임 입력')} />
          <CustomButton title={t('프로필 수정')} buttonType={'green'}
            action={ModifyProfile}
            disable={!Textreplace(modifyName) && profileimg == undefined} />
        </View>
      </View>
      <View style={[{ paddingTop: 7, paddingHorizontal: 20, borderTopWidth: 7, borderColor: colors.GRAY_COLOR_1, }]}>
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 }}
          onPress={Allreview}>
          <View style={{ flexDirection: 'row' }}>
            <Image style={{ width: 22, height: 22, marginRight: 7 }} source={require('../../../assets/img/ico_review.png')} />
            <Text style={[style.text_b, { fontSize: 17, color: colors.BLACK_COLOR_2, marginRight: 5 }]}>
              {t('받은 거래후기')}
            </Text>
            <Text style={[style.text_b, { fontSize: 17, color: colors.GREEN_COLOR_3 }]}>
              {ReviewCount}
            </Text>
          </View>
          <Image style={{ width: 7, height: 12 }} source={require('../../../assets/img/arrow3.png')} />
        </TouchableOpacity>
      </View>
      {reviewData == undefined ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={'#00C379'} size={'large'} />
        </View>
        :

        <View style={{ flex: 1 }}>
          <FlatList
            style={{ flex: 1 }}
            data={reviewData.slice(0, 5)}
            renderItem={({ item }) => {
              return (
                <ReviewList key={item.rt_idx} item={item} deleteReview={deleteReview} Toggle={Toggle}
                  listmodal={listmodal} setListmodal={setListmodal} />
              )
            }}
            contentContainerStyle={{ paddingHorizontal: 20, flexDirection: 'column-reverse' }}
            ListHeaderComponent={
              <View style={{ marginBottom: 120 }}></View>
            }
            ListEmptyComponent={<NodataView></NodataView>}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.1}
          />
        </View>


      }


      <CheckPhotoImage
        photoModalVisible={photoModalVisible}
        setPhotoModalVisible={() => setPhotoModalVisible(false)}
        action={() => ModifyImage('camera')}
        action2={() => ModifyImage('gallery')}
      />

      <BackHandlerCom />
    </SafeAreaView>
  );
};

export default MypageSetting;
