import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import {IconButton} from 'native-base';
import RoundConfiguration from '../screens/RoundConfiguration'
import HomeScreen from '../screens/HomePage';


const Stack = createStackNavigator();

export default function RoundStackNavigator({navigation}) {
    return (
        <Stack.Navigator >
                    <Stack.Screen name="RoundConfig" component={RoundConfiguration} options={{
                headerBackTitleVisible: false,
                title: '',
                headerStyle: {
                    backgroundColor:'rgba(255,255,255,0)',
                  },
                  headerLeft: () => (
                    <IconButton ml={3} marginY={0}
                    icon={<Ionicons name="arrow-back" size={28} color="black" />}
                    onPress={()=>{navigation.navigate('RoundConfiguration')}}
                    />
                  ), 
            }}/>
            <Stack.Screen
                name="RoundBack"
                component={HomeScreen}
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
