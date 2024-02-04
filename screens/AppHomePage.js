import { useState, useEffect } from "react";
import { Box, Heading, IconButton,Text, Pressable, Button, NativeBaseProvider, Flex } from 'native-base';
import { Avatar } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import Background from "../components/Background";

// TODO: change the layout to match the new ios version
const AppHomeScreen = ({ navigation, route }) => {
  const { userData, updateUserData } = useData();
  console.log(userData, 'inApp');
  // const avatar=route.params;
  // console.log(avatar);

  const handleAvatarPress = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate('MainStack', { screen: 'Account' });
  };
  useEffect(() => {
    // Fetch or update avatar dynamically
    // userData=useData().useData
    console.log(userData, 'inHome');
  }, [userData]);

  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column"  alignItems='center' justifyContent="center">
        <Box safeArea w="100%" maxW="300" h="100%" alignItems="center" justifyContent="center">
            <Text fontFamily={'Bold'} fontSize={30} >APP Home Page</Text>
            <Button onPress={() => { navigation.navigate('LoginStack', { screen: 'Login' }) }}>Login</Button>
        </Box >
      </Flex>

    </NativeBaseProvider>
  );
};

export default AppHomeScreen;
