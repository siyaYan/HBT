
import { Input, Icon, Pressable, Center, IconButton } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { VStack, HStack, FormControl, Button, Box, Heading, Text ,WarningOutlineIcon} from 'native-base';
import { registerUser } from "../components/Endpoint";


const RegisterScreen = ({ navigation }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setData] = useState({});
    const [errors, setErrors] = useState({
        email:true,
        username:true,
        confirmPassword:true,
        password:true,
    });
    const [showMessage, setShowMessage] = useState({
        username: {
            constrain1: true,
            constrain2: true,
            constrain3: true
        },
        password: false,
        confirmPassword: 'Please confirm your password.',
        textProp: 'Input your username start with charactor.'
    });

    //Implement show corresponding messages for each input field
    // Handle focus for password field
    const handlePasswordFocus = () => {
        setShowMessage({ ...showMessage, password: true });
    };

    // Handle blur for password field
    const handlePasswordBlur = () => {
        setShowMessage({ ...showMessage, password: false });
    };

    const validateEmail = (text) => {
        setData({
            ...formData,
            email: text
        });
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const res = regex.test(text);
        console.log(res)
        if (text) {
            setErrors({
                ...errors,
                email: res
            })
            return res;
        }
    };

    const validateUsername = (text) => {
        setData({
            ...formData,
            username: text
        })
        // It must start with a letter.
        // It must be between 5 and 20 characters in length.
        // It must contain at least one digit.
        if (text) {
            let Prop = '';
            if (!/(?=.*\d)[A-Za-z\d]/.test(text)) {
                Prop = 'It should contain at least one digit.'
            }
            if (!(text.length <= 20 && text.length >= 5)) {
                Prop = 'Length should be between 5 to 20 characters.'
            }
            if (!/^(?=.*[A-Za-z])/.test(text)) {
                Prop = 'It should start with a letter.'
            }
            setShowMessage({
                ...showMessage,
                username: {
                    constrain1: /^(?=.*[A-Za-z])/.test(text),
                    constrain2: text.length <= 20 && text.length >= 5,
                    constrain3: /(?=.*\d)[A-Za-z\d]/.test(text)
                },
                textProp: Prop
            }),
            setErrors({
                ...errors,
                username:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/.test(text)
            })
            console.log(showMessage.username);
            // console.log(showMessage.textProp,'in');
            return showMessage.username.constrain1 && showMessage.username.constrain2 && showMessage.username.constrain3;
        }
    };

    // const validatePassword = () => {
    //     if (formData.password) {
    //         const length = formData.password.length >= 8 && formData.password.length <= 20;
    //         const letterAndNumber = /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/.test(formData.password);
    //         const noSpaces = !/\s/.test(formData.password);
    //         const specialChars = /[!@#%&_?#=-]/.test(formData.password);
    //         return length && letterAndNumber && noSpaces && specialChars
    //     }
    //     return false;
    // };
    const validatePassword = (text) => {
        setData({
            ...formData,
            password: text
        })
        if (text) {
            setErrors({
                ...errors,
                length: text.length >= 8 && text.length <= 20,
                letterAndNumber: /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/.test(text),
                noSpaces: !/\s/.test(text),
                specialChars: /[!@#%&_?#=-]/.test(text),
                password:/^(?=.*[A-Za-z].*[0-9]|[0-9].*[A-Za-z])(?=\S{8,20})(?=.*[!@#%&_?#=-])/.test(text)
            });
            return errors.length && errors.letterAndNumber && errors.noSpaces && errors.specialChars;
        }
    };

    const validateConfirm = (text) => {
        setData({
            ...formData,
            confirmPassword: text
        })
        const res = text === formData.password
        if(text){
            setErrors({
                ...errors,
                confirmPassword: res
            });
            return res
        }
    };

    const handleSubmit = () => {
        const hasErrors = Object.values(errors).some(error => error == false);

        if (!hasErrors) {
            // If all validations pass, handle successful submission
            if (formData.nickname == '') {
                setData({
                    ...formData,
                    nickname: formData.username
                })
            }
            console.log('Submitted');
            handleRegister();
        } else {
            // Optionally clear inputs here if necessary
            // if (newErrors.username) {
            //     // Clear username if it's invalid
            //     setData({ ...formData, username: '' });
            // }
            // if (newErrors.email) {
            //     // Clear email if it's invalid
            //     setData({ ...formData, email: '' });
            // }
            // if (newErrors.password) {
            //     // Clear username if it's invalid
            //     setData({ ...formData, password: '' });
            // }
            // if (newErrors.confirmPassword) {
            //     // Clear email if it's invalid
            //     setData({ ...formData, confirmPassword: '' });
            // }
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
            navigation.navigate('LoginStack', { screen: 'Login'})
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
                    <FormControl isRequired isInvalid={!errors.username}>
                        <Input placeholder="Username" value={formData.username} onChangeText={validateUsername} />
                        {Object.values(showMessage.username).some(value => value === false) ?
                            <FormControl.ErrorMessage>
                                {showMessage.textProp}
                            </FormControl.ErrorMessage> :
                            <FormControl.HelperText>
                                {showMessage.textProp?showMessage.textProp:'Well done!'}
                            </FormControl.HelperText>
                        }
                    </FormControl>
                    <FormControl >
                        <Input placeholder="Nickname" value={formData.nickname} onChangeText={value => setData({
                            ...formData,
                            nickname: value
                        })} />
                        <FormControl.HelperText>
                            Nick name is optional.
                        </FormControl.HelperText>
                    </FormControl>

                    <FormControl isRequired isInvalid={!errors.email}>
                        <Input placeholder="Email" value={formData.email} onChangeText={validateEmail} />
                        {errors.email ?
                            <FormControl.HelperText>
                                Please input your email address.
                            </FormControl.HelperText>
                            :
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                            Invalid email address.
                          </FormControl.ErrorMessage>
                        }
                    </FormControl>

                    <FormControl isRequired isInvalid={!errors.password}>
                        <Input onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                            value={formData.password}
                            placeholder="Password"
                            onChangeText={validatePassword}
                            type={showPassword ? "text" : "password"}
                            InputRightElement={
                                <Pressable onPress={() => setShowPassword(!showPassword)}>
                                    <Icon as={<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                                </Pressable>} />
                        {showMessage.password ?
                            <FormControl.HelperText>
                                <Text>{errors.length ? '✅' : '❌'} Between 8-20 characters</Text>
                                <Text>{errors.letterAndNumber ? '✅' : '❌'} Must include a letter and a number</Text>
                                <Text>{errors.noSpaces ? '✅' : '❌'} Cannot have any spaces</Text>
                                <Text>{errors.specialChars ? '✅' : '❌'} Special characters: !@#%&_?#=- </Text>
                            </FormControl.HelperText> :
                            <FormControl.HelperText>
                                Please input your password.
                            </FormControl.HelperText>
                        }
                    </FormControl>

                    <FormControl isRequired isInvalid={!errors.confirmPassword}>
                        <Input value={formData.confirmPassword}
                            placeholder="Confirm Password"
                            onChangeText={validateConfirm}
                            type={showConfirm ? "text" : "password"}
                            InputRightElement={
                                <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                                    <Icon as={<MaterialIcons name={showConfirm ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
                                </Pressable>} />
                        {!errors.confirmPassword ? 
                        <FormControl.ErrorMessage>Confirm Password is not correct!</FormControl.ErrorMessage> 
                        : <FormControl.HelperText>Please confirm your password.</FormControl.HelperText>}
                    </FormControl>

                    <Button onPress={handleSubmit} mt="2" colorScheme="indigo">
                        Register
                    </Button>
                    <HStack mb={6} justifyContent="center">
                        <Text fontSize="sm" color="coolGray.600" _dark={{
                            color: "warmGray.200"
                        }}>
                            I'm a exist user.{" "}
                        </Text>
                        <Pressable onPress={() => navigation.navigate('LoginStack', { screen: 'Login'})}>
                            <Text fontSize='sm' color="indigo.500">Log in</Text>
                        </Pressable>
                    </HStack>
                </VStack>
            </Box>
        </Center>

    )
};

export default RegisterScreen;