import AsyncStorage from "@react-native-async-storage/async-storage";

const key = 'logs'


const logsStorage = {
  async get(){
    try{
      const raw = await AsyncStorage.getItem(key)
      if(!raw){
        throw new Error('no saved')
      }
      const parsed = JSON.parse(raw)
      return parsed
    } catch (e){
      throw new Error('데이터 로딩실패')
    }
  },
  async set(data:any){
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data))
    } catch(e){
      throw new Error('데이터 저장실패')
    }
  }
}

export default logsStorage