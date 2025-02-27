import { useState, useEffect } from "react";
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
  Pressable,
} from "native-base";
import { Avatar } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import {
  connectByUserId,
  findByUserIdAndUsername,
  getFriends,
  reactReceivedRequest,
  getRelationByUserId,
  deleteFriendOrWithdrawRequestById,
} from "../components/Endpoint";
import Background from "../components/Background";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";


const InviteScreen = ({ navigation }) => {
  useEffect(() => {
    console.log(userData, "invite page");
  }, [userData]);
  const { userData, updateUserData } = useData();
  const [formData, setData] = useState({});
  const [errors, setErrors] = useState({
    userId: true,
  });
  const [findUser, setFind] = useState({ user: { profileImageUrl: "" } });
  const [linked, setLink] = useState(false);
  const [pend, setPend] = useState(false);

  const handleSearch = async () => {
    const response = await findByUserIdAndUsername(
      userData.token,
      formData.userId
    );
    console.log(response);
    // const friendsRes = await getFriends(userData.token);
    if (response.status === "success") {
      // console.log("find!!!!");
      setErrors({
        userId: true,
      });
      setFind({
        user: response.data.user,
      });
      // console.log(  response.data.user._id,
      // userData.data._id);
      const res = await getRelationByUserId(
        userData.token,
        response.data.user._id,
        userData.data._id
      );
      console.log(res, userData.data);
      if (res.result == "A") {
        setLink(true);
        setPend(false);
      } else if (res.result == "P") {
        setLink(false);
        setPend(res);
      } else {
        setLink(false);
        setPend(false);
      }
    } else {
      setErrors({
        userId: false,
      });
      setFind({
        user: "",
      });
    }
  };
  const handleConnect = async () => {
    console.log("connect", findUser);
    // console.log(userData.data._id, findUser.user._id);
    const response = await connectByUserId(
      userData.token,
      userData.data._id,
      findUser.user._id
    );
    if (response?.status === "success") {
      console.log("connect!!");
    } else {
      console.log("fail!!");
    }
    handleSearch();
  };
  const handleCancel = async () => {
    // console.log("connect", findUser);
    // console.log(userData.data._id, findUser.user._id);
    console.log("delete current item");
    // const id=sent[i-1]._id
    const id = pend.data._id;
    // console.log(pend.data._id)
    deleteFriendOrWithdrawRequestById(userData.token, id);
    handleSearch();
  };
  const handleAccept = async () => {
    console.log("accept current item");
    const id = pend.data._id;
    // console.log(pend.data._id)
    reactReceivedRequest(userData.token, id, "A");
    setPend(false);
    handleSearch();
  };

  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems="center">
        <Box safeArea py="2" w="100%" maxW="320">
          <VStack paddingY={10} alignItems="center">
            <Box
              w="100%"
              h="95%"
              maxW="300"
              alignItems="center"
              marginTop={"50%"}
            >
              <VStack space={5} alignItems="center" w={"100%"}>
                {/* Code for title: find a friend */}
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
                      {!errors.userId
                        ? "No users were found matching your search."
                        : ""}
                    </Text>
                  </FormControl.ErrorMessage>
                </FormControl>

                {/* Code for search friend button*/}

                {formData.userId &&
                (formData.userId.toLowerCase() == userData.data.email ||
                  formData.userId.toLowerCase() == userData.data.username) ? (
                  <Text fontFamily={"Regular"} fontSize="lg">
                    This is YOU!
                  </Text>
                ) : (
                  <Button
                    onPress={handleSearch}
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
                )}

                {/* Code for showing search friend result*/}
                {findUser.user.profileImageUrl &&
                !(
                  formData.userId.toLowerCase() == userData.data.email ||
                  formData.userId == userData.data.username
                ) ? (
                  <Box w={"100%"}>
                    <HStack
                      w={"100%"}
                      rounded={"25"}
                      alignItems={"center"}
                      justifyContent={"center"}
                      space={7}
                      backgroundColor={
                        linked ? "rgba(73,165,121,0.2)" : "light.100"
                      }
                      paddingY={2}
                    >
                      {findUser.user.profileImageUrl ? (
                        <Avatar
                          bg="f9f8f2"
                          mb="1"
                          ml={1}
                          size={"md"}
                          source={{ uri: findUser.user.profileImageUrl }}
                          rounded={100}
                        />
                      ) : (
                        <Avatar bg="#f9f8f2" mb="2" size="md" borderWidth={2} >
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
                        {linked ? (
                          <Pressable
                            onPress={() => {
                              navigation.navigate("MyCircle");
                            }}
                          >
                            <SvgXml xml={myCircleSVG("#191919")} width={30} height={30} />
                            <Text fontFamily={"Regular"} fontSize="xs">
                              Linked
                            </Text>
                          </Pressable>
                        ) : pend != false ? (
                          pend.data.senderId == userData.data._id ? (
                            <Pressable onPress={handleCancel}>
                              <SvgXml xml={widthdrawSvg()} width={30} height={30} />
                              <Text fontFamily={"Regular"} fontSize="xs">
                                Withdraw
                              </Text>
                            </Pressable>
                          ) : (
                            <Pressable onPress={handleAccept}>
                              <AntDesign
                                name="checkcircleo"
                                size={30}
                                color="#191919"
                              />
                              <Text fontFamily={"Regular"} fontSize="xs">
                                Accept
                              </Text>
                            </Pressable>
                          )
                        ) : (
                          <Pressable onPress={handleConnect}>
                            <Feather name="send" size={30} color="#191919"/>
                            <Text fontFamily={"Regular"} fontSize="xs">
                              Connect
                            </Text>
                          </Pressable>
                        )}
                      </Box>
                    </HStack>
                  </Box>
                ) : (
                  ""
                )}
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </NativeBaseProvider>
  );
};

export default InviteScreen;


const widthdrawSvg = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <defs>
      <style>.cls-1{fill:#000;stroke-width:0px;}</style>
    </defs>
    <path class="cls-1" d="M10.46,32.72c-.38.68-1.35.68-1.74,0l-2.98-5.3s-3.1-5.23-3.1-5.23c-.4-.67.09-1.51.87-1.5l6.08.07,6.08-.07c.78,0,1.26.83.87,1.5,0,0-3.1,5.23-3.1,5.23s-2.98,5.3-2.98,5.3Z"/>
    <path class="cls-1" d="M27.03,4.53C15.58,4.53,6.29,13.99,6.57,25.5h.02s4.42-4.25,4.42-4.25c1.84-7.85,9.29-13.56,17.88-12.61,7.54.84,13.65,6.93,14.49,14.47,1.11,9.92-6.66,18.36-16.36,18.36-4.33,0-8.27-1.7-11.21-4.44l-2.88,2.78c3.69,3.52,8.68,5.69,14.17,5.67,10.73-.04,19.79-8.63,20.36-19.35.63-11.79-8.78-21.58-20.44-21.58Z"/>
  </svg>`;



const myCircleSVG = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
  <defs>
    <style>
      .cls-1, .cls-2 { fill: #000; stroke: #000; stroke-miterlimit: 10; }
      .cls-2 { stroke-width: 0.75px; }
    </style>
  </defs>
  <path class="cls-2" d="M23.1,22.47s-.04,0-.05,0c-2.43-.02-4.51-1.6-5.06-3.84-.09-.37.16-.75.55-.83.39-.08.79.15.89.52.39,1.58,1.92,2.74,3.63,2.76.01,0,.03,0,.04,0,1.74,0,3.28-1.16,3.67-2.76.09-.37.49-.6.89-.52.4.09.65.46.55.83-.55,2.23-2.69,3.84-5.11,3.84Z"/>
  <path class="cls-1" d="M23.1,27.43c-5.73,0-10.39-4.66-10.39-10.39s4.66-10.39,10.39-10.39,10.39,4.66,10.39,10.39-4.66,10.39-10.39,10.39ZM23.1,8.62c-4.64,0-8.42,3.78-8.42,8.42s3.78,8.42,8.42,8.42,8.42-3.78,8.42-8.42-3.78-8.42-8.42-8.42Z"/>
  <path class="cls-1" d="M5.07,40.5c-.53,0-.97-.42-.99-.95-.06-1.62.09-7.26,4.25-11.69,3.16-3.36,6.89-4.21,8.83-4.43.53-.06,1.03.33,1.09.87.06.54-.33,1.03-.87,1.09-1.67.18-4.89.92-7.61,3.82-3.64,3.87-3.76,8.83-3.71,10.26.02.54-.41,1-.95,1.02-.01,0-.02,0-.03,0Z"/>
  <path class="cls-1" d="M37.63,30.4c-.42,0-.82-.28-.94-.7-.17-.55-.68-1.63-2.2-2.6-2.02-1.3-4.55-1.61-5.54-1.68-.54-.04-.95-.51-.91-1.06.04-.54.51-.95,1.06-.91,1.42.11,4.14.51,6.46,1.99,1.96,1.26,2.72,2.7,3.02,3.69.16.52-.14,1.07-.66,1.23-.1.03-.19.04-.29.04Z"/>
  <path class="cls-1" d="M44.93,34.6h-14.61c-.55,0-.99-.44-.99-.99s.44-.99.99-.99h14.61c.55,0,.99.44.99.99s-.44.99-.99.99Z"/>
  <path class="cls-1" d="M44.93,38.98h-14.61c-.55,0-.99-.44-.99-.99s.44-.99.99-.99h14.61c.55,0,.99.44.99.99s-.44.99-.99.99Z"/>
  <path class="cls-1" d="M44.93,43.35h-14.61c-.55,0-.99-.44-.99-.99s.44-.99.99-.99h14.61c.55,0,.99.44.99.99s-.44.99-.99.99Z"/>
</svg>`;