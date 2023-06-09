/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  KeyboardAvoidingView,
  ImageBackground,
  Platform,PermissionsAndroid
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import style from '../../../assets/style/style';
import { colors } from '../../../assets/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainNavigatorParams } from '../../../components/types/routerTypes';
import { BackHeader } from '../../../components/header/BackHeader';
import { CustomButton } from '../../../components/layout/CustomButton';
import { BackHandlerCom } from '../../../components/BackHandlerCom';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import { useTranslation } from 'react-i18next';
import client from '../../../api/client';
import {useSelector} from 'react-redux';
import {launchImageLibrary,launchCamera} from 'react-native-image-picker';
import LoadingIndicator from '../../../components/layout/Loading';
import { CheckPhotoImage } from '../../../components/modal/CheckPhothImage';
import cusToast from '../../../components/navigation/CusToast';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const Inquiry_1_1Upload = ({ }) => {
  const navigation = useNavigation<StackNavigationProp<MainNavigatorParams>>();
  const userInfo = useSelector((state: any) => state.userInfo);
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isloading, setIsLoading] = useState(false);
  const [uploadpictures, setUploadpictures] = useState<any>([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [photoModalVisible, setPhotoModalVisible] = useState(false)

  const Delete = (e: any) => {
    const remove = uploadpictures.filter(item => item.fileName !== e.fileName);
    setUploadpictures(remove);
  };

  /** 사진 고르기 */
  const openPicker = (type: string) => {
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
        if (res.didCancel) {
        } else if (res.assets) {
          let newres = [...uploadpictures];
          res.assets.forEach((item, index) => {
            newres.push({
              uri: item.uri,
              fileName: item.fileName,
              type: item.type,
              img_idx: '',
            });
          });
          if (newres.length >= 10) {
            newres = newres.slice(0, 10);
          }
          setUploadpictures(newres);
        }
      });
    } else {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        selectionLimit: 10,
        // includeBase64: true
      },
      (res: any) => {
        if (res.didCancel) {
        } else if (res.assets) {
          let newres = [...uploadpictures, ...res.assets];
          if (newres.length >= 10) {
            newres = newres.slice(0, 10);
          }

          setUploadpictures(newres);
        }
      },
    );
    }
  };

  const UploadData = async () => {
    setIsLoading(true)
    const form = new FormData();
    form.append('mt_idx', userInfo.idx);
    form.append(`qt_title`, title);
    form.append(`qt_content`, text);

    if (title.trim() == '') {
      cusToast(t('제목을 입력해주세요'));
      return false;
    }
    if (text.trim() == '') {
      cusToast(t('내용을 입력해주세요'));
      return false;
    }

    const idxs = Object.keys(uploadpictures);
    for (const idx of idxs) {
      const item = uploadpictures[idx];
      let data = {
        name: item.fileName,
        type: item.type,
        uri: Platform.OS === 'ios' ? item.uri.replace('file://', '') : item.uri,
      };

      // let s_idx = parseInt(idx) + 1;
      form.append(`qt_file[]`, data);
    }

    await client({
      method: 'post',
      url: '/customer/qna-add',
      headers: { 'Content-Type': 'multipart/form-data' },
      data: form,
    })
      .then(res => {
        navigation.goBack();
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err)
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <BackHeader title={t('문의하기')} />
      {isloading ? (
        <LoadingIndicator />
      ) : (
          <ScrollView style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
            <Text
              style={[
                style.text_b,
                { fontSize: 15, color: colors.BLACK_COLOR_1, marginBottom: 6 },
              ]}>
              {t('제목')} <Text style={{ color: colors.GREEN_COLOR_2 }}>*</Text>
            </Text>
            <TextInput
              placeholder={t('제목 입력')}
              style={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: colors.GRAY_COLOR_3,
                paddingHorizontal: 15,
              }}
              value={title}
              onChangeText={setTitle}
            />
            <Text
              style={[
                style.text_b,
                {
                  fontSize: 15,
                  color: colors.BLACK_COLOR_1,
                  marginBottom: 6,
                  marginTop: 30,
                },
              ]}>
              {t('내용')} <Text style={{ color: colors.GREEN_COLOR_2 }}>*</Text>
            </Text>
            <TextInput
              placeholder={t('내용 입력')}
              style={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: colors.GRAY_COLOR_3,
                paddingHorizontal: 15,
                height: 156,
                marginBottom: 30,
                textAlignVertical: 'top',
                maxHeight: 156
              }}
              multiline={true}
              value={text}
              onChangeText={setText}
            />
            <Text
              style={[
                style.text_b,
                { fontSize: 15, color: colors.BLACK_COLOR_1, marginBottom: 6 },
              ]}>
              {t('이미지 첨부')}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.GREEN_COLOR_2,
                height: 44,
                borderRadius: 5,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 17,
              }}
              onPress={openPicker}>
              <Text
                style={[
                  style.text_sb,
                  { fontSize: 15, color: colors.WHITE_COLOR },
                ]}>
                {t('사진 추가')} ({uploadpictures ? uploadpictures.length : 0}/10)
            </Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {uploadpictures.map((items: any) => {
                return (
                  <View
                    key={items.fileName}
                    style={{
                      marginBottom: 20,
                      marginRight: 13,
                      width: 100,
                      height: 100,
                    }}>
                    <ImageBackground
                      style={{ flex: 1 }}
                      source={{ uri: items.uri }}
                      resizeMode="cover"
                      imageStyle={{ borderRadius: 10 }}>
                      <TouchableOpacity
                        style={{ alignItems: 'flex-end', right: 10, top: 10 }}
                        onPress={() => Delete(items)}>
                        <Image
                          style={{ width: 25, height: 25 }}
                          source={require('../../../assets/img/ico_close1.png')}
                        />
                      </TouchableOpacity>
                    </ImageBackground>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        )}

      <TouchableOpacity
        style={{
          backgroundColor: isloading ? colors.GRAY_COLOR_2 : colors.GREEN_COLOR_2,
          height: 54,
          borderRadius: 5,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={isloading ? () => { } : () => UploadData()}>
        <Text style={[style.text_b, { fontSize: 18, color: colors.WHITE_COLOR }]}>
          {t('문의하기')}
        </Text>
      </TouchableOpacity>

      <CheckPhotoImage
      photoModalVisible={photoModalVisible}
      setPhotoModalVisible={()=>setPhotoModalVisible(false)}
      action={()=>openPicker('camera')}
      action2={()=>openPicker('gallery')}
      />
      <BackHandlerCom />
    </SafeAreaView>
  );
};

export default Inquiry_1_1Upload;
