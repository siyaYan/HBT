
import * as SecureStore from 'expo-secure-store';
import { useState } from "react";
import { Center, Box, VStack, IconButton, Button, NativeBaseProvider, Flex } from 'native-base';
import { Avatar } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { Ionicons } from '@expo/vector-icons';
import OptionMenu from '../components/OptionMenu';

const AccountScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  console.log(userData, 'account');

  const deleteCredentials = async () => {
    try {
      await SecureStore.deleteItemAsync('userCredentials');
      updateUserData({
        token:'',
        userName:''
      })
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
      <Flex direction="column" alignItems='center'>
          <OptionMenu />
          <Box safeArea py='2' w="100%" maxW="290">
            <VStack space={3} alignItems='center' >
              <Box py='2's alignItems="center" justifyContent="center">
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
              <Button
                onPress={logout} size='md' p='1'
              >  Log out  </Button>
            </VStack>
          </Box>
      </Flex>
    </NativeBaseProvider>
  );
};

export default AccountScreen;
