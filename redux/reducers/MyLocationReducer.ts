import { myLocationType } from "../../components/types/reduxTypes";
import { types } from "../types";


const defaultState: any = {
    location1: {
        mt_area: '',
        mt_address: '',
        mt_lat: '',
        mt_log: '',
        mat_status: '',
        mat_idx: ''
    }
    ,
    isLocAuth1: false,
    location2: {
        mt_area: '',
        mt_address: '',
        mt_lat: '',
        mt_log: '',
        mat_status: '',
        mat_idx: ''
    },
    isLocAuth2: false,
    select_location: 0,
}

export const MyLocation = (prevState: any, action: any) => {
    // For Debugger
    switch (action.type) {
        case types.UPDATE_MY_LOCATION:
            return {
                ...defaultState,
                location1: action.location1,
                isLocAuth1: action.isLocAuth1,
                location2: action.location2,
                isLocAuth2: action.isLocAuth2,
                select_location: action.select_location,
            };
        case types.SELECT_MY_LOCATION:

            return {
                ...prevState,
                select_location: action.select_location,
            };
        case types.DELETE_MY_LOCATION:
            return {
                ...defaultState,
                location1: action.location1,
                isLocAuth1: action.isLocAuth1,
                location2: defaultState.location2,
                isLocAuth2: defaultState.isLocAuth2,
                select_location: "1",
            };
        case types.DELETE_ALL:
            return defaultState;
        default:
            return defaultState;
    }
};

