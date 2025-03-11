import { useState, useCallback } from "react";
import {
  Box,
  Text,
  NativeBaseProvider,
  Flex,
  VStack,
  Divider,
  HStack,
  Image,
  ScrollView,
  Badge,
  Pressable,
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
  getNoteUpdate,
} from "../components/Endpoint";
import { SvgXml } from "react-native-svg";

const NotificationScreen = ({ navigation }) => {
  useFocusEffect(
    useCallback(() => {
      updateNotifiableFriendRequest();
      updateNotification();
      updateNotificationHistory();
      updateNote();
    }, [userData]) // Depend on `userInfo` to re-run the effect when it changes or the tab comes into focus
  );
  const { userData, updateUserData, note, updateNotes } = useData();
  // combination of sent & received
  const [friendRequest, setFriendRequest] = useState([]);
  const [notificates, setNotificates] = useState([]);
  const [history, setHistory] = useState([]);
  const updateNote = async () => {
    const res = await getNoteUpdate(userData.token, userData.data.email);
    if (res > 0) {
      updateNotes(res);
    }
  };
  const updateNotifiableFriendRequest = async () => {
    const response = await getNotifiableFriendRequests(userData.token);

    // Handle success or error response
    if (!response) {
      console.log("get NotifiableFriendRequests was unsucessful.");
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
        friendrequests[index] = item;
      });
      setFriendRequest(friendrequests);
      // console.log("NotifiableFriendRequests:", friendrequests);
    } else {
      console.error(
        "get NotifiableFriendRequests was unsucessful.:",
        response.message
      );
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
      console.log("get NotifiableNotifications was unsucessful.");
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
      console.error(
        "get NotifiableNotifications was unsucessful.:",
        response.message
      );
    }
  };
  const updateNotificationHistory = async () => {
    const response = await getNotificationHistory(
      userData.token,
      userData.data.email
    );
    console.log("---email", userData.data.email);
    // Handle success or error response
    if (!response) {
      console.log("get NotificationHistory was unsucessful.");
    }
    if (response.status == "success") {
      let Historys = [];
      console.log("----response", response);
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
      console.log("----NotificationHistory:", Historys);
    } else {
      console.error(
        "get NotificationHistory was unsucessful.:",
        response.message
      );
    }
  };

  const clearNotification = async (id) => {
    const response = await clearNotificationById(
      userData.token,
      userData.data.email,
      id
    );
    if (!response) {
      console.log("clear notification was unsucessful.");
    }
    // Handle success or error response
    if (response.status == "success") {
      console.log("clear notification success:", response);
    } else {
      console.error("clear notification was unsucessful.:", response.message);
    }
  };

  // const clearAllNotification = async () => {
  //   const response = await clearAllNotifications(
  //     userData.token,
  //     userData.data.email
  //   );
  //   if (!response) {
  //     console.log("clear all notification was unsucessful.");
  //   }
  //   // Handle success or error response
  //   if (response.status == "success") {
  //     updateNotes(friendRequest.length);
  //     console.log("clear all notifications success:", response);
  //   } else {
  //     console.error(
  //       "clear all notifications was unsucessful.:",
  //       response.message
  //     );
  //   }
  // };

  // const clearAllFriendRequest = async () => {
  //   const response = await clearAllFriendRequests(userData.token);
  //   if (!response) {
  //     console.log("clear all notification was unsucessful.");
  //   }
  //   // Handle success or error response
  //   if (response.status == "success") {
  //     updateNotes(notificates.length);
  //     console.log("clear all notifications success:", response);
  //   } else {
  //     console.error(
  //       "clear all notifications was unsucessful.:",
  //       response.message
  //     );
  //   }
  // };
  const clearAllNotification = async () => {
    // Optimistically clear state immediately
    const previousNotificates = notificates; // Save previous state
    setNotificates([]); // Update UI instantly

    const response = await clearAllNotifications(
      userData.token,
      userData.data.email
    );

    if (!response) {
      console.log("Clear all notification was unsuccessful.");
      setNotificates(previousNotificates); // Restore previous state on failure
      return;
    }

    // Handle success or error response
    if (response.status == "success") {
      updateNotes(friendRequest.length);
      console.log("Clear all notifications success:", response);
    } else {
      console.error(
        "Clear all notifications was unsuccessful:",
        response.message
      );
      setNotificates(previousNotificates); // Restore previous state on failure
    }
  };

  const clearAllFriendRequest = async () => {
    // Optimistically clear state immediately
    const previousFriendRequests = friendRequest; // Save previous state
    setFriendRequest([]); // Update UI instantly

    const response = await clearAllFriendRequests(userData.token);

    if (!response) {
      console.log("Clear all friend request was unsuccessful.");
      setFriendRequest(previousFriendRequests); // Restore previous state on failure
      return;
    }

    // Handle success or error response
    if (response.status == "success") {
      updateNotes(notificates.length);
      console.log("Clear all friend requests success:", response);
    } else {
      console.error(
        "Clear all friend requests was unsuccessful:",
        response.message
      );
      setFriendRequest(previousFriendRequests); // Restore previous state on failure
    }
  };

  const clearFriendRequest = async (id) => {
    const response = await clearFriendRequestById(userData.token, id);
    if (!response) {
      console.log("clear notification was unsucessful.");
    }
    // Handle success or error response
    if (response.status == "success") {
      console.log("clear notification success:", response);
    } else {
      console.error("clear notification was unsucessful.:", response.message);
    }
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

  const rejectFriend = (i) => {
    console.log("reject Friend,delete current notificate");
    setFriendRequest((currentReceived) => [
      ...currentReceived.slice(0, i),
      ...currentReceived.slice(i + 1),
    ]);
    reactRequest(friendRequest[i].friendRequestId, "R");
  };
  const acceptFriend = (i) => {
    console.log("accept Friend,delete current notificate");
    setFriendRequest((currentReceived) => [
      ...currentReceived.slice(0, i),
      ...currentReceived.slice(i + 1),
    ]);
    reactRequest(friendRequest[i].friendRequestId, "A");
  };
  const clearCurrent = (item, i) => {
    if (item == "received") {
      console.log("clear current received notificate");
      clearFriendRequest(friendRequest[i].friendRequestId);
      setFriendRequest((currentReceived) => [
        ...currentReceived.slice(0, i),
        ...currentReceived.slice(i + 1),
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
          <Box mt="9" w="85%">
            <VStack space={1} alignItems="left">
             

              <HStack w={"100%"} justifyContent={"space-between"}>
                {(notificates?.length || 0) + (friendRequest?.length || 0) >
                0 ? (
                  // Render this section if there are notifications or friend requests
                  <Box>
                    <SvgXml
                      xml={bellNotificationSVG("#191919")}
                      width={30}
                      height={30}
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
                      {(notificates?.length || 0) +
                        (friendRequest?.length || 0)}
                    </Badge>
                  </Box>
                ) : (
                  <SvgXml
                    xml={bellNotificationSVG("#191919")}
                    width={35}
                    height={35}
                  />
                )}

                <Pressable
                  onPress={async () => {
                    await clearAllNotification();
                    await clearAllFriendRequest();
                  }}
                >
                  <SvgXml xml={readAllSvg()} width={35} height={35} />
                </Pressable>
              </HStack>

              <Box
                h="43.3%"
                w={"95%"}
                alignSelf={"center"}
                justifyContent={"center"}
              >
                <ScrollView w={"100%"}>
                  {/* Friend Request Notifications */}
                  {friendRequest?.length > 0 ? (
                    <Box mt={"2"} w={"95%"} alignSelf={"center"}>
                      {friendRequest?.map((item, index) =>
                        item.requestRole == "received" ? (
                          <Box
                            mt={"2"}
                            w={"100%"}
                            alignSelf={"center"}
                            key={index}
                          >
                            <HStack
                              w={"100%"}
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <HStack
                                alignItems="center"
                                space={6}
                                p={2}
                                // borderBottomWidth={1}
                                // borderColor="#ddd"
                              >
                                {item.profileImageUrl ? (
                                  <Avatar
                                    bg="white"
                                    mb="1"
                                    size={"md"}
                                    source={{ uri: item.profileImageUrl }}
                                  />
                                ) : (
                                  <FontAwesome name="check" size={24} color="black" />
                                 
                                )}

                                <VStack>
                                  <Text fontSize="lg" fontWeight="bold">
                                    {item.nickname}
                                  </Text>
                                  <Text fontSize="sm" color="gray.500">
                                    @{item.username}
                                  </Text>
                                </VStack>
                              </HStack>
                              <HStack space="3">
                                <Pressable onPress={() => acceptFriend(index)}>
                                  <SvgXml
                                    xml={acceptSvg()}
                                    width={30}
                                    height={30}
                                  />
                                </Pressable>
                                <Pressable onPress={() => rejectFriend(index)}>
                                  <SvgXml
                                    xml={declineSvg()}
                                    width={30}
                                    height={30}
                                  />
                                </Pressable>
                              </HStack>
                            </HStack>
                          </Box>
                        ) : (
                          <Box
                            mt={"2"}
                            w={"100%"}
                            alignSelf={"center"}
                            key={index}
                          >
                            <HStack
                              w={"100%"}
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              <HStack
                                alignItems="center"
                                space={6}
                                p={2}
                                // borderBottomWidth={1}
                                // borderColor="#ddd"
                              >
                                {item.profileImageUrl ? (
                                  <Avatar
                                    bg="white"
                                    mb="1"
                                    size={"md"}
                                    source={{ uri: item.profileImageUrl }}
                                  />
                                ) : (
                                  // <FontAwesome name="check" size={24} color="black" />
                                  <SvgXml
                                    xml={acceptSvg()}
                                    width={25}
                                    height={25}
                                  />
                                )}

                                <VStack>
                                  <Text fontSize="lg" fontWeight="bold">
                                    {item.nickname}
                                  </Text>
                                  <Text fontSize="sm" color="gray.500">
                                    @{item.username}
                                  </Text>
                                </VStack>
                              </HStack>

                              <HStack space="3">
                                {item.status == "linked" ? (
                                  <AntDesign
                                    name="link"
                                    size={28}
                                    color="black"
                                  />
                                ) : null}
                                <Pressable
                                  onPress={() =>
                                    clearCurrent("received", index)
                                  }
                                >
                                  <SvgXml
                                    xml={deleteSVG()}
                                    width={30}
                                    height={30}
                                  />
                                </Pressable>
                              </HStack>
                            </HStack>
                          </Box>
                        )
                      )}
                    </Box>
                  ) : null}

                  {/* Other Notifications */}
                  {notificates?.length > 0 ? (
                    <Box my="2" w="95%" alignSelf="center">
                      {notificates?.map((item, index) =>
                        item.user === "system" ? (
                          <HStack
                            key={index}
                            w="100%"
                            alignItems="center"
                            justifyContent="space-between"
                            mt={2}
                            px={2}
                          >
                            <Text flex={1} fontFamily="Regular" fontSize="md">
                              {item.content}
                            </Text>
                            <Pressable
                              onPress={() => clearCurrent("notificates", index)}
                            >
                              <SvgXml
                                xml={declineSvg("#191919")}
                                width={35}
                                height={35}
                              />
                            </Pressable>
                          </HStack>
                        ) : (
                          <HStack
                            key={index}
                            w="100%"
                            alignItems="center"
                            justifyContent="space-between"
                            mt={2}
                            px={2}
                          >
                            {item.profileImageUrl ? (
                              <Avatar
                                bg="white"
                                mb="1"
                                size="md"
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
                            <Text fontFamily="Regular" fontSize="md" ml={2}>
                              {item.user}
                            </Text>
                            <Text
                              flex={1}
                              fontFamily="Regular"
                              fontSize="md"
                              mx={2}
                            >
                              {item.content}
                            </Text>
                            <AntDesign
                              onPress={() => clearCurrent("notificates", index)}
                              name="closesquareo"
                              size={30}
                              color="black"
                            />
                          </HStack>
                        )
                      )}
                    </Box>
                  ) : null}

                  {/* If No Notifications */}
                  {friendRequest?.length === 0 && notificates?.length === 0 ? (
                    <Text
                      fontFamily={"Regular"}
                      fontSize="xl"
                      textAlign={"center"}
                      margin={"12"}
                    >
                      You are all caught up :D
                    </Text>
                  ) : null}
                </ScrollView>
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

              <HStack w={"100%"} mt={"5"} justifyContent={"space-between"}>
                <Text mt={"1"} fontFamily={"Regular Semi Bold"} fontSize="2xl">
                  Last 30 days
                </Text>
              </HStack>
              <Box w={"96%"} h={"41%"} alignSelf={"center"}>
                <ScrollView w={"100%"} h="40%">
                  {history?.length > 0 ? (
                    <Box my="2" w={"95%"} alignSelf={"center"}>
                      {history?.map((item, index) =>
                        item.user === "system" || item.title === "system" ? (
                          <HStack
                            w="100%"
                            alignItems="center"
                            justifyContent="space-between"
                            m={1}
                            key={index}
                            px={2}
                          >
                            <Text
                              fontFamily="Regular"
                              fontSize="md"
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={{ flex: 1 }}
                            >
                              {item.content}
                            </Text>
                          </HStack>
                        ) : (
                          <HStack
                            w={"100%"}
                            alignItems={"center"}
                            justifyContent={"space-between"}
                            m={1}
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
                              <FontAwesome
                                name="check"
                                size={40}
                                color="black"
                              />
                            )}
                            <Text fontFamily={"Regular"} fontSize="md">
                              {item.user ? item.user : item.title}
                            </Text>
                            <Text fontFamily={"Regular"} fontSize="md">
                              {item.content}
                            </Text>
                          </HStack>
                        )
                      )}
                    </Box>
                  ) : (
                    <Text
                      marginTop={"20%"}
                      fontFamily={"Regular"}
                      fontSize="xl"
                      textAlign={"center"}
                    >
                      No past notifications
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

const readAllSvg = () => `
<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#000;stroke-width:0px;}</style></defs><path class="cls-1" d="M25,45.47c-11.29,0-20.47-9.18-20.47-20.47S13.71,4.53,25,4.53s20.47,9.18,20.47,20.47-9.18,20.47-20.47,20.47ZM25,8.53c-9.08,0-16.47,7.39-16.47,16.47s7.39,16.47,16.47,16.47,16.47-7.39,16.47-16.47-7.39-16.47-16.47-16.47Z"/><rect class="cls-1" x="13.98" y="26.52" width="11.88" height="4.07" rx="2.03" ry="2.03" transform="translate(28.16 -5.28) rotate(48.58)"/><rect class="cls-1" x="17.29" y="22.97" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(64.26 18.56) rotate(127.86)"/></svg>`;

const bellNotificationSVG = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <defs>
      <style>.cls-1{fill:#000;stroke-width:0px;}</style>
    </defs>
    <path class="cls-1" d="M18.25,41.18c-.11,0-.24,0-.36,0-3.41,0-6.83,0-10.24,0-1.13,0-1.9-.8-1.9-1.94,0-.8.12-1.59.37-2.35.67-2.08,1.95-3.65,3.84-4.69.5-.28.74-.68.74-1.26,0-3.59-.04-7.18,0-10.77.08-5.47,2.5-9.57,7.19-12.28,1.54-.88,3.21-1.37,4.97-1.54.25-.02.32-.1.32-.35-.01-.93-.02-1.87,0-2.8.03-.94.75-1.66,1.67-1.74.88-.07,1.7.52,1.91,1.4.05.2.05.41.06.61,0,.86,0,1.71,0,2.57,0,.21.06.29.27.31,6.94.7,12.18,6.57,12.21,13.68.01,3.61,0,7.22,0,10.83,0,.65.26,1.06.81,1.38,2.64,1.55,4.04,3.89,4.14,6.99.04,1.16-.75,1.95-1.9,1.95-3.41,0-6.83,0-10.24,0q-.39,0-.4.39c-.05,3.45-2.7,6.27-6.2,6.61-3.29.31-6.42-2.08-7.07-5.42-.1-.51-.12-1.03-.18-1.58ZM40.18,37.46c-.04-.09-.06-.14-.08-.19-.42-.8-1.05-1.4-1.83-1.84-1.7-.97-2.59-2.45-2.6-4.43-.02-3.75.03-7.5-.02-11.24-.05-3.99-2.58-7.6-6.24-9.07-2.17-.87-4.44-.92-6.68-.56-4.93.78-8.37,4.96-8.37,10.03,0,3.63.02,7.26,0,10.89-.01,1.95-.9,3.41-2.58,4.38-.31.18-.61.38-.88.62-.45.38-.81.84-1.05,1.42h30.35ZM28.06,41.21h-6.08c-.16,1.02.47,2.24,1.45,2.84,1.04.64,2.39.59,3.39-.16.87-.66,1.28-1.56,1.24-2.68Z"/>
  </svg>`;

const acceptSvg = () => `
 <?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#000;stroke-width:0px;}</style></defs><path class="cls-1" d="M25,45.47c-11.29,0-20.47-9.18-20.47-20.47S13.71,4.53,25,4.53s20.47,9.18,20.47,20.47-9.18,20.47-20.47,20.47ZM25,8.53c-9.08,0-16.47,7.39-16.47,16.47s7.39,16.47,16.47,16.47,16.47-7.39,16.47-16.47-7.39-16.47-16.47-16.47Z"/><rect class="cls-1" x="13.98" y="26.52" width="11.88" height="4.07" rx="2.03" ry="2.03" transform="translate(28.16 -5.28) rotate(48.58)"/><rect class="cls-1" x="17.29" y="22.97" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(64.26 18.56) rotate(127.86)"/></svg>`;

const declineSvg = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <path class="cls-1" d="M25,45.47c-11.29,0-20.47-9.18-20.47-20.47S13.71,4.53,25,4.53s20.47,9.18,20.47,20.47-9.18,20.47-20.47,20.47ZM25,8.53c-9.08,0-16.47,7.39-16.47,16.47s7.39,16.47,16.47,16.47,16.47-7.39,16.47-16.47-7.39-16.47-16.47-16.47Z"/>
    <rect class="cls-1" x="14.7" y="22.97" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(24.81 60.35) rotate(-134.69)"/>
    <rect class="cls-1" x="14.7" y="22.9" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(60.31 25.08) rotate(135.31)"/>
  </svg>`;

const deleteSVG = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
  <path class="cls-1" d="M37.01,15.62c0,3.38,0,6.62,0,9.86,0,4.89,0,9.78,0,14.67,0,2.66-.94,3.61-3.53,3.62-5.77.01-11.54.02-17.31,0-2.14,0-3.26-1.03-3.26-3.06-.03-8.08-.01-16.15,0-24.23,0-.26.06-.52.1-.85h24ZM17.18,29.81c0,2.25,0,4.49,0,6.74,0,1.17.31,2.17,1.67,2.14,1.26-.03,1.57-1,1.57-2.09,0-4.6,0-9.21,0-13.81,0-1.16-.29-2.16-1.68-2.13-1.28.03-1.56.98-1.56,2.08,0,2.36,0,4.71,0,7.07ZM23.38,29.64c0,2.36,0,4.73,0,7.09,0,1.07.36,1.91,1.52,1.96,1.28.05,1.66-.85,1.65-1.98,0-4.67,0-9.35,0-14.02,0-1.11-.3-2.05-1.6-2.03-1.29.01-1.58.95-1.57,2.06.01,2.31,0,4.62,0,6.93ZM32.73,29.65c0-2.35,0-4.71,0-7.06,0-1.06-.34-1.9-1.52-1.94-1.29-.04-1.65.85-1.65,1.97,0,4.71,0,9.42,0,14.13,0,1.05.33,1.92,1.51,1.94,1.26.03,1.66-.83,1.65-1.97-.01-2.35,0-4.71,0-7.06Z"/>
  <path class="cls-1" d="M29.24,9.65c1.26,0,2.56,0,3.87,0q2.62,0,3.15,2.41,2.55.43,2.51,1.96H11.36q-.29-1.51,2.35-1.97c.42-2.35.47-2.4,2.97-2.4,1.31,0,2.62,0,3.49,0,3.02,0,6.05,0,9.07,0ZM26.12,6.91"/>
  <path class="cls-1" d="M24.62,6.22c-1.89,0-3.42,1.53-3.42,3.42h1.56c0-1.03.83-1.86,1.86-1.86s1.86.83,1.86,1.86h1.56c0-1.89-1.53-3.42-3.42-3.42Z"/>
</svg>`;

export default NotificationScreen;
