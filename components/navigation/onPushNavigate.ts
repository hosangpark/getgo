import {StackNavigationProp} from '@react-navigation/stack';
// import {PushNavigationType, UserDataType} from '~/types/user';
import { Linking } from "react-native";

//전달받은 push message 정보를 파싱하여 전달받은 페이지로 이동하는 함수
export const onPushNavigate = (
  pushData: any,
  navigation: any,
  user?: any,
) => {
  if (!pushData) return null;
console.log('push ? ' , pushData)
  switch (pushData.intent) {
      case 'rptDetail':
        return navigation("FranchiseRequestDetail",{
          rpt_idx:pushData.idxx
        })
      case 'fChatDetail':
        return navigation("ChattingDetail",{
          room_idx: pushData.content_idx,
          name: pushData.content_idx2,
          use_seller : true,
        })
      case 'uChatDetail':
        return navigation("ChattingDetail",{
          room_idx: pushData.content_idx,
          name: pushData.content_idx2,
        })
      case 'fNotice':
        return navigation("NoticeDetail",{
            nt_idx : pushData.content_idx,
        })
      case 'fScore':
        return Linking.openURL('https://bangdream.co.kr/seller/evaluation_list.php');
      case 'reqDetail':
        return navigation("RequestDetail",{
          rqt_idx : pushData.content_idx,
        })
      case 'rptDetail':
        return navigation("FranchiseRequestDetail",{
          rpt_idx : pushData.content_idx,
        })
      case 'rptList':
        return navigation("FranchiseRequestList");
      case 'fMain':
        return navigation('FranchiseMain');
      
      
      // 예시 case === "push_type" ref_params 값을 전달받는 방식에 따라 파싱여부 및 pushNavigationType 수정 후 적용.
      // case 'notice':
      //     return navigation.navigate("Notice",{mt_id:user.id})
      // case 'chatAdd':
      // return navigation.setParams({
      //   id: remoteMessage.ref_idx,
      //   comt_idx_re: '',
      //   rel_idx: '',
      //   title: JSON.parse(remoteMessage.ref_param).comt_name,
      // });
      //스위치 종료
      default:
        return null;
  }
};
