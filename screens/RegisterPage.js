import {
  Input,
  Icon,
  Pressable,
  Center,
  IconButton,
  ScrollView,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
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

import { registerUser } from "../components/Endpoint";
import Background from "../components/Background";

const RegisterScreen = ({ navigation }) => {
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
    textProp: "Input your username start with charactor.",
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
      email: text,
    });
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const res = regex.test(text);
    console.log(res);
    if (text) {
      setErrors({
        ...errors,
        email: res,
      });
      return res;
    } else {
      setErrors({
        ...errors,
        email:false
      });
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
      if (!/(?=.*\d)[A-Za-z\d]/.test(text)) {
        Prop = "It should contain at least one digit.";
      }
      if (!(text.length <= 20 && text.length >= 5)) {
        Prop = "Length should be between 5 to 20 characters.";
      }
      if (!/^(?=.*[A-Za-z])/.test(text)) {
        Prop = "It should start with a letter.";
      }
      if (!/^\S+$/.test(text)) {
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
          username:
            (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/.test(text) &&
            /^\S+$/.test(text)),
        });
      console.log(showMessage.username);
      // console.log(showMessage.textProp,'in');
      return (
        showMessage.username.constrain1 &&
        showMessage.username.constrain2 &&
        showMessage.username.constrain3 &&
        showMessage.username.constrain4
      );
    }else{
      setErrors({
        ...errors,
        username:false
      });
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
    }else{
      setErrors({
        ...errors,
        password:false
      });
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
    }else{
      setErrors({
        ...errors,
        confirmPassword:false
      });
    }
  };

  const handleSubmit = () => {
    const hasErrors = Object.values(errors).some((error) => error == true);

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
      // Optionally clear inputs here if necessary
      if (
        validateUsername(formData.username) &&
        validateEmail(formData.email) &&
        validatePassword(formData.password) &&
        validateConfirm(formData.confirmPassword)
      ) {
        console.log("secuss");
        handleRegister();
      } else {
        console.log("error!!");
        // if (errors.username) {
        //   // Clear username if it's invalid
        //   setData({ ...formData, username: "" });
        // }
        // if (errors.email) {
        //   // Clear email if it's invalid
        //   setData({ ...formData, email: "" });
        // }
        // if (errors.password) {
        //   // Clear username if it's invalid
        //   setData({ ...formData, password: "" });
        // }
        // if (errors.confirmPassword) {
        //   // Clear email if it's invalid
        //   setData({ ...formData, confirmPassword: "" });
        // }
      }
    }

    console.log({
      username: formData.username,
      nickname: formData.nickname,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });
    console.log("error", {
      username: errors.username,
      email: errors.email,
      password: errors.password,
      confirm: errors.confirmPassword,
    });
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
    if (response.token) {
      navigation.navigate("LoginStack", { screen: "Login" });
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
            // justifyContent="center"
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
                    mt={10}
                    ml={2}
                    fontSize="3xl"
                    style={{ fontFamily: "Bold" }}
                  >
                    Create account
                  </Text>
                </VStack>
                <VStack w="100%" space={4}>
                  <FormControl isRequired isInvalid={!errors.username}>
                    <Input
                      rounded={30}
                      size="lg"
                      fontFamily={"Regular Semi Bold"}
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
                        <Text fontFamily={"Regular"} fontSize="sm">
                          {showMessage.textProp
                            ? showMessage.textProp
                            : "✅ Username"}
                        </Text>
                      </FormControl.HelperText>
                    )}
                  </FormControl>
                  <FormControl>
                    <Input
                      rounded={30}
                      size="lg"
                      fontFamily={"Regular Semi Bold"}
                      placeholder="Nickname"
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
                          : "Nick name is optional"}
                      </Text>
                    </FormControl.HelperText>
                  </FormControl>

                  <FormControl isRequired isInvalid={!errors.email}>
                    <Input
                      rounded={30}
                      size="lg"
                      fontFamily={"Regular Semi Bold"}
                      placeholder="Email"
                      value={formData.email}
                      onChangeText={validateEmail}
                    />
                    {errors.email ? (
                      <FormControl.HelperText ml={3} mt={1}>
                        <Text fontFamily={"Regular"} fontSize="sm">
                          
                          {formData.email
                            ? "✅ Email"
                            : "Please input your email address"}
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
                      rounded={30}
                      size="lg"
                      fontFamily={"Regular Semi Bold"}
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
                          <Icon
                            as={
                              <MaterialIcons
                                name={
                                  showPassword ? "visibility" : "visibility-off"
                                }
                              />
                            }
                            size={5}
                            mr="2"
                            color="muted.400"
                          />
                        </Pressable>
                      }
                    />
                    {showMessage.password ? (
                      <FormControl.HelperText ml={3} mt={1}>
                        <Text fontFamily={"Regular"} fontSize="sm">
                          {errors.length ? "✅" : "❌"} Between 8-20 characters
                        </Text>
                        <Text fontFamily={"Regular"} fontSize="sm">
                          {errors.letterAndNumber ? "✅" : "❌"} Must include a
                          letter and a number
                        </Text>
                        <Text fontFamily={"Regular"} fontSize="sm">
                          {errors.noSpaces ? "✅" : "❌"} No space is allowed
                        </Text>
                        <Text fontFamily={"Regular"} fontSize="sm">
                          {errors.specialChars ? "✅" : "❌"} At least one special
                          case: !@#%&_?#=-{" "}
                        </Text>
                      </FormControl.HelperText>
                    ) : (
                      <FormControl.HelperText ml={3} mt={1}>
                        <Text fontFamily={"Regular"} fontSize="sm">
                        {formData.password
                            ? "✅ Password"
                            : "Please input your password"}
                          
                        </Text>
                      </FormControl.HelperText>
                    )}
                  </FormControl>

                  <FormControl isRequired isInvalid={!errors.confirmPassword}>
                    <Input
                      rounded={30}
                      size="lg"
                      fontFamily={"Regular Semi Bold"}
                      value={formData.confirmPassword}
                      placeholder="Confirm Password"
                      onChangeText={validateConfirm}
                      type={showConfirm ? "text" : "password"}
                      InputRightElement={
                        <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                          <Icon
                            as={
                              <MaterialIcons
                                name={
                                  showConfirm ? "visibility" : "visibility-off"
                                }
                              />
                            }
                            size={5}
                            mr="2"
                            color="muted.400"
                          />
                        </Pressable>
                      }
                    />
                    {!errors.confirmPassword ? (
                      <FormControl.ErrorMessage ml={3} mt={1}>
                        <Text fontFamily={"Regular"} fontSize="sm">
                          Confirm password is not correct
                        </Text>
                      </FormControl.ErrorMessage>
                    ) : (
                      <FormControl.HelperText ml={3} mt={1}>
                        <Text fontFamily={"Regular"} fontSize="sm">
                        {formData.confirmPassword
                            ? "✅ Confirm Password"
                            : "Please confirm your password"}
                          
                        </Text>
                      </FormControl.HelperText>
                    )}
                  </FormControl>

                  <Button
                    rounded={30}
                    shadow="7"
                    width="100%"
                    size={"lg"}
                    onPress={handleSubmit}
                    mt="2"
                    backgroundColor={"#49a579"}
                    _text={{
                      color: "#f9f8f2",
                      fontFamily: "Regular Semi Bold",
                      fontSize: "lg",
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
                        fontFamily={"Regular Semi Bold"}
                        fontSize="lg"
                        color="#49a579"
                      >
                        Log in
                      </Text>
                    </Pressable>
                  </HStack>
                </VStack>
              </VStack>
            </Center>
          </Box>
        </ScrollView>
      </Center>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
