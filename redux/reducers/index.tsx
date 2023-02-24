import { combineReducers } from 'redux'
import { MyLocation } from './MyLocationReducer';
import { UserInfo } from './UserInfoReducer';
import { ProductPost } from './ProductPostReducer';


export const rootReducer = combineReducers({
    myLocation : MyLocation,
    userInfo : UserInfo,
    productPost : ProductPost
});

export type RootState = ReturnType<typeof rootReducer>;

// import { combineReducers } from 'redux'
// import { MyLocation } from './MyLocationReducer';
// import UserInfo from './UserInfoReducer';


// export const rootReducer = combineReducers({
//     UserInfo,
//     // myLocation : MyLocation,
// });


// export type RootState = ReturnType<typeof rootReducer>

// declare module 'react-redux' {
//     interface DefaultRootState extends RootState {}
// }