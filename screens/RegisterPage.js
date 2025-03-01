import {
  Input,
  Icon,
  Pressable,
  Center,
  IconButton,
  Modal,
  ScrollView,
} from "native-base";
import { useState } from "react";
import Svg, { Path } from "react-native-svg";
import {
  VStack,
  HStack,
  FormControl,
  Button,
  Box,
  Heading,
  Text,
  WarningOutlineIcon,
  KeyboardAvoidingView,
} from "native-base";

import {
  registerUser,
  loginUser,
  getRoundInfo,
  verifyEmail,
  loginUserThirdParty,
} from "../components/Endpoint";
import * as SecureStore from "expo-secure-store";
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";
import Background from "../components/Background";
import OTPInput from "../components/OTPInput";

const RegisterScreen = ({ navigation }) => {
  const { roundData, updateRounds, updateacceptRoundData } = useRound();
  const { userData, updateUserData } = useData();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
      constrain3: true,
      constrain4: true,
    },
    password: false,
    confirmPassword: "Please confirm your password.",
    textProp: "Username must start with a character",
  });

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyToken, setVerifyToken] = useState("");
  const handleVerify = async () => {
    const res = await verifyEmail(formData.email, verifyToken);
    setVerifyToken("");
    if (res.status == "success") {
      setShowVerifyModal(false);
      handleSubmitLogin();
    }
  };
  const handleSubmitLogin = async () => {
    const response = await loginUser(formData.email, formData.password);
    await afterLogin(response);
  };

  const afterLogin = async (response, type = 0) => {
    console.log("response", response);
    if (response.token) {
      const roundInfo = await getRoundInfo(
        response.token,
        response.data.user._id
      );
      if (formData?.id && formData?.password) {
        await saveCredentials(formData.id, formData.password);
      } else {
        const id =
          type == 1
            ? response.data.user.googleId
            : response.data.user.facebookId;
        await saveCredentialsThirdParty(id, response.data.user.email, type);
      }
      updateUserData({
        token: response.token,
        data: response.data.user,
        avatar: {
          uri: response.data.user.profileImageUrl,
        },
      });
      updateRounds(roundInfo);
      console.log("update userData", response.data.user._id);
      updateacceptRoundData(roundInfo, response.data.user._id);
      console.log("round context", roundData);
      navigation.navigate("MainStack", { screen: "Home" });
    } else {
      console.log("login was unsucessful.");
      if (response.message.includes("Email varify")) {
        console.log("need to verify email....");
        setShowVerifyModal(true);
      }
    }
  };

  const saveCredentials = async (id, password) => {
    try {
      await SecureStore.setItemAsync(
        "userData",
        JSON.stringify({ id, password })
      );
    } catch (error) {
      console.error(
        "was unsucessful. to store the credentials securely",
        error
      );
      // Handle the error, like showing an alert to the user
      Alert.alert(
        "Error",
        "was unsucessful. to securely save your credentials. You may need to login again next time."
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
      console.error(
        "was unsucessful. to store the credentials securely",
        error
      );
      // Handle the error, like showing an alert to the user
      Alert.alert(
        "Error",
        "was unsucessful. to securely save your credentials. You may need to login again next time."
      );
    }
  };
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
      email: text,
    });
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const res = regex.test(text);
    if (text) {
      setErrors({
        ...errors,
        email: res,
      });
      return res;
    } else {
      setErrors({
        ...errors,
        email: false,
      });
      return false;
    }
  };

  const validateUsername = (text) => {
    setData({
      ...formData,
      username: text,
    });
    // It must start with a letter.
    // It must be between 5 and 20 characters in length.
    // It must contain at least one digit.
    if (text) {
      let Prop = "";
      if (!/^(?=.*[A-Za-z])/.test(text)) {
        Prop = "It should start with a letter.";
      } else if (!/(?=.*\d)[A-Za-z\d]/.test(text)) {
        Prop = "It should contain at least one digit.";
      } else if (!(text.length <= 20 && text.length >= 5)) {
        Prop = "Length should be between 5 to 20 characters.";
      } else if (!/^\S+$/.test(text)) {
        Prop = "No space is allowed.";
      }
      setShowMessage({
        ...showMessage,
        username: {
          constrain1: /^(?=.*[A-Za-z])/.test(text),
          constrain2: text.length <= 20 && text.length >= 5,
          constrain3: /(?=.*\d)[A-Za-z\d]/.test(text),
          constrain4: /^\S+$/.test(text),
        },
        textProp: Prop,
      }),
        setErrors({
          ...errors,
          username: Prop ? false : true,
        });
      return Prop ? false : true;
    } else {
      setErrors({
        ...errors,
        username: false,
      });
      return false;
    }
  };

  const validatePassword = (text) => {
    setData({
      ...formData,
      password: text,
    });
    if (text) {
      setErrors({
        ...errors,
        length: text.length >= 8 && text.length <= 20,
        letterAndNumber: /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/.test(text),
        noSpaces: !/\s/.test(text),
        specialChars: /[!@#%&_?#=-]/.test(text),
        password:
          /^(?=.*[A-Za-z].*[0-9]|[0-9].*[A-Za-z])(?=\S{8,20})(?=.*[!@#%&_?#=-])/.test(
            text
          ),
      });
      return (
        errors.length &&
        errors.letterAndNumber &&
        errors.noSpaces &&
        errors.specialChars
      );
    } else {
      setErrors({
        ...errors,
        password: false,
      });
      return false;
    }
  };

  const validateConfirm = (text) => {
    setData({
      ...formData,
      confirmPassword: text,
    });
    const res = text === formData.password;
    if (text) {
      setErrors({
        ...errors,
        confirmPassword: res,
      });
      return res;
    } else {
      setErrors({
        ...errors,
        confirmPassword: false,
      });
      return false;
    }
  };

  const handleSubmit = () => {
    console.log(errors);
    const hasErrors = Object.values(errors).some((error) => error == false);

    if (!hasErrors) {
      // If all validations pass, handle successful submission
      if (formData.nickname == "") {
        setData({
          ...formData,
          nickname: formData.username,
        });
      }
      console.log("Submitted");
      handleRegister();
    } else {
      console.log("error!!");
    }
  };

  async function handleRegister() {
    // Call the mock registration function
    const response = await registerUser(
      formData.username,
      formData.nickname,
      formData.email,
      formData.password,
      formData.confirmPassword
    );
    // Handle success or error response
    if (response.status == "success") {
      setShowVerifyModal(true);
    }
  }

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
            alignItems="center"
            alignSelf="center"
            position="relative"
            safeArea
            h="100%"
            w="80%"
            maxW={320}
          >
            <Center w="90%" h="100%">
              <VStack w="100%" h="100%" space={6}>
                <VStack>
                  <Text
                    mt={2}
                    ml={2}
                    fontSize="3xl"
                    style={{ fontFamily: "Bold" }}
                  >
                    Create account
                  </Text>
                </VStack>
                <VStack w="100%" space={4}>
                  <FormControl
                    isRequired
                    isInvalid={!errors.username && showMessage.textProp}
                  >
                    <Input
                      size="lg"
                      placeholder="Username"
                      value={formData.username}
                      onChangeText={validateUsername}
                    />
                    {Object.values(showMessage.username).some(
                      (value) => value === false
                    ) ? (
                      <FormControl.ErrorMessage ml={3} mt={1}>
                        <Text fontFamily={"Regular"} fontSize="sm">
                          {showMessage.textProp}
                        </Text>
                      </FormControl.ErrorMessage>
                    ) : (
                      <FormControl.HelperText ml={3} mt={1}>
                        <Text fontFamily="Regular" fontSize="sm">
                          {showMessage.textProp ? (
                            showMessage.textProp
                          ) : (
                            <>
                              <Svg width={20} height={20} viewBox="0 0 50 50">
                                <Path
                                  d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
                                  fill="#49a579"
                                />
                              </Svg>
                              Username
                            </>
                          )}
                        </Text>
                      </FormControl.HelperText>
                    )}
                  </FormControl>
                  <FormControl>
                    <Input
                      size="lg"
                      placeholder="Nickname (Optional)"
                      value={formData.nickname}
                      onChangeText={(value) =>
                        setData({
                          ...formData,
                          nickname: value,
                        })
                      }
                    />
                    <FormControl.HelperText ml={3} mt={0}>
                      <Text fontFamily={"Regular"} fontSize="sm">
                        {formData.nickname
                          ? "Hey " + formData.nickname + " 👋🏻"
                          : "How would you like to be called?"}
                      </Text>
                    </FormControl.HelperText>
                  </FormControl>

                  <FormControl isRequired isInvalid={!errors.email}>
                    <Input
                      size="lg"
                      placeholder="Email"
                      value={formData.email}
                      onChangeText={validateEmail}
                    />
                    {errors.email ? (
                      <FormControl.HelperText ml={3} mt={1}>
                        <Text fontFamily="Regular" fontSize="sm">
                          {formData.email ? (
                            <>
                              <Svg width={20} height={20} viewBox="0 0 50 50">
                                <Path
                                  d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
                                  fill="#49a579"
                                />
                              </Svg>
                              Email
                            </>
                          ) : (
                            "Please input your email address"
                          )}
                        </Text>
                      </FormControl.HelperText>
                    ) : (
                      <FormControl.ErrorMessage
                        ml={3}
                        mt={1}
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        <Text ml={3} fontFamily={"Regular"} fontSize="sm">
                          Invalid email address
                        </Text>
                      </FormControl.ErrorMessage>
                    )}
                  </FormControl>

                  <FormControl isRequired isInvalid={!errors.password}>
                    <Input
                      size="lg"
                      onFocus={handlePasswordFocus}
                      onBlur={handlePasswordBlur}
                      value={formData.password}
                      placeholder="Password"
                      onChangeText={validatePassword}
                      type={showPassword ? "text" : "password"}
                      InputRightElement={
                        <Pressable
                          onPress={() => setShowPassword(!showPassword)}
                        >
                          {!showPassword ? (
                            <Icon size="5" marginRight="3" viewBox="0 0 50 50">
                              <Path
                                class="b"
                                fill="#606060"
                                d="M18.45,31.51l-7.74-3.07c-.15,.38-.36,.92-.56,1.47-.48,1.31-.95,2.62-1.44,3.93-.36,.99-1.08,1.41-1.88,1.12-.8-.29-1.06-1.05-.69-2.08,.68-1.9,1.35-3.8,2.08-5.68,.21-.54,.09-.82-.32-1.18-1.6-1.38-2.93-2.99-3.99-4.81-.16-.27-.3-.54-.42-.83-.3-.76-.05-1.49,.59-1.79,.7-.33,1.35-.03,1.84,.66,1.03,1.44,1.99,2.98,3.24,4.22,3.28,3.24,7.36,4.9,11.89,5.48,4.99,.63,9.86,.25,14.49-1.87,3.67-1.69,6.61-4.2,8.53-7.81,.43-.8,1.15-1.04,1.88-.65,.69,.36,.91,1.06,.51,1.86-1.06,2.17-2.58,3.99-4.39,5.57-.41,.36-.51,.64-.31,1.17,.73,1.88,1.4,3.78,2.08,5.68,.34,.96,.08,1.76-.64,2.05-.84,.33-1.58-.09-1.96-1.11-.67-1.84-1.34-3.68-1.96-5.39l-7.76,3.09c.24,1.34,.52,2.86,.8,4.37,.12,.66,.27,1.32,.37,1.98,.14,.92-.28,1.56-1.07,1.68-.77,.12-1.46-.34-1.63-1.2-.36-1.88-.68-3.76-1.01-5.65-.05-.3-.12-.6-.19-.96-.75,.04-1.46,.12-2.18,.12-1.6,0-3.2-.02-4.8-.11-.51-.03-.67,.1-.75,.58-.33,2.01-.7,4.02-1.07,6.03-.13,.7-.6,1.17-1.27,1.14-.44-.02-.95-.35-1.25-.69-.2-.23-.16-.74-.1-1.11,.3-1.84,.65-3.66,.98-5.5,.05-.28,.08-.56,.1-.7Z"
                              />
                            </Icon>
                          ) : (
                            <Icon size="5" marginRight="3" viewBox="0 0 50 50">
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
                    {showMessage.password ? (
                      <FormControl.HelperText ml={3} mt={1}>
                        <HStack space={2}>
                          <Icon size="5" viewBox="0 0 50 50">
                            {errors.length ? (
                              <Path
                                fill="#49a579"
                                d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
                              />
                            ) : (
                              <Path
                                fill="#606060"
                                d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
                              />
                            )}
                          </Icon>
                          <Text fontFamily={"Regular"} fontSize="sm">
                            Between 8-20 characters
                          </Text>
                        </HStack>
                        <HStack space={2}>
                          <Icon size="5" viewBox="0 0 50 50">
                            {errors.letterAndNumber ? (
                              <Path
                                fill="#49a579"
                                d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
                              />
                            ) : (
                              <Path
                                fill="#606060"
                                d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
                              />
                            )}
                          </Icon>
                          <Text fontFamily={"Regular"} fontSize="sm">
                            Must include a letter and a number
                          </Text>
                        </HStack>
                        <HStack space={2}>
                          <Icon size="5" viewBox="0 0 50 50">
                            {errors.noSpaces ? (
                              <Path
                                fill="#49a579"
                                d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
                              />
                            ) : (
                              <Path
                                fill="#606060"
                                d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
                              />
                            )}
                          </Icon>
                          <Text fontFamily={"Regular"} fontSize="sm">
                            No space is allowed
                          </Text>
                        </HStack>
                        <HStack space={2}>
                          <Icon size="5" viewBox="0 0 50 50">
                            {errors.specialChars ? (
                              <Path
                                fill="#49a579"
                                d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
                              />
                            ) : (
                              <Path
                                fill="#606060"
                                d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
                              />
                            )}
                          </Icon>
                          <Text fontFamily={"Regular"} fontSize="sm">
                            At least one special case: !@#%&_?#=-{" "}
                          </Text>
                        </HStack>
                      </FormControl.HelperText>
                    ) : (
                      <HStack>
                        <Icon ml={3} mt={1} size="5" viewBox="0 0 50 50">
                          {errors.password && formData.password ? (
                            <Path
                              fill="#49a579"
                              d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
                            />
                          ) : (
                            <Path
                              fill="#606060"
                              d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
                            />
                          )}
                        </Icon>

                        {errors.password ? (
                          <FormControl.HelperText ml={2} mt={1}>
                            <Text fontFamily={"Regular"} fontSize="sm">
                              Password
                            </Text>
                          </FormControl.HelperText>
                        ) : (
                          <FormControl.ErrorMessage ml={2} mt={2}>
                            <Text fontFamily={"Regular"} fontSize="sm">
                              Password must meet all requirements.
                            </Text>
                          </FormControl.ErrorMessage>
                        )}
                      </HStack>
                    )}
                  </FormControl>

                  <FormControl isRequired isInvalid={!errors.confirmPassword}>
                    <Input
                      size="lg"
                      value={formData.confirmPassword}
                      placeholder="Confirm Password"
                      onChangeText={validateConfirm}
                      type={showConfirm ? "text" : "password"}
                      InputRightElement={
                        <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                          {!showConfirm ? (
                            <Icon size="5" marginRight="3" viewBox="0 0 50 50">
                              <Path
                                class="b"
                                fill="#606060"
                                d="M18.45,31.51l-7.74-3.07c-.15,.38-.36,.92-.56,1.47-.48,1.31-.95,2.62-1.44,3.93-.36,.99-1.08,1.41-1.88,1.12-.8-.29-1.06-1.05-.69-2.08,.68-1.9,1.35-3.8,2.08-5.68,.21-.54,.09-.82-.32-1.18-1.6-1.38-2.93-2.99-3.99-4.81-.16-.27-.3-.54-.42-.83-.3-.76-.05-1.49,.59-1.79,.7-.33,1.35-.03,1.84,.66,1.03,1.44,1.99,2.98,3.24,4.22,3.28,3.24,7.36,4.9,11.89,5.48,4.99,.63,9.86,.25,14.49-1.87,3.67-1.69,6.61-4.2,8.53-7.81,.43-.8,1.15-1.04,1.88-.65,.69,.36,.91,1.06,.51,1.86-1.06,2.17-2.58,3.99-4.39,5.57-.41,.36-.51,.64-.31,1.17,.73,1.88,1.4,3.78,2.08,5.68,.34,.96,.08,1.76-.64,2.05-.84,.33-1.58-.09-1.96-1.11-.67-1.84-1.34-3.68-1.96-5.39l-7.76,3.09c.24,1.34,.52,2.86,.8,4.37,.12,.66,.27,1.32,.37,1.98,.14,.92-.28,1.56-1.07,1.68-.77,.12-1.46-.34-1.63-1.2-.36-1.88-.68-3.76-1.01-5.65-.05-.3-.12-.6-.19-.96-.75,.04-1.46,.12-2.18,.12-1.6,0-3.2-.02-4.8-.11-.51-.03-.67,.1-.75,.58-.33,2.01-.7,4.02-1.07,6.03-.13,.7-.6,1.17-1.27,1.14-.44-.02-.95-.35-1.25-.69-.2-.23-.16-.74-.1-1.11,.3-1.84,.65-3.66,.98-5.5,.05-.28,.08-.56,.1-.7Z"
                              />
                            </Icon>
                          ) : (
                            <Icon size="5" marginRight="3" viewBox="0 0 50 50">
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
                    <HStack>
                      <Icon ml={3} mt={1} size="5" viewBox="0 0 50 50">
                        {errors.confirmPassword && formData.confirmPassword ? (
                          <Path
                            fill="#49a579"
                            d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
                          />
                        ) : (
                          <Path
                            fill="#606060"
                            d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
                          />
                        )}
                      </Icon>

                      {errors.confirmPassword ? (
                        <FormControl.HelperText ml={2} mt={1}>
                          <Text fontFamily={"Regular"} fontSize="sm">
                            {formData.confirmPassword
                              ? "Confirm Password"
                              : "Please confirm your password"}
                          </Text>
                        </FormControl.HelperText>
                      ) : (
                        <FormControl.ErrorMessage ml={2} mt={2}>
                          <Text fontFamily={"Regular"} fontSize="sm">
                            The confirm password does not match the password.
                          </Text>
                        </FormControl.ErrorMessage>
                      )}
                    </HStack>
                  </FormControl>

                  <Button
                    onPress={handleSubmit}
                    mt="2"
                    width="100%"
                    size="lg"
                    bg="#49a579"
                    _text={{
                      color: "#f9f8f2",
                      fontFamily: "Regular Medium",
                      fontSize: "lg",
                    }}
                    _pressed={{
                      // below props will only be applied on button is pressed
                      bg: "emerald.600",
                      _text: {
                        color: "warmGray.50",
                      },
                    }}
                  >
                    Register
                  </Button>
                  <HStack mb={6} justifyContent="center">
                    <Text fontFamily={"Regular"} fontSize="lg">
                      Already a Habital citizen?{" "}
                    </Text>
                    <Pressable
                      onPress={() =>
                        navigation.navigate("LoginStack", { screen: "Login" })
                      }
                    >
                      <Text
                        fontFamily={"Regular Medium"}
                        fontSize="lg"
                        color="#49a579"
                      >
                        Log in
                      </Text>
                    </Pressable>
                  </HStack>
                </VStack>
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
                          _text={{
                            color: "#f9f8f2",
                          }}
                          colorScheme="blueGray"
                          onPress={() => {
                            setShowVerifyModal(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          rounded={30}
                          shadow="7"
                          width="50%"
                          size={"md"}
                          _text={{
                            color: "#f9f8f2",
                          }}
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

export default RegisterScreen;
