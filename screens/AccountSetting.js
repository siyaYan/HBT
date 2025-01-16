import {
  Input,
  Icon,
  Pressable,
  Center,
  IconButton,
  Actionsheet,
  useDisclose,
  NativeBaseProvider,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { Avatar } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  VStack,
  HStack,
  FormControl,
  Button,
  Box,
  Heading,
  Text,
  Label,
} from "native-base";
import {
  resetEmail,
  resetProfile,
  resetSendEmail,
} from "../components/Endpoint";
import { useData } from "../context/DataContext";
import * as ImagePicker from "expo-image-picker";
import Background from "../components/Background";
import { updateAvatar } from "../components/Endpoint";
import { SvgXml } from "react-native-svg";


const AccountSettingScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  const { isOpen, onOpen, onClose } = useDisclose();
  const [selectedImage, setSelectedImage] = useState(null);
  const [inputChange, setInputChange] = useState({
    nick: false,
    user: false,
    email: false,
  });

  useEffect(() => {
    (async () => {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (
        cameraPermission.status !== "granted" ||
        mediaLibraryPermission.status !== "granted"
      ) {
        alert("Camera and media library access permissions are required!");
      }
    })();
  }, []);

  //   TODO: token of reset email
  const [formData, setData] = useState({
    nickname: userData.data.nickname,
    username: userData.data.username,
    email: userData.data.email,
    token: true,
    send: false,
  });
  const [errors, setErrors] = useState({
    email: true,
    username: true,
    confirmPassword: true,
    password: true,
    token: true,
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

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setSelectedImage(result);
      // console.log("Captured Image Result:", result);
      const response = await updateAvatar(
        userData.token,
        userData.data.email,
        result.assets[0]
      );
      updateUserData({
        ...userData,
        avatar: result.assets[0],
      });
      handleUploadImage();
    }
    // console.log(selectedImage)
  };

  const handleTakePicture = async () => {
    const result = await ImagePicker.launchCameraAsync();
    try {
      if (!result.canceled) {
        setSelectedImage(result);
        const response = await updateAvatar(
          userData.token,
          userData.data.email,
          result.assets[0]
        );
        updateUserData({
          ...userData,
          avatar: result.assets[0],
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  // const handleUploadImage = async () => {
  //   // Implement image upload to backend here
  //   // You can use the 'selectedImage' state to get the image data
  //   const response = await updateAvatar(
  //     userData.token,
  //     userData.data.email,
  //     userData.avatar
  //   );
  //   if (response.data) {
  //     // console.log(response.data, "got");
  //     const newData = userData.data;
  //     newData.profileImageUrl = response.data.profileImageUrl;
  //     updateUserData({
  //       ...userData,
  //       data: newData,
  //     });
  //   }
  // };

  const validateEmail = (text) => {
    setInputChange({
      ...inputChange,
      email: true,
    });
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
    }
  };
  const validateUsername = (text) => {
    if (text == userData.data.username) {
      setInputChange({
        ...inputChange,
        user: false,
      });
    } else {
      setInputChange({
        ...inputChange,
        user: true,
      });
    }

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
      } else if (!(text.length <= 20 && text.length >= 5)) {
        Prop = "Length should be between 5 to 20 characters.";
      } else if (!/^(?=.*[A-Za-z])/.test(text)) {
        Prop = "It should start with a letter.";
      } else if (!/\s/.test(text)) {
        Prop = "It should not contain space.";
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
            showMessage.username.constrain1 &&
            showMessage.username.constrain2 &&
            showMessage.username.constrain3 &&
            showMessage.username.constrain4,
        });
      console.log(showMessage.username);
      // console.log(showMessage.textProp,'in');
      return (
        showMessage.username.constrain1 &&
        showMessage.username.constrain2 &&
        showMessage.username.constrain3 &&
        showMessage.username.constrain4
      );
    } else {
      setErrors({
        ...errors,
        username: false,
      });
      return false;
    }
  };
  const validateNickname = (text) => {
    if (text && text !== "") {
      setInputChange({
        ...inputChange,
        nick: true,
      });
      setData({
        ...formData,
        nickname: text,
      });
      // console.log(text, "nickname");
      if (formData.nickname.trim() != "") {
        setErrors({
          ...errors,
          nickname: false,
        });
        return true;
      } else {
        setErrors({
          ...errors,
          nickname: "Nickname can not be empty.",
        });
        return false;
      }
    } else {
      setErrors({
        ...errors,
        nickname: "Nickname can not be empty.",
      });
      return false;
    }
  };
  async function saveNickName() {
    if (
      inputChange.nick &&
      !errors.nickname &&
      formData.nickname &&
      formData.nickname.trim() != ""
    ) {
      const response = await resetProfile(
        userData.data.email,
        userData.token,
        formData.nickname,
        userData.data.username
      );
      // console.log(response)
      if (response.status == "success") {
        updateUserData({
          data: response.data.user,
          avatar: {
            uri: response.data.user.profileImageUrl,
          },
        });
      } else {
        setData({
          ...formData,
          nickname: "",
        });
      }
    }
  }
  async function saveUsername() {
    if (
      inputChange.user &&
      !Object.values(showMessage.username).some((value) => value === false)
    ) {
      const response = await resetProfile(
        userData.data.email,
        userData.token,
        userData.data.nickname,
        formData.username
      );
      // console.log(response)
      if (response.status == "success") {
        updateUserData({
          data: response.data.user,
          avatar: {
            uri: response.data.user.profileImageUrl,
          },
        });
      } else {
        setData({
          ...formData,
          username: "",
        });
      }
    }
  }

  async function saveEmail() {
    const response = await resetEmail(
      userData.token,
      userData.data.email,
      formData.token
    );
    // Handle success or error response
    if (response.status != "success") {
      setData({
        ...formData,
        token: "",
      });
      setErrors({
        ...errors,
        token: "Reset token invalid",
      });
    } else {
      await updateUserData({
        ...userData,
        data: response.data.user,
        avatar: {
          uri: response.data.user.profileImageUrl,
        },
      });
      console.log(userData);
    }
  }

  async function sendToken() {
    if (inputChange.email) {
      const response = await resetSendEmail(
        userData.token,
        userData.data.email,
        formData.email
      );
      // Handle success or error response
      if (response.status != "success") {
        setData({
          ...formData,
          send: false,
        });
        setErrors({
          ...errors,
          email: "Email address invalid",
        });
      } else {
        setData({
          ...formData,
          send: true,
        });
      }
    }
  }

  const goResetPassword = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate("AccountStack", { screen: "ResetPassword" });
  };

  return (
    <NativeBaseProvider>
      <Center w="100%">
        <Background />
        <Box w="80%" h="100%" maxW="320">
          <Pressable onPress={onOpen}>
            <Box py="5" alignItems="center" justifyContent="center">
              {selectedImage ? (
                <Avatar
                  bg="white"
                  mb="1"
                  size="lg"
                  source={{ uri: selectedImage.assets[0].uri }}
                >
                  <Avatar.Badge
                    bg="white"
                    position="absolute"
                    top={0}
                    right={0}
                  >
                    <Ionicons name="settings-sharp" size={16} color="black" />
                  </Avatar.Badge>
                </Avatar>
              ) : (
                <Avatar
                  bg="white"
                  mb="1"
                  size="lg"
                  source={{ uri: userData.avatar.uri }}
                >
                  <Avatar.Badge
                    bg="white"
                    position="absolute"
                    top={0}
                    right={0}
                  >
                    <Ionicons name="settings-sharp" size={16} color="black" />
                  </Avatar.Badge>
                </Avatar>
              )}
            </Box>
          </Pressable>
          <VStack space={3} mt="10" style={{ justifyContent: "center" }}>
            <FormControl
              isInvalid={
                errors.nickname && inputChange.nick && formData.nickname
              }
            >
              <FormControl.Label
                ml={1}
                _text={{
                  fontFamily: "Regular Semi Bold",
                  fontSize: "lg",
                  color: "#191919",
                }}
              >
                Nickname
              </FormControl.Label>
              <Box flexDir="row" w="100%">
                <Input
                  borderColor="#49a579"
                  rounded="30"
                  fontFamily={"Regular Medium"}
                  size="lg"
                  mr={3}
                  w="93%"
                  placeholder="Nickname"
                  value={formData.nickname}
                  onChangeText={validateNickname}
                />
                <Pressable onPress={saveNickName}>
                  <SvgXml
                    xml={SaveButtonSVG(
                      inputChange.nick &&
                        !errors.nickname &&
                        formData.nickname
                        ? "black"
                        : "grey"
                    )}
                    width={40}
                    height={40}
                  />
                </Pressable>
              </Box>
              <Box ml={1}>
                <FormControl.ErrorMessage>
                  {errors.nickname ? errors.nickname : ""}
                </FormControl.ErrorMessage>
              </Box>
            </FormControl>
            <FormControl
              isInvalid={
                Object.values(showMessage.username).some(
                  (value) => value === false
                ) &&
                inputChange.user &&
                formData.username
              }
            >
              <FormControl.Label
                ml={1}
                _text={{
                  fontFamily: "Regular Semi Bold",
                  fontSize: "lg",
                  color: "#191919",
                }}
              >
                Username
              </FormControl.Label>
              <Box flexDir="row" w="100%">
                <Input
                  borderColor="#49a579"
                  rounded="30"
                  fontFamily={"Regular Medium"}
                  size="lg"
                  mr={3}
                  w="93%"
                  placeholder="Username"
                  value={formData.username}
                  onChangeText={validateUsername}
                />
                <Pressable onPress={saveUsername}>
                  <SvgXml
                    xml={SaveButtonSVG(
                      formData.username &&
                        inputChange.user &&
                        !Object.values(showMessage.username).some((value) => value === false)
                        ? "black"
                        : "grey"
                    )}
                    width={40}
                    height={40}
                  />
                </Pressable>
              </Box>
              <Box ml={1}>
                <FormControl.ErrorMessage>
                  {Object.values(showMessage.username).some((value) => value === false)
                    ? showMessage.textProp
                    : ""}
                </FormControl.ErrorMessage>
              </Box>
            </FormControl>
            <FormControl isInvalid={!errors.email}>
              <FormControl.Label
                ml={1}
                _text={{
                  fontFamily: "Regular Semi Bold",
                  fontSize: "lg",
                  color: "#191919",
                }}
              >
                Email
              </FormControl.Label>
              <Box flexDir="row" w="100%">
                <Input
                  borderColor="#49a579"
                  rounded="30"
                  fontFamily={"Regular Medium"}
                  size="lg"
                  mr={3}
                  w="93%"
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={validateEmail}
                />
                <Pressable onPress={sendToken}>
                  <SvgXml
                    xml={SaveButtonSVG(inputChange.email ? "black" : "grey")}
                    width={40}
                    height={40}
                  />
                </Pressable>
              </Box>
              <Box ml={1}>
                <FormControl.ErrorMessage>
                  {!errors.email ? "Email address is not valid" : ""}
                </FormControl.ErrorMessage>
              </Box>
            </FormControl>
            {formData.send ? (
              <FormControl isInvalid={!errors.token}>
                <FormControl.Label
                  ml={1}
                  _text={{
                    fontFamily: "Regular Semi Bold",
                    fontSize: "lg",
                    color: "#191919",
                  }}
                >
                  Verification code
                </FormControl.Label>
                <Box flexDir="row" w="100%" alignItems="center">
                  <Input
                    borderColor="#49a579"
                    rounded="30"
                    fontFamily={"Regular Medium"}
                    size="lg"
                    mr={3}
                    w="93%"
                    placeholder="Enter the code"
                    value={formData.token}
                    onChangeText={(value) => {
                      setData({
                        ...formData,
                        token: value,
                      });
                    }}
                  />
                  <Pressable onPress={saveEmail}>
                    <SvgXml
                      xml={SaveButtonSVG(
                        formData.token ? "black" : "grey"
                      )}
                      width={40}
                      height={40}
                    />
                  </Pressable>
                </Box>
                <Box ml={1}>
                  <FormControl.ErrorMessage>
                    {!errors.token ? "Input token it not valid" : ""}
                  </FormControl.ErrorMessage>
                </Box>
              </FormControl>
            ) : (
              ""
            )}
            {(userData.data?.googleId || userData.data?.facebookId) ? ('') : (
              <Button
                onPress={goResetPassword}
                rounded="30"
                mt="5"
                width="100%"
                size="lg"
                style={{
                  borderWidth: 1,
                  borderColor: "#49a579",
                }}
                backgroundColor={"rgba(250,250,250,0.2)"}
                _text={{
                  color: "#191919",
                  fontFamily: "Regular Semi Bold",
                  fontSize: "lg",
                }}
                _pressed={{
                  bg: "#e5f5e5",
                }}
              >
                <HStack alignItems="center" space={2}>
                  <SvgXml xml={ChangePasswordSVG()} width={24} height={24} />
                  <Text color="#191919" fontFamily="Regular Semi Bold" fontSize="lg">
                    Change your password
                  </Text>
                </HStack>
              </Button>
            )}
          </VStack>
        </Box>
        <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
          <Actionsheet.Content>
            <Box
              w="100%"
              h={60}
              px={4}
              justifyContent="center"
              alignItems="center"
            >
              <Text
                fontSize="16"
                color="gray.500"
                _dark={{
                  color: "gray.300",
                }}
              >
                Pick photo from
              </Text>
            </Box>
            <Actionsheet.Item
              onPress={handleTakePicture}
              alignItems="center"
              startIcon={<Icon as={MaterialIcons} size="6" name="camera-alt" />}
            >
              Take Photo
            </Actionsheet.Item>
            <Actionsheet.Item
              onPress={handleChooseImage}
              alignItems="center"
              startIcon={<Icon as={MaterialIcons} name="camera" size="6" />}
            >
              Photo Album
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
      </Center>
    </NativeBaseProvider>
  );
};

