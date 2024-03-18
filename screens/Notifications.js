import { useState, useEffect } from "react";
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
import Background from "../components/Background";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

// TODO: change the layout to match the new ios version
const NotificationScreen = ({ navigation }) => {
  useEffect(() => {
    // Fetch or update avatar dynamically
    // userData=useData().useData
    let noteNum = Object.keys(notificates).length;
    if (noteNum > 0) {
      console.log("Notification-------------------------", noteNum);
    }
    // console.log(userData, "Notification");
    updateUserData({
      ...userData,
      notes: noteNum,
    });
  }, [userData]);

  const { userData, updateUserData } = useData();
  const [received, setReceived] = useState([
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      username: "siya_received",
      nickname: "Dancer1",
      status: "linked",
    },
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      username: "Tom_received",
      nickname: "ZOOOO",
      status: "unlink",
    },
  ]);
  const [sent, setSent] = useState([
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      username: "Jo_sent",
      nickname: "Lover11",
    },
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      username: "Dan_sent",
      nickname: "viewrrr",
    },
  ]);
  const [notificates, setNotificates] = useState([
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      user: "Siya",
      content: "reacted to your action item.",
    },
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      user: "Tom",
      content: "reacted to your action item.",
    },
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      user: "Dan",
      content: "reacted to your action item.",
    },
  ]);
  const [history, setHistory] = useState([
    { title: "Hibit count", content: "your action was successfully." },
    { title: "Hibit count", content: "your action was successfully." },
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      user: "Siya",
      content: "reacted to your action item.",
    },
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      user: "Tom",
      content: "reacted to your action item.",
    },
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      user: "Siya",
      content: "reacted to your action item.",
    },
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      user: "Tom",
      content: "reacted to your action item.",
    },
  ]);
  const rejectFriend = () => {
    console.log("reject Friend,delete current notificate");
    setSent((currentSent) => currentSent.slice(1));
  };
  const acceptFriend = () => {
    console.log("accept Friend,delete current notificate");
    setSent((currentSent) => currentSent.slice(1));
  };
  const deleteCurrent = (item, i) => {
    if (item == "received") {
      console.log("delete current received notificate");
      setReceived((currentReceived) => currentReceived.slice(1));
    }
    if (item === "notificates") {
      console.log("delete current system notificate");
      if (Object.keys(notificates).length == 1) {
        updateUserData({
          ...userData,
          notes: 0,
        });
      }
      setNotificates((currentNotificates) => [
        ...currentNotificates.slice(0, i - 1),
        ...currentNotificates.slice(i),
      ]);
    }
  };
  const deleteAll = (item) => {
    if (item == "received") {
      console.log("delete all received notificate");
      setReceived({});
    } else if (item == "history") {
      console.log("delete all history notificate");
      setHistory({});
    } else {
      console.log("delete all system notificate");
      setNotificates({});
      updateUserData({
        ...userData,
        notes: 0,
      });
    }
  };
  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems="center">
        <Box safeArea w="90%" alignItems="center">
          <Box mt="5" w="95%">
            <VStack space={1} alignItems="left">
              {sent.length ? (
                <Box>
                  <Image
                    size={30}
                    source={require("../assets/Buttonicons/PaperPlaneRight.png")}
                    alt="sent"
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
                    {sent.length}
                  </Badge>
                </Box>
              ) : (
                <Image
                  size={30}
                  source={require("../assets/Buttonicons/PaperPlaneRight.png")}
                  alt="sent"
                />
              )}

              <Box mt="2" h="10%" w={"90%"} alignSelf={"center"}>
                {sent.length > 0 ? (
                  <HStack
                    w={"100%"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    {sent[0].profileImageUrl ? (
                      <Avatar
                        bg="white"
                        mb="1"
                        size={"md"}
                        source={{ uri: sent[0].profileImageUrl }}
                      />
                    ) : (
                      <Avatar bg="white" mb="1" size="md" borderWidth={2}>
                        <AntDesign name="user" size={20} color="black" />
                      </Avatar>
                    )}
                    <Text fontFamily={"Regular"} fontSize="lg">
                      {sent[0].username}
                    </Text>
                    <Text fontFamily={"Regular"} fontSize="lg">
                      {sent[0].nickname}
                    </Text>
                    <HStack space="3">
                      <AntDesign
                        onPress={() => acceptFriend()}
                        name="checksquareo"
                        size={30}
                        color="black"
                      />
                      <AntDesign
                        onPress={() => rejectFriend()}
                        name="closesquareo"
                        size={30}
                        color="black"
                      />
                    </HStack>
                  </HStack>
                ) : (
                  <Text
                    fontFamily={"Regular"}
                    fontSize="2xl"
                    textAlign={"center"}
                  >
                    No more connect requests
                  </Text>
                )}
              </Box>

              <Divider
                marginBottom="2"
                _light={{
                  bg: "muted.800",
                }}
                _dark={{
                  bg: "muted.50",
                }}
                alignSelf={"center"}
                w="90%"
              />

              <HStack w={"100%"} justifyContent={"space-between"}>
                {received.length ? (
                  <Box>
                    <Image
                      size={30}
                      source={require("../assets/Buttonicons/PaperPlaneTilt.png")}
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
                      {received.length}
                    </Badge>
                  </Box>
                ) : (
                  <Image
                    size={30}
                    source={require("../assets/Buttonicons/PaperPlaneTilt.png")}
                    alt="received"
                  />
                )}

                <AntDesign
                  name="checkcircleo"
                  size={30}
                  color="black"
                  onPress={() => deleteAll("received")}
                />
                {/* <AntDesign name="delete" size={30} color="black" /> */}
              </HStack>
              <Box mt="5" h="10%" w={"90%"} alignSelf={"center"}>
                {received.length > 0 ? (
                  <HStack
                    w={"100%"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    {received[0].profileImageUrl ? (
                      <Avatar
                        bg="white"
                        mb="1"
                        size={"md"}
                        source={{ uri: received[0].profileImageUrl }}
                      />
                    ) : (
                      <Avatar bg="white" mb="1" size="md" borderWidth={2}>
                        <AntDesign name="user" size={20} color="black" />
                      </Avatar>
                    )}

                    <Text fontFamily={"Regular"} fontSize="lg">
                      {received[0].username}
                    </Text>
                    <Text fontFamily={"Regular"} fontSize="lg">
                      {received[0].nickname}
                    </Text>

                    <HStack space="3">
                      {received[0].status == "linked" ? (
                        <AntDesign name="link" size={28} color="black" />
                      ) : (
                        ""
                      )}
                      <MaterialIcons
                        onPress={() => deleteCurrent("received", 1)}
                        name="delete-outline"
                        size={30}
                        color="#191919"
                      />
                    </HStack>
                  </HStack>
                ) : (
                  <Text
                    fontFamily={"Regular"}
                    fontSize="2xl"
                    textAlign={"center"}
                  >
                    You are all caught up :D
                  </Text>
                )}
              </Box>

              <Divider
                mb="2"
                _light={{
                  bg: "muted.800",
                }}
                _dark={{
                  bg: "muted.50",
                }}
                alignSelf={"center"}
                w="90%"
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
                  onPress={() => deleteAll("notification")}
                />
                {/* <AntDesign name="delete" size={30} color="black" /> */}
              </HStack>
              <Box
                h="20%"
                w={"90%"}
                alignSelf={"center"}
                justifyContent={"center"}
              >
                {notificates.length > 0 ? (
                  <VStack space={3}>
                    <HStack
                      w={"100%"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      {notificates[0] && notificates[0].profileImageUrl ? (
                        <Avatar
                          bg="white"
                          mb="1"
                          size={"md"}
                          source={{ uri: notificates[0].profileImageUrl }}
                        />
                      ) : (
                        <Avatar bg="white" mb="1" size="md" borderWidth={2}>
                          <AntDesign name="user" size={20} color="black" />
                        </Avatar>
                      )}
                      <Text fontFamily={"Regular"} fontSize="lg">
                        {notificates[0].user}
                      </Text>
                      <Text fontFamily={"Regular"} fontSize="lg">
                        {notificates[0].content}
                      </Text>
                      <AntDesign
                        onPress={() => deleteCurrent("notificates", 1)}
                        name="closesquareo"
                        size={30}
                        color="black"
                      />
                    </HStack>
                    {notificates.length > 1 ? (
                      <HStack
                        w={"100%"}
                        alignItems={"center"}
                        justifyContent={"space-between"}
                      >
                        {notificates[1] && notificates[1].profileImageUrl ? (
                          <Avatar
                            bg="white"
                            mb="1"
                            size={"md"}
                            source={{ uri: notificates[1].profileImageUrl }}
                          />
                        ) : (
                          <Avatar bg="white" mb="1" size="md" borderWidth={2}>
                            <AntDesign name="user" size={20} color="black" />
                          </Avatar>
                        )}

                        <Text fontFamily={"Regular"} fontSize="lg">
                          {notificates[1].user}
                        </Text>
                        <Text fontFamily={"Regular"} fontSize="lg">
                          {notificates[1].content}
                        </Text>

                        <AntDesign
                          onPress={() => deleteCurrent("notificates", 2)}
                          name="closesquareo"
                          size={30}
                          color="black"
                        />
                      </HStack>
                    ) : (
                      ""
                    )}
                  </VStack>
                ) : (
                  <Text
                    fontFamily={"Regular"}
                    fontSize="2xl"
                    textAlign={"center"}
                  >
                    You are all caught up :D
                  </Text>
                )}
              </Box>

              <Divider
                marginb="2"
                _light={{
                  bg: "muted.800",
                }}
                _dark={{
                  bg: "muted.50",
                }}
                alignSelf={"center"}
                w="90%"
              />
              <HStack w={"100%"} justifyContent={"space-between"}>
                <Text fontFamily={"Regular Semi Bold"} fontSize="2xl">
                  Last 30 days
                </Text>
                <AntDesign
                  name="checkcircleo"
                  size={30}
                  color="black"
                  onPress={() => deleteAll("history")}
                />
              </HStack>
              <Box w={"93%"} h={"30%"} alignSelf={"center"}>
                <ScrollView w={"100%"} h="100%">
                  {history.length>0?(
                  <Box w="95%">
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
                  ):(<Text marginTop={"20%"} fontFamily={"Regular"} fontSize="2xl" textAlign={"center"}>No previous data</Text>)}
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
