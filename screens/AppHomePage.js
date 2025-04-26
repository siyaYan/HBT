import React, { useState, useRef, useEffect } from "react";
import { View, Animated, TouchableOpacity, Dimensions } from "react-native";
import {
  Box,
  Flex,
  Text,
  Button,
  NativeBaseProvider,
} from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import Background from "../components/Background";
import { habitList, habitCategory } from "../components/HabitList";
import { SvgXml } from "react-native-svg";
import { IconButton } from "native-base";

const { width, height } = Dimensions.get("window");

const AppHomeScreen = ({ navigation }) => {
  const { userData } = useData();
  const [habit, setHabit] = useState("Tap the button to get a healthy habit!");
  const fadeAnims = useRef([...Array(5)].map(() => new Animated.Value(0))).current;
  const borderSpinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const boxColorAnim = useRef(new Animated.Value(0)).current;
  const [backgroundHabits, setBackgroundHabits] = useState([]);
  const animationTimeouts = useRef([]);

  const generateHabits = () => {
    let newHabits = [];
    let usedPositions = [];
    let availableHabits = [...habitCategory];

    for (let i = availableHabits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableHabits[i], availableHabits[j]] = [availableHabits[j], availableHabits[i]];
    }

    const habitCount = Math.min(5, availableHabits.length);
    const centralAreaTop = height * 0.35;
    const centralAreaBottom = height * 0.65;
    const bottomAreaTop = height * 0.85;
    const centralWidth = width * 0.85;
    const sideMargin = (width - centralWidth) / 2;

    for (let i = 0; i < habitCount; i++) {
      let habitText = availableHabits[i];
      let x, y;
      let attempts = 0;
      let positionFound = false;

      do {
        const region = Math.random();
        if (region < 0.5) {
          x = Math.random() * (width - 150);
          y = Math.random() * (centralAreaTop - 50);
        } else {
          x = region < 0.75 
            ? Math.random() * sideMargin 
            : width - sideMargin + Math.random() * sideMargin;
          y = Math.random() * (bottomAreaTop - 50);
        }

        attempts++;
        positionFound = !(
          usedPositions.some(
            (pos) => Math.abs(pos.x - x) < 120 && Math.abs(pos.y - y) < 80
          ) ||
          (x > sideMargin && x < width - sideMargin && y > centralAreaTop && y < centralAreaBottom) ||
          (x > sideMargin && x < width - sideMargin && y > bottomAreaTop)
        );
      } while (!positionFound && attempts < 50);

      if (!positionFound) {
        x = i % 2 === 0 ? sideMargin / 2 : width - sideMargin / 2 - 150;
        y = 50 + i * 50;
      }

      usedPositions.push({ x, y });
      newHabits.push({ text: habitText, x, y });
    }

    setBackgroundHabits(newHabits);
  };

  const startRandomAnimations = () => {
    fadeAnims.forEach((anim, index) => {
      const animate = () => {
        Animated.sequence([
          Animated.timing(anim, { toValue: 1, duration: 3000, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 3000, useNativeDriver: true }),
        ]).start(() => {
          const timeout = setTimeout(animate, Math.floor(Math.random() * 8000) + 4000);
          animationTimeouts.current[index] = timeout;
        });
      };
      const initialTimeout = setTimeout(animate, Math.random() * 4000);
      animationTimeouts.current[index] = initialTimeout;
    });
  };

  useEffect(() => {
    generateHabits();
    startRandomAnimations();

    return () => {
      animationTimeouts.current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  const getNewHabit = () => {
    // Reset animations
    textAnim.setValue(0);
    boxColorAnim.setValue(0);
    borderSpinAnim.setValue(0);

    // Border spin (smoother, multi-rotation)
    Animated.timing(borderSpinAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Button bounce (spring for tactile feel)
    Animated.spring(scaleAnim, {
      toValue: 1.15,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }).start();
    });

    // Box background color flash
    Animated.sequence([
      Animated.timing(boxColorAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(boxColorAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();

    // Text pulse animation
    Animated.timing(textAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Rapid habit selection (reduced to 5 cycles)
    let rollIndex = 0;
    const interval = setInterval(() => {
      if (rollIndex < 5) {
        setHabit(habitList[Math.floor(Math.random() * habitList.length)]);
        rollIndex++;
      } else {
        clearInterval(interval);
        setHabit(habitList[Math.floor(Math.random() * habitList.length)]);
        Animated.timing(textAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }, 150);
  };

  const borderSpin = borderSpinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"], // Multi-rotation for flair
  });

  const textPulse = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const textScale = textAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  const boxBackgroundColor = boxColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255,255,255,0.95)", "#e6f4ea"],
  });

  const backgroundHabitRotation = fadeAnims.map((anim) =>
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: ["-5deg", "5deg"],
    })
  );

  const instructionsSvg = () => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#49a579">
      <path d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
    </svg>
  `;

  return (
    <NativeBaseProvider>
      <View style={styles.mainContainer}>
        <Background />
        {backgroundHabits.map((item, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.backgroundHabit,
              {
                left: item.x,
                top: item.y,
                opacity: fadeAnims[index],
                transform: [{ rotate: backgroundHabitRotation[index] }],
              },
            ]}
          >
            {item.text}
          </Animated.Text>
        ))}

        {/* Instructions Button */}
        <Flex
          position="absolute"
          top={20}
          right={10}
          zIndex={2}
        >
          <IconButton
            icon={<SvgXml xml={instructionsSvg()} width={28} height={28} />}
            onPress={() => navigation.navigate("Intro")}
          />
        </Flex>

        {/* Center content */}
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          flex={1}
          position="absolute"
          top={-70}
          bottom={0}
          left={0}
          right={0}
        >
          <Box w="90%" maxW="350" alignItems="center">
            <Animated.View style={[styles.habitBox, { backgroundColor: boxBackgroundColor }]}>
              <Animated.Text
                style={[
                  styles.habitText,
                  {
                    opacity: textPulse,
                    transform: [{ scale: textScale }],
                  },
                ]}
              >
                {habit}
              </Animated.Text>
            </Animated.View>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={getNewHabit}
              activeOpacity={0.9}
            >
              <Animated.View
                style={[
                  styles.buttonBorder,
                  { transform: [{ rotate: borderSpin }] },
                ]}
              />
              <Animated.View
                style={[
                  styles.button,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              >
                <Ionicons name="refresh" size={24} color="white" />
              </Animated.View>
            </TouchableOpacity>
          </Box>
        </Flex>

        {/* Bottom login button */}
        <Flex
          direction="row"
          alignItems="flex-end"
          justifyContent="center"
          position="absolute"
          bottom={20}
          left={0}
          right={0}
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
            onPress={() => navigation.navigate("LoginStack", { screen: "Login" })}
          >
            Login to start!
          </Button>
        </Flex>
      </View>
    </NativeBaseProvider>
  );
};

const styles = {
  mainContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundHabit: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.3)", // Slightly more visible
    textAlign: "center",
    width: 150,
    zIndex: 0,
    pointerEvents: "none",
  },
  habitBox: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 50,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 1,
  },
  habitText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: -120,
    width: 70,
    height: 70,
    zIndex: 1,
  },
  buttonBorder: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#3d8c63",
    borderStyle: "dashed",
    opacity: 0.8,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#49a579",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
};

export default AppHomeScreen;