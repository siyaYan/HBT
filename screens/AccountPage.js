import React from 'react';
import { Center,Box,Heading,VStack,Button } from 'native-base';
import * as SecureStore from 'expo-secure-store';

const AccountScreen = ({ navigation }) => {
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
      navigation.navigate('Login');
    } catch (error) {
      // Error clearing the credentials
    }
  };
  return (
    <Center flex={1} w="100%">
      <Box safeArea py='8' w="90%" maxW="290">
        <VStack space={3} alignItems='center' >
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
          color: "warmGray.50"
        }}>
          Account Page
        </Heading>
        <Button
          onPress={logout}
        >  Log out  </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default AccountScreen;
