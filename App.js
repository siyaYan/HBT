import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomePage';
import AccountScreen from './screens/AccountPage'
import ResetPassword from './screens/ResetPage';
import { NativeBaseProvider } from "native-base";
import Login from './screens/LoginPage';
import Register from './screens/RegisterPage'
import * as SecureStore from 'expo-secure-store';
import { useRef } from 'react';
import { loginUser } from './components/Endpoint';



const Stack = createStackNavigator();
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

export default function App() {
  const navigationRef = useRef();

  useEffect(() => {
    const checkCredentials = async () => {
      const storedCredentials = await getCredentials();
      console.log("in app")
      if (storedCredentials) {
        // Use credentials to log in the user automatically
        // Implement your login logic here using the retrieved credentials
        console.log('Credentials successfully loaded for user ' + storedCredentials);
        const response = await loginUser(storedCredentials.id, storedCredentials.password)
        if (response.token) {
          navigationRef.current?.navigate('Home');
          console.log(response.token);
        }
      } else {
        navigationRef.current?.navigate('Login');
      }
    };

    checkCredentials();
  }, []);

  return (
    <NativeBaseProvider>
      {/* <Box flex={1} bg="#fff" alignItems="center" justifyContent="center"> */}
      <NavigationContainer ref={navigationRef}>
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



