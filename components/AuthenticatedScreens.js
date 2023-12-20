import React, { useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingScreen from '../screens/SettingPage';
import HomeScreen from '../screens/HomePage';
import AccountScreen from '../screens/AccountPage'
import { useData } from '../context/DataContext';
import {  Icon} from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 

const Tab = createBottomTabNavigator();

export default function AuthenticatedScreens() {
    const navigationRef = useRef();
    const { userData, updateUserData } = useData();
    const handleTabPress = (value) => {

        if (value.target.includes("Home")) {
            // Pass data to the Home screen
            navigationRef.current?.navigate('Home');
            console.log(userData.userName, 'home')
        }
        if (value.target.includes("Account")) {
            navigationRef.current?.navigate('Account')
            console.log(userData.userName, 'account')
        }
        if (value.target.includes("Setting")) {
            navigationRef.current?.navigate('Setting')
            console.log(userData.userName, 'setting')
        }
    }
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                listeners={{ tabPress: handleTabPress }}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name={'home'}
                      color={color}
                      size={size}
                    />
                  ),
                }}
            />
            <Tab.Screen
                name="Account"
                component={AccountScreen}
                listeners={{ tabPress: handleTabPress }}
                options={{
                    tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons
                        name={'account'}
                        color={color}
                        size={size}
                      />
                    ),
                  }}
            />
            <Tab.Screen
                name="Setting"
                component={SettingScreen}
                listeners={{ tabPress: handleTabPress }}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons 
                        name={'settings'}
                        color={color}
                        size={size}
                      />
                    ),
                  }}
            />
        </Tab.Navigator>
    )
};
