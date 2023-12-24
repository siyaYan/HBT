
import { Input, Icon, Pressable, Center, IconButton, Row } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useState , useEffect} from "react";
import { Avatar } from "native-base";
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { VStack, HStack, FormControl, Button, Box, Heading, Text, Label } from 'native-base';
import { resetEmail, resetProfile, resetSendEmail } from "../components/Endpoint";
import { useData } from '../context/DataContext';
import { Alert } from 'react-native';


const AccountSettingScreen = ({ navigation }) => {
    const { userData, updateUserData } = useData();
    useEffect(() => {
        // Fetch or update avatar dynamically
        // userData=useData().useData
        console.log(userData, 'inHome');
      }, [userData]);
    
    const [formData, setData] = useState({
        nickname: 'nickname',
        username: userData.userName,
        email: '123@123.com',
        token:'',
        send:false
    });
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
                    username: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/.test(text)
                })
            console.log(showMessage.username);
            // console.log(showMessage.textProp,'in');
            return showMessage.username.constrain1 && showMessage.username.constrain2 && showMessage.username.constrain3;
        }
    };
    const validateNickname = (text) => {
        setData({
            ...formData,
            nickname: text
        })
        if (text) {
            console.log(text, 'nickname');
            setErrors({
                ...errors,
                nickname: false
            })
            return true;
        } else {
            setErrors({
                ...errors,
                nickname: 'nick name can not be empty.'
            })
            return false;
        }
    }
    async function saveNickName() {
        Alert.alert('Success', 'Reset Profile successful');
        console.log('reset profile success');
        // const response = await resetProfile(formData.nickname, formData.username);
        // Handle success or error response
        // if (response == 'failed') {
        //     setData({
        //         ...formData,
        //         username: ''
        //     })
        // }
    };
    async function saveUsername() {
        const response = await resetProfile(formData.nickname, formData.username);
        // Handle success or error response
        if (response == 'failed') {
            setData({
                ...formData,
                username: ''
            })
        }
    };
    async function saveEmail() {
        const response = await resetEmail(formData.email, formData.token);
        // Handle success or error response
        if (response == 'failed') {
            setData({
                ...formData,
                token: ''
            })
            setErrors({
                ...errors,
                token: 'Reset token invalid'
            })
        }
    };
    async function sendToken() {
        const response = await resetSendEmail(formData.email);
        // Handle success or error response
        if (response == 'failed') {
            setData({
                ...formData,
                email: '',
                send:false
            })
            setErrors({
                ...errors,
                email: 'Email address invalid'
            })

        }else{
            setData({
                ...formData,
                send:true
            })
        }
    };

    const goResetPassword = () => {
        // Navigate to another screen when the Avatar is pressed
        navigation.navigate('AccountStack', { screen: 'ResetPassword' });
    };

    return (
        <Center w="100%">
            <Box w="100%" maxW="290">
                <Box mt={5} alignItems="center" justifyContent="center">
                {userData.avatar ?
              (<Avatar bg='white' mb='1' size="md" source={{ uri: userData.avatar }} />) : 
                    <Avatar bg='white' mb='1' size="lg" borderWidth={2}>
                        <AntDesign name="user" size={40} color="black" />
                        <Avatar.Badge
                            bg="white"
                            position="absolute"
                            top={0}
                            right={0}
                        >
                            <Ionicons name="settings-sharp" size={16} color="black" />
                        </Avatar.Badge>
                    </Avatar>}
                </Box>
                <VStack space={8} mt="5">
                    <FormControl isInvalid={errors.nickname}>
                        <Box flexDir="row" w="100%">
                            <FormControl.Label _text={{
                                bold: true
                            }}>Nick name</FormControl.Label>
                            <Input ml={2} mr={3} w="60%" placeholder="Nickname" value={formData.nickname} onChangeText={validateNickname} />
                            <IconButton icon={<Ionicons name="save-outline" size={24} color="black" />}
                                p={0} onPress={saveNickName} />
                        </Box>
                        <Box ml={20} >
                            <FormControl.ErrorMessage>
                                {errors.nickname ? errors.nickname : ''}
                            </FormControl.ErrorMessage>
                        </Box>

                    </FormControl>

                    <FormControl isInvalid={!errors.username}>
                        <Box flexDir="row" w="100%">
                            <FormControl.Label _text={{
                                bold: true
                            }}>User name</FormControl.Label>
                            <Input ml={2} mr={3} w="60%" placeholder="Username" value={formData.username} onChangeText={validateUsername} />
                            <IconButton icon={<Ionicons name="save-outline" size={24} color="black" />}
                                p={0} onPress={saveUsername} />
                        </Box>
                        <Box ml={20} >
                            <FormControl.ErrorMessage>
                                {Object.values(showMessage.username).some(value => value === false) ? showMessage.textProp : ''}
                            </FormControl.ErrorMessage>
                        </Box>
                    </FormControl>


                    <FormControl isInvalid={!errors.email}>
                        <Box flexDir="row" w="100%">
                            <FormControl.Label mr={9} _text={{
                                bold: true
                            }}>Email</FormControl.Label>
                            <Input ml={2} mr={3} w="60%" placeholder="Email" value={formData.email} onChangeText={validateEmail} />
                            <IconButton icon={<MaterialCommunityIcons name="email-search-outline" size={24} color="black" />}
                                p={0} onPress={sendToken} />
                        </Box>
                        <Box ml={20}>
                            <FormControl.ErrorMessage>
                                {!errors.email ? 'Email address is not valid' : ''}
                            </FormControl.ErrorMessage>
                        </Box>
                    </FormControl>
                    {formData.send? (<Box flexDir="row" w="100%" alignItems="center">
                        <Text mr={8}>Vertify</Text>
                        <Input ml={2} mr={3} w="60%" placeholder="Enter your email token" value={formData.token} onChangeText={(value)=>{
                            setData({
                                ...formData,
                                token:value
                            })
                        }} />
                        <IconButton icon={<Ionicons name="save-outline" size={24} color="black" />}
                                p={0} onPress={saveEmail} />
                    </Box>):('')}
                    {/* <Box flexDir="row" w="100%" alignItems="center">
                        <Text mr={8}>Vertify</Text>
                        <Input ml={2} mr={3} w="60%" placeholder="Enter your email token" value={formData.token} onChangeText={(value)=>{
                            setData({
                                ...formData,
                                token:value
                            })
                        }} />
                        <IconButton icon={<Ionicons name="save-outline" size={24} color="black" />}
                                p={0} onPress={saveEmail} />
                    </Box> */}

                    <Button mt={5} onPress={goResetPassword} >
                        Change your password
                    </Button>
                </VStack>
            </Box>
        </Center>

    )
};

export default AccountSettingScreen;