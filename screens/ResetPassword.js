import React, { useState } from 'react';
import { Input, Icon, Pressable, Center, Heading, VStack, Box, FormControl, Button, Text } from 'native-base';
import { resetPassword } from '../components/Endpoint'; // Import the mock function
import { MaterialIcons } from "@expo/vector-icons";

const ResetPassword = ({ navigation }) => {
  const current = '123'
  const [formData, setData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
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

  //Only validate the password match
  const validate = () => {
    let error1 = false;
    let error2 = false;
    let data1 = formData.confirmPassword;
    let data2 = formData.current;
    if (formData.password == formData.confirmPassword && formData.current == current) {
      setErrors({
        ...errors,
        confirmPassword: error1,
        current: error2,
      })
      return true;
    } else {
      if (formData.password !== formData.confirmPassword) {
        console.log('Passwords do not match.');
        data1 = ''
        error1 = true;
        // return false;
      } else {
        console.log('Password match.');
      }
      if (formData.current !== current) {
        console.log('Current Password is wrong.');
        data2 = ''
        error2 = true;
        // return false;
      } else {
        console.log('current password is right.');
      }
      setErrors({
        ...errors,
        confirmPassword: error1,
        current: error2,
      })
      setData({
        ...formData,
        confirmPassword: data1,
        current: data2
      });
      return false;
    }
  };

  const handleSubmit = () => {
    if (validatePassword(formData.password)) {
      setErrors({
        ...errors,
        password: false
      });
      if (validate()) {
        console.log('Submitted')
        console.log(errors.confirmPassword)
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
        password: true
      })
    }

  };

  const handlePasswordReset = async () => {
    // Call the mock registration function
    const response = await resetPassword(formData.current, formData.password, formData.confirmPassword);
    // Handle success or error response
    if (response == 'failed') {
      setErrors({
        ...errors,
        current: true
      })
      console.log("current password wrong")
      return false;
    }
  };

  return (
    <Center w="100%" >
      <Box safeArea py="8" w="90%" maxW="290" >
        <VStack mt="5" >
          <Center>
            <FormControl mb={5} isRequired isInvalid={errors.current}>
              <FormControl.Label _text={{
                bold: true
              }}>Current password</FormControl.Label>
              <Input value={formData.current}
                placeholder="Enter your current password"
                onChangeText={value => setData({
                  ...formData,
                  current: value
                })} type={showCurrent ? "text" : "password"}
                InputRightElement={
                  <Pressable onPress={() => setShowCurrent(!showCurrent)}>
                    <Icon as={<MaterialIcons name={showCurrent ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                  </Pressable>} />
              <FormControl.ErrorMessage>{errors.current ? 'Current Password is not correct!' : ''}</FormControl.ErrorMessage>

            </FormControl>
            <FormControl  mb={5} isRequired isInvalid={errors.password}>
              <FormControl.Label _text={{
                bold: true
              }}>Password</FormControl.Label>
              <Input value={formData.password}
                placeholder="Enter the new password"
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
            <FormControl mb={5}  isRequired isInvalid={errors.confirmPassword}>
              <FormControl.Label _text={{
                bold: true
              }}>Confirm Password</FormControl.Label>
              <Input value={formData.confirmPassword}
                placeholder="Confirm new Password"
                onChangeText={value => setData({
                  ...formData,
                  confirmPassword: value
                })} type={showConfirm ? "text" : "password"}
                InputRightElement={
                  <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                    <Icon as={<MaterialIcons name={showConfirm ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                  </Pressable>} />
              <FormControl.ErrorMessage>
                {errors.confirmPassword ? 'Confirm Password is not correct!' : ''}
              </FormControl.ErrorMessage>

            </FormControl>
            <Button w="100%" onPress={handleSubmit} mt="5" colorScheme="cyan">
              Proceed to change
            </Button>
          </Center>
        </VStack>
      </Box>
    </Center>

  );
};

export default ResetPassword;
