import { useState, useEffect } from "react";
import { Box, Heading, IconButton,Text, Pressable, Button, NativeBaseProvider, Flex } from 'native-base';
import { Avatar } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import OptionMenu from "../components/OptionMenu";
import Background from "../components/Background";

// TODO: change the layout to match the new ios version
const HomeScreen = ({ navigation, route }) => {
  const { userData, updateUserData } = useData();
  console.log(userData, 'inHome');
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
      <Flex direction="column" alignItems='center'>
        <OptionMenu />
        <Pressable onPress={handleAvatarPress}>
          <Box py='5' px='2' alignItems="center" justifyContent="center">
            {userData.data.profileImageUrl ?
              (<Avatar bg='white' mb='1' size="md" source={{ uri: userData.data.profileImageUrl }} />) : (
                <Avatar bg='white' mb='1' size="md" borderWidth={2}>
                  <AntDesign name="user" size={30} color="black" />
                </Avatar>)}
                <Text fontFamily={'Regular'} fontSize={30}>
                  {userData.data.nickname}
                  </Text>
          </Box>
        </Pressable>
        <Box safeArea w="100%" maxW="300" alignItems="center">
          {!userData ? <Button onPress={() => { navigation.navigate('LoginStack', { screen: 'Login' }) }}>Login</Button>: 
            <Text fontFamily={'Bold'} fontSize={30} style={{ marginTop:'50%',}} >Home Page</Text>
          }
          
        </Box >
      </Flex>

    </NativeBaseProvider>
  );
};

export default HomeScreen;
