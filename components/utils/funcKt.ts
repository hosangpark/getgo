import { GetMinMaxType, NumberReplaceType, } from "../types/funcType";

//현재 날짜 구하기 yyyy-mm-dd
export const getToday = () => {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
}

export const idCheck = (id: string) => {
    const emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    if (id == '') {
        return {
            result: false,
            msg: '아이디를 입력해주세요.',
        }
    }
    else if (!emailReg.test(id)) {
        return {
            result: false,
            msg: '올바르지 않은 이메일입니다.',
        }
    }
    else {
        return {
            result: true,
            msg: '',
        }
    }
}

export const pwCheck = (pw: string) => {
    const passwordReg = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{6,20}$/
    if (pw == '') {
        return {
            result: false,
            msg: '비밀번호를 입력해주세요.',
        }
    }
    else if (!passwordReg.test(pw)) {
        return {
            result: false,
            msg: '영문, 숫자, 특수문자를 조합하여 입력해주세요. (6~20자)',
        }
    }
    else {
        return {
            result: true,
            msg: '사용가능한 비밀번호 입니다.',
        }
    }
}

export const pwCheckRe = (pw: string, pw_re: string) => {
    if (pw_re == '') {
        return {
            result: false,
            msg: '비밀번호를 한번 더 입력해주세요.',
        }
    }
    else if (pw != pw_re) {
        return {
            result: false,
            msg: '비밀번호가 일치하지 않아요!',
        }
    }
    else {
        return {
            result: true,
            msg: '비밀번호가 일치합니다.',
        }
    }
}

export const phoneCheck = (phone: string) => {
    const phoneRule = /^(01[0]{1})[0-9]{3,4}[0-9]{4}$/

    if (phone == '') {
        return {
            result: false,
            msg: '휴대폰번호를 입력해주세요.',
        }
    }
    else if (!phoneRule.test(phone)) {
        return {
            result: false,
            msg: '올바르지 않은 휴대폰 번호입니다.',
        }
    }
    else {
        return {
            result: true,
            msg: '사용가능한 휴대폰번호 입니다.',
        }
    }
}

export const nameCheckRe = (name: string) => {
    const nameReg = /^[가-힣a-zA-Z]{2,15}$/;
    if (!nameReg.test(name)) {
        return {
            result: false,
            msg: '이름은 2~15자, 한글과 영문으로 입력해주세요.',
        }
    }
    else {
        return {
            result: true,
            msg: '',
        }
    }
}

export const textBrConverter = (text: string) => {
    let convertText = text;
    if (text == '') {
        return '';
    }
    else {
        convertText = convertText.replace(/\r\n/ig, '<br>');
        convertText = convertText.replace(/\\n/ig, '<br>');
        convertText = convertText.replace(/\n/ig, '<br>');

        return convertText;
    }
}

export const getDate = () => {

    const nowDate = new Date();
    const nowYear = nowDate.getFullYear();
    const nowMonth = nowDate.getMonth() + 1;
    const nowDay = nowDate.getDate();

    const prevWeekDate = new Date(nowYear, nowMonth - 1, nowDay - 7);

    const prevWeekYear = prevWeekDate.getFullYear(); //7일전
    const prevWeekMonth = prevWeekDate.getMonth() + 1; //7일전
    const prevWeekDay = prevWeekDate.getDate(); //7일전
    return {
        year: nowYear, //현재 년도
        month: nowMonth, //현재 월
        day: nowDay, //현재 일
        prevWeekYear, //7일전 년도
        prevWeekMonth, //7일전 월
        prevWeekDay, //7일전 일
        prevWeekDate, //7일전 전체
        koText: `${nowYear}년 ${nowMonth}월 ${nowDay}일`,
        prevKoText: `${prevWeekYear}년 ${prevWeekMonth}월 ${prevWeekDay}일 ~ ${nowYear}년 ${nowMonth}월 ${nowDay}일`,
        onlyYearMonth: `${nowYear}년 ${nowMonth}월`,
        comText: `${nowYear}.${nowMonth < 10 ? '0' + nowMonth : nowMonth}.${nowDay < 10 ? '0' + nowDay : nowDay}`,
        hiponText: `${nowYear}-${nowMonth < 10 ? '0' + nowMonth : nowMonth}-${nowDay < 10 ? '0' + nowDay : nowDay}`
    }
}

export const getMinMax = (list: any) => {
    const min = Math.min(...list);
    const max = Math.max(...list);

    return {
        min,
        max,
    }
}

export const NumberReplace = (event: any) => {

    console.log(event);

    if (event.key === '.'
        || event.key === '-'
        || event.key >= 0 && event.key <= 9) {
        return true;
    }

    return false;
}

export const NumberComma = (number: number) => {
    const comNumber = number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    return comNumber;
}


import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { enUS } from "date-fns/locale";
import { id } from "date-fns/locale";
import { useTranslation } from 'react-i18next';

export function foramtDate(date: any) {
    const { t, i18n } = useTranslation()
    if (!date) return '';
    const localeSelect = i18n.language == 'Ko'? ko : i18n.language == 'En'? enUS:id

    const d = new Date(date);
    const now = Date.now();
    const diff = (now - d.getTime()) / 1000; // 현재 시간과의 차이(초)
    if (diff < 60 * 1) { // 1분 미만일땐 방금 전 표기
        return "방금 전";
    }
    if (diff < 60 * 60 * 24 * 3) { // 3일 미만일땐 시간차이 출력(몇시간 전, 몇일 전)
        return formatDistanceToNow(d, { addSuffix: true, locale: localeSelect });
    }
    return format(d, 'PPP EEE p', { locale: localeSelect }); // 날짜 포맷
}

export const validateEmail = (email: any) => {
    const regex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    return regex.test(email);
}

export const Textreplace = (text:string) =>{
        // 특수문자 정규식 변수(공백 미포함)
        var replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>0-9\/.\`:\"\\,\[\]?|{}]/gi;
 
        // 완성형 아닌 한글 정규식
        var replaceNotFullKorean = /[ㄱ-ㅎㅏ-ㅣ]/gi;
        
        // 허용할 특수문자는 여기서 삭제하면 됨
        var regExp = /[ \{\}\[\]\/?.,;:|\)*~`!^\-_+┼<>@\#$%&\'\"\\\(\=]/gi; 
        // 지금은 띄어쓰기도 특수문자 처리됨 참고하셈
        if( regExp.test(text) || replaceNotFullKorean.test(text) ){

            return false
            // text = text.substring( 0 , text.length - 1 ); // 입력한 특수문자 한자리 지움

        } 

        return true
}