import { useState } from "react";
import { Menu, Center, HamburgerIcon, Pressable, Box, Heading, VStack, HStack, ZStack, IconButton, Button, NativeBaseProvider, Flex } from 'native-base';
import { Avatar } from "native-base";
import { useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useData } from '../context/DataContext';

const HomeScreen = () => {
  const { userData, updateUserData } = useData();
  console.log(userData,'inHome');

  function inviteFriend(value){
    console.log('invite friend')
  }
  return (
    <NativeBaseProvider>
      <Flex direction="column" alignItems='center'>
        <ZStack alignSelf='flex-end' mr='8' mt='2' >
          <Box alignItems="flex-start">
            <Menu mt='-20' shadow={2} mr='2' w="140" trigger={triggerProps => {
              return <Pressable accessibilityLabel="Options menu" {...triggerProps}>
                <AntDesign  name="plus" size={24} color="black" />
              </Pressable>;
            }}>
              <Menu.Item px='0' onPress={inviteFriend}><AntDesign name="adduser" size={24} color="black" />Add a friend</Menu.Item>
              <Menu.Item px='0' >Test</Menu.Item>
              <Menu.Item px='0' >Test</Menu.Item>
            </Menu>
          </Box>
        </ZStack>

        <Box py='2' px='2' alignItems="center" justifyContent="center">
          <Avatar bg='white' mb='1' size="md">
            <AntDesign name="user" size={30} color="black" />
            {/* <FontAwesome name="user-circle-o" size={30} color="black" /> */}
            {/* {data.userName} */}
          </Avatar>
          {userData.userName}
        </Box>

        <Box py='5' safeArea w="100%" maxW="290" alignItems="center">
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
