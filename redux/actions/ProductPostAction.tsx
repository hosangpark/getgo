import { types } from "../types";


export function updateProductPost(data:any){
    const args = JSON.parse(data);
    
    return {
        type: types.POST_PRODUCT,
        idx:args.idx,
        slide_img:args.slide_img,
        category:args.category,
        title:args.title,
        text:args.text,
        price:args.price,
        product_state:'',
        date:'',
        eyecount:0,
        messagecount:0,
        heartcount:0,
        upload_user_profile:'',
        upload_user_location:'',
        upload_user_name:'',
        upload_user_sell_count:0,
        upload_user_trade_com_count:0,
    };
}

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



