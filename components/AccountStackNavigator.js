import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AccountSettingScreen from '../screens/AccountSetting';
import ResetPassword from '../screens/ResetPassword';
import { Ionicons } from '@expo/vector-icons';
import {IconButton} from 'native-base';
import AccountScreen from '../screens/AccountPage'

const Stack = createStackNavigator();

export default function AccountStackNavigator({navigation}) {
    return (
        <Stack.Navigator >
            <Stack.Screen name="ResetPassword" component={ResetPassword} options={{
                headerBackTitleVisible: false,
                title: '',
                headerStyle: {
                    backgroundColor:'rgba(255,255,255,0)',
                  },
                  headerLeft: () => (
                    <IconButton ml={3} marginY={0}
                    icon={<Ionicons name="arrow-back" size={28} color="black" />}
                    onPress={()=>{navigation.navigate('AccountSetting')}}
                    />
                  ), 
            }}/>
            <Stack.Screen name="AccountSetting" component={AccountSettingScreen} options={{
                headerBackTitleVisible: false,
                title: '',
                headerStyle: {
                    backgroundColor:'rgba(255,255,255,0)',
                  },
                  headerLeft: () => (
                    <IconButton ml={3} marginY={0}
                    icon={<Ionicons name="arrow-back" size={28} color="black" />}
                    onPress={()=>{navigation.navigate('Setting')}}
                    />
                  ), 
            }}/>
            <Stack.Screen
                name="Account"
                component={AccountScreen}
                options={{
                  headerBackTitleVisible: false,
                  title: '',
                  headerStyle: {
                      backgroundColor:'rgba(255,255,255,0)',
                    },
                    headerLeft: () => (
                      <IconButton ml={3} marginY={0}
                      icon={<Ionicons name="arrow-back" size={28} color="black" />}
                      onPress={()=>{navigation.goBack()}}
                      />
                    ), 
              }}
            /> 
        </Stack.Navigator>)
};
