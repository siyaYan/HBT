import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "native-base";
import RoundConfigurationScreen from "../screens/RoundConfiguration";
import RoundInfoScreen from "../screens/RoundInfo";
import RoundInviteFriendsScreen from "../screens/RoundInviteFriends";
import InviteScreen from "../screens/InviteFriends";
import RoundHabit from "../screens/RoundHabit";
import RoundScoreScreen from "../screens/RoundScore";
const Stack = createStackNavigator();

export default function RoundStackNavigator({ navigation }) {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}
    <Stack.Screen
        name="RoundInviteFriend"
        component={RoundInviteFriendsScreen}
        options={{
          headerBackTitleVisible: false,
          title: "",
          headerStyle: {
            backgroundColor: "rgba(255,255,255,0)",
          },
          headerLeft: () => (
            <IconButton
              ml={3}
              marginY={0}
              icon={<Ionicons name="arrow-back" size={28} color="black" />}
              onPress={() => {
                navigation.goBack(); //TODO, navigate to round info page, rather than home page
      //           navigation.navigate("RoundStack", {
      //   screen: "RoundInfo",
      //   params: { roundId},
      // });
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="GlobalAddFriend"
        component={InviteScreen}
        options={{
          headerBackTitleVisible: false,
          title: "",
          headerStyle: {
            backgroundColor: "rgba(255,255,255,0)",
          },
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
      {/* Round Habit */}
       <Stack.Screen
        name="RoundHabit"
        component={RoundHabit}
        options={{
          headerBackTitleVisible: false,
          title: "",
          headerStyle: {
            backgroundColor: "rgba(255,255,255,0)",
          },
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
      {/* Round Habit */}
      <Stack.Screen
        name="RoundScore"
        component={RoundScoreScreen}
        options={{
          headerBackTitleVisible: false,
          title: "",
          headerStyle: {
            backgroundColor: "rgba(255,255,255,0)",
          },
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
        name="RoundConfig"
        component={RoundConfigurationScreen}
        options={({navigation})=>({
          headerBackTitleVisible: false,
          title: "",
          headerStyle: {
            backgroundColor: "rgba(255,255,255,0)",
          },
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
        })}
      />
      <Stack.Screen
        name="RoundInfo"
        component={RoundInfoScreen}
        options={({ navigation }) =>({
          headerBackTitleVisible: false,
          // title: navigation.params,
          headerStyle: {
            backgroundColor: "rgba(255,255,255,0)",
          },
          headerLeft: () => (
            <IconButton
              ml={3}
              marginY={0}
              icon={<Ionicons name="arrow-back" size={28} color="black" />}
              onPress={() => {
                // navigation.goBack();
                navigation.navigate("MainStack", { screen: "Home" }); // Navigate to Home if round is not found
              }}
            />
          ),
        })}
      />
      
    </Stack.Navigator>
  );
}
