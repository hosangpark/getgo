import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Text,
  View,
  Modal,
  useState,
  TouchableOpacity,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import cusToast from '../components/navigation/CusToast';
import { useTranslation } from 'react-i18next';
import style from '../assets/style/style';
import { colors } from '../assets/color';

// import dayjs from 'dayjs';
import axios from 'axios';
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
// } from 'react-native-responsive-screen';

// import jwt_decode from 'jwt-decode';
// import jwt_encode from 'jwt-encode';

//import {InAppBrowser} from 'react-native-inappbrowser-reborn';

class Api {
  constructor() {
    //super(props);

    this.state = {
      //jwt_debug: 'XNkc2Fkc2jc4OTAiLCJuYW',
      //jwt_key:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9',
      // jwt_key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6InN1cGVya2l6eiJ9',
      // jwt_debug: 'XNkc2Fkc2jc4OTAiLCJuYW',
      isLoading: false,
      siteUrl: 'http://getgo.id:4000',
      imageUrl: 'http://getgo.id:4000/uploads/',
      socketUrl: 'http://getgo.id:3333',
      // deepLinkUrl: 'http://ec2-13-125-251-68.ap-northeast-2.compute.amazonaws.com:3000/bridge',
      // deepLinkUrl: 'https://getgo.page.link/bjYi',
      deepLinkUrl: 'https://getgo.page.link',
      path: '/api/',
      option: {
        method: 'POST',
        headers: {
          //Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZHgiOjEsImlhdCI6MTY3MzQ4MzQ2NX0.ZbFX8K1lEEX2Ce-2dPQl7hyq6Y4DBlzL_4fdIu9TzH8`
        },
        body: null,
      },
      dataSource: {},
      baseCode: {},
      recount: 0,
      mb_id: '',
      mb_name: '',
      auth: {} /* 권한 */,
      mb_level: 2,
      mb_fcm: '',

      goPageData: {},
      goPage: false,
      goPopupData: {},
      goPopup: false,
      userData: {},
    };

  }

  isDate(x) {
    return null != x && !isNaN(x) && 'undefined' !== typeof x.getDate;
  }

  // isDate(myDate) {
  //   return myDate.constructor.toString().indexOf('Date') > -1;
  // }

  formatDate(date) {
    //moment(date).format('')
    var year = date.getFullYear(); //yyyy
    var month = 1 + date.getMonth(); //M
    month = month >= 10 ? month : '0' + month; //month 두자리로 저장
    var day = date.getDate(); //d
    day = day >= 10 ? day : '0' + day; //day 두자리로 저장
    return year + '-' + month + '-' + day;
  }

  makeJwtData(datas, method) {
    let formdata = new FormData();
    // console.log('datas', method, datas);
    //datas.jwt_debug = this.state.jwt_debug;
    if (datas.files) {
      for (const [key, value] of Object.entries(datas.files)) {
        if (value) {
          if (Array.isArray(value)) {
            //console.log('!!!!!!!!!!!!arr', value);

            for (let v of value) {
              formdata.append(key + '[]', v);
            }
          } else {
            formdata.append(key, value);
          }
          console.log('files key', key, value);
        }
      }
      delete datas.files;
    }

    this.state.jwt_data = jwt_encode(datas, this.state.jwt_key);

    //formdata.append('jwt_debug', this.state.jwt_debug);
    formdata.append('jwt_data', this.state.jwt_data);

    this.state.option.body = formdata;
  }

  //formdata 로 변경
  makeFormData(method = '', datas = {}) {
    let formdata = new FormData();

    // console.log('datas', datas);
    formdata.append('method', method);
    //formdata.append('jwt_debug', this.state.jwt_debug);
    //formdata.append('jwt_data', this.state.jwt_data);

    for (let [key, value] of Object.entries(datas)) {
      if (typeof value === 'undefined') continue;

      if (Array.isArray(value)) {
        //console.log('!!!!!!!!!!!!arr', value);

        for (let v of value) {
          formdata.append(key + '[]', v);
        }

        //continue; //배열일때 처리는 하지 않음.
      } else if (this.isDate(value)) {
        //날짜형이라면
        value = this.formatDate(value);
        formdata.append(key, value);
      } else if (value === null) {
        //널값은 ''으로
        value = '';
        formdata.append(key, value);
      } else {
        // } else if (typeof value.fileSize !== 'undefined' && value.fileSize > 0) {
        //   //이미지 처리

        //   formdata.append(key, {
        //     uri: value.uri,
        //     type: value.type,
        //     name: value.fileName,
        //   });

        //   console.log('== file : ', {
        //     uri: value.uri,
        //     type: value.type,
        //     name: value.fileName,
        //   });
        // } else {
        formdata.append(key, value);
      }

      //value = typeof value === 'undefined' ? '' : value;
    }

    // this.setState((prevState, props)=>{
    //   newState = { ...prevState };
    //   newState.option.body = formdata;
    //   return newState;
    // });

    this.state.option.body = formdata;
  }

