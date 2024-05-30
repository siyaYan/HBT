import { useState, useEffect, useCallback } from "react";
import { Box, Heading, IconButton,Text, Pressable, Button, NativeBaseProvider, Flex } from 'native-base';
import { Avatar } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import OptionMenu from "../components/OptionMenu";
import Background from "../components/Background";
import { useFocusEffect } from '@react-navigation/native';
import {
  getNoteUpdate
} from "../components/Endpoint";

// TODO: change the layout to match the new ios version
const HomeScreen = ({ navigation }) => {
  const { userData, updateUserData, note, updateNotes } = useData();

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
        <Box safeArea w="100%" maxW="300" alignItems="center">
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
        </Box>
      </Flex>

    </NativeBaseProvider>
  );
};

export default HomeScreen;
