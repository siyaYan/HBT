import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Heading,
  IconButton,
  Text,
  Button,
  NativeBaseProvider,
  Flex,
  View,
  ScrollView,
} from "native-base";
import { Pressable } from "react-native";
import { Avatar } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import OptionMenu from "../components/OptionMenu";
import Background from "../components/Background";
import { useFocusEffect } from "@react-navigation/native";
import { useRound } from "../context/RoundContext";

// TODO: change the layout to match the new ios version @Siya

const HomeScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  const { roundData, updateRoundData } = useRound();
  console.log("rounddata", roundData);
  useFocusEffect(
    useCallback(() => {
      console.log("call back", roundData);
      // This code runs when the tab comes into focus
      // console.log('Tab is in focus, userInfo:', userData);
    }, [userData, roundData]) // Depend on `userInfo` to re-run the effect when it changes or the tab comes into focus
  );
  console.log("rounddata after callback", roundData);

  const handleAvatarPress = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate("AccountStack", { screen: "Account" });
  };

  {
    /* Round */
  }
  //Navigation
  const startRound = () => {
    // Navigate to round configuration when pressed
    navigation.navigate("RoundStack", {
      screen: "RoundConfig",
      params: { emptyState: true },
    });
    console.log("Home page", roundData);
  };

  const handleRoundPress = (roundId) => {
    // console.log('function, roundinfo:', round);
    navigation.navigate("RoundStack", {
      screen: "RoundInfo",
      params: { roundId },
    });
    console.log("home page roundId", roundId);
  };

  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems="center">
        <OptionMenu navigation={navigation} />
        <Pressable onPress={handleAvatarPress}>
          <Box py="5" px="2" alignItems="center" justifyContent="center">
            {userData.avatar && userData.avatar.uri ? (
              <Avatar
                bg="white"
                mb="1"
                size="md"
                source={{ uri: userData.avatar.uri }}
              />
            ) : (
              <Avatar bg="white" mb="1" size="md" borderWidth={2}>
                <AntDesign name="user" size={30} color="black" />
              </Avatar>
            )}
            <Text fontFamily={"Regular"} fontSize="lg">
              {userData.data.nickname}
            </Text>
          </Box>
        </Pressable>
      </Flex>
      {/* Linda Sprint 4 Show round/s*/}

      <Flex direction="column" alignItems="center">
        {roundData?.data?.map((round, index) => (
          //<View key={round._id} >
          <Button
            key={index}
            title={"Round ${index+1}"}
            onPress={() => {
              handleRoundPress(round._id);
            }}
            rounded="30"
            // shadow="1"
            mt="5"
            width="80%"
            size="lg"
            style={{
              borderWidth: 1, // This sets the width of the border
              borderColor: "#49a579", // This sets the color of the border
            }}
            backgroundColor={round.status === "P" ? "rgba(102, 102, 255, 1)" : (round.status === "R" ? "rgba(102, 102, 255, 1)" : ((round.status === "A" ? "rgba(73, 165, 121, 1)":(round.status === "C" ? "rgba(249, 248, 242, 1)":"rgba(250,250,250,0.2)"))))}
            _text={{
              color: "#FFFFFF",
              fontFamily: "Regular Semi Bold",
              fontSize: "lg",
            }}
            _pressed={{
              bg: "rgba(102, 102, 255, 1)",
            }}
          >
            {round.name}
          </Button>
          // </View>
        ))}
        {/* Linda Sprint 4 Start a round*/}
        {(!roundData.data || roundData?.data?.length < 2) && (
          <Button
            onPress={startRound}
            rounded="30"
            // shadow="1"
            mt="5"
            width="80%"
            size="lg"
            style={{
              borderWidth: 1, // This sets the width of the border
              borderColor: "#49a579", // This sets the color of the border
            }}
            backgroundColor={"rgba(250,250,250,0.2)"}
            _text={{
              color: "#191919",
              fontFamily: "Regular Semi Bold",
              fontSize: "lg",
            }}
            _pressed={{
              bg: "#e5f5e5",
            }}
          >
            {roundData?.data?.length === 1
              ? "Plan the next round"
              : "Start a round"}
          </Button>
        )}
      </Flex>
    </NativeBaseProvider>
  );
};

export default HomeScreen;
