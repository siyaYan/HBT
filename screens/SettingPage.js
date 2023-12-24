import { useState } from "react";
import { Center, Divider, Box, Heading, VStack, IconButton, Button, NativeBaseProvider, Flex } from 'native-base';
import { Avatar } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import OptionMenu from '../components/OptionMenu';
import { Ionicons } from '@expo/vector-icons';

const SettingScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  console.log(userData, 'setting');

  const handleAvatarPress = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate('MainStack', { screen: 'Account' });
  };

  return (
    <NativeBaseProvider>
      <Flex direction="column" alignItems='center' >
        <OptionMenu />
        <Box mt='5' mr='5' width='90%' py='2' px='2' alignItems="flex-end" justifyContent="center">
          <Avatar size="md" bg='white' borderWidth={2}>
            <AntDesign name="user" size={30} color="black"
              onPress={handleAvatarPress} />
          </Avatar>
          {userData.userName}
        </Box>
        <Box safeArea w="90%" maxW="290">
          <VStack space={1} alignItems='left' >
            <Heading size="sm" fontWeight="600" color="coolGray.800" _dark={{
              color: "warmGray.50"
            }}>
              System Settings
            </Heading>
            <Divider my="2" _light={{
              bg: "muted.800"
            }} _dark={{
              bg: "muted.50"
            }} />
            <Box py='2' alignItems="center" justifyContent="center">
              <Avatar bg='white' mb='1' size="lg" borderWidth={2}>
                <AntDesign name="user" size={40} color="black" />
                <Avatar.Badge
                  bg="white"
                  position="absolute"
                  top={0}
                  right={0}
                >
                  <Ionicons name="settings-sharp" size={16} color="black" />
                </Avatar.Badge>
              </Avatar>
              {userData.userName}
            </Box>
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
