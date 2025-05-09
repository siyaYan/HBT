import { useState, useCallback } from "react";
import DefaultProfile from "../assets/DefaultProfile.png";
import {
  Box,
  Text,
  Pressable,
  Button,
  NativeBaseProvider,
  Flex,
  VStack,
  Divider,
  HStack,
  View,
  Image,
  ScrollView,
  Modal,
  Avatar,
  Badge,
} from "native-base";
import { useData } from "../context/DataContext";
import Background2 from "../components/Background2";
import {
  getFriends,
  deleteFriendOrWithdrawRequestById,
  deleteFriends,
  getSendRequest,
  getReceivedRequest,
  reactReceivedRequest,
  getFriendNoteUpdate,
} from "../components/Endpoint";
import { useFocusEffect } from "@react-navigation/native";
import { SvgXml } from "react-native-svg";
const profileWidth = "90%";
const FriendsScreen = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const { userData,updateFriendNotes } = useData();
  const [deleted, setDelete] = useState(0);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [friends, setFriends] = useState([]);

  useFocusEffect(
    useCallback(() => {
      // This code runs when the tab comes into focus
      console.log("Tab is in focus, userInfo:", userData);
      updateFriendList();
      updateSendRequest();
      updateReceivedRequest();
      updateFriendNote();
      
    }, [userData]) // Depend on `userInfo` to re-run the effect when it changes or the tab comes into focus
  );

  const updateFriendNote = async () => {
    const res = await getFriendNoteUpdate(userData.token);
    // if (res > 0) {
      updateFriendNotes(res);
    // }
  };
  const updateFriendList = async () => {
    const response = await getFriends(userData.token);
    // Handle success or error response
    if (!response) {
      console.log("get friends was unsucessful.");
    }
    if (response.status == "success") {
      let newFriends = [];
      response.users.map((user) => {
        const newFriend = {
          _id: "",
          email: user.email,
          profileImageUrl: user.profileImageUrl,
          username: user.username,
          nickname: user.nickname,
        };
        newFriends.push(newFriend);
      });
      response.data.map((data, index) => {
        console.log("data:", data);
        if (index < newFriends.length) {
          newFriends[index]._id = data?._id;
        }
      });
      setFriends(newFriends);
    } else {
      console.error("get friends was unsucessful.:", response.message);
    }
  };
  const updateSendRequest = async () => {
    const response = await getSendRequest(userData.token);
    // Handle success or error response
    if (!response) {
      console.log("get send friends request was unsucessful.");
      setSent({});
    }
    if (response.status == "success") {
      // console.log('get friends success:',response.data);
      let sendFriends = [];
      const pendingRes = response.data.filter((item) => item.status == "P");
      // console.log('update:',pendingRes, response.users);
      if (pendingRes.length > 0) {
        response.data.map((data, index) => {
          if (data.status == "P") {
            const newFriend = {
              _id: data?._id,
              email: response.users[index].email,
              profileImageUrl: response.users[index].profileImageUrl,
              username: response.users[index].username,
              nickname: response.users[index].nickname,
            };
            sendFriends.push(newFriend);
          }
        });
      }
      //  console.log('update:',sendFriends);
      setSent(sendFriends);
      // console.log('send request:',sent)
    } else {
      // console.error('get send friend request was unsucessful.:',response.message);
      console.log("get send friends request was unsucessful.");
      setSent({});
    }
  };
  const updateReceivedRequest = async () => {
    const response = await getReceivedRequest(userData.token);
    // Handle success or error response
    if (!response) {
      console.log("get received friends was unsucessful.");
      setReceived({});
    }
    if (response.status == "success") {
      // console.log('get friends success:',response.data);
      let receivedFriends = [];
      const pendingRes = response.data.filter((item) => item.status == "P");
      // const pendingRes=response.users
      if (pendingRes.length > 0) {
        pendingRes.map((data, index) => {
          const newFriend = {
            _id: data?._id,
            email: response.users[index].email,
            profileImageUrl: response.users[index].profileImageUrl,
            username: response.users[index].username,
            nickname: response.users[index].nickname,
          };
          receivedFriends.push(newFriend);
        });
      }
      const reversedFriends = receivedFriends.slice().reverse();
      setReceived(reversedFriends);
      // console.log('received requests:',received)
    } else {
      // console.error('get received friend requests was unsucessful.:',response.message);
      console.log("get received friends was unsucessful.");
      setReceived({});
    }
  };
  const rejectFriend = (i) => {
    console.log("reject Friend,delete current notificate");
    setReceived((currentReceived) => [
      ...currentReceived.slice(0, i - 1),
      ...currentReceived.slice(i),
    ]);
    const id = received[i - 1]?._id;
    reactRequest(id, "R");
  };
  const acceptFriend = (i) => {
    console.log("accept Friend,delete current notificate");
    setReceived((currentReceived) => [
      ...currentReceived.slice(0, i - 1),
      ...currentReceived.slice(i),
    ]);
    const id = received[i - 1]?._id;
    reactRequest(id, "A");
  };
  const reactRequest = async (id, react) => {
    const response = await reactReceivedRequest(userData.token, id, react);
    if (!response) {
      console.log("react request was unsucessful.");
    }
    // Handle success or error response
    if (response.status == "success") {
      console.log("react request success:", response);
    } else {
      console.error("react request was unsucessful.:", response.message);
    }
  };
  const deleteAllFriends = async () => {
    const response = await deleteFriends(userData.token);
    if (!response) {
      console.log("delete friends was unsucessful.");
    }
    // Handle success or error response
    if (response.status == "success") {
      console.log("delete friends success:", response);
    } else {
      console.error("delete friends was unsucessful.:", response.message);
    }
  };
  const deleteFriendOrRequestByID = async (id) => {
    const response = await deleteFriendOrWithdrawRequestById(
      userData.token,
      id
    );
    if (!response) {
      console.log("delete friends was unsucessful.");
    }
    // Handle success or error response
    if (response.status == "success") {
      console.log("delete friends success:", response);
    } else {
      console.error("delete friends was unsucessful.:", response.message);
    }
  };
  const deleteCurrent = (item, i) => {
    if (item === "sent") {
      console.log("Deleting sent invite at index:", i);

      const id = sent[i]?._id; // Ensure correct ID
      if (id) {
        deleteFriendOrRequestByID(id);
      }

      // Corrected array slicing logic (remove the item at index i)
      setSent((currentSent) => currentSent.filter((_, index) => index !== i));
    }
    if (item === "friend") {
      setShowModal(false);
      console.log("delete current friend");
      if (deleted > 0) {
        setFriends((currentFriends) => [
          ...currentFriends.slice(0, deleted - 1),
          ...currentFriends.slice(deleted),
        ]);
        const id = friends[deleted - 1]?._id;
        deleteFriendOrRequestByID(id);
      } else {
        console.log("delete all friends");
        setFriends({});
        deleteAllFriends();
      }
    }
  };
  const deleteOption = (i) => {
    setDelete(i);
    setShowModal(true);
  };

  return (
    <NativeBaseProvider>
      <Background2 />
      <Flex direction="column" alignItems="center">
        <OptionMenu navigation={navigation} />
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <Modal.Content maxWidth="400px">
                <Modal.Header>Did you want to proceed to unlink? </Modal.Header>
                <Modal.Footer>
                  <Button.Group justifyContent={"center"}>
                    <Button
                      rounded={30}
                      shadow="7"
                      width="48%"
                      size={"md"}
                      _text={{
                        color: "#f9f8f2",
                      }}
                      colorScheme="blueGray"
                      alignSelf="center"
                      onPress={() => {
                        setShowModal(false);
                      }}
                    >
                      Cancel
                    </Button>

                    <Button
                      rounded={30}
                      shadow="7"
                      width="48%"
                      size={"md"}
                      // _text={{
                      //   color: "#f9f8f2",
                      // }}
                      colorScheme="red"
                      // backgroundColor={"#ff061e"}
                      onPress={() => {
                        deleteCurrent("friend");
                      }}
                    >
                      Delete
                    </Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
        {/* Box 0 */}
        <View mt="8" w="90%">

        <VStack space={4} alignItems="center" justifyContent="center">
        {/* First Section */}
            <HStack w={"100%"} justifyContent={"space-between"}>
              {/* Number of Received Friend Requests */}
              {received?.length > 0 ? (
                <Box>
                  <SvgXml
                    // style={{ transform: [{ translateY: -20 }] }}
                    xml={incomingRequestSVG()}
                    width={35}
                    height={35}
                  />
                  <Badge // bg="red.400"
                    colorScheme="danger"
                    rounded="full"
                    mt={-8}
                    mr={-3}
                    px={1}
                    py={0}
                    zIndex={1}
                    variant="solid"
                    alignSelf="flex-end"
                    _text={{
                      fontSize: 12,
                    }}
                  >
                    {received?.length}
                  </Badge>
                </Box>
              ) : (
                <SvgXml
                  // style={{ transform: [{ translateY: -20 }] }}
                  xml={incomingRequestSVG()}
                  width={35}
                  height={35}
                />
              )}
            </HStack>
            {/* Box 1 Display the received friend requests */}
            <Box
              // mt={3}
              h="16%"
              w={profileWidth}
              alignSelf={"center"}
              justifyContent={"center"}
            >
              {received?.length > 0 ? (
                <VStack space={3}>
                  <HStack
                    w={"100%"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <HStack alignItems="center" space={6} p={2}>
                      <Avatar
                        size="57"
                        bg="transparent"
                        source={
                          received[0] && received[0].profileImageUrl
                            ? { uri: received[0].profileImageUrl }
                            : null
                        } // Show null if using DefaultProfile
                      >
                        {!received[0].profileImageUrl && (
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
                          {received[0].nickname}
                        </Text>
                        <Text
                          fontFamily="Regular Medium"
                          fontSize="sm"
                          color="gray.500"
                        >
                          @{received[0].username}
                        </Text>
                      </VStack>
                    </HStack>

                    <HStack space="3">
                      <Pressable onPress={() => acceptFriend(1)}>
                        <SvgXml xml={acceptSvg()} width={25} height={25} />
                      </Pressable>

                      <Pressable onPress={() => rejectFriend(1)}>
                        <SvgXml
                          onPress={() => rejectFriend(1)}
                          xml={declineSvg()}
                          width={25}
                          height={25}
                        />
                      </Pressable>
                    </HStack>
                  </HStack>
                  {received?.length > 1 ? (
                    <HStack
                      w={"100%"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <HStack alignItems="center" space={6} p={2}>
                        <Avatar
                          size="57"
                          bg="transparent"
                          source={
                            received[1] && received[1].profileImageUrl
                              ? { uri: received[1].profileImageUrl }
                              : null
                          } // Show null if using DefaultProfile
                        >
                          {!received[1].profileImageUrl && (
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
                            {received[1].nickname}
                          </Text>
                          <Text
                            fontFamily="Regular Medium"
                            fontSize="sm"
                            color="gray.500"
                          >
                            @{received[1].username}
                          </Text>
                        </VStack>
                      </HStack>
                      <HStack space="3">
                        <Pressable onPress={() => acceptFriend(2)}>
                          <SvgXml xml={acceptSvg()} width={25} height={25} />
                        </Pressable>
                        <Pressable onPress={() => rejectFriend(2)}>
                          <SvgXml xml={declineSvg()} width={25} height={25} />
                        </Pressable>
                      </HStack>
                    </HStack>
                  ) : (
                    ""
                  )}
                </VStack>
              ) : (
                <Text
                  marginTop={"-10%"}
                  fontFamily={"Regular"}
                  fontSize="xl"
                  textAlign={"center"}
                >
                  You are all caught up :D
                </Text>
              )}
            </Box>

            <Divider
              m="2"
              _light={{
                bg: "muted.300",
              }}
              _dark={{
                bg: "muted.700",
              }}
              alignSelf={"center"}
              w="90%"
            />
            {/* Second section */}
            <HStack w={"100%"} justifyContent={"space-between"}>
              {sent?.length > 0 ? (
                <Box>
                  <SvgXml xml={outGoingRequestSVG()} width={35} height={35} />

                  <Badge // bg="red.400"
                    colorScheme="danger"
                    rounded="full"
                    mt={-8}
                    mr={-3}
                    px={1}
                    py={0}
                    zIndex={1}
                    variant="solid"
                    alignSelf="flex-end"
                    _text={{
                      fontSize: 12,
                    }}
                  >
                    {sent?.length}
                  </Badge>
                </Box>
              ) : (
                <SvgXml xml={outGoingRequestSVG()} width={35} height={35} />
              )}
            </HStack>
            {/* Box 2 */}
            <Box
              // mt={3}
              h="10%"
              w={profileWidth}
              alignSelf={"center"}
              justifyContent={"center"}
            >
              {sent?.length > 0 ? (
                <ScrollView w={"100%"}>
                  <VStack space={3}>
                    {sent?.map((item, index) => (
                      <HStack
                        key={item._id}
                        w={"100%"}
                        alignItems={"center"}
                        justifyContent={"flex-end"}
                      >
                        <HStack alignItems="center" space={6} p={2}>
                          <Avatar
                            size="57"
                            bg="transparent"
                            source={
                              item && item.profileImageUrl
                                ? { uri: item.profileImageUrl }
                                : null
                            } // Show null if using DefaultProfile
                          >
                            {!item.profileImageUrl && (
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
                              {item.nickname}
                            </Text>
                            <Text
                              fontFamily="Regular Medium"
                              fontSize="sm"
                              color="#606060"
                            >
                              @{item.username}
                            </Text>
                          </VStack>
                        </HStack>

                        <VStack ml="auto" justifyContent={"center"} alignItems={"center"}>
                          <Pressable
                            onPress={() => deleteCurrent("sent", index)}
                          >
                            <SvgXml
                              xml={widthdrawSvg()}
                              width={25}
                              height={25}
                            />
                           
                          </Pressable>
                         {/* <Text
                            fontFamily={"Regular"}
                            fontSize="10"
                            style={{ marginLeft: -15 }}  // adjust the value as needed
                          >
                            Withdraw
                          </Text> */}
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                </ScrollView>
              ) : (
                <Text
                  marginTop={"-10%"}
                  fontFamily={"Regular"}
                  fontSize="xl"
                  textAlign={"center"}
                >
                  You are all caught up :D
                </Text>
              )}
            </Box>

            <Divider
              m="2"
              _light={{
                bg: "muted.300",
              }}
              _dark={{
                bg: "muted.700",
              }}
              alignSelf={"center"}
              w="90%"
            /> 
            <HStack
              w={"100%"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <HStack>
                <SvgXml xml={myCircleSVG("#191919")} width={35} height={35} />
                <Text fontFamily={"Regular"} fontSize="md">
                  {friends?.length > 0 ? friends.length : ""}
                </Text>
              </HStack>
          
            </HStack>
            {/* Box 3 */}
          
            <Box
              // mt={3}
              h="45%"
              w={profileWidth}
              alignSelf={"center"}
              justifyContent={"center"}
            >
              {friends?.length > 0 ? (
                <ScrollView>
                  <VStack space={3}>
                    {friends?.map((item, index) => (
                      <HStack
                      key={index}
                        w={"100%"}
                        alignItems={"center"}
                        justifyContent={"flex-end"}
                      >
                        <HStack alignItems="center" space={6} p={2}>
                          <Avatar
                            size="57"
                            bg="transparent"
                            source={
                              item && item.profileImageUrl
                                ? { uri: item.profileImageUrl }
                                : null
                            } // Show null if using DefaultProfile
                          >
                            {!item.profileImageUrl && (
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
                              {item.nickname}
                            </Text>
                            <Text
                              fontFamily="Regular Medium"
                              fontSize="sm"
                              color="#606060"
                            >
                              @{item.username}
                            </Text>
                          </VStack>
                        </HStack>
                        <VStack ml="auto" justifyContent={"center"} alignItems={"center"}>
                          <Pressable
                            onPress={() => deleteOption(index + 1)}
                          >
                            <Image
                              style={{ width: 25, height: 25 }}
                              source={require("../assets/UIicons/Unlink.png")}
                              alt="Unlink"
                            />
                           
                          </Pressable>
                          {/* <Text fontFamily={"Regular"} fontSize="10">
                            Unlink
                          </Text>
                           */}
                        </VStack>
                      </HStack>
                    ))}
                  </VStack>
                </ScrollView>
              ) : (
                <Pressable onPress={() => navigation.navigate("Invite")}>
                  <Image
                    source={require("../assets/Animations/AddFriends.gif")}
                    alt="Add Friends GIF"
                    style={{ alignSelf: "center", width: 100, height: 100 }}
                  />
                  <Text
                    fontFamily={"Regular"}
                    fontSize="xl"
                    textAlign={"center"}
                  >
                    Add friends to start a round!
                  </Text>
                </Pressable>
              )}
            </Box>
          </VStack>
        </View>
        
      </Flex>
    </NativeBaseProvider>
  );
};

const outGoingRequestSVG = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
      <defs>
      <style>.cls-1{fill:#000;stroke-width:1px;}</style>
    </defs>
    <path class="cls-1" d="M7.76,9.8l4.37,15.57c.04.15,4.01,15.69,4.01,15.69.15.59.59,1.03,1.18,1.19.53.14,1.07.02,1.48-.32l6.06-15.76-7.04-7.04c-.39-.39-.39-1.01,0-1.4s1.01-.39,1.4,0l7.05,7.05,15.67-5.98c.34-.41.46-.95.32-1.48-.16-.59-.6-1.03-1.19-1.18l-15.66-4-15.59-4.37c-.58-.16-1.19,0-1.62.42s-.59,1.04-.42,1.62Z"/>
  </svg>`;

const incomingRequestSVG = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <defs>
      <style>.cls-1{fill:#000;stroke-width:1px;}</style>
    </defs>
    <path class="cls-1" d="M39.84,23.55l-14.1-7.92c-.13-.08-13.92-8.26-13.92-8.26-.52-.31-1.15-.31-1.68,0-.47.27-.77.74-.82,1.27l6.86,15.43h9.96c.55,0,.99.44.99.99s-.44.99-.99.99h-9.96s-6.86,15.31-6.86,15.31c.05.53.35,1,.82,1.27.53.3,1.15.3,1.67,0l13.9-8.25,14.12-7.93c.53-.3.85-.84.85-1.45s-.32-1.15-.85-1.45Z"/>
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

const unlinkSvg = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <defs>
      <style>.cls-1{fill:#000;stroke-width:1px;}</style>
    </defs>
    <path class="cls-1" d="M15.06,18.23c.44-.48,1.17-.58,1.73-.22l3.54,2.3c.62.4.8,1.24.4,1.86-.41.62-1.24.8-1.86.4l-3.54-2.3c-.62-.4-.8-1.24-.4-1.86.04-.06.09-.12.14-.18Z"/>
    <path class="cls-1" d="M8.05,14.16c.44-.48,1.17-.58,1.73-.22l3.54,2.3c.62.4.8,1.24.4,1.86-.41.62-1.24.8-1.86.4l-3.54-2.3c-.62-.4-.8-1.24-.4-1.86.04-.06.09-.12.14-.18Z"/>
    <path class="cls-1" d="M22.13,22.83c.44-.48,1.17-.58,1.73-.22l3.54,2.3c.62.4.8,1.24.4,1.86-.4.62-1.24.8-1.86.4l-3.54-2.3c-.62-.4-.8-1.24-.4-1.86.04-.06.09-.12.14-.18Z"/>
    <path class="cls-1" d="M29.21,27.42c.44-.48,1.17-.58,1.73-.22l3.54,2.3c.62.4.8,1.24.4,1.86-.41.63-1.24.8-1.86.4l-3.54-2.3c-.62-.4-.8-1.24-.4-1.86.04-.06.09-.12.14-.18Z"/>
    <path class="cls-1" d="M36.42,31.72c.44-.48,1.17-.58,1.73-.22l3.54,2.3c.62.4.8,1.24.4,1.86-.41.63-1.24.8-1.86.4l-3.54-2.3c-.62-.4-.8-1.24-.4-1.86.04-.06.09-.12.14-.18Z"/>
    <polygon class="cls-1" points="31.75,35.23 35.23,31.75 31.75,28.27 28.27,31.75 31.75,35.23"/>
    <polygon class="cls-1" points="26.67,20.11 30.11,16.67 26.67,13.23 23.23,16.67 26.67,20.11"/>
  </svg>`;

const acceptSvg = () => `
  <?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#000;stroke-width:0px;}</style></defs><path class="cls-1" d="M25,45.47c-11.29,0-20.47-9.18-20.47-20.47S13.71,4.53,25,4.53s20.47,9.18,20.47,20.47-9.18,20.47-20.47,20.47ZM25,8.53c-9.08,0-16.47,7.39-16.47,16.47s7.39,16.47,16.47,16.47,16.47-7.39,16.47-16.47-7.39-16.47-16.47-16.47Z"/><rect class="cls-1" x="13.98" y="26.52" width="11.88" height="4.07" rx="2.03" ry="2.03" transform="translate(28.16 -5.28) rotate(48.58)"/><rect class="cls-1" x="17.29" y="22.97" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(64.26 18.56) rotate(127.86)"/></svg>`;

const declineSvg = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <defs>
      <style>.cls-1{fill:#000;stroke-width:0px;}</style>
    </defs>
    <path class="cls-1" d="M25,45.47c-11.29,0-20.47-9.18-20.47-20.47S13.71,4.53,25,4.53s20.47,9.18,20.47,20.47-9.18,20.47-20.47,20.47ZM25,8.53c-9.08,0-16.47,7.39-16.47,16.47s7.39,16.47,16.47,16.47,16.47-7.39,16.47-16.47-7.39-16.47-16.47-16.47Z"/>
    <rect class="cls-1" x="14.7" y="22.97" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(24.81 60.35) rotate(-134.69)"/>
    <rect class="cls-1" x="14.7" y="22.9" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(60.31 25.08) rotate(135.31)"/>
  </svg>`;

const widthdrawSvg = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <defs>
      <style>.cls-1{fill:#000;stroke-width:0px;}</style>
    </defs>
    <path class="cls-1" d="M10.46,32.72c-.38.68-1.35.68-1.74,0l-2.98-5.3s-3.1-5.23-3.1-5.23c-.4-.67.09-1.51.87-1.5l6.08.07,6.08-.07c.78,0,1.26.83.87,1.5,0,0-3.1,5.23-3.1,5.23s-2.98,5.3-2.98,5.3Z"/>
    <path class="cls-1" d="M27.03,4.53C15.58,4.53,6.29,13.99,6.57,25.5h.02s4.42-4.25,4.42-4.25c1.84-7.85,9.29-13.56,17.88-12.61,7.54.84,13.65,6.93,14.49,14.47,1.11,9.92-6.66,18.36-16.36,18.36-4.33,0-8.27-1.7-11.21-4.44l-2.88,2.78c3.69,3.52,8.68,5.69,14.17,5.67,10.73-.04,19.79-8.63,20.36-19.35.63-11.79-8.78-21.58-20.44-21.58Z"/>
  </svg>`;

export default FriendsScreen;

const Withdraw = `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#000;stroke-width:0px;}</style></defs><path class="cls-1" d="M10.46,32.72c-.38.68-1.35.68-1.74,0l-2.98-5.3s-3.1-5.23-3.1-5.23c-.4-.67.09-1.51.87-1.5l6.08.07,6.08-.07c.78,0,1.26.83.87,1.5,0,0-3.1,5.23-3.1,5.23s-2.98,5.3-2.98,5.3Z"/><path class="cls-1" d="M27.03,4.53C15.58,4.53,6.29,13.99,6.57,25.5h.02s4.42-4.25,4.42-4.25c1.84-7.85,9.29-13.56,17.88-12.61,7.54.84,13.65,6.93,14.49,14.47,1.11,9.92-6.66,18.36-16.36,18.36-4.33,0-8.27-1.7-11.21-4.44l-2.88,2.78c3.69,3.52,8.68,5.69,14.17,5.67,10.73-.04,19.79-8.63,20.36-19.35.63-11.79-8.78-21.58-20.44-21.58Z"/></svg>`;
