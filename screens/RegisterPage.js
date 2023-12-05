
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
    const [errors, setErrors] = useState({});

    // do not work
    const removeError = fieldToRemove => {
        const { [fieldToRemove]: _, ...newErrors } = errors;
        setErrors(newErrors);
    };

    //TODO: refactor the variables
    const validateEmail = () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (regex.test(formData.email)) {
            // removeError('email');
            // setErrors({
            //     ...errors,
            //     email: false
            // });
            console.log("email valid", errors.email);
            return true;
        } else {
            // setErrors({
            //     ...errors,
            //     email: true
            // });
            console.log("email invalid", errors.email);
        }
        return false;
    };

    const validateUsername = () => {
        // setData({
        //     ...formData,
        //     username: value
        // })
        const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/;
        if (regex.test(formData.username)) {
            setErrors({
                ...errors,
                username: false
            });
            console.log("username valid",errors.username);
            return true;
        } else {
            
            setErrors({
                ...errors,
                username: true
            });
            console.log('username invalid',errors.username);
            return false;
        }

    }

    const validatePassword = () => {
        if (formData.password) {
            const length = formData.password.length >= 8 && formData.password.length <= 20;
            const letterAndNumber = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/.test(formData.password);
            const noSpaces = !/\s/.test(formData.password);
            const specialChars = /[!@#%&_?#=-]/.test(formData.password);
            if (length && letterAndNumber && noSpaces && specialChars) {
                // setErrors({
                //     ...errors,
                //     password: false
                // });
                console.log("password valid",errors.password);
                return true;
            } else {
                // setErrors({
                //     ...errors,
                //     password: true
                // });
            }
        } else {
            // setErrors({
            //     ...errors,
            //     password: true
            // });
        }
        return false;
    };

    const validateConfirm = () => {
        if (formData.confirmPassword) {
            if (formData.confirmPassword == formData.password) {
                // setErrors({
                //     ...errors,
                //     confirmPassword: false
                // });
                console.log("confirm password valid",errors.confirmPassword);
                return true;
            } else {
                // setErrors({
                //     ...errors,
                //     confirmPassword: true
                // });
            }
        }
        return false;
    };

    const handleSubmit = () => {
        // const error={};
        if (validateUsername() && validateEmail() && validateConfirm() && validatePassword()) {
            if (formData.nickname == '') {
                setData({
                    ...formData,
                    nickname: formData.username
                })
                setErrors({});
            }
            console.log('Submitted');
            handleRegister();
        } else if (!validateUsername()) {
            setData({
                ...formData,
                username: ''
            });
            setErrors({
                ...errors,
                username: ''
            });
            // error['username']=''
        } else if (!validateEmail()) {
            setData({
                ...formData,
                email: ''
            });
            setErrors({
                ...errors,
                email: ''
            });
            // error['email']='';
        } else if (!validatePassword()) {
            setData({
                ...formData,
                password: ''
            });
            setErrors({
                ...errors,
                password: ''
            });
            // error['password']='';
        } else if (!validateConfirm()) {
            setData({
                ...formData,
                confirmPassword: ''
            });
            setErrors({
                ...errors,
                confirmPassword: ''
            });
        }
        // setErrors({error});
        // console.log(error);

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

    //TODO: call Register endpoint
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
                    <FormControl isRequired isInvalid={'username' in errors}>
                        <FormControl.Label>Username</FormControl.Label>
                        <Input value={formData.username} onChangeText={value => setData({
                            ...formData,
                            username:value})} />
                    </FormControl>
                    <FormControl >
                        <FormControl.Label>Nickname</FormControl.Label>
                        <Input value={formData.nickname} onChangeText={value => setData({
                            ...formData,
                            nickname: value
                        })} />
                    </FormControl>
                    <FormControl isRequired isInvalid={'email' in errors}>
                        <FormControl.Label>Email Address</FormControl.Label>
                        <Input value={formData.email} onChangeText={value => setData({
                            ...formData,
                            email: value
                        })} />
                    </FormControl>
                    <FormControl isRequired isInvalid={'password' in errors}>
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
                    <FormControl isRequired isInvalid={errors.confirmPassword === true}>
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
                        {errors.confirmPassword===true ? <FormControl.ErrorMessage>Confirm Password is not correct!</FormControl.ErrorMessage> : <FormControl.HelperText>
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