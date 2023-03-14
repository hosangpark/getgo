import { myLocationType, userInfoType } from "../../components/types/reduxTypes";
import { types } from "../types";



const defaultState:userInfoType = {
    idx:'',
    mt_profile_img:'',
    mt_na:0,
    mt_hp:'',
    mt_nickname:'',
    mt_email:'',
    sell_count:0,
    trade_com_count:0,
    language:'',
    token:'',
    islogin:false,
}

export const UserInfo = (state = defaultState, action:any) => {
    // For Debugger
    switch (action.type) {
        case types.USER_LOGIN:
            return {
                ...defaultState,
                idx:action.idx,
                mt_profile_img:action.mt_profile_img,
                mt_hp:action.mt_hp,
                mt_na:action.mt_na,
                mt_nickname:action.mt_nickname,
                mt_email:action.mt_email,
                sell_count:action.sell_count,
                trade_com_count:action.trade_com_count,
                language:action.language,
                token:action.token,
                islogin:true,
            };
        case types.UPDATE_USER_INFO:
            return {
                ...defaultState,
                idx:action.idx,
                mt_profile_img:action.mt_profile_img,
                mt_hp:action.mt_hp,
                mt_na:action.mt_na,
                mt_nickname:action.mt_nickname,
                mt_email:action.mt_email,
                sell_count:action.sell_count,
                trade_com_count:action.trade_com_count,
                language:action.language,
                token:action.token,
                islogin:action.islogin,
            };
        case types.UPDATE_EMAIL:
            return {
                ...defaultState,
                mt_email:action.mt_email,
            };
        case types.UPDATE_PHONE:
            return {
                ...defaultState,
                mt_hp:action.mt_hp,
            };
        case types.UPDATE_NICKNAME:
            return {
                ...defaultState,
                mt_nickname:action.mt_nickname,
            };
        case types.LOGOUT :
            return defaultState;
        default:
            return state;
    }
};

// export interface User {
//     idx:string
//     areaCode:string,
//     mt_hp: number,
//     mt_name: string,
//     mt_email: string,
//     sell_count:number,
//     trade_com_count:number,
// }

// interface UserState {
//     user : User | null
// }


// const initialState: UserState = {
//     user : null,
// }

// const UserInfo = createSlice({
//     name:'User',
//     initialState,
//     reducers:{
//         authorize(state, action:PayloadAction<User>){
//             state.user = action.payload
//         },
//         logout(state){
//             state.user = null
//         },
//     },
// });

// export default UserInfo.reducer;
// export const {authorize, logout} = UserInfo.actions;



