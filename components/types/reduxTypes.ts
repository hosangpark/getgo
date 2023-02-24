
//router type 지정하기

export type userInfoType = {
    idx : string;
    mt_profile_img:string,
    mt_na:number;
    mt_hp:string;
    mt_nickname:string;
    mt_email:string;
    sell_count:number;
    trade_com_count:number;
    token:string,
    islogin:boolean,
}
export type myLocationType ={ 
    location1:string;
    isLocAuth1:boolean;
    location2:string;
    isLocAuth2:boolean;
    select_location:string;
}
export type productPostType ={ 
    idx:string
    slide_img:string[],
    category:string,
    title:string,
    text:string,
    price:number,
    product_state:string,
    date:string,
    eyecount:number,
    messagecount:number,
    heartcount:number,
    upload_user_profile:string,
    upload_user_location:string,
    upload_user_name:string,
    upload_user_sell_count:number,
    upload_user_trade_com_count:number,
}

export interface reduxStateType {
    myLocation:myLocationType;
    userInfo:userInfoType;
    productPost:productPostType;
}
