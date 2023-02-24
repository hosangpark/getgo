import { productPostType } from "../../components/types/reduxTypes";
import { types } from "../types";



const defaultState:productPostType = {
    idx:'',
    slide_img:[],
    category:'',
    title:'',
    text:'',
    price:0,
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
}

export const ProductPost = (state = defaultState, action:any) => {
    // For Debugger
    switch (action.type) {
        case types.POST_PRODUCT:
            return {
                ...defaultState,
                idx:action.idx,
                slide_img:action.slide_img,
                category:action.category,
                title:action.title,
                text:action.text,
                price:action.price,
            };
        case types.LOGOUT :
            return defaultState;
        default:
            return state;
    }
};

