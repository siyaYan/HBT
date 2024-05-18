import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import {IconButton} from 'native-base';
import RoundConfigurationScreen from '../screens/RoundConfiguration'
import RoundInfoScreen from '../screens/RoundInfo';
import RoundInviteFriendsScreen from '../screens/RoundInviteFriends';


const Stack = createStackNavigator();

export default function RoundStackNavigator({navigation}) {
    return (
        <Stack.Navigator >
            <Stack.Screen name="RoundConfig" component={RoundConfigurationScreen} options={{
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
            }}/>
            <Stack.Screen name="RoundInfo" component={RoundInfoScreen} />
            <Stack.Screen name="RoundInviteFriend" component={RoundInviteFriendsScreen} />
        </Stack.Navigator>)
};
