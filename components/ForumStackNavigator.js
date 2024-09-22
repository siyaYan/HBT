import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "native-base";
import ForumPage from "../screens/ForumPage";
import ForumDraft from "../screens/ForumDraft";
import { useRound } from "../context/RoundContext";
import { Feather } from "@expo/vector-icons";

const Stack = createStackNavigator();
export default function ForumStackNavigator({ route, navigation }) {
  const { activeRoundData } = useRound();
  const roundId = route.params.id;
  const activeRound = activeRoundData?.data.filter((item) => item.status === "A")[0];
  console.log(activeRoundData);
  const firstTwoFinishRounds = activeRoundData
    ?.data.filter((item) => item.status === "F")
    .slice(0, 2);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ForumDraft"
        component={ForumDraft}
        options={{
          headerBackTitleVisible: false,
          title:
            activeRound?._id === roundId
              ? activeRound?.name
              : firstTwoFinishRounds?.find((item) => item._id === roundId)
                  ?.name,
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
        }}
      />
      <Stack.Screen
        name="ForumPage"
        component={ForumPage}
        initialParams={{ id: roundId }}
        options={{
          headerBackTitleVisible: false,
          title:
          activeRound?._id === roundId
          ? activeRound?.name
          : firstTwoFinishRounds?.find((item) => item._id === roundId)
              ?.name,
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
            activeRound && activeRound._id===roundId ? (
              <IconButton
                mr={3}
                marginY={0}
                icon={<Feather name="edit" size={24} color="black" />}
                onPress={() => {
                  navigation.navigate("RoundStack", {
                    screen: "RoundInfo",
                    params: { roundId: roundId },
                  });
                }}
              />
            ):(
              ""
            ) 
        }}
      />
    </Stack.Navigator>
  );
}
