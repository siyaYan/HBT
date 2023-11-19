import React from 'react';
import { View, Text, Button } from 'react-native';

const AccountScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Account Screen</Text>
      <Button
        title="Register"
        onPress={() => navigation.navigate('Register')}
      />
      <Button
        title="Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
};

export default AccountScreen;
