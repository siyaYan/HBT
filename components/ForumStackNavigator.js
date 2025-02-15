import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "native-base";
import ForumPage from "../screens/ForumPage";
import ForumDraft from "../screens/ForumDraft";
import { useRound } from "../context/RoundContext";
import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SvgXml } from "react-native-svg";

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
    const finalDaysLeft = Math.abs(daysLeft - thisRound?.level);
    return finalDaysLeft==0?"Last day":finalDaysLeft+" days to go";
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
                  {isThisActiveRound}
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
              // icon={<Ionicons name="arrow-back" size={28} color="black" />}
              icon={<SvgXml xml={backSvg()} width={28} height={28} />}
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
                  {isThisActiveRound}
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
              // icon={<Ionicons name="arrow-back" size={28} color="black" />}
              icon={<SvgXml xml={backSvg()} width={28} height={28} />}
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
const backSvg = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <defs>
      <style>.cls-1{fill:#000;stroke-width:0px;}</style>
    </defs>
    <path class="cls-1" d="M36.43,42.47c-.46,0-.93-.13-1.34-.39L10.01,26.04c-.74-.47-1.18-1.3-1.15-2.18.03-.88.52-1.68,1.29-2.11l25.07-13.9c1.21-.67,2.73-.23,3.4.97.67,1.21.23,2.73-.97,3.4l-21.4,11.87 21.54,13.77c1.16.74,1.5,2.29.76,3.45-.48.75-1.28,1.15-2.11,1.15Z"/>
  </svg>`;
