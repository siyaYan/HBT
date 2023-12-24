import React, { useEffect, useRef } from 'react';
import { useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthenticatedScreens from '../components/AuthenticatedScreens';
import LoginStackNavigator from '../components/LoginStackNavigator';
import * as SecureStore from 'expo-secure-store';
import { loginUser } from '../components/Endpoint';
import { useData } from '../context/DataContext';

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

export default function AppContainer () {
    const navigationRef = useRef();
    const {userData, updateUserData}= useData();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
                    console.log(userData)
                    setIsAuthenticated(true);
                    // navigationRef.current?.AuthenticatedScreens.navigate('Home', { userName: storedCredentials.id, token: response.token })
                    navigationRef.current?.navigate('MainStack', { screen: 'Home' });
                    // console.log(response.token);
                }
            } else {
                setIsAuthenticated(false);
                navigationRef.current?.navigate('LoginStack', { screen: 'Login' })
            }
        };

        checkCredentials();
    }, [isAuthenticated]);

    return (
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="MainStack" component={AuthenticatedScreens}  />
                    <Stack.Screen name="LoginStack" component={LoginStackNavigator} />
                </Stack.Navigator>
            </NavigationContainer>
    )
};
