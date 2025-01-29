import React, { useState } from "react";
import {
  Input,
  Icon,
  Pressable,
  Center,
  Heading,
  VStack,
  Box,
  FormControl,
  Button,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  HStack,
} from "native-base";
import { resetPassword } from "../components/Endpoint"; // Import the mock function
import { MaterialIcons } from "@expo/vector-icons";
import Background from "../components/Background";
import { useData } from "../context/DataContext";
import { Path } from "react-native-svg";

const ResetPassword = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  const current = "123";
  const [formData, setData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [errors, setErrors] = useState({
    // email: true,
    // username: true,
    confirmPassword: true,
    password: true,
    current: true,
  });

  const validatePassword = (text) => {
    setData({
      ...formData,
      password: text,
    });
    // const res = text === formData.confirmPassword;
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
        // confirmPassword: res,
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
    }
  };
  const validateConfirm = (text) => {
    setData({
      ...formData,
      confirmPassword: text,
    });
    const res = text === formData.password;
    console.log(res);
    if (text) {
      setErrors({
        ...errors,
        confirmPassword: res,
      });
    } else {
      setErrors({
        ...errors,
        confirmPassword: res,
      });
    }
    return res;
  };

  const validateCurrent = (text) => {
    setData({
      ...formData,
      current: text,
    });
    setErrors({
      ...errors,
      current: true,
    });
    // if (text == current) {
    //   setErrors({
    //     current: true,
    //   });
    // } else {
    //   setErrors({
    //     current: false,
    //   });
    // }
  };

  const handleSubmit = () => {
    const hasErrors = Object.values(errors).some((error) => error == false);
    if (!hasErrors&&formData.password&&formData.current&&formData.confirmPassword) {
      console.log("submitted");
      handlePasswordReset();
    } else {
      console.log("was unsucessful.");
    }
  };

  const handlePasswordReset = async () => {
    // Call the mock registration function
    const response = await resetPassword(
      userData.data.email,
      userData.token,
      formData.current,
      formData.password,
      formData.confirmPassword
    );
    // Handle success or error response
    if (response.status == "success") {
      navigation.navigate("LoginStack", { screen: "Login" });
    } else {
      setErrors({
        ...errors,
        current: false,
      });
      console.log(response);
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
            alignItems="center"
            alignSelf="center"
            position="relative"
            safeArea
            h="100%"
            w="80%"
            maxW={320}
          >
            <VStack w="100%" h="100%" space={6}>
              <VStack>
                <Text
                  mt={10}
                  ml={2}
                  fontSize="3xl"
                  style={{ fontFamily: "Bold" }}
                >
                  Reset password
                </Text>
              </VStack>
              <VStack w="100%" space={5}>
                <FormControl isRequired isInvalid={!errors.current}>
                  <Input
                    size="lg"
                    value={formData.current}
                    placeholder="Enter your current password"
                    onChangeText={validateCurrent}
                    type={showCurrent ? "text" : "password"}
                    InputRightElement={
                      <Pressable onPress={() => setShowCurrent(!showCurrent)}>
                        {!showCurrent ? (
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
                              d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
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
                  <FormControl.ErrorMessage ml={2} mt={2}>
                    <Text fontFamily={"Regular"} fontSize="sm">
                      {!errors.current
                        ? "Current Password is not correct!"
                        : "Please enter your current password"}
                    </Text>
                  </FormControl.ErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!errors.password}>
                  <Input
                    size="lg"
                    value={formData.password}
                    placeholder="Password"
                    onChangeText={validatePassword}
                    type={showPassword ? "text" : "password"}
                    InputRightElement={
                      <Pressable onPress={() => setShowPassword(!showPassword)}>
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
                              d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
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
                              d="M38.4,15.41c4.3-6.2,8.27-8.39,7.45-10.02-1.13-2.24-9.92-.68-16.82,2.12C17.48,12.21,2.52,23.95,4.17,36.33c.47,3.51,2.15,6.14,3.2,7.55,1.25-4.95,3.91-12.59,10.08-19.77,4.54-5.28,9.7-8.85,9.94-8.59.26.28-5.51,4.82-10.55,12.2-4.48,6.55-6.74,12.94-7.98,17.59.41.11.99.24,1.71.31,0,0,1.03.11,2.1.02,8.96-.7,16.02-9.06,16.02-9.06,6.44-7.63,2.93-11.39,9.71-21.17Z"
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
                  disabled={!(formData.password&&formData.current&&formData.confirmPassword)|| Object.values(errors).some((error) => error == false)}
                  mt="5"
                  width="100%"
                  size="lg"
                  // bg={!(formData.password&&formData.current&&formData.confirmPassword)?"#49a579":"gray"}
                  style={{
                    backgroundColor:!(formData.password&&formData.current&&formData.confirmPassword)|| Object.values(errors).some((error) => error == false)?"rgba(73,165,121,0.4)":"#49a579"
                  }}
                  _text={{
                    color: "rgba(249,248,242,0.4)",
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
                  Proceed to change
                </Button>
              </VStack>
            </VStack>
          </Box>
        </ScrollView>
      </Center>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;
