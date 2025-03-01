import React, { useState, useRef, useEffect } from "react";
import {
  Input,
  Icon,
  IconButton,
  Checkbox,
  Pressable,
  Center,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
} from "native-base";
import Svg, { G, Path } from "react-native-svg";
import { FontAwesome } from "@expo/vector-icons";
import {
  VStack,
  HStack,
  ZStack,
  FormControl,
  Box,
  Button,
  Heading,
  Link,
  Text,
  Image,
} from "native-base";
import { Alert, Linking } from "react-native";
import {
  loginUser,
  forgetSendEmail,
  getRoundInfo,
  verifyEmail,
  loginUserThirdParty,
} from "../components/Endpoint";
import * as SecureStore from "expo-secure-store";
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";
import Background from "../components/Background";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  FacebookAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import OTPInput from "../components/OTPInput";

const firebaseConfig = {
  apiKey: "AIzaSyCUcdfsmB6eqkaUPQ0xH2ELm4mqA9MhHJ4",
  authDomain: "habital-e1c8d.firebaseapp.com",
  projectId: "habital-e1c8d",
  storageBucket: "habital-e1c8d.appspot.com",
  messagingSenderId: "720818502811",
  appId: "1:720818502811:web:6516136f1df011ce289a3e",
  measurementId: "G-EVZCE105VF",
};

const app = initializeApp(firebaseConfig);

