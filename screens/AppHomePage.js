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

const { width, height } = Dimensions.get("window");

const AppHomeScreen = ({ navigation }) => {
  const { userData } = useData();
  const [habit, setHabit] = useState("Tap the button to get a healthy habit!");
  const fadeAnims = useRef([...Array(5)].map(() => new Animated.Value(0))).current;
  const rollAnim = useRef(new Animated.Value(0)).current;
  const borderSpinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
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
    const centralAreaTop = height * 0.35; // Adjusted for middle content
    const centralAreaBottom = height * 0.65; // Adjusted for middle content
    const bottomAreaTop = height * 0.85; // Reserve bottom for login button
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
          // Top region (above center)
          x = Math.random() * (width - 150);
          y = Math.random() * (centralAreaTop - 50);
        } else {
          // Side regions (left/right, avoid bottom)
          x = region < 0.75 
            ? Math.random() * sideMargin 
            : width - sideMargin + Math.random() * sideMargin;
          y = Math.random() * (bottomAreaTop - 50); // Avoid bottom button area
        }

        attempts++;
        positionFound = !(
          usedPositions.some(
            (pos) => Math.abs(pos.x - x) < 120 && Math.abs(pos.y - y) < 80
          ) ||
          (x > sideMargin && x < width - sideMargin && y > centralAreaTop && y < centralAreaBottom) || // Avoid middle
          (x > sideMargin && x < width - sideMargin && y > bottomAreaTop) // Avoid bottom
        );
      } while (!positionFound && attempts < 50);

      if (!positionFound) {
        x = i % 2 === 0 ? sideMargin / 2 : width - sideMargin / 2 - 150;
        y = 50 + i * 50; // Fallback in top safe area
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
          Animated.timing(anim, { toValue: 1, duration: 4000, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0, duration: 4000, useNativeDriver: true }),
        ]).start(() => {
          const timeout = setTimeout(animate, Math.floor(Math.random() * 10000) + 5000);
          animationTimeouts.current[index] = timeout;
        });
      };
      const initialTimeout = setTimeout(animate, Math.random() * 5000);
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
    const rollDuration = 70;

    Animated.timing(borderSpinAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start(() => {
      borderSpinAnim.setValue(0);
    });

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.1, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    Animated.timing(rollAnim, {
      toValue: 1,
      duration: rollDuration,
      useNativeDriver: true,
    }).start(() => {
      rollAnim.setValue(0);
    });

    let rollIndex = 0;
    const interval = setInterval(() => {
      if (rollIndex < 8) {
        setHabit(habitList[Math.floor(Math.random() * habitList.length)]);
        rollIndex++;
      } else {
        clearInterval(interval);
        setHabit(habitList[Math.floor(Math.random() * habitList.length)]);
      }
    }, 200);
  };

  const borderSpin = borderSpinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <NativeBaseProvider>
      <View style={styles.mainContainer}>
        <Background />
        {backgroundHabits.map((item, index) => (
          <Animated.Text
            key={index}
            style={[
              styles.backgroundHabit,
              { left: item.x, top: item.y, opacity: fadeAnims[index] },
            ]}
          >
            {item.text}
          </Animated.Text>
        ))}

        {/* Center content */}
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          flex={1}
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
        >
          <Box w="90%" maxW="350" alignItems="center">
            <View style={styles.habitBox}>
              <Animated.Text
                style={[
                  styles.habitText,
                  {
                    transform: [
                      {
                        translateY: rollAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 10],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {habit}
              </Animated.Text>
            </View>
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
          bottom={20} // Margin from bottom
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
    color: "rgba(0, 0, 0, 0.2)",
    textAlign: "center",
    width: 150,
    zIndex: 0,
    pointerEvents: "none",
  },
  habitBox: {
    backgroundColor: "rgba(255,255,255,0.95)",
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
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 70, // Smaller size
    height: 70,
    zIndex: 1,
  },
  buttonBorder: {
    position: "absolute",
    width: 80, // Slightly larger than button
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