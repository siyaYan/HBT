import React, { useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ResetPassword from '../screens/TokenResetPage';
import LoginScreen from '../screens/LogInPage';
import RegisterScreen from '../screens/RegisterPage'
import {IconButton} from 'native-base';
import { Ionicons } from '@expo/vector-icons';


const Stack = createStackNavigator();
;

export default function LoginStackNavigator({navigation}) {
    const navigationRef = useRef()
    return (
        <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" component={LoginScreen} options={{
                title: '',
                headerStyle: {
                    backgroundColor:'rgba(255,255,255,0)',
                  },  
                  headerLeft: () => (
                    <IconButton ml={3} marginY={0}
                    icon={<Ionicons name="arrow-back" size={28} color="black" />}
                    onPress={()=>{navigation.navigate('Home')}}
                    />
                  ),              
            }}/>
            <Stack.Screen name="Reset" component={ResetPassword} options={{
                headerBackTitleVisible: false,
                title: '',
                headerStyle: {
                    backgroundColor:'rgba(255,255,255,0)',
                  },
                  headerLeft: () => (
                    <IconButton ml={3} marginY={0}
                    icon={<Ionicons name="arrow-back" size={28} color="black" />}
                    onPress={()=>{navigation.navigate('Login')}}
                    />
                  ), 
            }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{
                headerBackTitleVisible: false,
                title: '',
                headerStyle: {
                    backgroundColor:'rgba(255,255,255,0)',
                  },
                  headerLeft: () => (
                    <IconButton ml={3} marginY={0}
                    icon={<Ionicons name="arrow-back" size={28} color="black" />}
                    onPress={()=>{navigation.navigate('Login')}}
                    />
                  ), 
            }} />
        </Stack.Navigator>)
};
