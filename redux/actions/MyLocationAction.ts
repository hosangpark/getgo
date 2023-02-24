import { types } from "../types";



export function updateMyLocation(data:any){
    const args = JSON.parse(data);
    return {
        type:types.UPDATE_MY_LOCATION,
        location1:args.location1,
        isLocAuth1:args.isLocAuth1,
        location2:args.location2,
        isLocAuth2:args.isLocAuth2,
        select_location : args.select_location
    };
}
export function select_loaction(data:any){
    const args = JSON.parse(data);
    return {
        type:types.SELECT_MY_LOCATION,
        select_location : args
    };
}
export function deleteLocation(data:any){
    const args = JSON.parse(data);
    return {
        type : types.DELETE_MY_LOCATION,
        location1:args.location1,
        isLocAuth1:args.isLocAuth1,
        select_location :args.select_location
    }
}
export function deleteAll(){
    return {
        type : types.DELETE_ALL,
    }
}
