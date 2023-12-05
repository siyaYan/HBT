
import { Input, Icon, Pressable, Center, IconButton } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { VStack, HStack, FormControl, Button, Box, Heading, Text } from 'native-base';
import { Alert } from 'react-native';
import { registerUser } from "../components/Endpoint";
import { Popover } from 'native-base';


const Register = ({ navigation }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setData] = useState({});
    const [errors, setErrors] = useState({
        username:false,
        email:false,
        password:false,
        confirmPassword:false
    });

    //TODO: refactor the variables
    const validateEmail = () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(formData.email);
    };

    const validateUsername = () => {
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/;
        return regex.test(formData.username);
    }

    const validatePassword = () => {
        if (formData.password) {
            const length = formData.password.length >= 8 && formData.password.length <= 20;
            const letterAndNumber = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/.test(formData.password);
            const noSpaces = !/\s/.test(formData.password);
            const specialChars = /[!@#%&_?#=-]/.test(formData.password);
            return length && letterAndNumber && noSpaces && specialChars
        }
        return false;
    };

    const validateConfirm = () => {
        if (formData.confirmPassword) {
            return formData.confirmPassword == formData.password
        }
        return false;
    };

    const handleSubmit = () => {
        let newErrors = {};

        newErrors.username = validateUsername() ? false : true;
        newErrors.email = validateEmail() ? false : true;
        newErrors.password = validatePassword() ? false : true;
        newErrors.confirmPassword = validateConfirm() ? false : true;

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(error => error !== false);
        if (!hasErrors) {
            // If all validations pass, handle successful submission
            if (formData.nickname == '') {
                setData({
                    ...formData,
                    nickname: formData.username
                })
                console.log('Submitted');
                handleRegister();
            }
        } else {
            // Optionally clear inputs here if necessary
            if (newErrors.username) {
                // Clear username if it's invalid
                setData({ ...formData, username: '' });
            }
            if (newErrors.email) {
                // Clear email if it's invalid
                setData({ ...formData, email: '' });
            }
            if (newErrors.password) {
                // Clear username if it's invalid
                setData({ ...formData, password: '' });
            }
            if (newErrors.confirmPassword) {
                // Clear email if it's invalid
                setData({ ...formData, confirmPassword: '' });
            }
            console.log('Form has errors');
        }

        console.log({
            username: formData.username,
            nickname: formData.nickname,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword
        });
        console.log('error', {
            username: errors.username,

            email: errors.email,
            password: errors.password,
            confirm: errors.confirmPassword
        });
    };

    async function handleRegister() {

        // Call the mock registration function
        const response = await registerUser(formData.username, formData.nickname, formData.email, formData.password, formData.confirmPassword);
        // Handle success or error response
        if (response.token) {
            navigation.navigate('Login');
        }
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
                    <FormControl isRequired isInvalid={errors.username !== false}>
                        <FormControl.Label>Username</FormControl.Label>
                        <Input value={formData.username} onChangeText={value => setData({
                            ...formData,
                            username: value
                        })} />
                    </FormControl>
                    <FormControl >
                        <FormControl.Label>Nickname</FormControl.Label>
                        <Input value={formData.nickname} onChangeText={value => setData({
                            ...formData,
                            nickname: value
                        })} />
                    </FormControl>
                    <FormControl isRequired isInvalid={errors.email !== false}>
                        <FormControl.Label>Email Address</FormControl.Label>
                        <Input value={formData.email} onChangeText={value => setData({
                            ...formData,
                            email: value
                        })} />
                    </FormControl>
                    <FormControl isRequired isInvalid={errors.password !== false}>
                        <HStack alignItems="right">
                            <FormControl.Label _text={{
                                bold: true
                            }}>Password</FormControl.Label>

                            <Popover trigger={triggerProps => {
                                return <IconButton {...triggerProps} />;
                            }}>
                                <Popover.Content accessibilityLabel="info" w={'95%'}>
                                    <Popover.Body>
                                        ✅Between 8-20 characters
                                        ✅Must include a letter and a number
                                        ✅Cannot have any spaces
                                        ✅Special characters: !@#%&_?#=-
                                    </Popover.Body>
                                </Popover.Content>
                            </Popover>
                        </HStack>
                        <Input value={formData.password}
                            placeholder="Password"
                            onChangeText={value => setData({
                                ...formData,
                                password: value
                            })}
                            type={showPassword ? "text" : "password"}
                            InputRightElement={
                                <Pressable onPress={() => setShowPassword(!showPassword)}>
                                    <Icon as={<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                                </Pressable>} />
                    </FormControl>
                    <FormControl isRequired isInvalid={errors.confirmPassword !== false}>
                        <FormControl.Label _text={{
                            bold: true
                        }}>Confirm Password</FormControl.Label>
                        <Input value={formData.confirmPassword}
                            placeholder="Confirm Password"
                            onChangeText={value => setData({
                                ...formData,
                                confirmPassword: value
                            })}
                            type={showConfirm ? "text" : "password"}
                            InputRightElement={
                                <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                                    <Icon as={<MaterialIcons name={showConfirm ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                                </Pressable>} />
                        {errors.confirmPassword === true ? <FormControl.ErrorMessage>Confirm Password is not correct!</FormControl.ErrorMessage> : <FormControl.HelperText>
                            Please confirm your password!
                        </FormControl.HelperText>}
                    </FormControl>

                    <Button onPress={handleSubmit} mt="2" colorScheme="indigo">
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
        </Center>

    )
};

export default Register;