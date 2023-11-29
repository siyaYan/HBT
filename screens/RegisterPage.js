
import { Input, Icon, Pressable, Center, IconButton } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { VStack, HStack, FormControl, Button, Box, Heading, Text } from 'native-base';
import { Alert } from 'react-native';
import { Tooltip } from "native-base";

const Register = ({ navigation }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [formData, setData] = useState({});
    const [errors, setErrors] = useState({
        length: false,
        letterAndNumber: false,
        noSpaces: false,
        specialChars: false,
    });

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

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
        if (validate()) {
            console.log('Submitted')
            handlePasswordReset();
        } else if (validatePassword(formData.password)) {
            console.log('Confirm Failed');
            setData({
                password: formData.password,
                confirmPassword: ''
            });
            setErrors({
                ...errors,
                confirmPassword: ''
            });
        } else {
            console.log('Validation Failed');
            setData({
                password: '',
                confirmPassword: ''
            });
        }
        //TODO: call Register endpoint

    };

    return (
        <Center flex={1} w="100%">
            <Box safeArea p="2" py="8" w="90%" maxW="290">
                <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
                    color: "warmGray.50"
                }}>
                    Creat Account
                </Heading>
                <Heading mt="1" _dark={{
                    color: "warmGray.200"
                }} color="coolGray.600" fontWeight="medium" size="xs">
                    Creat your account to enjoy Habital!
                </Heading>

                <VStack space={3} mt="5">
                    <FormControl isRequired>
                        <FormControl.Label>Username</FormControl.Label>
                        <Input />
                    </FormControl>
                    <FormControl >
                        <FormControl.Label>Nickname</FormControl.Label>
                        <Input />
                    </FormControl>
                    <FormControl isRequired>
                        <FormControl.Label>Email Address</FormControl.Label>
                        <Input />
                    </FormControl>
                    <FormControl isRequired isInvalid={'password' in errors}>
                        <HStack alignItems="space-between">
                            <FormControl.Label _text={{
                                bold: true
                            }}>Password</FormControl.Label>
                            <Tooltip label="Click here to read more" openDelay={100}>
                                <IconButton icon={<Icon as={MaterialIcons} name="info" />} />
                            </Tooltip>
                        </HStack>
                        <Input value={formData.password}
                            placeholder="Password"
                            onChangeText={validatePassword}
                            type={showPassword ? "text" : "password"}
                            InputRightElement={
                                <Pressable onPress={() => setShowPassword(!showPassword)}>
                                    <Icon as={<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                                </Pressable>} />
                        {/* <FormControl.HelperText>
                            <Text>{errors.length ? '✅' : '❌'} Between 8-20 characters</Text>
                            <Text>{errors.letterAndNumber ? '✅' : '❌'} Must include a letter and a number</Text>
                            <Text>{errors.noSpaces ? '✅' : '❌'} Cannot have any spaces</Text>
                            <Text>{errors.specialChars ? '✅' : '❌'} Special characters: !@#%&_?#=- </Text>
                        </FormControl.HelperText> */}
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

                    <Button onPress={onSubmit} mt="2" colorScheme="indigo">
                        Register
                    </Button>
                    <HStack mb={8} justifyContent="center">
                        <Text fontSize="sm" color="coolGray.600" _dark={{
                            color: "warmGray.200"
                        }}>
                            I'm a exist user.{" "}
                        </Text>
                        <Pressable onPress={() => navigation.navigate('Login')}>
                            <Text fontSize='sm' color="indigo.500">Log in</Text>
                        </Pressable>
                    </HStack>
                </VStack>
            </Box>
        </Center>)
};

export default Register;