import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert } from 'react-native';
import BuildForm from '../components/BuildForm';
import { Center, Heading, VStack, Box } from 'native-base';

const ResetPassword = ({ navigation }) => {

  return (
    <Center w="100%">
      <Box safeArea py="8" w="90%" maxW="290">
      <VStack space={1} alignItems="center">
        <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
          color: "warmGray.50"
        }}>
          Reset Your Password
        </Heading>
        <Heading mt="3" Center _dark={{
          color: "warmGray.200"
        }} color="coolGray.600" fontWeight="medium" size="xs">
          Enter a new password to reset!
        </Heading>
        </VStack>
        <VStack mt="5">
          <BuildForm />
        </VStack>
      </Box>
    </Center>

  );
};

export default ResetPassword;
