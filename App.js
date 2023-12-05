import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomePage';
import AccountScreen from './screens/AccountPage'
import ResetPassword from './screens/ResetPage';
import { NativeBaseProvider } from "native-base";
import Login from './screens/LoginPage';
import Register from './screens/RegisterPage'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { loginUser } from './components/Endpoint';



const Stack = createStackNavigator();


export default function App() {
  useEffect(() => {
    const checkRememberMeAndLogin = async () => {
      try {
        const rememberMeValue = await AsyncStorage.getItem('@RememberMe');
        const isRememberMeEnabled = rememberMeValue === 'true';
        if (isRememberMeEnabled) {
          // If "Remember Me" is enabled, try to retrieve the stored credentials
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
            // Use credentials to log in the user automatically
            // Implement your login logic here using the retrieved credentials
            console.log('Credentials successfully loaded for user ' + credentials.id);
            // ... Your login logic
            const response = await loginUser(credentials.id, credentials.password)
            if (response.token) {
                navigation.navigate('Home');
                console.log(response.token);
            }

          }
        }
      } catch (error) {
        // Handle the error, could be an error retrieving data from AsyncStorage or Keychain
        console.error('Failed to load credentials', error);
      }
    };
    checkRememberMeAndLogin();
  }, []);
  return (
    <NativeBaseProvider>
      {/* <Box flex={1} bg="#fff" alignItems="center" justifyContent="center"> */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Account" component={AccountScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Reset" component={ResetPassword} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
      {/* </Box> */}
    </NativeBaseProvider>

  )
};



