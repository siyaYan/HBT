import React, { useRef, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const CongratsAnimation = ({ navigation }) => {
  return (
    // <NativeBaseProvider>
    <View style={stylesCongrats.animationContainer}>
      <LottieView
        autoPlay
        style={{
          height: 150,
          backgroundColor: "transparent",
        }}
        source={require("../assets/Animations/Congratualtions.json")}
      />
    </View>
    // </NativeBaseProvider>
  );
};

const stylesCongrats = StyleSheet.create({
  animationContainer: {
    backgroundColor: "#6666ff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export default CongratsAnimation;
