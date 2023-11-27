
import { Input, Icon, Pressable, Center} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { VStack, HStack, FormControl, Button, Box, Heading, Link, Text } from 'native-base';
import ResetModal from "../components/ResetModal";

const Login = () => {
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    return (
        <Center w="100%">
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
                    <FormControl isRequired>
                        <FormControl.Label>Email</FormControl.Label>
                        <Input />
                    </FormControl>
                    <FormControl isRequired>
                        <FormControl.Label>Password</FormControl.Label>
                        <Input type={show ? "text" : "password"} InputRightElement={<Pressable onPress={() => setShow(!show)}>
            <Icon as={<MaterialIcons name={show ? "visibility" : "visibility-off"} />} size={5} mr="2" color="muted.400" />
          </Pressable>}/>
                        {/* TODO:Reset email */}
                        <Link alignSelf="flex-end" mt="1">
                            <ResetModal />
                        </Link>

                    </FormControl>
                    <Button mt="2" colorScheme="indigo">
                        Sign in
                    </Button>
                    <HStack mt="6" justifyContent="center">
                        <Text fontSize="sm" color="coolGray.600" _dark={{
                            color: "warmGray.200"
                        }}>
                            I'm a new user.{" "}
                        </Text>
                        <Link _text={{
                            color: "indigo.500",
                            fontWeight: "medium",
                            fontSize: "sm"
                        }} href="#">
                            Sign Up
                        </Link>
                    </HStack>
                </VStack>
            </Box>
        </Center>)
};

export default Login;