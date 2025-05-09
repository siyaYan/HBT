import React, { useState, useRef, useEffect } from "react";
import { View, Image, Dimensions, Animated, Easing } from "react-native";
import { Flex, Text, Button, NativeBaseProvider, HStack, Pressable } from "native-base";
import { SvgXml } from "react-native-svg";
import Background from "../components/Background";

// GIF imports from your assets
const gifs = [
  { id: 1, src: require("../assets/Instructions/Instruction_1.gif") },
  { id: 2, src: require("../assets/Instructions/Instruction_2.gif") },
  { id: 3, src: require("../assets/Instructions/Instruction_3.gif") },
  { id: 4, src: require("../assets/Instructions/Instruction_4.gif") },
];

const allPages = [
  // ...instructionData,
  ...gifs.map((gif) => ({
    title: null,
    description: null,
    svg: null,
    gif: gif.src,
  })),
];

const { width, height } = Dimensions.get("window");

const InstructionCards = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const orbitAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current; // For fading out the dot
  const skipButtonRef = useRef(null);

  useEffect(() => {
    // Run both orbit and fade animations in parallel
    Animated.parallel([
      // Faster orbit animation for 2 seconds
      Animated.timing(orbitAnim, {
        toValue: 1,
        duration: 2000, // Reduced to 2 seconds for faster orbit
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      // Fade animation starting after 1.5 seconds
      Animated.sequence([
        Animated.delay(1500), // Wait for 1.5 seconds
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500, // Fade out over 0.5 seconds
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      orbitAnim.setValue(0); // Reset orbit animation
      fadeAnim.setValue(0); // Ensure dot stays hidden
    });
  }, [orbitAnim, fadeAnim]);

  const handleNext = () => {
    if (currentIndex < allPages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate("Home");
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    navigation.navigate("Home");
  };

  const handleDotPress = (index) => {
    setCurrentIndex(index); // Navigate to the page corresponding to the dot
  };

  const handleCautionPress = () => {
    navigation.navigate("Home"); // Direct navigation to Home when dot is clicked
  };

  // SVG for the back arrow
  const backArrowSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
      <defs>
        <style>.cls-1{fill:#000;stroke-width:0px;}</style>
      </defs>
      <path class="cls-1" d="M36.43,42.47c-.46,0-.93-.13-1.34-.39L10.01,26.04c-.74-.47-1.18-1.30-1.15-2.18.03-.88.52-1.68,1.29-2.11l25.07-13.9c1.21-.67,2.73-.23,3.4.97.67,1.21.23,2.73-.97,3.4l-21.4,11.87 21.54,13.77c1.16.74,1.5,2.29.76,3.45-.48.75-1.28,1.15-2.11,1.15Z"/>
    </svg>`;

  // SVG for a small dot
  const dotSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
      <circle cx="3" cy="3" r="3" fill="#49a579"/>
    </svg>
  `;

  // Calculate orbit animation
  const radius = 30; // Orbit radius
  const translateX = orbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [
      0, // 0 deg
      radius, // 90 deg
      0, // 180 deg
      -radius, // 270 deg
      0, // 360 deg
    ],
  });

  const translateY = orbitAnim.interpolate({
    inputRange: [0, 0.25, 0.5, 0.75, 1],
    outputRange: [
      -radius, // 0 deg
      0, // 90 deg
      radius, // 180 deg
      0, // 270 deg
      -radius, // 360 deg
    ],
  });

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Background />

        {/* Full-screen content */}
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="space-between"
          flex={1}
          width={width}
          height={height}
        >
          {/* Top Navigation Bar with Animated Dot */}
          <HStack
            w="100%"
            justifyContent="space-between"
            alignItems="center"
            safeAreaTop
            px={5}
            pt={4}
            pb={2}
            zIndex={2}
          >
            <HStack space={3} alignItems="center">
              {currentIndex > 0 && (
                <Pressable onPress={handleBack}>
                  <SvgXml xml={backArrowSvg} width={24} height={24} />
                </Pressable>
              )}
            </HStack>
            <View style={styles.skipContainer} ref={skipButtonRef}>
              <Pressable onPress={handleSkip}>
                <Text
                  fontFamily="Regular Medium"
                  fontSize="lg"
                  color="#49a579"
                  textDecorationLine="underline"
                  right={5}
                >
                  Skip
                </Text>
              </Pressable>
              <Animated.View
                style={{
                  position: "absolute",
                  transform: [
                    { translateX },
                    { translateY },
                  ],
                  opacity: fadeAnim, // Apply fade animation
                  zIndex: 3,
                }}
              >
                <Pressable onPress={handleCautionPress} style={styles.cautionPressable}>
                  <SvgXml xml={dotSvg} width={10} height={10} />
                </Pressable>
              </Animated.View>
            </View>
          </HStack>

          {/* Instruction Content */}
          <Flex
            flex={1}
            width="100%"
            alignItems="center"
            justifyContent="center"
            padding={0}
            margin={0}
          >
            {allPages[currentIndex].gif ? (
              <Image
                source={allPages[currentIndex].gif}
                style={styles.fullScreenGif}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.card}>
                <SvgXml
                  xml={allPages[currentIndex].svg}
                  width={120}
                  height={120}
                  style={styles.svg}
                />
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  color="#333"
                  textAlign="center"
                  mt={6}
                  mb={4}
                >
                  {allPages[currentIndex].title}
                </Text>
                <Text
                  fontSize="xl"
                  color="#666"
                  textAlign="center"
                >
                  {allPages[currentIndex].description}
                </Text>
              </View>
            )}
          </Flex>

          {/* Progress Indicator with Navigation */}
          <Flex direction="row" justifyContent="center" mb={5}>
            {allPages.map((_, index) => (
              <Pressable
                key={index}
                onPress={() => handleDotPress(index)}
              >
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: index === currentIndex ? "#49a579" : "gray" },
                  ]}
                />
              </Pressable>
            ))}
          </Flex>

          {/* Next Button */}
          <Flex
            direction="row"
            alignItems="flex-end"
            justifyContent="center"
            width="100%"
            mb={20}
            px={5}
          >
            <Button
              width="90%"
              maxW="350"
              size="lg"
              rounded="30"
              shadow="6"
              bg="#49a579"
              _text={{
                color: "#f9f8f2",
                fontFamily: "Regular Medium",
                fontSize:"lg",
                textAlign: "center",
              }}
              _pressed={{
                bg: "emerald.600",
                _text: { color: "warmGray.50" },
              }}
              onPress={handleNext}
            >
              {currentIndex === allPages.length - 1 ? "Get started" : "Next"}
            </Button>
          </Flex>
        </Flex>
      </View>
    </NativeBaseProvider>
  );
};

const styles = {
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: "#f9f9f9",
  },
  skipContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  cautionPressable: {
    padding: 10, // Larger hit area for better clickability
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 30,
    width: "95%",
    maxWidth: 300,
    height: 500,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  fullScreenGif: {
    width: width,
    height: height,
    position: "absolute",
    bottom: 0,
    top: -40,
    zIndex: -1,
    resizeMode: "contain",
  },
  svg: {
    marginBottom: 40,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    marginBottom: 20,
  },
};

export default InstructionCards;