import React from 'react';
import { Center,Box,Heading,VStack,Button } from 'native-base';

const AccountScreen = ({ navigation }) => {
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
          onPress={() => navigation.navigate('Login')}
        >  Log out  </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default AccountScreen;
