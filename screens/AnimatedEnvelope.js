import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
// import { , Modal, Text, Button } from "react-native";
import { FontAwesome } from '@expo/vector-icons';

import {
  View,
  Button,
  Modal,Text
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedEnvelope = ({ onPress }) => {
  const [isOpened, setIsOpened] = useState(false);

  const handlePress = () => {
    setIsOpened(true);
  };

  const handleClose = () => {
    setIsOpened(false);
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
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress}>
        <FontAwesome name="envelope" size={50} color="#666" />
      </TouchableOpacity>
      <Modal visible={isOpened} animationType="slide" style={{ margin: 50 }}>
        <View style={styles.modalContent}>
          <Text>This is the popup content</Text>
          <Button title="Close" onPress={handleClose} />
        </View>
      </Modal>
    </View>
    // <View>
    //   <TouchableOpacity style={styles.container} onPress={handlePress}>
    //     <Animated.View style={[styles.iconContainer, animatedStyle]}>
    //       <Icon
    //         name="envelope"
    //         size={300}
    //         color="#666"
    //         style={{ width: 300, height: 300 }}
    //       />
    //     </Animated.View>
    //   </TouchableOpacity>
    //   <Modal visible={isOpened} animationType="slide">
    //   <View style={styles.modalContent}>
    //   <Text>This is the popup content</Text>

    //       <Button title="Close" onPress={handleClose} />
    //     </View>
    //   </Modal>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    // backgroundColor: '#f9f8f2', // Background color of the envelope component
    backgroundColor: "transparent", // Set background to transparent
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  iconContainer: {
    margin: 0,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
});


export default AnimatedEnvelope;
