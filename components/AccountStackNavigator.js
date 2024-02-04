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
                title: '',
                headerStyle: {
                    backgroundColor:'rgba(255,255,255,0)',
                  },
            }}/>
            <Stack.Screen name="AccountSetting" component={AccountSettingScreen} options={{
                headerBackTitleVisible: false,
                title: '',
                headerStyle: {
                    backgroundColor:'rgba(255,255,255,0)',
                  },
            }}/>
        </Stack.Navigator>)
};
