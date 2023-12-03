import React, { useState } from 'react';
import { FormControl, Button, Text, Center } from 'native-base'; // Adjust based on
import { resetPassword } from '../components/Endpoint'; // Import the mock function
import { Alert } from 'react-native';
import { Input, Icon, Pressable } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";

function BuildForm() {
  const [formData, setData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({
    length: false,
    letterAndNumber: false,
    noSpaces: false,
    specialChars: false,
    token: false
  });

  //for real time check effect
  const validatePassword = (text) => {
    setData({
      ...formData,
      password: text
    })
    if (text) {
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
    if (!formData.token) {
      setErrors({
        ...errors,
        token: true
      })
      return false;
    } else {
      setErrors({
        ...errors,
        token: false
      })
      console.log("no token")
    }
    if (formData.password !== formData.confirmPassword) {
      console.log('Passwords do not match.');
      return false;
    } else {
      console.log('Passwords match.');
    }
    return true;
  };

  const handleSubmit = () => {

    if (validatePassword(formData.password)) {
      if (validate()) {
        console.log('Submitted')
        handlePasswordReset();
      }else{

      }
      console.log('Confirm Failed');
      setData({
        password: formData.password,
        confirmPassword: ''
      });
      setErrors({
        ...errors,
        confirmPassword: true
      });
    } else {
      console.log('Validation Failed');
      setData({
        password: '',
        confirmPassword: ''
      });
    }
    //TODO: call reset endpoint

  };

  const handlePasswordReset = async () => {

      // Call the mock registration function
      const response = await resetPassword(formData.password);
      // Handle success or error response
      if (response.token) {
        navigation.navigate('Home');
        console.log(response.token);
      }

  };

  return (
    <Center>
      <FormControl isRequired isInvalid={!errors.token}>
        <FormControl.Label _text={{
          bold: true
        }}>Token</FormControl.Label>
        <Input value={formData.token}
          placeholder="Input your reset password token"
          onChangeText={value => setData({
            ...formData,
            token: value
          })} />
      </FormControl>
      <FormControl isRequired isInvalid={'password' in errors}>
        <FormControl.Label _text={{
          bold: true
        }}>Password</FormControl.Label>
        <Input value={formData.password}
          placeholder="Password"
          onChangeText={validatePassword}
          type={showPassword ? "text" : "password"}
          InputRightElement={
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Icon as={<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
            </Pressable>} />
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
        <Input value={formData.confirmPassword}
          placeholder="Confirm Password"
          onChangeText={value => setData({
            ...formData,
            confirmPassword: value
          })} type={showConfirm ? "text" : "password"}
          InputRightElement={
            <Pressable onPress={() => setShowConfirm(!showConfirm)}>
              <Icon as={<MaterialIcons name={showConfirm ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
            </Pressable>} />
        {'confirmPassword' in errors ? <FormControl.ErrorMessage>Confirm Password is not correct!</FormControl.ErrorMessage> : <FormControl.HelperText>
          Please confirm your password!
        </FormControl.HelperText>}
      </FormControl>
      <Button w="100%" onPress={handleSubmit} mt="5" colorScheme="cyan">
        Reset Password
      </Button>
    </Center>);
}


export default BuildForm;