  //기본
  async send(method, path, datas, callback) {
    //this.makeFormData(method, datas);
    //this.makeJwtData(datas, method);
    this.state.option.body = datas;

    this.state.isLoading = true;

    console.log('== api start ==', method, path, datas);

    // let response = await fetch(
    //   this.state.siteUrl + this.state.path,
    //   this.state.option,
    // );
    // let responseJson = await response.json();

    await axios({
      method: method,
      url: this.state.siteUrl + this.state.path + path,
      headers: this.state.option.headers,
      data: datas,
    })
      .then(async response => {
        let responseOK = response && response.status === 200;
        //console.log('responseOK', responseOK);
        if (responseOK) {
          // let responseJson = await response.data;
          let responseJson = response;

          this.state.isLoading = false;
          this.state.dataSource = {
            ...this.state.dataSource,
            [method]: responseJson,
          };


          console.log('== api response ==', method, path, responseJson);

          if (typeof callback == 'function') {
            callback(responseJson);

            //재실행 횟수 초기화
            this.state.recount = 0;
          } else {
            this.state.recount = 0;
            return responseJson;
          }
        } else {
          //let responseJson = await response.data;
          //console.log('== api response Not OK == ', response);
        }
      })
      .catch(async error => {
        // console.log('-- json error -- ', error);

        if (this.state.recount < 5) {
          console.log('-- json error -- ', error);
          //console.log('-- json --', await response.data);

          //console.warn(error, this.state.recount);

          this.send(method, path, datas, callback);
          this.state.recount++;
        } else {
          cusToast(this.state.t('통신에 실패했습니다. 재실행 해주세요.'));
          //console.error(error);
        }
      });
  }

