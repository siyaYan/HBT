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
  const { acceptRoundData } = useRound();
  // const roundId = route.params.id;
  const { id: roundId } = route.params.params || {};  // Use optional chaining to prevent crashes if params are missing
  
  const activeRound = acceptRoundData?.data.filter((item) => item.status === "A")[0];
  // console.log(roundId,activeRound);
  const firstTwoFinishRounds = acceptRoundData
    ?.data.filter((item) => item.status === "F")
    .slice(0, 2);
  return (
    <Stack.Navigator initialRouteName="ForumPage">
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
                navigation.goBack();
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
                navigation.goBack();
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
                    params: { id: roundId },
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
