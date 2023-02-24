import {rootReducer} from '../reducers/index';
import { createStore,applyMiddleware, compose } from 'redux';
import { configureStore } from '@reduxjs/toolkit'
// import {authApi} from './slices/service/auth';


export default function initStore() {
    const store = configureStore({
        reducer:rootReducer,
        middleware: getDefaultMiddleware =>
        getDefaultMiddleware({serializableCheck: false}).concat(

            ),
        // composeWithDevTools(),
    });
    return store;
}
