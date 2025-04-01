import React, { useEffect } from "react";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthenticatedScreens from "../components/AuthenticatedScreens";
import LoginStackNavigator from "../components/LoginStackNavigator";
import AccountStackNavigator from "../components/AccountStackNavigator";
import RoundStackNavigator from "../components/RoundStackNavigator";
import ForumStackNavigator from "../components/ForumStackNavigator";
import * as SecureStore from "expo-secure-store";
import {
  loginUser,
  getRoundInfo,
  loginUserThirdParty,
} from "../components/Endpoint";
import { useData } from "../context/DataContext";
import AppHomeScreen from "../screens/AppHomePage";
import InstructionCards from "../screens/InstructionCards";
import InviteScreen from "../screens/InviteFriends";
import Instruction from "../screens/Instruction";
import { IconButton } from "native-base";
import { useRound } from "../context/RoundContext";
import { SvgXml } from "react-native-svg";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const stylesSplash = StyleSheet.create({
  animationContainer: {
    backgroundColor: "#6666ff",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

const Stack = createStackNavigator();

const getCredentials = async () => {
  try {
    const credentials = await SecureStore.getItemAsync("userData");
    if (credentials) {
      return JSON.parse(credentials);
    }
  } catch (error) {
    console.error("was unsucessful. to retrieve the credentials", error);
  }
};

export const navigationRef = React.createRef();
export default function AppContainer() {
  const { userData, updateUserData } = useData();
  const { roundData, updateAcceptRoundData, updateRounds, acceptRoundData } =
    useRound();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCredentials = async () => {
      const storedCredentials = await getCredentials();
      console.log("in app", storedCredentials);

      if (storedCredentials) {
        var response;
        if (storedCredentials?.type) {
          switch (storedCredentials.type) {
            case 1:
              response = await loginUserThirdParty(
                storedCredentials.idToken,
                storedCredentials.fcmToken,
                storedCredentials.user,
                1
              );
              break;
            case 2:
              response = await loginUserThirdParty(
                storedCredentials.idToken,
                storedCredentials.fcmToken,
                storedCredentials.user,
                2
              );
              break;
            case 3:
              response = await loginUserThirdParty(
                storedCredentials.idToken,
                storedCredentials.fcmToken,
                storedCredentials.user,
                3
              );
              break;
            default:
              idToken = storedCredentials.id;
              break;
          }
        } else {
          response = await loginUser(
            storedCredentials.id,
            storedCredentials.password,
            storedCredentials.fcmToken
          );
        }

        if (response.token) {
          const roundInfo = await getRoundInfo(
            response.token,
            response.data.user._id
          );

          updateUserData({
            data: response.data.user,
            token: response.token,
            avatar: {
              uri: response.data.user.profileImageUrl,
            },
          });
          updateRounds(roundInfo);
          updateAcceptRoundData(roundInfo);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkCredentials();
  }, []);

  if (isLoading) {
    return (
      <View style={stylesSplash.animationContainer}>
        <LottieView
          autoPlay
          loop
          style={{
            height: 150,
            backgroundColor: "transparent",
          }}
          source={require("../assets/Animations/Splash.json")}
        />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{ headerShown: false, headerBackTitleVisible: false }}
      >
        {isAuthenticated ? (
          <></>
        ) : (
          <>
            <Stack.Screen name="Intro" component={InstructionCards} />
            <Stack.Screen name="LoginStack" component={LoginStackNavigator} />
          </>
        )}
        <Stack.Screen name="Home" component={AppHomeScreen} />
        <Stack.Screen name="MainStack" component={AuthenticatedScreens} />
        <Stack.Screen
          name="Invite"
          component={InviteScreen}
          options={{
            headerShown: true,
            title: "",
            headerStyle: {
              backgroundColor: "rgba(255,255,255,0)",
            },
            headerLeft: () => (
              <IconButton
                ml={3}
                marginY={0}
                icon={<SvgXml xml={backSvg()} width={28} height={28} />}
                onPress={() => {
                  navigationRef.current?.goBack();
                }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Instruction"
          component={Instruction}
          options={{
            headerShown: true,
            title: "",
            headerStyle: {
              backgroundColor: "rgba(255,255,255,0)",
            },
            headerLeft: () => (
              <IconButton
                ml={3}
                marginY={0}
                icon={<SvgXml xml={backSvg()} width={28} height={28} />}
                onPress={() => {
                  navigationRef.current?.goBack();
                }}
              />
            ),
          }}
        />
        <Stack.Screen name="AccountStack" component={AccountStackNavigator} />
        <Stack.Screen name="RoundStack" component={RoundStackNavigator} />
        <Stack.Screen name="ForumStack" component={ForumStackNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const backSvg = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <defs>
      <style>.cls-1{fill:#000;stroke-width:0px;}</style>
    </defs>
    <path class="cls-1" d="M36.43,42.47c-.46,0-.93-.13-1.34-.39L10.01,26.04c-.74-.47-1.18-1.30-1.15-2.18.03-.88.52-1.68,1.29-2.11l25.07-13.9c1.21-.67,2.73-.23,3.4.97.67,1.21.23,2.73-.97,3.4l-21.4,11.87 21.54,13.77c1.16.74,1.5,2.29.76,3.45-.48.75-1.28,1.15-2.11,1.15Z"/>
  </svg>`;
