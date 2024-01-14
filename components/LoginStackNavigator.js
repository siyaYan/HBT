import React, { useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ResetPassword from '../screens/TokenResetPage';
import LoginScreen from '../screens/LoginPage';
import RegisterScreen from '../screens/RegisterPage'


const Stack = createStackNavigator();

export default function LoginStackNavigator() {
    return (
        <Stack.Navigator  initialRouteName='Login'>
            <Stack.Screen name="Login" component={LoginScreen} options={{
                headerBackTitleVisible: false,
            }}/>
            <Stack.Screen name="Reset" component={ResetPassword} options={{
                headerBackTitleVisible: false,
            }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{
                headerBackTitleVisible: false,
            }} />
        </Stack.Navigator>)
};