const SaveButtonSVG = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <defs>
      <style>.cls-1{fill:none;stroke:#000;stroke-miterlimit:10;stroke-width:1px;}</style>
    </defs>
    <path class="cls-1" d="M11.13,24.99c0-4.89,0-9.77,0-14.66,0-2.03.79-2.84,2.81-2.84,7.37,0,14.74,0,22.11,0,2.02,0,2.82.8,2.82,2.83,0,9.81,0,19.62.01,29.43,0,1.06-.25,1.94-1.21,2.48-.97.54-1.86.28-2.73-.32-2.72-1.84-5.48-3.63-8.19-5.5-1.2-.83-2.28-.83-3.48,0-2.68,1.85-5.41,3.61-8.1,5.44-.9.61-1.8.95-2.82.38-1.02-.56-1.23-1.5-1.22-2.59.02-4.89.01-9.77.01-14.66Z"/>
  </svg>`;

const SavedButtonSVG = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <path class="cls-1" d="M11.13,24.99c0-4.89,0-9.77,0-14.66,0-2.03.79-2.84,2.81-2.84,7.37,0,14.74,0,22.11,0,2.02,0,2.82.8,2.82,2.83,0,9.81,0,19.62.01,29.43,0,1.06-.25,1.94-1.21,2.48-.97.54-1.86.28-2.73-.32-2.72-1.84-5.48-3.63-8.19-5.5-1.2-.83-2.28-.83-3.48,0-2.68,1.85-5.41,3.61-8.1,5.44-.9.61-1.8.95-2.82.38-1.02-.56-1.23-1.5-1.22-2.59.02-4.89.01-9.77.01-14.66Z"/>
  </svg>`;

const ChangePasswordSVG = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <path class="cls-1" d="M2.27,23.55c.12-.86.2-1.72.37-2.57,1.73-8.42,6.6-14.21,14.59-17.37.1-.04.2-.09.4-.17-.3-.19-.53-.33-.77-.48-.73-.47-.95-1.32-.54-2.01.42-.69,1.28-.91,2.02-.47,1.25.74,2.49,1.49,3.72,2.25.74.46.95,1.25.54,2.01-.7,1.27-1.41,2.53-2.13,3.79-.44.76-1.27,1-1.99.61-.72-.4-.94-1.26-.52-2.05.13-.24.26-.47.45-.8-.26.08-.42.12-.58.19-7.45,3.18-11.78,8.77-12.57,16.84-.88,8.99,4.5,17.27,12.98,20.35,1.07.39,2.2.61,3.3.89.75.19,1.22.68,1.26,1.39.04.63-.37,1.25-1.01,1.42-.27.07-.58.09-.85.03-9.61-2.12-15.67-7.94-18.13-17.48-.26-1.01-.32-2.06-.48-3.1-.02-.12-.05-.25-.08-.37,0-.97,0-1.93,0-2.9Z"/>
    <path class="cls-1" d="M32.05,49.75c-1.39-.83-2.79-1.66-4.17-2.5-.71-.44-.92-1.25-.52-1.98.71-1.28,1.42-2.56,2.16-3.83.43-.74,1.25-.97,1.95-.59.71.38.96,1.24.57,2-.13.26-.28.5-.47.85.21-.06.34-.09.46-.14,7.18-2.99,11.5-8.3,12.58-16,1.47-10.49-5.7-20.22-16.08-22.1-.95-.17-1.5-.88-1.34-1.73.16-.84.92-1.32,1.83-1.13,8.35,1.75,14.21,6.55,17.26,14.52,4.44,11.61-1.6,24.78-13.23,29.16-.2.08-.41.16-.7.27.64.44,1.38.7,1.49,1.54.1.71-.23,1.22-1.11,1.66h-.68Z"/>
    <path class="cls-1" d="M24.97,37.76c-2.3,0-4.61,0-6.91,0-2.5,0-4.19-1.69-4.19-4.18,0-2.93,0-5.87,0-8.8,0-1.59.66-2.78,1.98-3.64.14-.09.25-.36.25-.54-.02-1.43.12-2.82.67-4.17,1.47-3.62,5.3-5.97,9.04-5.52,4.17.5,7.37,3.5,7.96,7.51.11.73.06,1.48.13,2.22.02.19.13.43.28.53,1.29.84,1.95,2.01,1.95,3.56,0,2.96,0,5.93,0,8.89,0,2.44-1.71,4.14-4.13,4.14-2.34,0-4.67,0-7.01,0ZM25,23.53c-2.32,0-4.64,0-6.96,0-.91,0-1.28.38-1.28,1.3,0,2.91,0,5.83,0,8.74,0,.89.4,1.28,1.31,1.28,4.61,0,9.21,0,13.82,0,.96,0,1.33-.38,1.33-1.35,0-2.87,0-5.73,0-8.6,0-1.02-.35-1.37-1.36-1.38-2.29,0-4.57,0-6.86,0ZM30.93,20.61c.31-2.49-.91-4.88-3.07-6.08-2.13-1.19-4.77-.94-6.69.63-1.59,1.3-2.58,3.87-2.09,5.45h11.84Z"/>
    <path class="cls-1" d="M23.54,29.17c0-.34-.01-.68,0-1.01.04-.8.66-1.41,1.43-1.42.77,0,1.42.59,1.45,1.39.03.71.03,1.42,0,2.13-.03.79-.69,1.4-1.45,1.4-.76,0-1.4-.63-1.43-1.42-.02-.35,0-.71,0-1.06Z"/>
  </svg>`;



export default AccountSettingScreen;
