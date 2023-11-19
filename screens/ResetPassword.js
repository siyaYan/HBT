import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { resetPassword } from '../components/MockApi'; // Import the mock function

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    try {
      // Call the mock registration function
      const response = await resetPassword(email);

      // Handle success or error response
      if (response.success) {
        Alert.alert('Success', response.message);
        // You can navigate to the login screen or perform other actions
      } else {
        Alert.alert('Error', response.message || 'Reset Password failed');
      }
    } catch (error) {
      console.error('Error during Reset Passsword:', error);
      Alert.alert('Error', 'Reset Passsword failed. Please try again later.');
    }
  };

  return (
    <View>
      <Text>Reset Password Screen</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <Button title="Reset Password" onPress={handlePasswordReset} />
    </View>
  );
};

export default ResetPasswordScreen;
