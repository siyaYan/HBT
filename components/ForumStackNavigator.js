import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "native-base";
import ForumPage from "../screens/ForumPage";
import ForumDraft from "../screens/ForumDraft";
import { useRound } from "../context/RoundContext";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

const Stack = createStackNavigator();
export default function ForumStackNavigator({ route, navigation }) {
  const { acceptRoundData } = useRound();
  // const roundId = route.params.id;
  const { id: roundId } = route.params.params || {}; // Use optional chaining to prevent crashes if params are missing

  const activeRound = acceptRoundData?.data.filter(
    (item) => item.status === "A"
  )[0];

  const firstTwoFinishRounds = acceptRoundData?.data
    .filter((item) => item.status === "F")
    .slice(0, 2);
  // Calculate how many days are left
  const today = new Date();
  const startDate = new Date(activeRound?.startDate);

  // Get the difference in milliseconds
  const timeDifference = Math.abs(today - startDate);

  // Convert milliseconds to days
  const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  // Adjust daysLeft based on level if needed
  const finalDaysLeft = Math.abs(daysLeft - activeRound?.level);
  // console.log(finalDaysLeft);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ForumDraft"
        component={ForumDraft}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {activeRound?.name}
              </Text>
              <Text style={{ fontSize: 14, textAlign: "center" }}>
                {finalDaysLeft} days to go
              </Text>
            </View>
          ),
          headerLeft: () => (
            <IconButton
              ml={3}
              marginY={0}
              icon={<Ionicons name="arrow-back" size={28} color="black" />}
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
          headerRight: () =>
            activeRound ? (
              <IconButton
                mr={3}
                marginY={0}
                icon={<Feather name="edit" size={24} color="black" />}
                onPress={() => {
                  navigation.navigate("RoundStack", {
                    screen: "RoundInfo",
                    params: { id: activeRound._id },
                  });
                }}
              />
            ) : (
              ""
            ),
        }}
      />
      <Stack.Screen
        name="ForumPage"
        component={ForumPage}
        initialParams={{ id: roundId }}
        options={{
          headerBackTitleVisible: false,
          headerTitle: () => (
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {activeRound?._id === roundId
                  ? activeRound.name
                  : firstTwoFinishRounds?.find((item) => item._id === roundId)
                      ?.name}
              </Text>
              {activeRound?._id === roundId?<Text style={{ fontSize: 14, textAlign: "center" }}>
                {finalDaysLeft + " days to go"}
              </Text>:('')}
            </View>
          ),
          // title:
          //   activeRound?._id === roundId
          //     ? activeRound?.name
          //     : firstTwoFinishRounds?.find((item) => item._id === roundId)
          //         ?.name,
          headerLeft: () => (
            <IconButton
              ml={3}
              marginY={0}
              icon={<Ionicons name="arrow-back" size={28} color="black" />}
              onPress={() => {
                navigation.navigate("MainStack", { screen: "Home" });
              }}
            />
          ),
          headerRight: () =>
            activeRound && activeRound._id === roundId ? (
              <IconButton
                mr={3}
                marginY={0}
                icon={<Feather name="edit" size={24} color="black" />}
                onPress={() => {
                  navigation.navigate("RoundStack", {
                    screen: "RoundInfo",
                    params: { id: roundId },
                  });
                }}
              />
            ) : (
              ""
            ),
        }}
      />
    </Stack.Navigator>
  );
}
