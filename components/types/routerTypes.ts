
//router type 지정하기

import { ProductItemType } from "./componentType";
import { reduxStateType } from "./reduxTypes";

export type MainNavigatorParams = { //props가 없으면 undefined 있으면 {props명 : type}
    Main: undefined;
    NotificationIndex: undefined;
    /** 로그인 ***/
    SelectLogin: undefined;
    Login: undefined;


    /** 회원가입 **/

    JoinStep2: {
        area: string;
        mt_lat: number,
        mt_log: number,
        mt_type?: number;
        sns_key?: string;
    };
    JoinStep3: undefined;
    JoinStep4: undefined;

    /** 정보변경 **/
    ChangePhoneAuth: undefined;
    ChangePhone: {
        phone: string;
        areaCode: String;
        email: string;
        areaCodeLabel: String;
    };
    ChangePhoneResult: {
        beforePhone: string;
        beforeAreaCode: String;
        afterPhone: string;
        afterAreaCode: String;
    }

    /** 내 동네 설정 */
    SetMyLocation: undefined;
    SearchLocation: {
        type: string;
        selectIdx?: string;
        mt_type?: number;
        sns_key?: string;
    };
    AuthMyLocation: {
        setLocation: {
            mt_lat: number;
            mt_log: number;
        },
        selectIdx?: string;
        mt_address?: string;
    }

    Itemlist: undefined;
    Itemupload: {
        type: string
        pt_idx: number
    };
    Itempost: {
        pt_idx: number
    }
    ItempostFullSlide: {
        imageheight: number,
        gofullscreen: () => void,
        SlideImage: any
    };

    Search: undefined;
    Reserve_choice: {
        target: {
            id: number,
            image: string,
            title: string
        },
        type: string,
        pt_sale_now: string
    };
    ReportUser: {
        mt_declaration_idx: number
    }
    ReportPost: {
        mt_declaration_idx: number
        pt_idx: number
    }
    ReportChat: {
        room_idx: number,
        mt_declaration_idx: number
    }

    /**Notification */
    Notification: undefined;
    KeywordSetting: undefined;
    NotificationDetail: {
        pst_idx: number,
    };

    /**Category */
    Category: undefined;
    Category_Filter: {
        ct_name: string
    };

    /**Message */
    Message: undefined;
    MessageRoom: {
        items: {
            chr_id: number,
            room_id: number,
            crt_last_date: string | null,
            ctt_id: string,
            ctt_msg: string | null,
            ctt_push: string | null,
            mt_area: string,
            mt_idx: number,
            mt_image1: number | null,
            mt_nickname: string,
        }
        type: string
    }
    ;

    /**Mypage */
    Mypage: undefined;


    ProfileModify: undefined;
    Allreview: undefined;
    ReviewDetail: {

    };

    /**Mypage Setting */
    SettingAnnounce: undefined;
    SettingAnnounceDetail: {
        id: number
    };

    MypageSetting: undefined;
    SettingModifyEmail: undefined;
    SettingModifyPhone: {
        PhoneNumber: number
    };
    SettingTerms: undefined;
    SettingServiceLocation: undefined;
    SettingPolicy: undefined;
    SettingLogout: undefined;
    SettingWithdrawal: undefined;

    /**MYpage - Transaction */
    SaledList: { target: number };
    SendReview: {
        item: ProductItemType
    };
    PurchaseList: undefined;
    InterestsList: undefined;

    /**MYpage - Q & A */
    Question: undefined;
    QuestionDetail: {
        id: number,
    };
    Inquiry_1_1: undefined;
    Inquiry_1_1Detail: {
        qt_idx: string,
        qt_status: string,
        qt_title: string,
        qt_wdate: string,
    };
    Inquiry_1_1Upload: {
        type: string,
    };


}