const LoginScreen = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyToken, setVerifyToken] = useState("");
  const [show, setShow] = useState(false);
  const [formData, setData] = useState({});
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { userData, updateUserData } = useData();
  const { roundData, updateRounds, updateacceptRoundData } = useRound();
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "720818502811-gvpcgktd6jgf21fbdt3sa9e6v9iu7e5d.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  const loginGoogle = async () => {
    try {
      console.log("Signing in...");
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const response = await loginUserThirdParty(
        userInfo.idToken,
        userInfo.user,
        "google"
      );
      await afterLogin(response, 1);
    } catch (error) {
      console.log(error);
    }
  };

  const loginFb = async () => {
    try {
      console.log("Signing in...");
      await LoginManager.logInWithPermissions(["public_profile", "email"]);
      const data = await AccessToken.getCurrentAccessToken();
      const facebookCredential = FacebookAuthProvider.credential(
        data.accessToken
      );
      const auth = getAuth();
      const res = await signInWithCredential(auth, facebookCredential);
      const user = {
        email: res._tokenResponse.email,
        name: res._tokenResponse.displayName,
        photo: res._tokenResponse.photoUrl,
        emailVerified: res._tokenResponse.emailVerified,
      };
      const response = await loginUserThirdParty(
        res._tokenResponse.oauthAccessToken,
        user,
        "facebook"
      );
      await afterLogin(response, 2);
    } catch (error) {
      console.log(error);
    }
  };

  const saveCredentials = async (id, password) => {
    try {
      await SecureStore.setItemAsync(
        "userData",
        JSON.stringify({ id, password })
      );
    } catch (error) {
      console.error("Failed to store credentials securely", error);
      Alert.alert(
        "Error",
        "Failed to securely save your credentials. You may need to login again next time."
      );
    }
  };

  const saveCredentialsThirdParty = async (idToken, type = 1) => {
    try {
      await SecureStore.setItemAsync(
        "userData",
        JSON.stringify({ idToken, type })
      );
    } catch (error) {
      console.error("Failed to store credentials securely", error);
      Alert.alert(
        "Error",
        "Failed to securely save your credentials. You may need to login again next time."
      );
    }
  };

  const handleSubmit = async () => {
    if (submitValidation()) {
      const response = await loginUser(formData.id, formData.password);
      await afterLogin(response);
    }
  };

  const afterLogin = async (response, type = 0) => {
    if (response.token) {
      const roundInfo = await getRoundInfo(
        response.token,
        response.data.user._id
      );
      if (remember && formData?.id && formData?.password) {
        await saveCredentials(formData.id, formData.password);
      } else if (type) {
        const id =
          type === 1
            ? response.data.user.googleId
            : response.data.user.facebookId;
        await saveCredentialsThirdParty(id, type);
      }
      updateUserData({
        token: response.token,
        data: response.data.user,
        avatar: { uri: response.data.user.profileImageUrl },
      });
      updateRounds(roundInfo);
      updateacceptRoundData(roundInfo, response.data.user._id);
      navigation.navigate("MainStack", { screen: "Home" });
    } else {
      if (response.message.includes("Email verify")) {
        setShowVerifyModal(true);
      }
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleResend = () => {
    if (validateEmail(email)) {
      handleSentEmail();
      setShowModal(false);
      setEmail("");
      setError(false);
    } else {
      setEmail("");
      setError(true);
    }
  };

  const handleVerify = async () => {
    const res = await verifyEmail(formData.id, verifyToken);
    setVerifyToken("");
    if (res.status === "success") {
      setShowVerifyModal(false);
      handleSubmit();
    }
  };

  const handleSentEmail = async () => {
    const response = await forgetSendEmail(email);
    if (response.status === "success") {
      navigation.navigate("LoginStack", { screen: "Reset" });
    }
  };

  const submitValidation = () => {
    if (formData.id && formData.password) {
      return true;
    } else if (formData.id) {
      setErrors({ password: "Password is required" });
      return false;
    } else {
      setErrors({ id: "Email/Username is required", password: "Password is required" });
      return false;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Center w="100%">
        <ScrollView
          w="100%"
          h="100%"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, minHeight: "100%" }}
        >
          <Background />
          <Box
            justifyContent="center"
            alignItems="center"
            alignSelf="center"
            position="relative"
            safeArea
            h="100%"
            w={"80%"}
            maxW={320}
          >
            <Center w="90%" h="100%">
              <VStack w="100%" space={5}>
                {/* Default View: Google and Facebook Buttons */}
                {!showMoreOptions && (
                  <>
                    <HStack
                      w="95%"
                      style={{
                        alignSelf: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text fontSize="4xl" style={{ fontFamily: "Bold" }}>
                        Log in
                      </Text>
                    </HStack>
                    <VStack space={5} mt="2">
                      <Button
                        rounded={30}
                        shadow="6"
                        size="lg"
                        onPress={loginGoogle}
                        padding={0}
                        bg={"white"}
                        _pressed={{ bg: "gray.100" }}
                      >
                        <HStack alignItems={"center"}>
                          <Image
                            size={45}
                            right="5"
                            source={require("../assets/Buttonicons/google_icon.png")}
                            alt="google icon"
                          />
                          <Text
                            fontFamily={"Regular Medium"}
                            fontSize={"lg"}
                            color={"#191919"}
                          >
                            Continue with Google
                          </Text>
                        </HStack>
                      </Button>

                      <Button
                        rounded={30}
                        shadow="6"
                        size="lg"
                        onPress={loginFb}
                        backgroundColor="rgb(26,119,242)"
                        _pressed={{ backgroundColor: "blue.600" }}
                      >
                        <HStack space={3}>
                          <FontAwesome
                            name="facebook-f"
                            size={26}
                            color="white"
                            style={{ right: "10" }}
                          />
                          <Text
                            fontFamily={"Regular Medium"}
                            fontSize={"lg"}
                            color={"white"}
                          >
                            Continue with Facebook
                          </Text>
                        </HStack>
                      </Button>

                      <Pressable onPress={() => setShowMoreOptions(true)}>
                        <Text
                          fontFamily={"Regular Semi Bold"}
                          fontSize={"lg"}
                          textAlign="center"
                          color="#49a579"
                          textDecorationLine="underline"
                        >
                          Other option
                        </Text>
                      </Pressable>
                    </VStack>
                  </>
                )}

                {/* Expanded View: Email, Password, Sign Up, Forgot */}
                {showMoreOptions && (
                  <>
                    <HStack
                      w="95%"
                      style={{
                        alignSelf: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text fontSize="4xl" style={{ fontFamily: "Bold" }}>
                        Log in
                      </Text>
                      <VStack>
                        <Text fontFamily={"Regular"} fontSize="lg">
                          New to Habital?{" "}
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
                              fontFamily={"Regular Medium"}
                              fontSize={"lg"}
                              color="#49a579"
                            >
                              Sign up
                            </Text>
                          </Pressable>
                          <Text fontFamily={"Regular"} fontSize={"lg"}>
                            {" "}to start!
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>

                    <VStack space={5} mt="2">
                      <FormControl isRequired isInvalid={"id" in errors}>
                        <Input
                          fontSize="lg"
                          fontFamily={"Regular Medium"}
                          onChangeText={(value) =>
                            setData({ ...formData, id: value })
                          }
                          placeholder="Email/Username"
                        />
                        <FormControl.ErrorMessage>
                          {errors.id}
                        </FormControl.ErrorMessage>
                      </FormControl>

                      <FormControl isRequired isInvalid={"password" in errors}>
                        <Input
                          fontSize="lg"
                          fontFamily={"Regular Medium"}
                          placeholder="Password"
                          onChangeText={(value) =>
                            setData({ ...formData, password: value })
                          }
                          type={show ? "text" : "password"}
                          InputRightElement={
                            <Pressable onPress={() => setShow(!show)}>
                              {!show ? (
                                <Icon
                                  size="5"
                                  marginRight="3"
                                  viewBox="0 0 50 50"
                                >
                                  <Path
                                    class="b"
                                    fill="#606060"
                                    d="M18.45,31.51l-7.74-3.07c-.15,.38-.36,.92-.56,1.47-.48,1.31-.95,2.62-1.44,3.93-.36,.99-1.08,1.41-1.88,1.12-.8-.29-1.06-1.05-.69-2.08,.68-1.9,1.35-3.8,2.08-5.68,.21-.54,.09-.82-.32-1.18-1.6-1.38-2.93-2.99-3.99-4.81-.16-.27-.3-.54-.42-.83-.3-.76-.05-1.49,.59-1.79,.7-.33,1.35-.03,1.84,.66,1.03,1.44,1.99,2.98,3.24,4.22,3.28,3.24,7.36,4.9,11.89,5.48,4.99,.63,9.86,.25,14.49-1.87,3.67-1.69,6.61-4.2,8.53-7.81,.43-.8,1.15-1.04,1.88-.65,.69,.36,.91,1.06,.51,1.86-1.06,2.17-2.58,3.99-4.39,5.57-.41,.36-.51,.64-.31,1.17,.73,1.88,1.4,3.78,2.08,5.68,.34,.96,.08,1.76-.64,2.05-.84,.33-1.58-.09-1.96-1.11-.67-1.84-1.34-3.68-1.96-5.39l-7.76,3.09c.24,1.34,.52,2.86,.8,4.37,.12,.66,.27,1.32,.37,1.98,.14,.92-.28,1.56-1.07,1.68-.77,.12-1.46-.34-1.63-1.2-.36-1.88-.68-3.76-1.01-5.65-.05-.3-.12-.6-.19-.96-.75,.04-1.46,.12-2.18,.12-1.6,0-3.2-.02-4.8-.11-.51-.03-.67,.1-.75,.58-.33,2.01-.7,4.02-1.07,6.03-.13,.7-.6,1.17-1.27,1.14-.44-.02-.95-.35-1.25-.69-.2-.23-.16-.74-.1-1.11,.3-1.84,.65-3.66,.98-5.5,.05-.28,.08-.56,.1-.7Z"
                                  />
                                </Icon>
                              ) : (
                                <Icon
                                  size="5"
                                  marginRight="3"
                                  viewBox="0 0 50 50"
                                >
                                  <Path
                                    class="b"
                                    fill="#606060"
                                    d="M48.85,26.84c-1.11-1.26-2.22-2.52-3.41-3.69-1.19-1.17-2.43-2.28-3.73-3.31-.02-.15,0-.32,.08-.53,.73-1.88,1.4-3.78,2.08-5.68,.37-1.03,.1-1.79-.69-2.08-.8-.29-1.52,.13-1.88,1.12-.55,1.49-.96,2.54-1.44,3.93-.23,.66-.44,1.18-.56,1.47-.02-.01-.04-.02-.06-.04-1.42-.95-2.91-1.82-4.49-2.56-1.01-.48-2.04-.89-3.09-1.24,.19-1.23,.79-4.35,.97-5.44,.06-.37,.1-.88-.1-1.11-.3-.34-.81-.67-1.25-.69-.21,0-.4,.03-.57,.11-.44,.22-.61,.73-.7,1.03-.21,.74-.62,2.69-1.08,5.37-1.29-.25-2.6-.4-3.95-.4-1.37,0-2.7,.16-4,.42-.31-1.75-.62-3.6-.96-5.37-.16-.86-.86-1.32-1.63-1.2-.3,.05-.55,.17-.73,.36-.36,.37-.36,.92-.33,1.33,.06,.93,.42,2.94,1.02,5.59-.91,.3-1.81,.66-2.7,1.07-1.79,.83-3.46,1.81-5.06,2.89-.38-1.38-1.17-4.09-1.82-5.5-.19-.41-.5-1.03-1.1-1.18-.26-.07-.55-.05-.86,.07-.72,.28-.99,1.09-.64,2.05,.68,1.9,1.35,3.8,2.08,5.68,.08,.21,.1,.37,.09,.52-2.58,2.02-4.93,4.34-7.09,6.9-.79,.94-.8,1.82,.02,2.74,1.14,1.28,2.28,2.56,3.51,3.76,2.99,2.92,6.3,5.41,10.05,7.26,2.92,1.44,5.98,2.39,9.25,2.55,3.65,.18,7.09-.67,10.37-2.21,5.72-2.68,10.39-6.71,14.42-11.51,.65-.78,.66-1.71-.02-2.47Zm-5.77,3.24c-3.03,2.97-6.34,5.56-10.21,7.35-2.89,1.34-5.9,2.1-9.11,1.84-2.9-.24-5.58-1.2-8.12-2.58-4.01-2.17-7.42-5.1-10.5-8.45-.04-.05-.08-.1-.15-.21,.89-.89,1.76-1.81,2.68-2.67,2.84-2.68,5.93-5,9.49-6.64,2.32-1.07,4.73-1.77,7.29-1.86,2.76-.1,5.37,.54,7.88,1.64,3.74,1.63,6.95,4.02,9.9,6.78,.85,.8,1.66,1.66,2.48,2.5,.09,.09,.17,.19,.28,.33-.65,.67-1.27,1.34-1.92,1.98Z"
                                  />
                                  <Path
                                    class="b"
                                    d="M25.1,20.61c-4.2-.02-7.57,3.29-7.59,7.45-.01,4.13,3.33,7.49,7.46,7.5,4.14,.01,7.5-3.32,7.51-7.45,0-4.11-3.31-7.49-7.38-7.5Zm-.09,11.23c-2.08,0-3.76-1.68-3.76-3.76,0-2.05,1.69-3.74,3.75-3.74s3.74,1.69,3.75,3.75c0,2.04-1.69,3.75-3.74,3.75Z"
                                  />
                                </Icon>
                              )}
                            </Pressable>
                          }
                        />
                        <FormControl.ErrorMessage>
                          {errors.password}
                        </FormControl.ErrorMessage>
                      </FormControl>

                      <HStack style={{ justifyContent: "space-between" }}>
                        <VStack space={2}>
                          <Checkbox
                            colorScheme="green"
                            ml="1"
                            size="sm"
                            defaultIsChecked
                            onPress={() => setRemember(!remember)}
                            _checked={{
                              bg: "#49a579",
                              borderColor: "#49a579",
                            }}
                            _icon={{
                              color: "#f9f8f2",
                            }}
                          >
                            <Text fontFamily={"Regular"} fontSize={"lg"}>
                              Stay signed in
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
                                😱 Oh no! I forgot
                              </Text>
                            </Pressable>
                          </Link>
                        </VStack>
                        <Pressable onPress={handleSubmit}>
                          <Image
                            source={require("../assets/UIicons/Login.gif")}
                            style={{ width: 120, height: 120 }}
                            bottom="5"
                            alt="image"
                          />
                        </Pressable>
                      </HStack>

                      <Pressable onPress={() => setShowMoreOptions(false)}>
                        <Text
                          bottom={"7"}
                          fontFamily={"Regular Semi Bold"}
                          fontSize={"lg"}
                          textAlign="center"
                          color="#49a579"
                          textDecorationLine="underline"
                        >
                          Social login options
                        </Text>
                      </Pressable>
                    </VStack>
                  </>
                )}

                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Regular",
                    marginTop: 15,
                    marginBottom: 15,
                  }}
                >
                  By continuing, you agree to our{" "}
                  <Text
                    style={{ color: "#6666ff"}}
                    onPress={() =>
                      Linking.openURL(
                        "https://jocellany.notion.site/Habital-Hub-Privacy-Policy-19ad835ad38480a0a3eacab002d7f67c?pvs=4"
                      )
                    }
                  >
                    Privacy Policy
                  </Text>{" "}
                  and{" "}
                  <Text
                    style={{color: "#6666ff" }}
                    onPress={() =>
                      Linking.openURL(
                        "https://jocellany.notion.site/Habital-Hub-License-Copyright-Agreement-19ad835ad38480a1bde0eab563765e81?pvs=4"
                      )
                    }
                  >
                    License & Copyright Agreement
                  </Text>
                  .
                </Text>

                {/* Modals */}
                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                  <Modal.Content maxWidth="300px">
                    <Modal.CloseButton />
                    <Modal.Header>
                      <Text fontFamily={"Regular Medium"} fontSize="xl">
                        Reset your password
                      </Text>
                    </Modal.Header>
                    <Modal.Body>
                      <FormControl mt="3" isInvalid={!!error} isRequired>
                        <Input
                          rounded={30}
                          size="2xl"
                          fontFamily={"Regular Medium"}
                          fontSize="md"
                          value={email}
                          onChangeText={setEmail}
                          placeholder="example@email.com"
                        />
                        {error ? (
                          <FormControl.ErrorMessage>
                            <Text fontFamily={"Regular"} fontSize="md">
                              Please enter a valid email address.
                            </Text>
                          </FormControl.ErrorMessage>
                        ) : (
                          <FormControl.HelperText></FormControl.HelperText>
                        )}
                      </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button.Group w={"90%"} marginX={"5"} space={2}>
                        <Button
                          rounded={30}
                          shadow="7"
                          width="50%"
                          size={"md"}
                          _text={{ color: "#f9f8f2" }}
                          colorScheme="blueGray"
                          onPress={() => {
                            setShowModal(false);
                            setError(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          rounded={30}
                          shadow="7"
                          width="50%"
                          size={"md"}
                          _text={{ color: "#f9f8f2" }}
                          backgroundColor={"#49a579"}
                          onPress={handleResend}
                        >
                          Send
                        </Button>
                      </Button.Group>
                    </Modal.Footer>
                  </Modal.Content>
                </Modal>

                <Modal
                  isOpen={showVerifyModal}
                  onClose={() => setShowVerifyModal(false)}
                >
                  <Modal.Content maxWidth="300px">
                    <Modal.CloseButton />
                    <Modal.Header>
                      <Text fontFamily={"Regular Medium"} fontSize="xl">
                        Verify your email
                      </Text>
                    </Modal.Header>
                    <Modal.Body>
                      <FormControl mt="3" isRequired>
                        <OTPInput
                          value={verifyToken}
                          onChange={setVerifyToken}
                        />
                      </FormControl>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button.Group w={"90%"} marginX={"5"} space={2}>
                        <Button
                          rounded={30}
                          shadow="7"
                          width="50%"
                          size={"md"}
                          _text={{ color: "#f9f8f2" }}
                          colorScheme="blueGray"
                          onPress={() => setShowVerifyModal(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          rounded={30}
                          shadow="7"
                          width="50%"
                          size={"md"}
                          _text={{ color: "#f9f8f2" }}
                          backgroundColor={"#49a579"}
                          onPress={handleVerify}
                        >
                          Submit
                        </Button>
                      </Button.Group>
                    </Modal.Footer>
                  </Modal.Content>
                </Modal>
              </VStack>
            </Center>
          </Box>
        </ScrollView>
      </Center>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;