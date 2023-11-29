import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomePage';
import AccountScreen from './screens/AccountPage'
import ResetPassword from './screens/ResetPage';
import { NativeBaseProvider} from "native-base";
import Login from './screens/LoginPage';
import Register from './screens/RegisterPage'



const Stack = createStackNavigator();

export default function App() {
  return (
    <NativeBaseProvider>
      {/* <Box flex={1} bg="#fff" alignItems="center" justifyContent="center"> */}
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Account">
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



