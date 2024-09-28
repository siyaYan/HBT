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
import { useRound } from "../context/RoundContext";
import { Feather } from "@expo/vector-icons";

const Stack = createStackNavigator();

export default function RoundStackNavigator({ route, navigation }) {
  const { id: roundId ,state: newState} = route.params.params || {}; // Use optional chaining to prevent crashes if params are missing
  const { roundData } =useRound()
  const handleRoundNavigation = (roundId, navigation) => {
    if (!roundId) {
      // If roundId is empty, navigate back
      navigation.goBack();
    } else {
      // If roundId is not empty, navigate to the RoundInfo screen
      navigation.navigate("RoundStack", {
        screen: "RoundInfo",
        params: { id: roundId },
      });
    }
  };
  const goRoundInfo = (roundId, navigation) => {
    console.log("roundId in Stack",roundId);
      // If roundId is not empty, navigate to the RoundInfo screen
      navigation.navigate("RoundStack", {
        screen: "RoundInfo",
        params: { id: roundId },
      });
    
  };

  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="HomeScreen" component={HomeScreen} /> */}
      <Stack.Screen
        name="RoundInviteFriend"
        component={RoundInviteFriendsScreen}
        initialParams={{ id: roundId }}
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
                handleRoundNavigation(roundId, navigation);
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="GlobalAddFriend"
        component={InviteScreen}
        initialParams={{ id: roundId }}
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
        initialParams={{ id: roundId }}
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
                console.log("----stack roundId",roundId);
                goRoundInfo(roundId, navigation);
              }}
            />
          ),
        }}
      />
      {/* Round Score */}
      <Stack.Screen
        name="RoundScore"
        component={RoundScoreScreen}
        initialParams={{ id: roundId }}
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
        // initialParams={{ id: roundId }}
        options={({ navigation }) => ({
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
                handleRoundNavigation(roundId, navigation);
              }}
            />
          ),
        })}
      />
      <Stack.Screen
        name="RoundInfo"
        component={RoundInfoScreen}
        initialParams={{ id: roundId }}
        options={({ navigation }) => ({
          headerBackTitleVisible: false,
          title: roundData.data.filter(item=>item._id === roundId)[0]?.name,
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
                if(newState){{
                  navigation.navigate("MainStack", { screen: "Home" });
                }}
                navigation.goBack(); 
              }}
            />
          ),
          headerRight: () =>
              <IconButton
                mr={3}
                marginY={0}
                icon={<Feather name="edit" size={24} color="black" />}
                onPress={() => {
                  navigation.navigate("RoundStack", {
                    screen: "RoundConfig",
                    params: { emptyState: false, id: roundId, source: "info"  },
                  });
                }}
              />
        })}
      />
    </Stack.Navigator>
  );
}
