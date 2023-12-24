import { useState } from "react";
import { Center, Divider, Box, Heading, VStack, IconButton, Button, NativeBaseProvider, Flex } from 'native-base';
import { Avatar } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import OptionMenu from '../components/OptionMenu';

const SettingScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  console.log(userData, 'setting');

  const handleAvatarPress = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate('MainStack', {screen: 'Account'}); 
  };

  return (
    <NativeBaseProvider>
       <Flex direction="column" alignItems='center' >
          <OptionMenu />
          <Box width='90%' py='2' px='2' alignItems="center" justifyContent="center">
          <Avatar alignSelf='flex-end' bg='white' mt='5' mr='5' size="md" borderWidth={2}>
            <AntDesign name="user" size={30} color="black" 
            onPress={handleAvatarPress} />
            {/* {data.userName} */}
          </Avatar>
          {userData.userName}
        </Box>
        <Box safeArea  w="90%" maxW="290">
          <VStack space={1} alignItems='left' >
            <Heading size="sm" fontWeight="600" color="coolGray.800" _dark={{
              color: "warmGray.50"
            }}>
              System Settings
            </Heading>
            {/* {userData.userName} */}
            <Divider my="2" _light={{
              bg: "muted.800"
            }} _dark={{
              bg: "muted.50"
            }} />

          </VStack>
        </Box>
      </Flex>
    </NativeBaseProvider>
  );
};

export default SettingScreen;
