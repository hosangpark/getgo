import { TextInputProps } from "react-native";

export interface BackHandlerType{
    goHome?:boolean;
    noRetrun? : boolean;
}
export interface BackHeaderType{
    title : String;
}
export interface MessageHeaderType{
    title : String;
}
export interface NotificationHeaderType{
    title : String;
}
export interface MypageHeaderType{
    title : String;
}
export interface MessageRoomType{
    title : String;

}

export interface QuestionHeaderType{
    title : String
    subtitle : String
    action: ()=>void;
}

export interface SearchHeaderType{
    value : string;
    setValue : (value:string) => void;
}

export interface LocationHeaderType{
    value : string;
    setValue : (value:string) => void;
    searchPlace? : ()=>void;
}

export interface OptionType{ //휴대폰 타입
    label : String;
    value : String;
    sel_id: number
}
export interface ReserveOptionType{
    label : String;
    value : String;
}
export interface CategoryOptionType{
    label : String;
    value : String;
    sel_id: number
}

export interface FileType { //파일선택 타입
    uri: string;
    type: string;
    name: string;
  }

export interface SelectBoxType{ //select dropbox 타입
    selOption : CategoryOptionType;
    options : CategoryOptionType[];
    height: number;
    paddingVertical: number;
    action : (item:CategoryOptionType) => void;
    overScrollEnable:()=>void
}

export interface Reserve_SelectBoxType{
    selOption : ReserveOptionType;
    options : ReserveOptionType[];
    action : (item:ReserveOptionType) => void;
}

export type InputBoxType = {
    value : string;
    onChangeText : (text:string) => void;
    placeHolder : string;
}

export type CustomButtonType = {
    buttonType : string; //버튼 색상
    title : string;
    action : () => void;
    disable : boolean;
}
export type CustomTabType = {
    title1 : string;
    title2 : string;
    action : () => void
}

export type ProductItemType = {
    pt_idx: number,
    profileimg: any,
    pt_title : string,
    pt_area:string,
    ct_name: string,
    pt_lat: string,
    pt_lon: string,
    description: string,
    pt_selling_price: number,
    pt_sale_now: string,
    pt_hit: number,
    pt_chat: number,
    pt_wish: number,
    wish_cnt:number
    pt_wdate:string,
    pt_image1: string,
    rt_idx:number
    ot_idx:number
    wp_idx:number
}
export type ChatItemType = {
    chr_id:number,
    ctt_id:string,
    crt_last_date:string | null,
    ctt_push: string,
    mt_idx: number,
    mt_image1: null,
    ctt_msg: null,
    mt_nickname: string,
    mt_area: string
}
export type ReviewItemType = {
    mt_nickname:string,
    rt_idx:number,
    rt_content:string,
    pt_area:string,
    rt_wdate:string,
    review_image1:string,
    review_nickname:string,
}
export type ReviewItemDetailType = {
    rt_content:string,
    rt_idx:number,
    pt_image1:string,
    pt_title:string,
    mt_nickname:string,
}

export interface PaginationType {
    postsPerPage:number
    totalPosts:number
    paginate : (e:number)=>void
  }
export interface QuestionDataType {
ft_idx:number,
ft_title:string,
}

// export type ProductSaledListType ={
//     Remove:()=>void , 
//     Modify:()=>void ,
// }

export type UploadItemType = {
    id: number,
    deletepicture: boolean,
}

export type Alert_DataType = {
    alert_type:string,
    text:string,
    time:string,
}

export type CategoryType = {
    ct_idx: number,
    ct_name: string,
    ct_file1: string,
}

export type SlickSlideType = {
    imageheight: number,
    gofullscreen:() => void
    SlideImage: any
}

export type ReviewDataType = {
    profileimg: any,
    nickname : string,
    district:string,
    uploadtime: string,
    reviewtext: string,
}

export type AnnounceDataType = {
    id: number,
    titletype: string,
    date:string,
    title:string,
    text: string,
}

export interface InquiryDetailData {
    qt_answer:null | string,
    qt_idx:number,
    qt_title:string,
    qt_content:string,
    qt_file1:null | string,
    qt_file2:null | string,
    qt_file3:null | string,
    qt_file4:null | string,
    qt_file5:null | string,
    qt_file6:null | string,
    qt_file7:null | string,
    qt_file8:null | string,
    qt_file9:null | string,
    qt_file10:null | string,
  }

export interface ChoiceType{
id:number,
image:string,
title:string
}