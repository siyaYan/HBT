import { useState } from "react";
import {  Box, Heading, IconButton, Button, NativeBaseProvider, Flex } from 'native-base';
import { Avatar } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import OptionMenu from "../components/OptionMenu";

const HomeScreen = ({navigation}) => {
  const { userData, updateUserData } = useData();
  console.log(userData,'inHome');
  
  const handleAvatarPress = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate('MainStack', {screen: 'Account'}); 
  };

  return (
    <NativeBaseProvider>
      <Flex direction="column" alignItems='center'>
        <OptionMenu/>

        <Box py='2' px='2' alignItems="center" justifyContent="center">
          <Avatar bg='white' mb='1' size="md" borderWidth={2}>
            <AntDesign name="user" size={30} color="black" 
            onPress={handleAvatarPress} />
          </Avatar>
          {userData.userName}
        </Box>

        <Box py='5' px='2' safeArea w="100%" maxW="290" alignItems="center">
          <Heading mt='140' size="lg" fontWeight="600" color="coolGray.300" _dark={{
            color: "Gray.50"
          }}>
            Home Page
          </Heading>
        </Box >
      </Flex>
    </NativeBaseProvider>
  );
};

export default HomeScreen;
