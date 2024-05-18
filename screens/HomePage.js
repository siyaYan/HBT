import { useState, useEffect, useCallback } from "react";
import { Box, Heading, IconButton,Text, Pressable, Button, NativeBaseProvider, Flex, View } from 'native-base';
import { Avatar } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import OptionMenu from "../components/OptionMenu";
import Background from "../components/Background";
import { useFocusEffect } from '@react-navigation/native';

// TODO: change the layout to match the new ios version
const HomeScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  useFocusEffect(
    useCallback(() => {
      // This code runs when the tab comes into focus
      console.log('Tab is in focus, userInfo:', userData);
    }, [userData]) // Depend on `userInfo` to re-run the effect when it changes or the tab comes into focus
  );
  const handleAvatarPress = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate('AccountStack', { screen: 'Account' });
  };
  const startRound = () => {
    // Navigate to round configuration when pressed
    navigation.navigate('RoundStack', { screen: 'RoundConfig' });
  };


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
        {/* <Box safeArea w="100%" maxW="300" alignItems="center">
          {!userData ? <Button
            mt="2"
            width="100%"
            size="lg"
            rounded="30"
            shadow="6"
            bg="#49a579"
            _text={{
              color: "#f9f8f2",
              fontFamily: "Regular Medium",
              fontSize: "lg",
            }}
            _pressed={{
              // below props will only be applied on button is pressed
              bg: "emerald.600",
              _text: {
                color: "warmGray.50",
              },
            }}
            onPress={() => {
              navigation.navigate("LoginStack", { screen: "Login" });
            }}
          >
            Login
          </Button>: 
            <Text fontFamily={'Bold'} fontSize={"3xl"} style={{ marginTop:'50%',}} >Home Page1</Text>
          }
        </Box> */}
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
              Round invitation
            </Button>
        {/* Linda Sprint 4 */}
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
