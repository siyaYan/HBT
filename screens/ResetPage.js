import React, { useState } from 'react';
import { Input, Icon, Pressable, Center, Heading, VStack, Box,FormControl, Button, Text } from 'native-base';
import { resetPassword } from '../components/Endpoint'; // Import the mock function
import { Alert } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

const ResetPassword = ({ navigation }) => {

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
      console.log("no token")
      return false;
    } else {
      setErrors({
        ...errors,
        token: false
      })
      console.log("have token")
    }
    if (formData.password !== formData.confirmPassword) {
      console.log('Passwords do not match.');
      setData({
        ...formData,
        confirmPassword: ''
      });
      setErrors({
        ...errors,
        confirmPassword:true
      })
      return false;
    } else {
      console.log('Passwords match.');
    }
    return true;
  };

  const handleSubmit = () => {
    if (validatePassword(formData.password)) {
      setErrors({
        ...errors,
        password:false
      });
      if (validate()) {
        console.log('Submitted')
        handlePasswordReset();
      }
    } else {
      console.log('Validation Password Failed');
      setData({
        ...formData,
        password: '',
      });
      setErrors({
        ...errors,
        password:true
      })
    }

  };

  const handlePasswordReset = async () => {

      // Call the mock registration function
      const response = await resetPassword(formData.password, formData.confirmPassword,formData.token);
      // Handle success or error response
      if (response.token) {
        navigation.navigate('Login');
        console.log(response.token);
      }
  };

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
          <Center>
            <FormControl isRequired isInvalid={errors.token===true}>
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
            <FormControl isRequired isInvalid={errors.password===true}>
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
            <FormControl isRequired isInvalid={errors.confirmPassword===true}>
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
          </Center>
        </VStack>
      </Box>
    </Center>

  );
};

export default ResetPassword;
