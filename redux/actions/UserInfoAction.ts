import { types } from "../types";

export function userlogin(data:any){
    const args = JSON.parse(data);
    return {
        type: types.USER_LOGIN,
        idx:args.idx,
        mt_profile_img:args.mt_profile_img,
        mt_na:args.mt_na,
        mt_hp:args.mt_hp,
        mt_nickname:args.mt_nickname,
        mt_email:args.mt_email,
        sell_count:args.sell_count,
        trade_com_count:args.trade_com_count,
        token:args.token,
        islogin:true,
    };
}
export function updateUserInfo(data:any){
    const args = JSON.parse(data);
    return {
        type: types.UPDATE_USER_INFO,
        idx:args.idx,
        mt_profile_img:args.mt_profile_img,
        mt_na:args.mt_na,
        mt_hp:args.mt_hp,
        mt_nickname:args.mt_nickname,
        mt_email:args.mt_email,
        sell_count:args.sell_count,
        trade_com_count:args.trade_com_count,
        token:args.token,
        islogin:args.islogin,
    };
}
export function updateEmail(data:any){
    const args = JSON.parse(data);
    return {
        type: types.UPDATE_EMAIL,
        mt_email:args.mt_email,
    };
}
export function updatePhone(data:any){
    const args = JSON.parse(data);
    return {
        type: types.UPDATE_EMAIL,
        mt_hp:args.mt_hp,
    };
}
export function updateNickname(data:any){
    const args = JSON.parse(data);
    return {
        type: types.UPDATE_NICKNAME,
        mt_nickname:args.mt_nickname,
    };
}

export function logOut(){
    return {
        type : types.LOGOUT,
    }
}


// import { useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { bindActionCreators } from "redux";
// import { RootState } from "../reducers";
// import { authorize,InputName, logout, User } from "../reducers/UserInfoReducer";
// import { types } from "../types";

// interface updateData{
//     type : string;
//     idx:string,
//     mt_hp:string;
//     mt_name:string;
//     sell_count:Number;
//     trade_com_count:Number,
// }

// export function updateUserInfo(data : any){
//     const args = JSON.parse(data);
    
//     return {
//         type: types.UPDATE_USER_INFO,
//         idx:args.idx,
//         mt_hp:args.mt_hp,
//         mt_name:args.mt_name,
//         sell_count:args.sell_count,
//         trade_com_count:args.trade_com_count,
//     };
// }

// export function logOut(){
//     return {
//         type : types.LOGOUT,
//     }
// }

// /** hooks */
// export default function useUser(){
//     return useSelector((state:RootState)=>state.UserInfo.user)
// }
// /** actions */
// export function useAuthActions(){
//     const dispatch = useDispatch()
//     return useMemo(()=> bindActionCreators({authorize, InputName, logout},dispatch),[dispatch,])
// }


