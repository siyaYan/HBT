import { Input, Icon, Checkbox, Pressable, Center, Modal } from "native-base";
import { Image, ImageBackground } from "react-native";
import { View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  VStack,
  HStack,
  FormControl,
  Box,
  Button,
  Heading,
  Link,
  Text,
} from "native-base";
// import ResetModal from "../components/ResetModal";
import { Alert } from "react-native";
import { loginUser, forgetSendEmail } from "../components/Endpoint";
import * as SecureStore from "expo-secure-store";
import { useData } from "../context/DataContext";

// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// GoogleSignin.configurer({
//     webClientId: '720818502811-gvpcgktd6jgf21fbdt3sa9e6v9iu7e5d.apps.googleusercontent.com', // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
//   });
const LoginScreen = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [formData, setData] = useState();
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { userData, updateUserData } = useData();
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
      await SecureStore.setItemAsync(
        "userCredentials",
        JSON.stringify({ id, password })
      );
    } catch (error) {
      console.error("Failed to store the credentials securely", error);
      // Handle the error, like showing an alert to the user
      Alert.alert(
        "Error",
        "Failed to securely save your credentials. You may need to login again next time."
      );
    }
  };

  // Method to handle login
  async function handleSubmit() {
    console.log({
      id: formData.id,
      password: formData.password,
      rememberMe: remember,
    });
    if (submitValidation()) {
      const response = await loginUser(formData.id, formData.password);
      if (response.token) {
        if (remember) {
          await saveCredentials(formData.id, formData.password);
        }
        updateUserData({
          token: response.token,
          data: response.data.user,
        });
        navigation.navigate("MainStack", { screen: "Home" });
        // console.log(response.token);
      } else {
        console.log("login failed");
      }
    }
  }

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleResend = () => {
    // Validate the email
    if (validateEmail(email)) {
      console.log({ email });
      handleSentEmail();
      setShowModal(false);
      setEmail(""); // Clear the email state after successful submission
      setError(false);
    } else {
      setEmail(""); // Clear the email state after successful submission
      setError(true);
      // Keep the modal open and display the error message
    }
  };

  const handleSentEmail = async () => {
    const response = await forgetSendEmail(email);
    if (response.status == "success") {
      // navigation.navigate('Reset');
      navigation.navigate("LoginStack", { screen: "Reset" });
    }
  };

  const submitValidation = () => {
    if (formData.id && formData.password) {
      // validateEmail();
      return true;
    } else if (formData.id) {
      setErrors({
        password: "",
      });
      return false;
    } else {
      setErrors({
        id: "",
        password: "",
      });
      return false;
    }
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")} // Replace with the actual path to your image
      style={{ flex: 1, resizeMode: "cover" , opacity:"0.2" }}
    >
      <Center w="100%">
        <Box py="5" safeArea w="100%" h="100%" maxW="300">
          <Center w="100%" h="100%">
            <VStack w="100%" space={8}>
              <HStack
                w="95%"
                style={{ alignSelf: "center", justifyContent: "space-between" }}
              >
                <Text fontSize="4xl" style={{ fontFamily: "Bold" }}>
                  Log in
                </Text>
                <VStack>
                  <Text fontFamily={"Regular"} fontSize="lg">
                    New to Habital?{"  "}
                  </Text>
                  <HStack>
                    <Pressable
                      onPress={() =>
                        navigation.navigate("LoginStack", {
                          screen: "Register",
                        })
                      }
                    >
                      <Text
                        fontFamily={"Regular Semi Bold"}
                        fontSize="lg"
                        color="#49a579"
                      >
                        Sign Up
                      </Text>
                    </Pressable>
                    <Text fontFamily={"Regular"} fontSize="lg">
                      {" "}
                      to start!
                    </Text>
                  </HStack>
                </VStack>
              </HStack>

              <VStack space={7} mt="5">
                <Button
                  rounded={30}
                  shadow="6"
                  size="lg"
                  onPress={() => signIn()}
                >
                  Google
                </Button>
                <Button
                  rounded={30}
                  shadow="6"
                  size="lg"
                  onPress={() => signIn()}
                >
                  Facebook
                </Button>
                <Text
                  textAlign={"center"}
                  fontFamily={"Regular Semi Bold"}
                  fontSize={"lg"}
                >
                  Or
                </Text>

                <FormControl isRequired isInvalid={"id" in errors}>
                  <Input
                    rounded={30}
                    size="2xl"
                    fontFamily={"Regular"}
                    onChangeText={(value) =>
                      setData({
                        ...formData,
                        id: value,
                      })
                    }
                    placeholder="Email/Username"
                  />
                  <FormControl.ErrorMessage></FormControl.ErrorMessage>
                </FormControl>

                <FormControl isRequired isInvalid={"password" in errors}>
                  <Input
                    rounded={30}
                    size="2xl"
                    fontFamily={"Regular"}
                    placeholder="Password"
                    onChangeText={(value) =>
                      setData({
                        ...formData,
                        password: value,
                      })
                    }
                    type={show ? "text" : "password"}
                    InputRightElement={
                      <Pressable onPress={() => setShow(!show)}>
                        <Icon
                          as={
                            <MaterialIcons
                              name={show ? "visibility" : "visibility-off"}
                            />
                          }
                          size={5}
                          mr="2"
                          color="muted.400"
                        />
                      </Pressable>
                    }
                  />
                </FormControl>
              </VStack>

              <HStack style={{ justifyContent: "space-between" }}>
                <VStack space={2}>
                  <Checkbox
                    // backgroundColor={"blue"}
                    colorScheme="green"
                    ml="1"
                    size="sm"
                    defaultIsChecked
                    onPress={(value) => setRemember(!remember)}
                  >
                    <Text fontFamily={"Regular"} fontSize={"lg"}>
                      Remember
                    </Text>
                  </Checkbox>

                  <Link>
                    <Pressable onPress={() => setShowModal(true)}>
                      <Text
                        marginLeft={1}
                        fontFamily={"Regular"}
                        fontSize={"lg"}
                        color="#191919"
                        textDecorationLine={"underline"}
                      >
                        Oh no! I forget😱
                      </Text>
                    </Pressable>
                    <Modal
                      isOpen={showModal}
                      onClose={() => setShowModal(false)}
                    >
                      <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>Send Reset Password Email</Modal.Header>
                        <Modal.Body>
                          <FormControl mt="3" isInvalid={!!error} isRequired>
                            <FormControl.Label>Email</FormControl.Label>
                            <Input
                              value={email}
                              onChangeText={setEmail}
                              placeholder="example@email.com"
                            />
                            {error ? (
                              <FormControl.ErrorMessage>
                                Please enter a valid email address.
                              </FormControl.ErrorMessage>
                            ) : (
                              <FormControl.HelperText></FormControl.HelperText>
                            )}
                          </FormControl>
                        </Modal.Body>
                        <Modal.Footer>
                          <Button.Group space={2}>
                            <Button
                              variant="ghost"
                              colorScheme="blueGray"
                              onPress={() => {
                                setShowModal(false);
                                setError(false); // Clear any errors
                              }}
                            >
                              Cancel
                            </Button>
                            <Button onPress={handleResend}>Send</Button>
                          </Button.Group>
                        </Modal.Footer>
                      </Modal.Content>
                    </Modal>
                  </Link>
                </VStack>
                {/* <Button
                  rounded={30}
                  shadow="7"
                  width="50%"
                  size={"lg"}
                  onPress={handleSubmit}
                  mt="2"
                  backgroundColor={"#49a579"}
                  _text={{
                    color: "#f9f8f2",
                  }}
                >
                  Sign in
                 </Button> */}
                <Image
                  source={require("../assets/cherry.png")}
                  style={{ width: 80, height: 80 }}
                  alt="image"
                />
                {/* source={{
                  uri: "../assets/cherry.png",
                }} */}
              </HStack>
            </VStack>
          </Center>
        </Box>
      </Center>
    </ImageBackground>
  );
};

export default LoginScreen;
