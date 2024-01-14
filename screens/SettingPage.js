import { useState, useEffect } from "react";
import { Center, Pressable, Divider, Box, Heading, HStack, VStack, IconButton, Button, NativeBaseProvider, Flex } from 'native-base';
import { Avatar } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import OptionMenu from '../components/OptionMenu';
import { Ionicons } from '@expo/vector-icons';

const SettingScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  console.log(userData, 'inSetting');

  const handleAvatarPress = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate('MainStack', { screen: 'Account' });
  };

  const goAccountSetting = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate('AccountStack', { screen: 'AccountSetting' });
  };
  useEffect(() => {
    // Fetch or update avatar dynamically
    // userData=useData().useData
    console.log(userData, 'inHome');
  }, [userData]);

  return (
    <NativeBaseProvider>
      <Flex direction="column" alignItems='center' >
        <OptionMenu />

        <Box mt='5' mr='5' width='90%' py='2' px='2' alignItems="flex-end" justifyContent="center">
          <Pressable onPress={handleAvatarPress}>
          {userData.avatar ?
              (<Avatar bg='white' mb='1' size="md" source={{ uri: userData.avatar }} />) :
            <Avatar size="md" bg='white' borderWidth={2}>
              <AntDesign name="user" size={30} color="black" />
            </Avatar>}
          </Pressable>
          {userData.data.nickname}
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

            <Box alignItems="center" justifyContent="center">
              <HStack>

                <Avatar bg='white' size={6} borderWidth={2}>
                  <AntDesign name="user" size={15} color="black" />
                  <Avatar.Badge
                    bg="white"
                    position="absolute"
                    top={-4}
                    right={-4}
                  >
                    <Ionicons name="settings-sharp" size={8} color="black" />
                  </Avatar.Badge>
                </Avatar>

                <Box alignItems="center" justifyContent="center" ml={2}>
                  <Button p={0} variant="unstyled" onPress={goAccountSetting}>Account Setting</Button>
                </Box>
              </HStack>
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
