import React, { useState } from "react";
import { View, Image, Dimensions } from "react-native";
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

// Instruction data for first 4 pages, referencing "Habit Rulet"
const instructionData = [
    {
      title: "Welcome!",
      description: "You are about to embark on a journey to seek and build your desired lifestyle.",
      svg: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#49a579">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92c-.72.73-1.17 1.33-1.17 2.33h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
      `,
    },
    {
      title: "Explore",
      description: "Discover new habits to try with Habit Rulet.",
      svg: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#49a579">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 14v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V6h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      `,
    },
    {
      title: "Accountability",
      description: "Support your friends in maintaining their streaks.",
      svg: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#49a579">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      `,
    },
    {
      title: "Succeed",
      description: "Achieve success together—it’s easier that way!",
      svg: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#49a579">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
        </svg>
      `,
    },
  ];

// Combine instruction data with GIF-only "How To" pages
const allPages = [
  ...instructionData,
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

  // SVG for the back arrow
  const backArrowSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
      <defs>
        <style>.cls-1{fill:#000;stroke-width:0px;}</style>
      </defs>
      <path class="cls-1" d="M36.43,42.47c-.46,0-.93-.13-1.34-.39L10.01,26.04c-.74-.47-1.18-1.30-1.15-2.18.03-.88.52-1.68,1.29-2.11l25.07-13.9c1.21-.67,2.73-.23,3.4.97.67,1.21.23,2.73-.97,3.4l-21.4,11.87 21.54,13.77c1.16.74,1.5,2.29.76,3.45-.48.75-1.28,1.15-2.11,1.15Z"/>
    </svg>`;

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
          {/* Top Navigation Bar */}
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
            <Pressable onPress={handleSkip}>
              <Text
                fontFamily="Regular Medium"
                fontSize="lg"
                color="#49a579"
                textDecorationLine="underline"
              >
                Skip
              </Text>
            </Pressable>
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

          {/* Progress Indicator */}
          <Flex direction="row" justifyContent="center" mb={5}>
            {allPages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: index === currentIndex ? "#49a579" : "gray" },
                ]}
              />
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
                fontSize: "lg",
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