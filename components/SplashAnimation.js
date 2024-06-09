import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const SplashAnimationScreen = ({ navigation }) => {
  return (
    // <NativeBaseProvider>
    <View style={stylesSplash.animationContainer} >
      <LottieView
        autoPlay
        style={{
          width: 250,
          height: 250,
          backgroundColor: 'transparent',
        }}
        source={require("../assets/Animations/Splash.json")}
      />
    </View>
    // </NativeBaseProvider>
  );
}

const stylesSplash = StyleSheet.create({
  animationContainer: {
    backgroundColor: '#6666ff',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  
});

export default SplashAnimationScreen;