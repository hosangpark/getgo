
//반복되는 interface가 많거나 따로 관리해야할때 여길 씁시다

import { ImageSourcePropType } from "react-native";

export interface SelectLangType{
    label : string;
    img : ImageSourcePropType ;
    value : string;
}

export type LocationType = {
    mt_lat : number,
    mt_log : number,
}
