
import { Input, Icon, Checkbox, Pressable, Center } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { VStack, HStack, FormControl, Button, Box, Heading, Link, Text } from 'native-base';
import ResetModal from "../components/ResetModal";
import { Alert } from 'react-native';
import { loginUser, sendEmail } from '../components/MockApi'

const Login = ({ navigation }) => {
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    const [formData, setData] = useState({ status: true });
    const [errors, setErrors] = useState({});

    // Method to handle login
    async function handleSubmit() {
        console.log({
            id: formData.id,
            password: formData.password,
            status: formData.status,
        });
        if (submitValidation()) {
            const response = await loginUser(formData.id, formData.password)
            if (response.token) {
                navigation.navigate('Home');
                console.log(response.token);
            }
        }
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // TODO: do not know whether is email or username
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
                        <FormControl.Label>Email/Username</FormControl.Label>
                        <Input onChangeText={value => setData({
                            ...formData,
                            id: value
                        })} />
                        <FormControl.ErrorMessage></FormControl.ErrorMessage>
                    </FormControl>
                    <FormControl isRequired isInvalid={'password' in errors}>
                        <FormControl.Label>Password</FormControl.Label>
                        <Input onChangeText={value => setData({
                            ...formData,
                            password: value
                        })} type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
                            <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                        </Pressable>} />
                    </FormControl>
                    <HStack space={6} >
                        <Checkbox ml='1' size='sm' defaultIsChecked onChange={value => setData({
                            ...formData,
                            status: value
                        })} >Remember
                        </Checkbox>
                        {/* <Checkbox isChecked={status} onChange={setStatus(value)} value={status}>check</Checkbox> */}
                        <Link>
                            <ResetModal />
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
                        <Pressable onPress={() => navigation.navigate('Register')}>
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
        </Center>)
};

export default Login;