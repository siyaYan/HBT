import { useState } from "react";
import {
  Center,
  Box,
  VStack,
  HStack,
  Text,
  Button,
  NativeBaseProvider,
  FormControl,
  Flex,
  Input,
} from "native-base";
import { Avatar } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import { findByUserId } from "../components/Endpoint";
import Background from "../components/Background";
import { Feather } from "@expo/vector-icons";

const InviteScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  const [formData, setData] = useState({});
  const [errors, setErrors] = useState({
    userId: true,
  });
  const [findUser, setFind] = useState({user:{profileImageUrl:''}});

  async function handleSubmit() {
    console.log(formData.userId);
    const response = await findByUserId(userData.token, formData.userId);
    if (response.status === "success") {
      // console.log('find!!!!')
      setErrors({
        userId: true,
      });
      setFind({
        user: response.data.user,
      });
    } else {
      setErrors({
        userId: false,
      });
      setFind({
        user: "",
      });
    }
    // if (submitValidation()) {
    //   const response = await loginUser(formData.id, formData.password);
    //   if (response.token) {
    //     if (remember) {
    //       await saveCredentials(formData.id, formData.password);
    //     }
    //     updateUserData({
    //       token: response.token,
    //       data: response.data.user,
    //       avatar:{
    //         uri: response.data.user.profileImageUrl,
    //       }
    //     });
    //     navigation.navigate("MainStack", { screen: "Home" });
    //     // console.log(response.token);
    //   } else {
    //     console.log("login failed");
    //   }
    // }
  }

  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems="center">
        <Box safeArea py="2" w="100%" maxW="300">
          <VStack space={3} alignItems="center">
            <Box py="5" alignSelf={"flex-end"}>
              {userData.avatar.uri ? (
                <Avatar
                  bg="white"
                  mb="1"
                  size="md"
                  source={{ uri: userData.avatar.uri }}
                />
              ) : (
                <Avatar bg="white" mb="1" size="md" borderWidth={2}>
                  <AntDesign name="user" size={30} color="black" />
                </Avatar>
              )}
              <Text fontFamily={"Regular"} fontSize="lg">
                {userData.data.nickname}
              </Text>
            </Box>
            <Box w="100%" maxW="300" alignItems="center">
              <VStack space={5} alignItems="center" w={"100%"}>
                <FormControl isInvalid={!errors.userId}>
                  <FormControl.Label
                    ml={1}
                    _text={{
                      fontFamily: "Regular Semi Bold",
                      fontSize: "lg",
                      color: "#191919",
                    }}
                  >
                    Find a friend
                  </FormControl.Label>
                  <Input
                    borderColor="#49a579"
                    rounded="30"
                    fontFamily={"Regular Medium"}
                    size="lg"
                    w="100%"
                    placeholder="Username/Email address"
                    onChangeText={(value) => {
                      setData({
                        ...formData,
                        userId: value,
                      });
                    }}
                  />
                  <FormControl.ErrorMessage ml={2} mt={2}>
                    <Text fontFamily={"Regular"} fontSize="sm">
                      {!errors.userId ? "No users found" : ""}
                    </Text>
                  </FormControl.ErrorMessage>
                </FormControl>

                <Button
                  onPress={handleSubmit}
                  rounded="30"
                  shadow="6"
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
                  Search
                </Button>
                {findUser.user.profileImageUrl ? (
                  <Box w={"100%"}>
                    <HStack
                      w={"100%"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      space={5}
                      backgroundColor={"light.100"}
                    >
                      {findUser.user.profileImageUrl ? (
                        <Avatar
                          bg="white"
                          mb="1"
                          size={"sm"}
                          source={{ uri: findUser.user.profileImageUrl }}
                        />
                      ) : (
                        <Avatar bg="white" mb="1" size="md" borderWidth={2}>
                          <AntDesign name="user" size={20} color="black" />
                        </Avatar>
                      )}
                      <Text fontFamily={"Regular"} fontSize="lg">
                        {findUser.user.username}
                      </Text>
                      <Text fontFamily={"Regular"} fontSize="lg">
                        {findUser.user.nickname}
                      </Text>
                      <Box>
                        <Feather name="send" size={30} color="black" />
                        <Text fontFamily={"Regular"} fontSize="xs">
                          connect
                        </Text>
                      </Box>
                    </HStack>
                  </Box>):''}
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </NativeBaseProvider>
  );
};

export default InviteScreen;
