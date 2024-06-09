import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import LottieView from 'lottie-react-native';

const SplashAnimationScreen = ({ navigation }) => {
  return (
    // <NativeBaseProvider>
    <View >
      <LottieView
        autoPlay
        style={{
          width: 200,
          height: 200,
          backgroundColor: '#eee',
        }}
        source={require("../assets/Animations/Splash.json")}
      />
    </View>
    // </NativeBaseProvider>
  );
}

export default SplashAnimationScreen;
