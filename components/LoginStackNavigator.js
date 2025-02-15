import React, { useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ResetPassword from '../screens/TokenResetPage';
import LoginScreen from '../screens/LogInPage';
import RegisterScreen from '../screens/RegisterPage'
import {IconButton} from 'native-base';
// import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from "react-native-svg";

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
                    // icon={<Ionicons name="arrow-back" size={28} color="black" />}
                    icon={<SvgXml xml={backSvg()} width={28} height={28} />}
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
                    // icon={<Ionicons name="arrow-back" size={28} color="black" />}
                    icon={<SvgXml xml={backSvg()} width={28} height={28} />}
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
                    // icon={<Ionicons name="arrow-back" size={28} color="black" />}
                    icon={<SvgXml xml={backSvg()} width={28} height={28} />}
                    onPress={()=>{navigation.navigate('Login')}}
                    />
                  ), 
            }} />
        </Stack.Navigator>)
};

const backSvg = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <defs>
      <style>.cls-1{fill:#000;stroke-width:0px;}</style>
    </defs>
    <path class="cls-1" d="M36.43,42.47c-.46,0-.93-.13-1.34-.39L10.01,26.04c-.74-.47-1.18-1.3-1.15-2.18.03-.88.52-1.68,1.29-2.11l25.07-13.9c1.21-.67,2.73-.23,3.4.97.67,1.21.23,2.73-.97,3.4l-21.4,11.87 21.54,13.77c1.16.74,1.5,2.29.76,3.45-.48.75-1.28,1.15-2.11,1.15Z"/>
  </svg>`;
