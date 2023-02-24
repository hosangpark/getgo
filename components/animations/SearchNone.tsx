import React from 'react';
import LottieView from 'lottie-react-native';

const SearchNone = () => {
  return (
    <LottieView 
        style={{width:102,height:102}}
        source={{uri:'https://assets9.lottiefiles.com/packages/lf20_pojzngga.json'}} autoPlay loop />
  )
};

export default SearchNone;