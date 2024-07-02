import { useState, useEffect, useRef, useCallback } from "react";
import { Box, Heading, IconButton, Text, Pressable, Button, NativeBaseProvider, Flex } from 'native-base';
import { Avatar } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import OptionMenu from "../components/OptionMenu";
import Background from "../components/Background";
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native'
import {
  getNoteUpdate
} from "../components/Endpoint";

const HomeScreen = ({ navigation }) => {
  const { userData, updateUserData, note, updateNotes } = useData();
    const animation = useRef(null);


  useFocusEffect(
    useCallback(() => {
      // This code runs when the tab comes into focus & userdata changed
      updateNote()
      console.log(userData)
    }, [userData])
  );
  const handleAvatarPress = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate('AccountStack', { screen: 'Account' });
  };
  const startRound = () => {
    // Navigate to round configuration when pressed
    navigation.navigate('RoundStack', { screen: 'RoundConfig' });
  };

  const roundInfo = () => {
    navigation.navigate('RoundStack',{screen:'RoundInfo'})
  };

  const  updateNote = async ()=>{
    const res=await getNoteUpdate(userData.token,userData.data.email)
    if(res>0){
      updateNotes(res)
    }
 }

  return (
    <NativeBaseProvider>
      <Background />

      <Flex direction="column" alignItems='center'>
        <OptionMenu navigation={navigation} />
        <Pressable onPress={handleAvatarPress}>
          <Box py='5' px='2' alignItems="center" justifyContent="center">
            {userData.avatar&&userData.avatar.uri ?
              (<Avatar bg='white' mb='1' size="md" source={{ uri: userData.avatar.uri}} />) : (
                <Avatar bg='white' mb='1' size="md" borderWidth={2}>
                  <AntDesign name="user" size={30} color="black" />
                </Avatar>)}
                <Text fontFamily={"Regular"} fontSize="lg">
                  {userData.data.nickname}
                  </Text>
          </Box>
        </Pressable>
        <Button
              // onPress={()=>navigation.navigate('RoundConfig')}
              onPress={roundInfo}
              rounded="30"
              // shadow="1"
              mt="5"
              width="80%"
              size="lg"
              style={{
                borderWidth: 1, // This sets the width of the border
                borderColor: '#49a579', // This sets the color of the border
              }}
              backgroundColor={"rgba(250,250,250,0.2)"}
              _text={{
                color: "#191919",
                fontFamily: "Regular Semi Bold",
                fontSize: "lg",
              }}
              _pressed={{
                // below props will only be applied on button is pressed
                bg: "#e5f5e5",
                // _text: {
                //   color: "warmGray.50",
                // },
              }}
            >
              Round info dummy
            </Button>
        <Button
              // onPress={()=>navigation.navigate('RoundConfig')}
              onPress={startRound}
              rounded="30"
              // shadow="1"
              mt="5"
              width="80%"
              size="lg"
              style={{
                borderWidth: 1, // This sets the width of the border
                borderColor: '#49a579', // This sets the color of the border
              }}
              backgroundColor={"rgba(250,250,250,0.2)"}
              _text={{
                color: "#191919",
                fontFamily: "Regular Semi Bold",
                fontSize: "lg",
              }}
              _pressed={{
                // below props will only be applied on button is pressed
                bg: "#e5f5e5",
                // _text: {
                //   color: "warmGray.50",
                // },
              }}
            >
              Start a round
            </Button>
        </Flex>
    </NativeBaseProvider>
  );
};

export default HomeScreen;
