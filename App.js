import React, { useEffect, useRef } from 'react';
import { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider, Box, Center, Flex } from "native-base";
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomePage';
import AccountScreen from './screens/AccountPage'
import ResetPassword from './screens/ResetPage';
import SettingScreen from './screens/SettingPage';
import LoginScreen from './screens/LoginPage';
import RegisterScreen from './screens/RegisterPage'
import * as SecureStore from 'expo-secure-store';
import { loginUser } from './components/Endpoint';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DataProvider } from './context/DataContext';
import { useData } from './context/DataContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const getCredentials = async () => {
  try {
    const credentials = await SecureStore.getItemAsync('userCredentials');
    if (credentials) {
      return JSON.parse(credentials);
    }
  } catch (error) {
    console.error('Failed to retrieve the credentials', error);
    // Handle the error, like showing an alert to the user
  }
};

export default function AppContainer() {
  const navigationRef = useRef();
  const { userData, updateUserData } = useData();
  console.log(userData)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleTabPress = (value) => {
    // Custom logic to handle data passing when clicking on a tab
    // console.log(value.target)
    if (value.target.includes("Home")) {
      // Pass data to the Home screen
      navigationRef.current?.navigate('Home' ,{userName: userData.userName, token: userData.token });
      console.log(userData.userName, 'home')
    }
    if (value.target.includes("Account")) {
      navigationRef.current?.navigate('Account',{ userName: userData.userName, token: userData.token })
      console.log(userData.userName, 'account')
    }
    if (value.target.includes("Setting")) {
      navigationRef.current?.navigate('Setting',{ userName: userData.userName, token: userData.token })
      console.log(userData.userName, 'setting')
    }
  }

  useEffect(() => {
    const checkCredentials = async () => {
      const storedCredentials = await getCredentials();
      console.log("in app")
      if (storedCredentials) {
        // Use credentials to log in the user automatically
        // Implement your login logic here using the retrieved credentials
        console.log('Credentials successfully loaded for user ' + storedCredentials);
        //TODO: get the userName, not use the stored ID
        const response = await loginUser(storedCredentials.id, storedCredentials.password)
        if (response.token) {
          updateUserData({
            userName: storedCredentials.id,
            token: response.token
          })
          setIsAuthenticated(true);
          // navigationRef.current?.AuthenticatedScreens.navigate('Home', { userName: storedCredentials.id, token: response.token })
          navigationRef.current?.navigate('MainStack', { screen: 'Home' });
          // console.log(response.token);
        }
      } else {
        setIsAuthenticated(false);
        navigationRef.current?.navigate('LoginStack', { screen: 'Login'})
      }
    };

    checkCredentials();
  }, [isAuthenticated]);

  const AuthenticatedScreens = () => (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        listeners={{ tabPress: handleTabPress }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        listeners={{ tabPress: handleTabPress }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        listeners={{ tabPress: handleTabPress }}
      />
    </Tab.Navigator>
  )

  const MainStackNavigator = () => (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Reset" component={ResetPassword} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );

  return (
    <NativeBaseProvider>
      <DataProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="MainStack" component={AuthenticatedScreens} options={{ headerShown: false }} />
          <Stack.Screen name="LoginStack" component={MainStackNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
      </DataProvider>
    </NativeBaseProvider >
  )
};