  loader(inv) {
    const [visible, setVisible] = React.useState(true);

    useEffect(() => {
      if (typeof inv == 'undefined') return;

      let setinv = inv;
      setVisible(setinv);
    }, [inv]);

    return (
      <Modal transparent={true} animationType={'none'} visible={visible}>
        <View
          style={{
            position: 'absolute',
            top: hp('45%'),
            left: wp('45%'),
            flexDirection: 'column',
            alignContent: 'stretch',
            backgroundColor: 'rgba(0,0,0,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{ backgroundColor: 'white', padding: 15 }}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <ActivityIndicator
                animating={true}
                size="large"
                color={'#0073D0'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  formatDate(date, types) {
    if (!types) types = 0;
    if (typeof date.getMonth === 'function') {
    } else {
      date = new Date(date);
    }
    var currentYear = date.getFullYear();
    var currentMonth = date.getMonth() + 1;
    var currentDate = date.getDate();
    var ref = '';
    if (types == 1) {
      //2021.2.24
      ref = currentYear + '.' + currentMonth + '.' + currentDate;
    } else {
      if (currentMonth < 10) currentMonth = '0' + currentMonth;
      if (currentDate < 10) currentDate = '0' + currentDate;
      ref = currentYear + '-' + currentMonth + '-' + currentDate;
    }

    return ref;
  }

  formatDateTime(date, format) {
    var currentYear = date.getFullYear();
    var currentMonth = date.getMonth() + 1;
    var currentDate = date.getDate();

    var currentHours = date.getHours();
    var currentMinutes = date.getMinutes();
    var currentSeconds = date.getSeconds();

    var hours = currentHours;
    var minutes = currentMinutes;

    if (currentMonth < 10) currentMonth = '0' + currentMonth;
    if (currentDate < 10) currentDate = '0' + currentDate;
    if (currentHours < 10) currentHours = '0' + currentHours;
    if (currentMinutes < 10) currentMinutes = '0' + currentMinutes;
    if (currentSeconds < 10) currentSeconds = '0' + currentSeconds;

    if (format === 'YmdHis') {
      return (
        currentYear +
        '' +
        currentMonth +
        '' +
        currentDate +
        '' +
        currentHours +
        '' +
        currentMinutes +
        '' +
        currentSeconds
      );
    } else if (format === 'H:i') {
      return currentHours + ':' + currentMinutes;
    } else if (format === 'AMPM') {
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      //hours + ':' + minutes + ' ' + ampm;

      return currentHours + ':' + currentMinutes + ' ' + ampm;
    } else {
      return (
        currentYear +
        '-' +
        currentMonth +
        '-' +
        currentDate +
        ' ' +
        currentHours +
        ':' +
        currentMinutes
      );
    }
  }

  //값을 숫자로 변환
  get_numeric(str) {
    if (!str) str = 0;
    str = str.toString().replace(/[^\d-]/g, '');
    return !str ? 0 : parseInt(str, 10);
  }

  //--------------------------------------------------------------------------------------------------
  //콤마찍기
  comma(str) {
    if (!str) return 0;

    str = this.get_numeric(str).toString();
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
  }
  //콤마풀기
  uncomma(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, '');
  }
  //--------------------------------------------------------------------------------------------------
  imgResize(imgWidth, imgHeight, maxWidth) {
    let width = 0,
      height = 0;
    if (imgWidth > maxWidth) {
      width = maxWidth;
      height = imgHeight * (maxWidth / imgWidth);
    } else {
      width = imgWidth;
      height = imgHeight;
    }
    width = parseInt(width);
    height = parseInt(height);

    return width + ',' + height;
  }
  //--------------------------------------------------------------------------------------------------
  dialCall = number => {
    let phoneNumber = '';

    if (Platform.OS === 'ios') {
      phoneNumber = `telprompt:${number}`;
    } else {
      phoneNumber = `tel:${number}`;
    }
    Linking.openURL(phoneNumber);
  };
  //--------------------------------------------------------------------------------------------------
  arrSearch = (nameKey, myArray) => {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
        return myArray[i];
      }
    }
  };

  //오브젝트 카피
  obClone = obj => {
    if (obj === null || typeof obj !== 'object') return obj;

    var copy = obj.constructor();

    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = this.obClone(obj[attr]);
      }
    }

    return copy;
  };

  //월요일 구하기 -> 일요일구하기로 변환
  getMonday = d => {
    d = new Date(d);
    var day = d.getDay();
    // diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    let diff = d.getDate() - day;
    d.setDate(diff);
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    // d.setTime(0);
    let newDay = new Date(d);

    // console.log('newDay', newDay.toUTCString());
    return newDay;
  };

  /**
   * 해당월 주의 최대값
   * @param dateStr		YYYYMM
   */
  getWeekCountOfMonth = dateStr => {
    var year = Number(dateStr.substring(0, 4));
    var month = Number(dateStr.substring(4, 6));

    var nowDate = new Date(year, month - 1, 1);

    var lastDate = new Date(year, month, 0).getDate();
    var monthSWeek = nowDate.getDay();

    console.log('getWeekCountOfMonth', nowDate, lastDate, monthSWeek);

    var weekSeq = parseInt((parseInt(lastDate) + monthSWeek - 1) / 7) + 1;

    return weekSeq;
  };

  lpad = (str, padLen, padStr) => {
    if (padStr.length > padLen) {
      console.log('오류 : 채우고자 하는 문자열이 요청 길이보다 큽니다');
      return str;
    }
    str += ''; // 문자로
    padStr += ''; // 문자로
    while (str.length < padLen) str = padStr + str;
    str = str.length >= padLen ? str.substring(0, padLen) : str;
    return str;
  };

  //나이구하기
  getAge = yyyy => {
    var d = new Date();
    var y = d.getFullYear();
    if (yyyy && yyyy.length >= 4) {
      yyyy = yyyy.substring(0, 4);
      return y - yyyy + 1;
    } else {
      return '';
    }
  };

