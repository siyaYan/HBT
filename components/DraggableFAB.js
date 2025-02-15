import React, { useRef,useState } from "react";
import { Animated, PanResponder, StyleSheet, Dimensions } from "react-native";
import { Pressable } from "react-native";
import { SvgXml } from "react-native-svg";

const { width, height } = Dimensions.get("window"); // Get screen dimensions
const BOUNDARY_PADDING = 50; // Padding from edges

const DraggableFAB = ({ onUpload }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // onPanResponderMove: Animated.event(
      //   [null, { dx: pan.x, dy: pan.y }],
      //   { useNativeDriver: false }
      // ),
      onPanResponderMove: (_, gesture) => {
        Animated.event(
          [null, { dx: pan.x, dy: pan.y }],
          { useNativeDriver: false }
        )(null, {
          dx: Math.max(BOUNDARY_PADDING, Math.min(width - 50, gesture.dx)),
          dy: Math.max(BOUNDARY_PADDING, Math.min(height - 50, gesture.dy)),
        });
      },
      onPanResponderRelease: () => {
        // Optionally add snapping logic here
        
      },
    })
  ).current;
  
  return (
      <Animated.View
        style={[styles.fab, { transform: pan.getTranslateTransform() }]}
        {...panResponder.panHandlers}
      >

        <Pressable accessibilityLabel="Upload button" onPress={onUpload}>
          <SvgXml
            xml={UploadPost}
            width={50} // Larger icon width
            height={50} // Larger icon height
            style={{
              fill: "#6666ff", // Icon color
            }}
          />
        </Pressable>
      </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: "absolute",
    bottom: 100, // Adjust position as needed
    right: 20, // Adjust position as needed
    width: 90, // Increased size for a larger button
    height: 90, // Keep it square for a circular shape
    borderRadius: 50, // Fully rounded
    backgroundColor: "white", // Button background color
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12, // Floating effect
  },
});

export default DraggableFAB;

const UploadPost = `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#000;stroke-width:0px;}</style></defs><path class="cls-1" d="M46.62,31.09c0-5.63-3.58-10.43-8.57-12.28-.52-6.75-6.17-12.08-13.05-12.08s-12.53,5.33-13.05,12.08c-5,1.85-8.57,6.65-8.57,12.28,0,.01,0,.03,0,.04h0v.85c0,1.56,1.27,2.83,2.83,2.83h10.47c1.02,0,1.84-.82,1.84-1.84s-.82-1.84-1.84-1.84H7.06s0-.03,0-.04c0-3.66,2.11-6.84,5.17-8.39,1.08-.55,2.28-.89,3.54-.99-.12-.61-.19-1.23-.19-1.88s.06-1.22.18-1.8c.84-4.33,4.67-7.62,9.24-7.62s8.4,3.28,9.24,7.62c.11.58.18,1.19.18,1.8s-.07,1.27-.19,1.88c1.27.09,2.46.44,3.54.99,3.06,1.56,5.17,4.73,5.17,8.39,0,.01,0,.03,0,.04h-9.62c-1.02,0-1.84.82-1.84,1.84s.82,1.84,1.84,1.84h10.47c1.56,0,2.83-1.27,2.83-2.83v-.85h0s0-.03,0-.04Z"/><path class="cls-1" d="M32.64,27.81c.79-.64.9-1.8.26-2.59l-6.76-8.24c-.36-.44-.9-.69-1.46-.67-.56.01-1.09.28-1.43.73l-6.2,8.24c-.61.81-.45,1.97.36,2.58.33.25.72.37,1.1.37.56,0,1.11-.25,1.47-.73l3.17-4.21v17.2c0,1.02.82,1.84,1.84,1.84s1.84-.82,1.84-1.84v-16.84l3.21,3.92c.64.79,1.8.9,2.59.26Z"/></svg>`;
