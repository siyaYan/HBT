import { useState } from "react";
import { Menu, Center, HamburgerIcon, Pressable, Box, Heading, VStack, HStack, ZStack, IconButton, Button, NativeBaseProvider, Flex } from 'native-base';
import { Avatar } from "native-base";
import { useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useData } from '../context/DataContext';


const SettingScreen = ({ navigation }) => {
  // const route = useRoute();
  // const { params } = route;
  // const data = params;
  // console.log(data,'setting');
  const { userData, updateUserData } = useData();
  console.log(userData,'setting');

  return (
    <NativeBaseProvider>
      <Center flex={1} w="100%">
        <Box safeArea py='8' w="90%" maxW="290">
          <VStack space={3} alignItems='center' >
            <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
              color: "warmGray.50"
            }}>
              Setting Page
              {userData.userName}
            </Heading>
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

export default SettingScreen;