  //Url에서 코드를 추출
  urlGetCode = urls => {
    if (urls) {
      let url_arr = urls.toString().split('?code=');

      if (url_arr[1]) {
        return url_arr[1];
      } else return false;
    }
  };

  isValidHttpUrl = string => {
    try {
      var re =
        /^(http[s]?:\/\/){1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
      if (!re.test(string)) {
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  };

  telinput = text => {
    return text
      .replace(/[^0-9]/g, '')
      .replace(
        /(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/,
        '$1-$2-$3',
      )
      .replace('--', '-');
  };

  birthinput = text => {
    return text
      .replace(/[^0-9]/g, '')
      .replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')
      .replace('--', '-');
  };

  getFormatDate = date => {
    // const dayNamesShort = ['일', '월', '화', '수', '목', '금', '토'];

    // const year = date.getFullYear();
    // const month = date.getMonth() + 1;
    // const day = date.getDate();

    let dd = dayjs(date);

    let weeks = dayNamesShort[dd.get('days')];
    // console.log('weeks', date, weeks);

    return dd.format('YYYY.MM.DD') + `(${weeks})`;
  };

}
/*
export async function openLink(url) {
  try {
    if (await InAppBrowser.isAvailable()) {
      const result = await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: 'cancel',
        // preferredBarTintColor: '#453AA4',
        // preferredControlTintColor: 'white',
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        //toolbarColor: '#6200EE',
        //secondaryToolbarColor: 'black',
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
        // Specify full animation resource identifier(package:anim/name)
        // or only resource name(in case of animation bundled with app).
        animations: {
          startEnter: 'slide_in_right',
          startExit: 'slide_out_left',
          endEnter: 'slide_in_left',
          endExit: 'slide_out_right',
        },
        // headers: {
        //   'my-custom-header': 'my custom header value',
        // },
      });
      //Alert.alert(JSON.stringify(result));
    } else Linking.openURL(url);
  } catch (error) {
    Alert.alert(error.message);
  }
}*/
/*
export function boardLink(page_type, mb_id, mb_key, wr_id, bo_table) {
  if (typeof page_type == 'undefined') page_type = '';

  if (typeof mb_id == 'undefined') mb_id = '';
  if (typeof wr_id == 'undefined') wr_id = '';
  if (typeof bo_table == 'undefined') bo_table = '';
  if (typeof mb_key == 'undefined') mb_key = '';

  if (!page_type || !mb_id || !mb_key) {
    Alert.alert('잘못된 방법입니다.', '', {
      type: 'cancel',
      name: '',
      onPress: void 0,
    });

    return '';
  }

  return (
    Api.state.siteUrl +
    '/json/board_link.php?bo_table=' +
    bo_table +
    '&mb_id=' +
    mb_id +
    '&mb_key=' +
    mb_key +
    '&wr_id=' +
    wr_id +
    '&page_type=' +
    page_type
  );
}*/

// state 사용
export function Loaders(props) {
  const [views, setViews] = React.useState(props.views);
  let whiteBack = 'transparent';
  if (props.backColor) {
    if (props.backColor == 'white') whiteBack = 'white';
    else whiteBack = 'rgba(0,0,0,0.3)';
  }

  useEffect(() => {
    setViews(props.views);
  }, [props.views]);

  return (
    //<Modal transparent={true} animationType={'none'} visible={views}>
    views ? (
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flex: 1,
          // top: hp('45%'),
          // left: wp('50%') - 30,
          flexDirection: 'column',
          alignContent: 'stretch',
          // backgroundColor: 'rgba(0,0,0,0.3)',

          backgroundColor: whiteBack,
          alignItems: 'center',
          justifyContent: 'center',
          // width: 35,
          // height: 40,
          zIndex: 2,
        }}>
        <View
          style={{
            backgroundColor: 'transparent',
            padding: 15,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              console.log('loader close');
              setViews(false);
            }}>
            <ActivityIndicator
              animating={true}
              size="large"
              color={'#0073D0'}
            />
          </TouchableOpacity>
        </View>
      </View>
    ) : null
    //</Modal>
  );
}

export function NodataView(props) {

  const { t } = useTranslation();

  const { style, msg, isLoaded, fontStyle } = props;
  let viewStyle = {
    height: 45,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'red'
  };
  if (style) viewStyle = { ...viewStyle, ...props.style };
  let newMsg = msg ? msg : t('데이터가 없습니다');
  if (typeof isLoaded != 'undefined') {
    if (!isLoaded) newMsg = t('로딩중');
  }

  // console.log('rrr', viewStyle);

  return (
    <View style={viewStyle}>
      <Text style={{ fontSize: 14, color: colors.GRAY_COLOR_2, ...fontStyle }}>
        {newMsg}
      </Text>
    </View>
  );
}

/**
 * isArray
 *
 * @param mixed input
 * @return bol
 */

export function is_array(obj) {
  if (obj.constructor.toString().indexOf('Array') == -1) {
    return false;
  }
  return true;
}

/**
 * stripTags
 *
 * @param mixed input
 * @parm mixed output
 */

export function strip_tags(input) {
  if (input) {
    var tags = /<\/?[^>]+(>|$)/g;

    if (typeof input != 'Array') {
      input = input.replace('</p>', '\r\n');
      input = input.replace(tags, '');
      input = input.replace(/&nbsp;/gi, ' ');
    } else {
      var i = input.length;
      var newInput = new Array();
      while (i--) {
        input[i] = input[i].replace('</p>', '\r\n');
        input[i] = input[i].replace(tags, '');
        input[i] = input[i].replace('&nbsp;', ' ');
      }
    }
    return input;
  }
  return false;
}


export const emailData = [
  { label: '직접입력', value: '' },
  { label: 'gmail.com', value: 'gmail.com' },
  { label: 'naver.com', value: 'naver.com' },
  { label: 'daum.net', value: 'daum.net' },
  { label: 'nate.com', value: 'nate.com' },
  { label: 'yahoo.co.kr', value: 'yahoo.co.kr' },
];

export const sido_data = [
  '서울',
  '경기',
  '인천',
  '세종',
  '강원',
  '부산',
  '대전',
  '대구',
  '울산',
  '광주',
  '경남',
  '경북',
  '전남',
  '전북',
  '충남',
  '충북',
  '제주도',
];

export const dayNamesShort = ['일', '월', '화', '수', '목', '금', '토'];

export function getWeeksInMonth(ddd) {
  let year = ddd.format('YYYY');
  let month = ddd.format('MM') - 1;
  let day = ddd.format('D');

  const weeks = [],
    firstDate = new Date(year, month, 1),
    lastDate = new Date(year, month + 1, 0),
    numDays = lastDate.getDate();

  let dayOfWeekCounter = firstDate.getDay();
  //if (dayOfWeekCounter == 1) dayOfWeekCounter = 0;
  //else if (dayOfWeekCounter == 0) dayOfWeekCounter = 6;

  let thisWeek = {};
  let thisWeekNo = 0;
  let firstDayWeek = false;
  let LastDayWeek = false;

  for (let date = 1; date <= numDays; date++) {
    if (dayOfWeekCounter === 0 || weeks.length === 0) {
      weeks.push([]);
    }
    weeks[weeks.length - 1].push({
      d: date,
      ymd: dayjs(
        year + '-' + (month + 1) + '-' + Api.lpad(date, 2, '0'),
        'YYYY-MM-DD',
      ),
    });
    dayOfWeekCounter = (dayOfWeekCounter + 1) % 7;

    if (date == day) {
      thisWeekNo = weeks.length;
      thisWeek = weeks[thisWeekNo - 1];
    }
  }

  //첫주, 마지막주 확인
  thisWeek.forEach((v, index) => {
    if (v.d == 1) {
      firstDayWeek = true;
      return;
    } else if (v.d == numDays) {
      LastDayWeek = true;
      return;
    }
  });

  console.log('y,m,d', year, month, day);

  //무슨요일인지 값 (0~7) 0은 월요일
  let thisWeekStartYoil = thisWeek[0].ymd.day();

  let ref = {
    //weekData: newWeek,
    thisWeek: thisWeek,
    thisWeekNo: thisWeekNo,
    thisWeekStartYoil: thisWeekStartYoil,
    firstDayWeek: firstDayWeek,
    LastDayWeek: LastDayWeek,
  };

  return ref;
}

export default Api = new Api();
