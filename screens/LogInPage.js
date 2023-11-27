import { Modal } from "native-base";
import { useState,Pressable } from "react";
import { Center, VStack, HStack, FormControl, Input, Button, Box, Heading, Link, Text } from 'native-base';
import ResetModal from "../components/ResetModal";

const Login = () => {
    const [showModal, setShowModal] = useState(false);

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
                        <Input type="password" />
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
                        {/* <Pressable onPress={() => setShowModal(true)}>
                            <Text fontSize={15} color="indigo.500">forget password?</Text>
                        </Pressable> */}
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