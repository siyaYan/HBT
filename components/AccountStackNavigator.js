import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AccountSettingScreen from '../screens/AccountSetting';
import ResetPassword from '../screens/ResetPassword';



const Stack = createStackNavigator();

export default function AccountStackNavigator() {
    return (
        <Stack.Navigator >
            <Stack.Screen name="ResetPassword" component={ResetPassword} options={{
                headerBackTitleVisible: false,
                title: 'Change password',
            }}/>
            <Stack.Screen name="AccountSetting" component={AccountSettingScreen} options={{
                headerBackTitleVisible: false,
                title: 'Change profile',
            }}/>
        </Stack.Navigator>)
};
