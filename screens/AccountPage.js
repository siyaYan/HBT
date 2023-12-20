
import * as SecureStore from 'expo-secure-store';
import { useState } from "react";
import { Menu, Center, HamburgerIcon, Pressable, Box, Heading, VStack, HStack, ZStack, IconButton, Button, NativeBaseProvider, Flex } from 'native-base';
import { Avatar } from "native-base";
// import { useRoute } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { useData } from '../context/DataContext';

const AccountScreen = ({ navigation }) => {
  // const route = useRoute();
  // const { params } = route;
  // const data = params;
  const { userData, updateUserData } = useData();
  console.log(userData,'account');

  const deleteCredentials = async () => {
    try {
      await SecureStore.deleteItemAsync('userCredentials');
    } catch (error) {
      console.error('Failed to delete the credentials', error);
      // Handle the error, like showing an alert to the user
    }
  };
  const logout = async () => {
    try {
      await deleteCredentials()
      navigation.navigate('LoginStack', { screen: 'Login' });
    } catch (error) {
      // Error clearing the credentials
    }
  };
  return (
    <NativeBaseProvider>
      <Center flex={1} w="100%">
        <Box safeArea py='8' w="90%" maxW="290">
          <VStack space={3} alignItems='center' >
            <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
              color: "warmGray.50"
            }}>
              Account Page
              {userData.userName}
            </Heading>
            <Button
              onPress={logout}
            >  Log out  </Button>
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

export default AccountScreen;
