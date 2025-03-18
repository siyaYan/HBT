import { useState, useEffect } from "react";
import DefaultProfile from "../assets/DefaultProfile.png";

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
// import { Feather } from "@expo/vector-icons";
// import { Entypo } from "@expo/vector-icons";
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
                      {!formData.userId
                        ? "Please enter a username."
                        : "No users were found matching your search."}
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
                  <>
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
                          justifyContent={"space-between"} // Spread items across the line
                          space={3}
                          backgroundColor={
                            linked ? "rgba(73,165,121,0.2)" : "light.100"
                          }
                          paddingY={2}
                          paddingX={4} // Optional: Add padding to avoid touching edges
                        >
                           <HStack alignItems="center" space={6} p={2}>
                        <Avatar
                          size="57"
                          bg="transparent"
                          source={
                            findUser.user.profileImageUrl 
                              ? { uri: findUser.user.profileImageUrl  }
                              : null
                          } // Show null if using DefaultProfile
                        >
                          {!findUser.user.profileImageUrl  && (
                            <Image
                              source={DefaultProfile}
                              style={{
                                width: "100%",
                                height: "100%",
                                opacity: 0.5,
                              }} // Apply 50% transparency
                              resizeMode="contain"
                            />
                          )}
                        </Avatar>
                        <VStack>
                          <Text fontFamily="Regular Medium" fontSize="lg">
                            {findUser.user.nickname}
                          </Text>
                          <Text
                            fontFamily="Regular Medium"
                            fontSize="sm"
                            color="gray.500"
                          >
                            @{findUser.user.username}
                          </Text>
                        </VStack>
                      </HStack>
                          {/* <HStack
                            alignItems="center"
                            space={6}
                            p={2}
                            // borderBottomWidth={1}
                            // borderColor="#ddd"
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
                              <Avatar
                                bg="#f9f8f2"
                                mb="2"
                                size="md"
                                borderWidth={2}
                              >
                                <AntDesign
                                  name="user"
                                  size={20}
                                  color="black"
                                />
                              </Avatar>
                            )}

                            <VStack>
                              <Text fontSize="lg" fontWeight="bold">
                                {findUser.user.nickname}
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                @{findUser.user.username}
                              </Text>
                            </VStack>
                          </HStack> */}
                          <Box>
                            {linked ? (
                              <Pressable
                                onPress={() => {
                                  navigation.navigate("MyCircle");
                                }}
                              >
                                <SvgXml
                                  xml={myCircleSVG("#191919")}
                                  width={25}
                                  height={25}
                                />
                                <Text fontFamily={"Regular"} fontSize="xs">
                                  Linked
                                </Text>
                              </Pressable>
                            ) : pend != false ? (
                              pend.data.senderId == userData.data._id ? (
                                <Pressable onPress={handleCancel}>
                                  <VStack alignItems="center" space={1}>
                                    <SvgXml
                                      xml={widthdrawSvg()}
                                      width={25}
                                      height={25}
                                    />
                                    <Text fontFamily={"Regular"} fontSize="xs">
                                      Withdraw
                                    </Text>
                                  </VStack>
                                </Pressable>
                              ) : (
                                <Pressable onPress={handleAccept}>
                                  <VStack alignItems="center" space={1}>
                                    <SvgXml
                                      xml={acceptSvg()}
                                      width={25}
                                      height={25}
                                    />
                                    <Text fontFamily={"Regular"} fontSize="xs">
                                      Accept
                                    </Text>
                                  </VStack>
                                </Pressable>
                              )
                            ) : (
                              <Pressable
                                onPress={handleConnect}
                                style={{
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <SvgXml
                                  xml={connectSvg()}
                                  width={30}
                                  height={30}
                                />
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
                  </>
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

const acceptSvg = () => `
  <?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#000;stroke-width:0px;}</style></defs><path class="cls-1" d="M25,45.47c-11.29,0-20.47-9.18-20.47-20.47S13.71,4.53,25,4.53s20.47,9.18,20.47,20.47-9.18,20.47-20.47,20.47ZM25,8.53c-9.08,0-16.47,7.39-16.47,16.47s7.39,16.47,16.47,16.47,16.47-7.39,16.47-16.47-7.39-16.47-16.47-16.47Z"/><rect class="cls-1" x="13.98" y="26.52" width="11.88" height="4.07" rx="2.03" ry="2.03" transform="translate(28.16 -5.28) rotate(48.58)"/><rect class="cls-1" x="17.29" y="22.97" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(64.26 18.56) rotate(127.86)"/></svg>`;

const connectSvg = () =>
  `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#000;stroke:#000;stroke-miterlimit:10;}</style></defs><path class="cls-1" d="M31.67,42.77c-.89,0-1.73-.35-2.38-1.01l-.13-.13-5.8-15.07-14.99-5.72-.14-.13c-.88-.86-1.21-2.08-.9-3.26.32-1.19,1.22-2.08,2.41-2.38l14.44-3.69,14.32-4.02c1.18-.33,2.41-.01,3.27.86.87.87,1.19,2.09.86,3.27l-4.03,14.34-3.68,14.42c-.3,1.19-1.19,2.09-2.38,2.41-.29.08-.59.12-.88.12ZM30.72,40.6c.38.32.88.42,1.36.29.54-.14.95-.56,1.09-1.1l3.69-14.44,4.03-14.37c.15-.54,0-1.1-.39-1.49s-.96-.54-1.49-.39l-14.34,4.03-14.46,3.69c-.54.14-.95.54-1.1,1.08-.13.49-.02.98.29,1.36l15.37,5.86,5.95,15.46Z"/><path class="cls-1" d="M24.07,26.76c-.23,0-.47-.09-.64-.27-.36-.36-.36-.93,0-1.29l6.91-6.91c.36-.36.93-.36,1.29,0s.36.93,0,1.29l-6.91,6.91c-.18.18-.41.27-.64.27Z"/></svg>`;
