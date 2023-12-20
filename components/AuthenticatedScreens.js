import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingScreen from '../screens/SettingPage';
import HomeScreen from '../screens/HomePage';
import AccountScreen from '../screens/AccountPage'
import { useData } from '../context/DataContext';

const Tab = createBottomTabNavigator();

export default function AuthenticatedScreens() {
    const navigationRef = useRef();
    const { userData, updateUserData } = useData();
    const handleTabPress = (value) => {
        // Custom logic to handle data passing when clicking on a tab
        // console.log(value.target)
        if (value.target.includes("Home")) {
            // Pass data to the Home screen
            navigationRef.current?.navigate('Home', { userName: userData.userName, token: userData.token });
            console.log(userData.userName, 'home')
        }
        if (value.target.includes("Account")) {
            navigationRef.current?.navigate('Account', { userName: userData.userName, token: userData.token })
            console.log(userData.userName, 'account')
        }
        if (value.target.includes("Setting")) {
            navigationRef.current?.navigate('Setting', { userName: userData.userName, token: userData.token })
            console.log(userData.userName, 'setting')
        }
    }
    
    return (
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
};
