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
} from "native-base";
import { resetPassword } from "../components/Endpoint"; // Import the mock function
import { MaterialIcons } from "@expo/vector-icons";
import Background from "../components/Background";
import { useData } from "../context/DataContext";
import bcrypt from "bcryptjs";
import { Path } from "react-native-svg";

const ResetPassword = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  const current = "123";

  const [formData, setData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [errors, setErrors] = useState({
    length: false,
    letterAndNumber: false,
    noSpaces: false,
    specialChars: false,
    token: false,
  });

  //for real time check effect
  const validatePassword = (text) => {
    setData({
      ...formData,
      password: text,
    });
    if (text) {
      setErrors({
        length: text.length >= 8 && text.length <= 20,
        letterAndNumber: /[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/.test(text),
        noSpaces: !/\s/.test(text),
        specialChars: /[!@#%&_?#=-]/.test(text),
      });
      return (
        errors.length &&
        errors.letterAndNumber &&
        errors.noSpaces &&
        errors.specialChars
      );
    }
  };

  const validateCurrent = (text) => {
    setData({
      ...formData,
      current: text,
    });
    // bcrypt
    //   .compare(userData.data.password, text)
    //   .then((result) => {
    //     console.log(userData.data.password,text,result)
    //     if (result) {
    //       console.log("Current Password is correct");
    //     } else {
    //       console.log("Current Password is incorrect");
    //       setErrors({
    //         ...errors,
    //         current: true,
    //       });
    //     }
    //   })
    //   .catch((error) => {
    //     setErrors({
    //       ...errors,
    //       current: true,
    //     });
    //     console.error("Error comparing passwords:", error);
    //   });
    // bcrypt.hash(text,12,(err, hash) => {
    //   if (err) {
    //     console.error('Error hashing password:', err);
    //   } else {
    //     console.log('Hashed Password:', hash);
    //   }
    // });
  };

  //Only validate the password match
  const validate = () => {
    let error1 = false;
    let error2 = false;
    let data1 = formData.confirmPassword;
    let data2 = formData.current;
    if (
      formData.password == formData.confirmPassword &&
      formData.current == current
    ) {
      setErrors({
        ...errors,
        confirmPassword: error1,
        current: error2,
      });
      return true;
    } else {
      if (formData.password !== formData.confirmPassword) {
        console.log("Passwords do not match.");
        data1 = "";
        error1 = true;
        // return false;
      } else {
        console.log("Password match.");
      }
      if (formData.current !== current) {
        console.log("Current Password is wrong.");
        data2 = "";
        error2 = true;
        // return false;
      } else {
        console.log("current password is right.");
      }
      setErrors({
        ...errors,
        confirmPassword: error1,
        current: error2,
      });
      setData({
        ...formData,
        confirmPassword: data1,
        current: data2,
      });
      return false;
    }
  };

  const handleSubmit = () => {
    if (validatePassword(formData.password)) {
      setErrors({
        ...errors,
        password: false,
      });
      if (validate()) {
        console.log("Submitted");
        console.log(errors.confirmPassword);
        handlePasswordReset();
      }
    } else {
      console.log("Validation Password Failed");
      setData({
        ...formData,
        password: "",
      });
      setErrors({
        ...errors,
        password: true,
      });
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
    if (response == "failed") {
      setErrors({
        ...errors,
        current: true,
      });
      console.log("current password wrong");
      return false;
    }
  };

  return (
    <Center w="100%">
      <Background />
      <Box safeArea py="8" w="90%" maxW="290">
        <VStack mt="5">
          <Center>
            <FormControl mb={5} isRequired isInvalid={errors.current}>
              <FormControl.Label
                _text={{
                  bold: true,
                }}
              >
                Current password
              </FormControl.Label>
              <Input
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
                          fill="#191919"
                          d="M18.45,31.51l-7.74-3.07c-.15,.38-.36,.92-.56,1.47-.48,1.31-.95,2.62-1.44,3.93-.36,.99-1.08,1.41-1.88,1.12-.8-.29-1.06-1.05-.69-2.08,.68-1.9,1.35-3.8,2.08-5.68,.21-.54,.09-.82-.32-1.18-1.6-1.38-2.93-2.99-3.99-4.81-.16-.27-.3-.54-.42-.83-.3-.76-.05-1.49,.59-1.79,.7-.33,1.35-.03,1.84,.66,1.03,1.44,1.99,2.98,3.24,4.22,3.28,3.24,7.36,4.9,11.89,5.48,4.99,.63,9.86,.25,14.49-1.87,3.67-1.69,6.61-4.2,8.53-7.81,.43-.8,1.15-1.04,1.88-.65,.69,.36,.91,1.06,.51,1.86-1.06,2.17-2.58,3.99-4.39,5.57-.41,.36-.51,.64-.31,1.17,.73,1.88,1.4,3.78,2.08,5.68,.34,.96,.08,1.76-.64,2.05-.84,.33-1.58-.09-1.96-1.11-.67-1.84-1.34-3.68-1.96-5.39l-7.76,3.09c.24,1.34,.52,2.86,.8,4.37,.12,.66,.27,1.32,.37,1.98,.14,.92-.28,1.56-1.07,1.68-.77,.12-1.46-.34-1.63-1.2-.36-1.88-.68-3.76-1.01-5.65-.05-.3-.12-.6-.19-.96-.75,.04-1.46,.12-2.18,.12-1.6,0-3.2-.02-4.8-.11-.51-.03-.67,.1-.75,.58-.33,2.01-.7,4.02-1.07,6.03-.13,.7-.6,1.17-1.27,1.14-.44-.02-.95-.35-1.25-.69-.2-.23-.16-.74-.1-1.11,.3-1.84,.65-3.66,.98-5.5,.05-.28,.08-.56,.1-.7Z"
                        />
                      </Icon>
                    ) : (
                      <Icon size="5" marginRight="3" viewBox="0 0 50 50">
                        <Path
                          class="b"
                          fill="#191919"
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
                {errors.current ? "Current Password is not correct!" : ""}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl mb={5} isRequired isInvalid={errors.password}>
              <FormControl.Label
                _text={{
                  bold: true,
                }}
              >
                Password
              </FormControl.Label>
              <Input
                value={formData.password}
                placeholder="Enter the new password"
                onChangeText={validatePassword}
                type={showPassword ? "text" : "password"}
                InputRightElement={
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    {!showPassword ? (
                      <Icon size="5" marginRight="3" viewBox="0 0 50 50">
                        <Path
                          class="b"
                          fill="#191919"
                          d="M18.45,31.51l-7.74-3.07c-.15,.38-.36,.92-.56,1.47-.48,1.31-.95,2.62-1.44,3.93-.36,.99-1.08,1.41-1.88,1.12-.8-.29-1.06-1.05-.69-2.08,.68-1.9,1.35-3.8,2.08-5.68,.21-.54,.09-.82-.32-1.18-1.6-1.38-2.93-2.99-3.99-4.81-.16-.27-.3-.54-.42-.83-.3-.76-.05-1.49,.59-1.79,.7-.33,1.35-.03,1.84,.66,1.03,1.44,1.99,2.98,3.24,4.22,3.28,3.24,7.36,4.9,11.89,5.48,4.99,.63,9.86,.25,14.49-1.87,3.67-1.69,6.61-4.2,8.53-7.81,.43-.8,1.15-1.04,1.88-.65,.69,.36,.91,1.06,.51,1.86-1.06,2.17-2.58,3.99-4.39,5.57-.41,.36-.51,.64-.31,1.17,.73,1.88,1.4,3.78,2.08,5.68,.34,.96,.08,1.76-.64,2.05-.84,.33-1.58-.09-1.96-1.11-.67-1.84-1.34-3.68-1.96-5.39l-7.76,3.09c.24,1.34,.52,2.86,.8,4.37,.12,.66,.27,1.32,.37,1.98,.14,.92-.28,1.56-1.07,1.68-.77,.12-1.46-.34-1.63-1.2-.36-1.88-.68-3.76-1.01-5.65-.05-.3-.12-.6-.19-.96-.75,.04-1.46,.12-2.18,.12-1.6,0-3.2-.02-4.8-.11-.51-.03-.67,.1-.75,.58-.33,2.01-.7,4.02-1.07,6.03-.13,.7-.6,1.17-1.27,1.14-.44-.02-.95-.35-1.25-.69-.2-.23-.16-.74-.1-1.11,.3-1.84,.65-3.66,.98-5.5,.05-.28,.08-.56,.1-.7Z"
                        />
                      </Icon>
                    ) : (
                      <Icon size="5" marginRight="3" viewBox="0 0 50 50">
                        <Path
                          class="b"
                          fill="#191919"
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
              <FormControl.HelperText>
                <Text>
                  {errors.length ? "✅" : "❌"} Between 8-20 characters
                </Text>
                <Text>
                  {errors.letterAndNumber ? "✅" : "❌"} Must include a letter
                  and a number
                </Text>
                <Text>
                  {errors.noSpaces ? "✅" : "❌"} Cannot have any spaces
                </Text>
                <Text>
                  {errors.specialChars ? "✅" : "❌"} Special characters:
                  !@#%&_?#=-{" "}
                </Text>
                <Text></Text>
              </FormControl.HelperText>
            </FormControl>
            <FormControl mb={5} isRequired isInvalid={errors.confirmPassword}>
              <FormControl.Label
                _text={{
                  bold: true,
                }}
              >
                Confirm Password
              </FormControl.Label>
              <Input
                value={formData.confirmPassword}
                placeholder="Confirm new Password"
                onChangeText={(value) =>
                  setData({
                    ...formData,
                    confirmPassword: value,
                  })
                }
                type={showConfirm ? "text" : "password"}
                InputRightElement={
                  <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                    {!showConfirm ? (
                      <Icon size="5" marginRight="3" viewBox="0 0 50 50">
                        <Path
                          class="b"
                          fill="#191919"
                          d="M18.45,31.51l-7.74-3.07c-.15,.38-.36,.92-.56,1.47-.48,1.31-.95,2.62-1.44,3.93-.36,.99-1.08,1.41-1.88,1.12-.8-.29-1.06-1.05-.69-2.08,.68-1.9,1.35-3.8,2.08-5.68,.21-.54,.09-.82-.32-1.18-1.6-1.38-2.93-2.99-3.99-4.81-.16-.27-.3-.54-.42-.83-.3-.76-.05-1.49,.59-1.79,.7-.33,1.35-.03,1.84,.66,1.03,1.44,1.99,2.98,3.24,4.22,3.28,3.24,7.36,4.9,11.89,5.48,4.99,.63,9.86,.25,14.49-1.87,3.67-1.69,6.61-4.2,8.53-7.81,.43-.8,1.15-1.04,1.88-.65,.69,.36,.91,1.06,.51,1.86-1.06,2.17-2.58,3.99-4.39,5.57-.41,.36-.51,.64-.31,1.17,.73,1.88,1.4,3.78,2.08,5.68,.34,.96,.08,1.76-.64,2.05-.84,.33-1.58-.09-1.96-1.11-.67-1.84-1.34-3.68-1.96-5.39l-7.76,3.09c.24,1.34,.52,2.86,.8,4.37,.12,.66,.27,1.32,.37,1.98,.14,.92-.28,1.56-1.07,1.68-.77,.12-1.46-.34-1.63-1.2-.36-1.88-.68-3.76-1.01-5.65-.05-.3-.12-.6-.19-.96-.75,.04-1.46,.12-2.18,.12-1.6,0-3.2-.02-4.8-.11-.51-.03-.67,.1-.75,.58-.33,2.01-.7,4.02-1.07,6.03-.13,.7-.6,1.17-1.27,1.14-.44-.02-.95-.35-1.25-.69-.2-.23-.16-.74-.1-1.11,.3-1.84,.65-3.66,.98-5.5,.05-.28,.08-.56,.1-.7Z"
                        />
                      </Icon>
                    ) : (
                      <Icon size="5" marginRight="3" viewBox="0 0 50 50">
                        <Path
                          class="b"
                          fill="#191919"
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
                {errors.confirmPassword
                  ? "Confirm Password is not correct!"
                  : ""}
              </FormControl.ErrorMessage>
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
              Proceed to change
            </Button>
          </Center>
        </VStack>
      </Box>
    </Center>
  );
};

export default ResetPassword;
