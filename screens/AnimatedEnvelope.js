import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { View, Button, Modal, Text, NativeBaseProvider } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedEnvelope = ({ navigation }) => {
  const [isOpened, setIsOpened] = useState(false);

  const handlePress = () => {
    setIsOpened(true);
    console.log("isOpened", isOpened);
  };

  const handleClose = () => {
    setIsOpened(false);
    console.log("isOpened", isOpened);
  };

  const animation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(animation.value) }],
    };
  });

  const triggerAnimation = () => {
    animation.value = 0; // Reset to initial position
    animation.value = withSpring(10, { stiffness: 300, damping: 5 }); // Shaking effect
  };

  useEffect(() => {
    triggerAnimation();
  }, []);

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <TouchableOpacity onPress={handlePress}>
          <Icon name="envelope" size={50} color="#666" />
        </TouchableOpacity>
        <Modal isOpen={isOpened} onClose={handleClose} animationType="slide">
          <View style={styles.modalContent}>
            <Text>This is the popup content</Text>
            <Button onPress={handleClose}>Close</Button>
          </View>
        </Modal>
      </View>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
});

export default AnimatedEnvelope;
