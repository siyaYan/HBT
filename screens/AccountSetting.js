
import { Input, Icon, Pressable, Center, IconButton } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { VStack, HStack, FormControl, Button, Box, Heading, Text, WarningOutlineIcon } from 'native-base';
import { resetEmail, resetProfile, resetSendEmail } from "../components/Endpoint";


const AccountSettingScreen = ({ navigation }) => {
    const [formData, setData] = useState({});
    const [errors, setErrors] = useState({
        email: true,
        username: true,
        confirmPassword: true,
        password: true,
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
                email: 'Invalid email address.'
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
                    username: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/.test(text)
                })
            console.log(showMessage.username);
            // console.log(showMessage.textProp,'in');
            return showMessage.username.constrain1 && showMessage.username.constrain2 && showMessage.username.constrain3;
        }
    };
    async function saveProfile () {
        const response = await resetProfile(formData.nickname,formData.username);
        // Handle success or error response
        if (response=='failed') {
            setData({
                ...formData,
                username:''
            })
        }
    };
    async function saveEmail () {
        const response = await resetEmail(email, token);
        // Handle success or error response
        if (response=='failed') {
            setData({
                ...formData,
                token:''
            })
            setErrors({
                ...errors,
                token:'Reset token invalid'
            })
        }
    };
    async function sendToken () {
        const response = await resetSendEmail(email);
        // Handle success or error response
        if (response=='failed') {
            setData({
                ...formData,
                email:''
            })
            setErrors({
                ...errors,
                email:'Email address invalid'
            })
        }
    };

    const goResetPassword = () => {
        // Navigate to another screen when the Avatar is pressed
        navigation.navigate('AccountStack', {screen: 'ResetPassword'}); 
      };

    return (
        <Center flex={1} w="100%">
            <Box safeArea p="2" py="8" w="90%" maxW="290">
                <VStack space={3} mt="5">
                    <FormControl isRequired isInvalid={!errors.username}>
                        <Input placeholder="Username" value={formData.username} onChangeText={validateUsername} />
                        {Object.values(showMessage.username).some(value => value === false) ?
                            <FormControl.ErrorMessage>
                                {showMessage.textProp}
                            </FormControl.ErrorMessage> :
                            <FormControl.HelperText>
                                {showMessage.textProp ? showMessage.textProp : 'Well done!'}
                            </FormControl.HelperText>
                        }
                        <Button onPress={saveProfile} mt="2" colorScheme="indigo">
                            Save
                        </Button>
                    </FormControl>
                    <FormControl >
                        <Input placeholder="Nickname" value={formData.nickname} onChangeText={value => setData({
                            ...formData,
                            nickname: value
                        })} />
                        <FormControl.HelperText>
                            Nick name is optional.
                        </FormControl.HelperText>
                        <Button onPress={saveProfile} mt="2" colorScheme="indigo">
                            Save
                        </Button>
                    </FormControl>

                    <FormControl isRequired isInvalid={!errors.email}>
                        <Input placeholder="Email" value={formData.email} onChangeText={validateEmail} />
                        {errors.email ?
                            <FormControl.HelperText>
                            </FormControl.HelperText>
                            :
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {errors.email}
                            </FormControl.ErrorMessage>
                        }
                        <Button onPress={sendToken} mt="2" colorScheme="indigo">
                            verify
                        </Button>
                    </FormControl>

                    <Button onPress={goResetPassword} mt="2" colorScheme="indigo">
                        Change your password
                    </Button>
                </VStack>
            </Box>
        </Center>

    )
};

export default AccountSettingScreen;