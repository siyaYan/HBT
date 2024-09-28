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
import { AntDesign } from "@expo/vector-icons";
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
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Background from "../components/Background";
import { updateAvatar } from "../components/Endpoint";

const AccountSettingScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  const { isOpen, onOpen, onClose } = useDisclose();
  const [selectedImage, setSelectedImage] = useState(null);
  const [inputChange, setInputChange] =useState({
    nick :false,
    user:false,
    email:false
  }
  )

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
        alert("Permission to access camera and media library is required!");
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
    },
    password: false,
    confirmPassword: "Please confirm your password.",
    textProp: "Input your username start with character.",
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
      email:true
    })
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

    if(text==userData.data.username){
      setInputChange({
        ...inputChange,
        user:false
      })
    }else{
      setInputChange({
        ...inputChange,
        user:true
      })
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
      }
      if (!(text.length <= 20 && text.length >= 5)) {
        Prop = "Length should be between 5 to 20 characters.";
      }
      if (!/^(?=.*[A-Za-z])/.test(text)) {
        Prop = "It should start with a letter.";
      }
      setShowMessage({
        ...showMessage,
        username: {
          constrain1: /^(?=.*[A-Za-z])/.test(text),
          constrain2: text.length <= 20 && text.length >= 5,
          constrain3: /(?=.*\d)[A-Za-z\d]/.test(text),
        },
        textProp: Prop,
      }),
        setErrors({
          ...errors,
          username: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,20}$/.test(text),
        });
      console.log(showMessage.username);
      // console.log(showMessage.textProp,'in');
      return (
        showMessage.username.constrain1 &&
        showMessage.username.constrain2 &&
        showMessage.username.constrain3
      );
    }
  };
  const validateNickname = (text) => {
    setInputChange({
      ...inputChange,
      nick:true
    })
    setData({
      ...formData,
      nickname: text,
    });
    if (text) {
      console.log(text, "nickname");
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
  };
  async function saveNickName() {
    if(inputChange.nick){
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
    if(inputChange.user){
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
        avatar:{
          uri:response.data.user.profileImageUrl,
        } 
      });
      console.log(userData);
    }
  }

  async function sendToken() {
    if(inputChange.email){
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
          <VStack space={3} mt="10" style={{justifyContent: 'center'}} >

            <FormControl isInvalid={errors.nickname}>
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
                <IconButton
                  icon={
                    <Ionicons name="save-outline" size={30} color={inputChange.nick?"black":"grey"} />
                  }
                  p={0}
                  onPress={saveNickName}
                />
              </Box>
              <Box ml={1}>
                <FormControl.ErrorMessage>
                  {errors.nickname ? errors.nickname : ""}
                </FormControl.ErrorMessage>
              </Box>
            </FormControl>

            <FormControl isInvalid={!errors.username}>
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
                <IconButton
                  icon={
                    <Ionicons name="save-outline" size={30} color={inputChange.user?"black":"grey"} />
                  }
                  p={0}
                  onPress={saveUsername}
                />
              </Box>
              <Box ml={1}>
                <FormControl.ErrorMessage>
                  {Object.values(showMessage.username).some(
                    (value) => value === false
                  )
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
                <IconButton
                  icon={
                    <MaterialCommunityIcons
                      name="email-search-outline"
                      size={30}
                      color={inputChange.email?"black":"grey"}
                    />
                  }
                  p={0}
                  onPress={sendToken}
                />
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
                  <IconButton
                    icon={
                      <Ionicons name="save-outline" size={30} color="black" />
                    }
                    p={0}
                    onPress={saveEmail}
                  />
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
            <Button
              onPress={goResetPassword}
              rounded="30"
              // shadow="1"
              mt="5"
              width="100%"
              size="lg"
              style={{
                borderWidth: 1, // This sets the width of the border
                borderColor: '#49a579', // This sets the color of the border
              }}
              // bg="#f5f5f5"
              backgroundColor={"rgba(250,250,250,0.2)"}
              _text={{
                color: "#191919",
                fontFamily: "Regular Semi Bold",
                fontSize: "lg",
              }}
              _pressed={{
                // below props will only be applied on button is pressed
                bg: "#e5f5e5",
                // _text: {
                //   color: "warmGray.50",
                // },
              }}
            >
              🗝  Change your password
            </Button>
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

export default AccountSettingScreen;
