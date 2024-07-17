import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "native-base";
import ForumPage from "../screens/ForumPage";
import ForumDraft from "../screens/ForumDraft";
import { useRound } from "../context/RoundContext";
import { useData } from "../context/DataContext";
import { Feather } from '@expo/vector-icons';

const Stack = createStackNavigator();
export default function ForumStackNavigator({ navigation }) {
  const { roundData } = useRound();
  const { userData } = useData();
  const activeRound=roundData.data.filter(item=>item.status === "A")[0]
  console.log(activeRound)
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ForumDraft"
        component={ForumDraft}
        options={{
          headerBackTitleVisible: false,
          title: activeRound.name,
          // headerStyle: {
          //   backgForumColor: "rgba(255,255,255,0)",
          // },
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
        options={{
          headerBackTitleVisible: false,
          title: activeRound.name,
          // headerStyle: {
          //   backgForumColor: "rgba(255,255,255,0)",
          // },
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
                  params: { roundId:activeRound._id },
                });
              }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
