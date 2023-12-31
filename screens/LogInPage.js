
import { Input, Icon, Checkbox, Pressable, Center, Modal } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { VStack, HStack, FormControl, Button, Box, Heading, Link, Text } from 'native-base';
// import ResetModal from "../components/ResetModal";
import { Alert } from 'react-native';
import { loginUser, forgetSendEmail } from '../components/Endpoint';
import * as SecureStore from 'expo-secure-store';
import { useData } from '../context/DataContext';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
//     webClientId: '720818502811-gvpcgktd6jgf21fbdt3sa9e6v9iu7e5d.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access. 
//   });
const LoginScreen = ({ navigation }) => {
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    const [formData, setData] = useState();
    const [remember, setRemember] = useState(true);
    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const {userData, updateUserData}= useData();
    // console.log(userData)
    // const signIn = async () => {
    //     try {
    //       await GoogleSignin.hasPlayServices();
    //       const userInfo = await GoogleSignin.signIn();
    //       setState({ userInfo });
    //     } catch (error) {
    //       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //         // user cancelled the login flow
    //       } else if (error.code === statusCodes.IN_PROGRESS) {
    //         // operation (e.g. sign in) is in progress already
    //       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //         // play services not available or outdated
    //       } else {
    //         // some other error happened
    //       }
    //     }
    //   };

    const saveCredentials = async (id, password) => {
        try {
            await SecureStore.setItemAsync('userCredentials', JSON.stringify({ id, password }));
        } catch (error) {
            console.error('Failed to store the credentials securely', error);
            // Handle the error, like showing an alert to the user
            Alert.alert('Error', 'Failed to securely save your credentials. You may need to login again next time.');
        }
    };

    // Method to handle login
    async function handleSubmit() {
        console.log({
            id: formData.id,
            password: formData.password,
            rememberMe: remember
        });
        if (submitValidation()) {
            const response = await loginUser(formData.id, formData.password)
            if (response.token) {
                if (remember) {
                    await saveCredentials(formData.id, formData.password);
                }
                updateUserData({
                    token:response.token,
                    userName:formData.id
                })
                navigation.navigate('MainStack', { screen: 'Home'});
                // console.log(response.token);
            } else {
                console.log('login failed');
            }
        }
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const handleResend = () => {
        // Validate the email
        if (validateEmail(email)) {
            console.log({ email });
            handleSentEmail();
            setShowModal(false);
            setEmail(''); // Clear the email state after successful submission
            setError(false)

        } else {
            setEmail(''); // Clear the email state after successful submission
            setError(true);
            // Keep the modal open and display the error message
        }
    };

    const handleSentEmail = async () => {
        const response = await forgetSendEmail(email);
        if (response.status == 'success') {
            // navigation.navigate('Reset');
            navigation.navigate('LoginStack', { screen: 'Reset' })
        };
    }

    const submitValidation = () => {
        if (formData.id && formData.password) {
            // validateEmail();
            return true;
        } else if (formData.id) {
            setErrors({
                password: ''
            })
            return false;
        } else {
            setErrors({
                id: '',
                password: ''
            })
            return false;
        }
    };

    return (
        <Center flex={1} w="100%">
            <Box safeArea p="2" py="8" w="90%" maxW="290">
                <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{
                    color: "warmGray.50"
                }}>
                    Welcome to Habital
                </Heading>
                <Heading mt="1" _dark={{
                    color: "warmGray.200"
                }} color="coolGray.600" fontWeight="medium" size="xs">
                    Log in to continue!
                </Heading>

                <VStack space={3} mt="5">
                    <FormControl isRequired isInvalid={'id' in errors}>
                        {/* <FormControl.Label></FormControl.Label> */}
                        <Input onChangeText={value => setData({
                            ...formData,
                            id: value
                        })} placeholder="Email/Username" />
                        <FormControl.ErrorMessage></FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={'password' in errors}>
                        {/* <FormControl.Label></FormControl.Label> */}
                        <Input placeholder='Password' onChangeText={value => setData({
                            ...formData,
                            password: value
                        })} type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
                            <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                        </Pressable>} />
                    </FormControl>
                    <HStack space={6} >
                        <Checkbox ml='1' size='sm' defaultIsChecked onPress={value => setRemember(!remember)} >Remember
                        </Checkbox>
                        <Link>
                            {/* <ResetModal /> */}
                            <Pressable onPress={() => setShowModal(true)}>
                                <Text fontSize={15} color="indigo.500">forget password?</Text>
                            </Pressable>
                            {/* <Button onPress={() => setShowModal(true)}>Forget Password?</Button> */}
                            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                                <Modal.Content maxWidth="400px">
                                    <Modal.CloseButton />
                                    <Modal.Header>Send Reset Password Email</Modal.Header>
                                    <Modal.Body>
                                        <FormControl mt="3" isInvalid={!!error} isRequired>
                                            <FormControl.Label>Email</FormControl.Label>
                                            <Input value={email} onChangeText={setEmail} placeholder="example@email.com" />
                                            {error ? <FormControl.ErrorMessage>Please enter a valid email address.</FormControl.ErrorMessage> : <FormControl.HelperText>

                                            </FormControl.HelperText>}
                                        </FormControl>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button.Group space={2}>
                                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                                setShowModal(false);
                                                setError(false); // Clear any errors
                                            }}>
                                                Cancel
                                            </Button>
                                            <Button onPress={handleResend}>
                                                Send
                                            </Button>
                                        </Button.Group>
                                    </Modal.Footer>
                                </Modal.Content>
                            </Modal>
                        </Link>
                    </HStack>
                    <Button onPress={handleSubmit} mt="2" colorScheme="indigo">
                        Sign in
                    </Button>
                    <HStack mt="6" justifyContent="center">
                        <Text fontSize="sm" color="coolGray.600" _dark={{
                            color: "warmGray.200"
                        }}>
                            New to Habital?{"  "}
                        </Text>
                        <Pressable onPress={() => navigation.navigate('LoginStack', { screen: 'Register' })}>
                            <Text fontSize='sm' color="indigo.500">Sign Up</Text>
                        </Pressable>
                        <Text fontSize="sm" color="coolGray.600" _dark={{
                            color: "warmGray.200"
                        }}>
                            {" "}to start!
                        </Text>
                    </HStack>
                </VStack>
            </Box>
        </Center>
    )
};

export default LoginScreen;