import * as React from 'react';
import {Text} from 'react-native';
import { colors } from '../../assets/color';
import style from '../../assets/style/style';

type PropsType = {
  mm: number;
  ss: number;
  timeover: () => void;
  reset : boolean;
  setReset : (type:boolean) => void;
};

const Timer = ({mm, ss, timeover,reset,setReset}: PropsType) => {
  const [minutes, setMinutes] = React.useState<number>(mm);
  const [seconds, setSeconds] = React.useState<number>(ss);

  //타이머 시작
  React.useEffect(() => {
    const countdown = setInterval(() => {
        if (seconds > 0) {
        setSeconds(seconds - 1);
        }
        if (seconds === 0) {
        if (minutes === 0) {
            timeover();
            clearInterval(countdown);
        } else {
            setMinutes(minutes - 1);
            setSeconds(59);
        }
        }
    }, 1000);
    return () => clearInterval(countdown);
  }, [minutes, seconds]);

  React.useEffect(()=>{
    if(reset){
        setMinutes(mm);
        setSeconds(ss);
        setReset(false);
    }
  },[reset])

  return (
    <Text
      style={[style.text_sb,{
        color: colors.WHITE_COLOR,
        fontSize:15,
      }]}>
      ({minutes}:{seconds < 10 ? `0${seconds}` : seconds})
    </Text>
  );
};

export default Timer;
