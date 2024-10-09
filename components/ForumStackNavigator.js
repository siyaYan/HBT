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
  const { id: roundId, isFromHome: isFromHome } = route.params.params || {}; // Use optional chaining to prevent crashes if params are missing
  console.log(roundId);
  const activeRound = acceptRoundData?.data.filter(
    (item) => item.status === "A"
  )[0];

  const thisRound = roundId
    ? acceptRoundData.data.filter((item) => item._id === roundId)[0]
    : activeRound;
  console.log(thisRound);
  const calculateDaysLeft = () => {
    // Calculate how many days are left
    const today = new Date();
    const startDate = new Date(thisRound?.startDate);

    // Get the difference in milliseconds
    const timeDifference = Math.abs(today - startDate);

    // Convert milliseconds to days
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // Adjust daysLeft based on level if needed
    const finalDaysLeft = Math.abs(daysLeft - thisRound?.level)-1;
    return finalDaysLeft;
  };

  const isThisActiveRound = thisRound?.status == "A" ? calculateDaysLeft() : "";

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
                {thisRound?.name}
              </Text>
              {isThisActiveRound ? (
                <Text style={{ fontSize: 14, textAlign: "center" }}>
                  {isThisActiveRound + " days to go"}
                </Text>
              ) : (
                ""
              )}
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
          headerRight: () => (
            <IconButton
              mr={3}
              marginY={0}
              icon={<Feather name="edit" size={24} color="black" />}
              onPress={() => {
                navigation.navigate("RoundStack", {
                  screen: "RoundInfo",
                  params: { id: thisRound._id },
                });
              }}
            />
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
                {thisRound?.name}
              </Text>
              {isThisActiveRound ? (
                <Text style={{ fontSize: 14, textAlign: "center" }}>
                  {isThisActiveRound + " days to go"}
                </Text>
              ) : (
                ""
              )}
            </View>
          ),
          headerLeft: () => (
            <IconButton
              ml={3}
              marginY={0}
              icon={<Ionicons name="arrow-back" size={28} color="black" />}
              onPress={() => {
                {
                  isFromHome
                    ? navigation.navigate("MainStack", { screen: "Home" })
                    : navigation.goBack();
                }
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
