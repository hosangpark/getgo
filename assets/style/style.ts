import { StyleSheet } from "react-native";
import { colors } from "../color";


//공통적으로 사용할것 같은 스타일은 여기 작성해주세요.
//해당페이지에서만 사용할 스타일은 해당페이지에 create해서 사용하셔도 됩니다.
const style = StyleSheet.create({
    text_li : {
        fontFamily:'Pretendard-Light'
    },
    text_re : {
        fontFamily:'Pretendard-Regular'
    },
    text_me : {
        fontFamily:'Pretendard-Medium'
    },
    text_sb: {
        fontFamily:'Pretendard-SemiBold'
    },
    text_b : {
        fontFamily:'Pretendard-Bold'
    },
    default_background : {
        backgroundColor:'#fff',
        flex:1,
    },
    lang_sel_back : {
        borderRadius:25,
        backgroundColor:colors.GRAY_COLOR_1,
        paddingHorizontal:20,
        paddingVertical:5,
    },
    vertical_line : {
        borderLeftColor:colors.GRAY_LINE,
        borderLeftWidth:1,

    },
    sel_arrow : {
        width:15,
        height:8,
    },
    lang_icon : {
        width:25,
        height:25,
    },
    custom_button : {
        width:'100%',
        height:54,
        backgroundColor:colors.GREEN_COLOR_2,
        borderRadius:5
    },
    default_font_black : {
        fontSize:15,
        fontWeight:'bold',
        color:'black',
    },
    default_font_white : {
        fontSize:15,
        fontWeight:'bold',
        color:'white',
    },
    header_ : {
        height: 50,
        alignItems : 'center',
        flexDirection : 'row',
        justifyContent : 'center'
    },
    input_container : {
        borderColor:colors.GRAY_LINE,
        borderWidth:1,
        borderRadius:6,
        height:45,
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:20,
    },
    gray_box : {
        backgroundColor:colors.GRAY_COLOR_1,
        padding:20,
    },
    green_button:{
        height:60,
        backgroundColor:colors.GREEN_COLOR_2,
        borderWidth:1,
        borderColor:colors.GREEN_COLOR_2,
        borderRadius:6,
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:20,
    },
    white_button_gb:{
        height:60,
        backgroundColor:colors.WHITE_COLOR,
        borderWidth:1,
        borderColor:colors.GREEN_COLOR_2,
        borderRadius:6,
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:20,
    },
    bottom_wrapper : {
        height:'auto',
    },
    bottom_btn : {
        height:60,
        alignItems:'center',
        justifyContent:'center',
    },
    bottom_btn_green : {
        backgroundColor:colors.GREEN_COLOR_2,
    },
    bottom_btn_gray : {
        backgroundColor:colors.GRAY_COLOR_3,
    },
})

export default style;