import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const LoadingAnimationScreen = ({ navigation }) => {
  return (
    // <NativeBaseProvider>
    <View Loadingstyle={stylis.animationContainer}>
      <LottieView
        autoPlay
        style={{
          width: 250,
          height: 250,
          backgroundColor: "transparent",
        }}
        source={require("../assets/Animations/loadingDots.json")}
      />
    </View>
    // </NativeBaseProvider>
  );
};

const Loadingstyle = StyleSheet.create({
  animationContainer: {
    backgroundColor: "#transparent",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export default LoadingAnimationScreen;
