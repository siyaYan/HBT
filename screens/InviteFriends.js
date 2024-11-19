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
  Pressable
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
  deleteFriendOrWithdrawRequestById
} from "../components/Endpoint";
import Background from "../components/Background";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

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
    // const friendsRes = await getFriends(userData.token);
    if (response.status === "success") {
      // console.log("find!!!!");
      setErrors({
        userId: true,
      });
      setFind({
        user: response.data.user
      });
      // console.log(  response.data.user._id,
      // userData.data._id);
      const res = await getRelationByUserId(
        userData.token,
        response.data.user._id,
        userData.data._id
      );
      console.log(res,userData.data);
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
    // console.log("connect", findUser);
    // console.log(userData.data._id, findUser.user._id);
    const response = await connectByUserId(
      userData.token,
      userData.data._id,
      findUser.user._id
    );
    if (response.status === "success") {
      console.log("connect!!");
    } else {
      console.log("fail!!");
    }
    handleSearch()
  };
  const handleCancel = async () => {
    // console.log("connect", findUser);
    // console.log(userData.data._id, findUser.user._id);
      console.log("delete current item");
      // const id=sent[i-1]._id
      const id=pend.data._id
      // console.log(pend.data._id)
      deleteFriendOrWithdrawRequestById(userData.token, id);
      handleSearch()
  };
  const handleAccept =async ()=>{
    console.log("accept current item");
    const id=pend.data._id
    // console.log(pend.data._id)
    reactReceivedRequest(userData.token, id, 'A');
    setPend(false)
    handleSearch()
  }

  return (
    <NativeBaseProvider>
      <Background />

      <Flex direction="column" alignItems="center">
        <Box safeArea py="2" w="100%" maxW="320">
          <VStack paddingY={10} alignItems="center">
            {/* <Box py="5" alignSelf={"center"}>
              {userData.avatar && userData.avatar.uri ? (
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
            </Box> */}
            {/* Code for InviteFriend section */}
            <Box w="100%" h="95%" maxW="300" alignItems="center" marginTop={'50%'}>
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
                      {!errors.userId ? "No users found" : ""}
                    </Text>
                  </FormControl.ErrorMessage>
                </FormControl>

                {/* Code for search friend button*/}
                {formData.userId &&
                (formData.userId.toLowerCase() == userData.data.email ||
                  formData.userId == userData.data.username) ? (
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
                      alignItems={"center"}
                      justifyContent={"center"}
                      space={5}
                      backgroundColor={linked?"rgba(73,165,121,0.2)":"light.100"}
                      paddingY={2}
                    >
                      {findUser.user.profileImageUrl ? (
                        <Avatar
                          bg="white"
                          mb="1"
                          size={"md"}
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
                        {linked ? (
                          <Pressable onPress={()=>{navigation.navigate('MyCircle')}}>
                            <AntDesign name="link" size={30} color="grey" />
                            <Text fontFamily={"Regular"} fontSize="xs">
                              linked
                            </Text>
                          </Pressable>
                        ) : pend!=false ? (
                          pend.data.senderId==userData.data._id?(
                            <Pressable onPress={handleCancel}>
                            {/* <Feather name="cancel" size={30} color="grey" />
                            <Text fontFamily={"Regular"} fontSize="xs">
                              cancel
                            </Text> */}
                            <Entypo
                              name="back-in-time"
                              size={30}
                              color="black"
                            />
                            <Text fontFamily={"Regular"} fontSize="xs">
                              cancel
                            </Text>
                          </Pressable>
                          ):(
                            <Pressable onPress={handleAccept}>
                            {/* <Feather name="cancel" size={30} color="grey" />
                            <Text fontFamily={"Regular"} fontSize="xs">
                              cancel
                            </Text> */}
                            <AntDesign name="checkcircleo" size={30} color="black" />
                            <Text fontFamily={"Regular"} fontSize="xs">
                              accept
                            </Text>
                          </Pressable>
                          )
                        ) : (
                          <Pressable onPress={handleConnect}>
                            <Feather name="send" size={30} color="black" />
                            <Text fontFamily={"Regular"} fontSize="xs">
                              connect
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
