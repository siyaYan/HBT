import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthenticatedScreens from "../components/AuthenticatedScreens";
import LoginStackNavigator from "../components/LoginStackNavigator";
import AccountStackNavigator from "../components/AccountStackNavigator";
import RoundStackNavigator from "../components/RoundStackNavigator";
import * as SecureStore from "expo-secure-store";
import { loginUser } from "../components/Endpoint";
import { useData } from "../context/DataContext";
import AppHomeScreen from "../screens/AppHomePage";
import InviteScreen from "../screens/InviteFriends";
import SplashAnimationScreen from "../components/SplashAnimation";
import LoadingAnimationScreen from "../components/LoadingAnimation";
import { IconButton } from "native-base";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();

const getCredentials = async () => {
  try {
    const credentials = await SecureStore.getItemAsync("userData");
    if (credentials) {
      return JSON.parse(credentials);
    }
  } catch (error) {
    console.error("Failed to retrieve the credentials", error);
    // Handle the error, like showing an alert to the user
  }
};

export default function AppContainer() {
  const navigationRef = useRef();
  const { userData, updateUserData } = useData();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkCredentials = async () => {
      const storedCredentials = await getCredentials();
      console.log("in app",storedCredentials);

      if (storedCredentials) {
        // Use credentials to log in the user automatically
        // Implement your login logic here using the retrieved credentials
        // console.log(
        //   "Credentials successfully loaded for user " + storedCredentials
        // );
        const response = await loginUser(
          storedCredentials.id,
          storedCredentials.password
        );
        if (response.token) {
          updateUserData({
            data: response.data.user,
            token: response.token,
            avatar: {
              uri: response.data.user.profileImageUrl,
            },
          });
          // console.log(userData);
          setIsAuthenticated(true);
          navigationRef.current?.navigate("MainStack", { screen: "Home" });
          // console.log(response.token);
        }
      } else {
        setIsAuthenticated(false);
        navigationRef.current?.navigate("Home");
      }
    };
    setTimeout(() => {
      checkCredentials();
    }, 500);
  }, [isAuthenticated]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, headerBackTitleVisible: false }}
      >
        <Stack.Screen name="Splash" component={SplashAnimationScreen} />
        <Stack.Screen name="Home" component={AppHomeScreen} />
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
                icon={<Ionicons name="arrow-back" size={28} color="black" />}
                onPress={() => {
                    navigationRef.current?.goBack();
                }}
              />
            ),
          }}
        />
        <Stack.Screen name="MainStack" component={AuthenticatedScreens} />
        <Stack.Screen name="LoginStack" component={LoginStackNavigator} />
        <Stack.Screen name="AccountStack" component={AccountStackNavigator} />
        <Stack.Screen name="RoundStack"  component={RoundStackNavigator} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
