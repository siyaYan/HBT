import { useState, useCallback, useEffect } from "react";
import {
  Box,
  Heading,
  IconButton,
  Text,
  Pressable,
  Button,
  NativeBaseProvider,
  Flex,
  VStack,
  Divider,
  HStack,
  Image,
  ScrollView,
  Badge,
} from "native-base";
import { Avatar } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import Background2 from "../components/Background2";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import {
  getNotifiableFriendRequests,
  getNotificationHistory,
  getNotifiableNotification,
  clearNotificationById,
  clearAllNotifications,
  reactReceivedRequest,
  clearFriendRequestById,
  clearAllFriendRequests,
  getNoteUpdate
} from "../components/Endpoint";

// TODO: change the layout to match the new ios version
const NotificationScreen = ({ navigation }) => {
  useFocusEffect(
    useCallback(() => {
      updateNotifiableFriendRequest();
      updateNotification();
      updateNotificationHistory();
      updateNote()
    }, [userData]) // Depend on `userInfo` to re-run the effect when it changes or the tab comes into focus
  );
  const { userData, updateUserData,note,updateNotes } = useData();
  // combination of sent & received
  const [friendRequest, setFriendRequest] = useState([]);
  const [notificates, setNotificates] = useState([]);
  const [history, setHistory] = useState([]);
  const updateNote = async ()=>{
    const res=await getNoteUpdate(userData.token,userData.data.email)
    if(res>0){
      updateNotes(res)
    }
 }
  const updateNotifiableFriendRequest = async () => {
    const response = await getNotifiableFriendRequests(userData.token);

    // Handle success or error response
    if (!response) {
      console.log("get NotifiableFriendRequests failed");
    }
    if (response.status == "success") {
      // console.log('get friends success:',response.data);
      let friendrequests = [];
      response.users.map((user, index) => {
        const item = {
          friendRequestId: response.data[index]._id,
          status: response.data[index].status == "A" ? "linked" : "unlink",
          profileImageUrl: user.profileImageUrl,
          username: user.username,
          nickname: user.nickname,
          requestRole: response.data[index].requestRole,
        };
        friendrequests[index]=item;
      });
      setFriendRequest(friendrequests);
      // console.log("NotifiableFriendRequests:", friendrequests);
    } else {
      console.error("get NotifiableFriendRequests failed:", response.message);
    }
  };
  //the latest is on the top
  const updateNotification = async () => {
    const response = await getNotifiableNotification(
      userData.token,
      userData.data.email
    );

    // Handle success or error response
    if (!response) {
      console.log("get NotifiableNotifications failed");
    }
    if (response.status == "success") {
      // console.log('get friends success:',response.data);
      let Notification = [];
      // console.log('notification',response)
      response.data.map((item, index) => {
        const notificationContent = {
          id: item._id,
          profileImageUrl: response.senders[index].profileImageUrl,
          user: response.senders[index].nickname || response.senders[index],
          content: item.content,
        };
        Notification[index] = notificationContent;
      });
      setNotificates(Notification);

      // console.log("NotifiableNotifications:", Notification);
    } else {
      console.error("get NotifiableNotifications failed:", response.message);
    }
  };
  const updateNotificationHistory = async () => {
    const response = await getNotificationHistory(
      userData.token,
      userData.data.email
    );
    // Handle success or error response
    if (!response) {
      console.log("get NotificationHistory failed");
    }
    if (response.status == "success") {
      let Historys = [];
      response.data.map((item, index) => {
        if (response.senders[index].profileImageUrl) {
          const historyContent = {
            id: item._id,
            profileImageUrl: response.senders[index].profileImageUrl,
            user: response.senders[index].nickname,
            content: item.content,
          };
          Historys[index] = historyContent;
        } else {
          const historyContent = {
            id: item._id,
            title: response.senders[index],
            content: item.content,
          };
          Historys[index] = historyContent;
        }
      });
      setHistory(Historys);
      // console.log("NotificationHistory:", Historys);
    } else {
      console.error("get NotificationHistory failed:", response.message);
    }
  };

  const clearNotification = async (id) => {
    const response = await clearNotificationById(
      userData.token,
      userData.data.email,
      id
    );
    if (!response) {
      console.log("clear notification failed");
    }
    // Handle success or error response
    if (response.status == "success") {
      console.log("clear notification success:", response);
    } else {
      console.error("clear notification failed:", response.message);
    }
  };

  const clearAllNotification = async () => {
    const response = await clearAllNotifications(
      userData.token,
      userData.data.email
    );
    if (!response) {
      console.log("clear all notification failed");
    }
    // Handle success or error response
    if (response.status == "success") {
      updateNotes(friendRequest.length)
      console.log("clear all notifications success:", response);
    } else {
      console.error("clear all notifications failed:", response.message);
    }
  };

  const clearAllFriendRequest = async () => {
    const response = await clearAllFriendRequests(userData.token)
    if(!response){
      console.log('clear all notification failed')
    }
    // Handle success or error response
    if (response.status == "success") {
      updateNotes(notificates.length)
      console.log('clear all notifications success:',response);
    } else {
      console.error('clear all notifications failed:',response.message);
    }
  };

  const clearFriendRequest = async (id) => {
    const response = await clearFriendRequestById(
      userData.token,
      id
    );
    if (!response) {
      console.log("clear notification failed");
    }
    // Handle success or error response
    if (response.status == "success") {
      console.log("clear notification success:", response);
    } else {
      console.error("clear notification failed:", response.message);
    }
  };

  const reactRequest = async(id, react) =>{
    const response = await reactReceivedRequest(userData.token, id, react);
    if(!response){
      console.log('react request failed')
    }
    // Handle success or error response
    if (response.status == "success") {
      console.log('react request success:',response);
    } else {
      console.error('react request failed:',response.message);
    }
  }

  const rejectFriend = (i) => {
    console.log("reject Friend,delete current notificate");
    setFriendRequest((currentReceived) => [
      ...currentReceived.slice(0, i),
      ...currentReceived.slice(i+1),
    ]);
    reactRequest(friendRequest[i].friendRequestId,"R")
  };
  const acceptFriend = (i) => {
    console.log("accept Friend,delete current notificate");
    setFriendRequest((currentReceived) => [
      ...currentReceived.slice(0, i),
      ...currentReceived.slice(i+1),
    ]);
    reactRequest(friendRequest[i].friendRequestId,"A")
  };
  const clearCurrent = (item, i) => {
    if (item == "received") {
      console.log("clear current received notificate");
      clearFriendRequest(friendRequest[i].friendRequestId)
      setFriendRequest((currentReceived) => [
        ...currentReceived.slice(0, i),
        ...currentReceived.slice(i+1),
      ]);
      
    }
    if (item === "notificates") {
      console.log("clear current selected notificate");
      clearNotification(notificates[i].id);
      setNotificates((currentNotificates) => [
        ...currentNotificates.slice(0, i),
        ...currentNotificates.slice(i + 1),
      ]);
    }
  };
  const clearAll = (item) => {
    if (item == "friendrequests") {
      console.log("clear all friendrequests");
      clearAllFriendRequest();
      setFriendRequest({});
    } else {
      console.log("Clear all notifiable notificates");
      clearAllNotification();
      setNotificates({});
    }
  };

  return (
    <NativeBaseProvider>
      <Background2 />
      <Flex direction="column" alignItems="center">
        <Box safeArea w="90%" alignItems="center">
          <Box mt="5" w="95%">
            <VStack space={1} alignItems="left">
              <HStack w={"100%"} justifyContent={"space-between"}>
                {friendRequest.length > 0 ? (
                  <Box>
                    <Image
                      size={30}
                      source={require("../assets/Buttonicons/Users.png")}
                      alt="received"
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
                      {friendRequest.length}
                    </Badge>
                  </Box>
                ) : (
                  <Image
                    size={30}
                    source={require("../assets/Buttonicons/Users.png")}
                    alt="friendrequests"
                  />
                )}

                <AntDesign
                  name="checkcircleo"
                  size={30}
                  color="black"
                  onPress={() => clearAll("friendrequests")}
                />
                {/* <AntDesign name="delete" size={30} color="black" /> */}
              </HStack>
              <Box
                h="24%"
                w={"95%"}
                alignSelf={"center"}
                justifyContent={"center"}
              >
                <ScrollView w={"100%"}>
                  {friendRequest.length > 0 ? (
                    <Box mt={"2"} w={"95%"} alignSelf={"center"}>
                      {friendRequest.map((item, index) => 
                        // (item.requestRole == "sent"?item.username:'qqq')
                          (item.requestRole == "received" ? (
                            <Box mt={"2"} w={"100%"} alignSelf={"center"}>
                              <HStack
                                w={"100%"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                                key={index}
                              >
                                {item.profileImageUrl ? (
                                  <Avatar
                                    bg="white"
                                    mb="1"
                                    size={"md"}
                                    source={{ uri: item.profileImageUrl }}
                                  />
                                ) : (
                                  <Avatar
                                    bg="white"
                                    mb="1"
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
                                <Text fontFamily={"Regular"} fontSize="lg">
                                  {item.username}
                                </Text>
                                <Text fontFamily={"Regular"} fontSize="lg">
                                  {item.nickname}
                                </Text>
                                <HStack space="3">
                                  <AntDesign
                                    onPress={() => acceptFriend(index)}
                                    name="checksquareo"
                                    size={30}
                                    color="black"
                                  />
                                  <AntDesign
                                    onPress={() => rejectFriend(index)}
                                    name="closesquareo"
                                    size={30}
                                    color="black"
                                  />
                                </HStack>
                              </HStack>
                            </Box>
                          ) : (
                            <Box mt={"2"} w={"100%"} alignSelf={"center"}>
                              <HStack
                                w={"100%"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                                key={index}
                              >
                                {item.profileImageUrl ? (
                                  <Avatar
                                    bg="white"
                                    mb="1"
                                    size={"md"}
                                    source={{ uri: item.profileImageUrl }}
                                  />
                                ) : (
                                  <Avatar
                                    bg="white"
                                    mb="1"
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

                                <Text fontFamily={"Regular"} fontSize="lg">
                                  {item.username}
                                </Text>
                                <Text fontFamily={"Regular"} fontSize="lg">
                                  {item.nickname}
                                </Text>
                                <HStack space="3">
                                  {item.status == "linked" ? (
                                    <AntDesign
                                      name="link"
                                      size={28}
                                      color="black"
                                    />
                                  ) : (
                                    ""
                                  )}
                                  <MaterialIcons
                                    onPress={() =>
                                      clearCurrent("received", index)
                                    }
                                    name="delete-outline"
                                    size={30}
                                    color="#191919"
                                  />
                                </HStack>
                              </HStack>
                            </Box>
                          ))
                        
                      )}
                    </Box>
                  ) : (
                    <Text
                      fontFamily={"Regular"}
                      fontSize="2xl"
                      textAlign={"center"}
                      margin={"12"}
                    >
                      You are all caught up :D
                    </Text>
                  )}
                </ScrollView>
              </Box>

              <Divider
                my="3"
                _light={{
                  bg: "muted.800",
                }}
                _dark={{
                  bg: "muted.50",
                }}
                alignSelf={"center"}
                w="95%"
              />

              <HStack w={"100%"} justifyContent={"space-between"}>
                {notificates.length ? (
                  <Box>
                    <Image
                      size={30}
                      source={require("../assets/Buttonicons/MegaphoneSimple.png")}
                      alt="notificate"
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
                      {notificates.length}
                    </Badge>
                  </Box>
                ) : (
                  <Image
                    size={30}
                    source={require("../assets/Buttonicons/MegaphoneSimple.png")}
                    alt="notificate"
                  />
                )}
                <AntDesign
                  name="checkcircleo"
                  size={30}
                  color="black"
                  onPress={() => clearAll("notification")}
                />
                {/* <AntDesign name="delete" size={30} color="black" /> */}
              </HStack>

              <Box
                h="16%"
                w={"95%"}
                alignSelf={"center"}
                justifyContent={"center"}
              >
                <ScrollView w={"100%"}>
                  {notificates.length > 0 ? (
                    <Box my="2" w={"95%"} alignSelf={"center"}>
                      {notificates.map((item, index) => (
                        <HStack
                          w={"100%"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          mt={2}
                          key={index}
                          item={item}
                        >
                          {item.profileImageUrl ? (
                            <Avatar
                              bg="white"
                              mb="1"
                              size={"md"}
                              source={{ uri: item.profileImageUrl }}
                            />
                          ) : (
                            <Avatar bg="white" mb="1" size="md" borderWidth={2}>
                              <AntDesign name="user" size={20} color="black" />
                            </Avatar>
                          )}
                          <Text fontFamily={"Regular"} fontSize="md">
                            {item.user}
                          </Text>
                          <Text fontFamily={"Regular"} fontSize="md">
                            {item.content}
                          </Text>
                          <AntDesign
                            onPress={() => clearCurrent("notificates", index)}
                            name="closesquareo"
                            size={30}
                            color="black"
                          />
                        </HStack>
                      ))}
                    </Box>
                  ) : (
                    <Text
                      fontFamily={"Regular"}
                      fontSize="2xl"
                      textAlign={"center"}
                      margin={"10"}
                    >
                      You are all caught up :D
                    </Text>
                  )}
                </ScrollView>
              </Box>

              {/* <Divider
                marginb="2"
                _light={{
                  bg: "muted.800",
                }}
                _dark={{
                  bg: "muted.50",
                }}
                alignSelf={"center"}
                w="90%"
              /> */}

              <HStack w={"100%"} mt={"5"} justifyContent={"space-between"}>
                <Text mt={"1"} fontFamily={"Regular Semi Bold"} fontSize="2xl">
                  Last 30 days
                </Text>
              </HStack>

              <Box w={"96%"} h={"40%"} alignSelf={"center"}>
                <ScrollView w={"100%"} h="40%">
                  {history.length > 0 ? (
                    <Box my="2" w={"95%"} alignSelf={"center"}>
                      {history.map((item, index) => (
                        <HStack
                          w={"100%"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                          m={1}
                          key={index}
                          item={item}
                        >
                          {item.profileImageUrl ? (
                            <Avatar
                              bg="white"
                              mb="1"
                              size={"md"}
                              source={{ uri: item.profileImageUrl }}
                            />
                          ) : (
                            <FontAwesome name="check" size={40} color="black" />
                          )}
                          <Text fontFamily={"Regular"} fontSize="md">
                            {item.user ? item.user : item.title}
                          </Text>
                          <Text fontFamily={"Regular"} fontSize="md">
                            {item.content}
                          </Text>
                        </HStack>
                      ))}
                    </Box>
                  ) : (
                    <Text
                      marginTop={"20%"}
                      fontFamily={"Regular"}
                      fontSize="2xl"
                      textAlign={"center"}
                    >
                      No previous data
                    </Text>
                  )}
                </ScrollView>
              </Box>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </NativeBaseProvider>
  );
};

export default NotificationScreen;
