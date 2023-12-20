import React, { useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ResetPassword from '../screens/ResetPage';
import LoginScreen from '../screens/LoginPage';
import RegisterScreen from '../screens/RegisterPage'


const Stack = createStackNavigator();

export default function MainStackNavigator () {
    const navigationRef = useRef();
    return(<Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Reset" component={ResetPassword} />
    <Stack.Screen name="Register" component={RegisterScreen} />
</Stack.Navigator>)
};
