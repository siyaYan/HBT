import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Animated } from "react-native";
import { Button, Center } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { updateRoundhabit } from "../components/Endpoint";
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";
import { habitList } from "../components/HabitList";

const RoundHabit = ({ route, navigation }) => {
  const [text, setText] = useState("");
  const { userData } = useData();
  const { roundData, insertRoundData } = useRound();

  // Animation refs
  const rollAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const { id: roundId, state: fromNew } = route.params || {};

  const thisRoundData = roundData.data.filter((item) => item._id == roundId)[0];
  const meInRound = thisRoundData.roundFriends.filter(
    (item) => item.id == userData.data._id
  )[0];
  const myHabit = meInRound.habit;

  // Persist text across navigation
  useEffect(() => {
    if (myHabit) {
      setText(myHabit); // Load the existing habit when the component mounts
    }
  }, [myHabit]);

  const handleSubmit = async () => {
    const res = await updateRoundhabit(userData.token, thisRoundData._id, text);
    const updatedUser = {
      ...meInRound,
      habit: text,
    };
    const updatedRoundFriends = thisRoundData.roundFriends.map((friend) =>
      friend.id === updatedUser.id ? updatedUser : friend
    );
    const updatedRound = {
      ...thisRoundData,
      roundFriends: updatedRoundFriends,
    };
    insertRoundData(updatedRound);
    if (fromNew) {
      navigation.navigate("RoundStack", {
        screen: "RoundInfo",
        params: { id: roundId, state: true },
      });
    }
  };

  const getRandomHabit = () => {
    const rollDuration = 70;

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
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
        setText(habitList[Math.floor(Math.random() * habitList.length)]);
        rollIndex++;
      } else {
        clearInterval(interval);
        setText(habitList[Math.floor(Math.random() * habitList.length)]);
      }
    }, 100); // Faster rolling for better UX
  };

  return (
    <View style={styles.container}>
      <Center w="90%" h="100%">
        <Text style={styles.label}>What would you like to do?</Text>
        <Text style={styles.instructionText}>
          Submit your own or press the button on the right so we randomly
          generate one for you.
        </Text>
        <Animated.View
          style={[
            styles.inputContainer,
            {
              transform: [
                {
                  translateY: rollAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 5],
                  }),
                },
              ],
            },
          ]}
        >
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder={myHabit || "Enter your habit"}
          />
          <Animated.View
            style={[
              styles.randomButton,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Button
              onPress={getRandomHabit}
              bg="#49a579"
              p={1}
              borderRadius={30}
            >
              <Ionicons name="refresh" size={20} color="white" />
            </Button>
          </Animated.View>
        </Animated.View>
        <Button
          variant="info"
          onPress={handleSubmit}
          width="95%"
          rounded={30}
          size="lg"
          bg="#49a579"
          _text={{
            color: "#f9f8f2",
            fontFamily: "Regular Medium",
            fontSize: "lg",
          }}
          _pressed={{ bg: "#3c7d5e" }}
        >
          Save my habit
        </Button>
        {/* Display text at absolute bottom */}
        <View style={styles.displayTextContainer}>
          <Text style={styles.displayText}>{text}</Text>
        </View>
      </Center>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    padding: 16,
    transform: [{ translateY: -25 }],
  },
  label: {
    fontSize: 25,
    marginBottom: 5,
    fontFamily: "Regular Semi Bold",
    color: "#191919",
  },
  inputContainer: {
    width: "95%",
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontFamily: "Regular Medium",
    fontSize: 15,
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    padding: 8,
    paddingRight: 50, // Space for the button
    borderRadius: 30,
  },
  randomButton: {
    position: "absolute",
    right: 10,
  },
  displayTextContainer: {
    position: "absolute",
    top: 600, // Adjusted to ensure visibility above potential navigation bars
    width: "100%",
    alignItems: "center",
  },
  displayText: {
    fontSize: 16,
    color: "rgba(25, 25, 25, 0.5)", // 50% transparency
    textAlign: "center",
    fontFamily: "Regular Medium",
    lineHeight: 20, // Consistent line spacing
    width: "100%", // Full width of container
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 30,
    color: "rgba(25, 25, 25, 0.5)", // 50% transparency
    textAlign: "center",
    fontFamily: "Regular Medium",
  },
});

export default RoundHabit;
