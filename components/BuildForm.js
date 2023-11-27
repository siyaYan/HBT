import React, { useState } from 'react';
import { VStack, FormControl, Input, Button, Text } from 'native-base'; // Adjust based on
import { resetPassword} from './MockApi'; // Import the mock function
import { Alert } from 'react-native';

function BuildForm() {
  const [formData, setData] = useState({});
  const [errors, setErrors] = useState({
    length: false,
    letterAndNumber: false,
    noSpaces: false,
    specialChars: false,
  });

  const validatePassword = (text) => {
    if (text) {
      setData({
        ...formData,
        password: text
      })
      setErrors({
        length: text.length >= 8 && text.length <= 20,
        letterAndNumber: /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/.test(text),
        noSpaces: !/\s/.test(text),
        specialChars: /[!@#%&_?#=-]/.test(text),
      });
      return errors.length && errors.letterAndNumber && errors.noSpaces && errors.specialChars;
    }

  };

  const validate = () => {
    if (formData.password !== formData.confirmPassword) {
      console.log('Passwords do not match.');
      return false;
    } else if (!validatePassword(formData.password)) {
      console.log('Password validation failed.');
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if(validate()){
      console.log('Submitted') 
      handlePasswordReset();
    }else if(validatePassword(formData.password)){
      console.log('Confirm Failed');
      setData({
        password: formData.password,
        confirmPassword: ''
      });
      setErrors({
        ...errors,
        confirmPassword: ''
      });
    }else{
      console.log('Validation Failed');
      setData({
        password: '',
        confirmPassword: ''
      });
    }
    //TODO: call reset endpoint

  };
  const handlePasswordReset = async () => {
    try {
      // Call the mock registration function
      const response = await resetPassword(formData.password);
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

  return (<VStack width="90%" mx="3" maxW="300px">
    <FormControl isRequired isInvalid={'password' in errors}>
      <FormControl.Label _text={{
        bold: true
      }}>Password</FormControl.Label>
      <Input value={formData.password} placeholder="Password" onChangeText={validatePassword} />
      <FormControl.HelperText>
        <Text>{errors.length ? '✅' : '❌'} Between 8-20 characters</Text>
        <Text>{errors.letterAndNumber ? '✅' : '❌'} Must include a letter and a number</Text>
        <Text>{errors.noSpaces ? '✅' : '❌'} Cannot have any spaces</Text>
        <Text>{errors.specialChars ? '✅' : '❌'} Special characters: !@#%&_?#=- </Text>
        <Text>
        </Text>
      </FormControl.HelperText>
    </FormControl>
    <FormControl isRequired isInvalid={'confirmPassword' in errors}>
      <FormControl.Label _text={{
        bold: true
      }}>Confirm Password</FormControl.Label>
      <Input value={formData.confirmPassword} placeholder="Confirm Password" onChangeText={value => setData({
        ...formData,
        confirmPassword: value
      })} />
      {'confirmPassword' in errors ? <FormControl.ErrorMessage>Confirm Password is not correct!</FormControl.ErrorMessage> : <FormControl.HelperText>
        Please confirm your password!
      </FormControl.HelperText>}
    </FormControl>
    <Button onPress={onSubmit} mt="5" colorScheme="cyan">
      Reset Password
    </Button>
  </VStack>);
}


export default BuildForm;