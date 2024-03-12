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
  ScrollView
} from "native-base";
import { Avatar } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import Background from "../components/Background";
import { FontAwesome } from "@expo/vector-icons";

// TODO: change the layout to match the new ios version
const NotificationScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  const [received, setReceived] = useState([
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      username: "siya_received",
      nickname: "Dancer1",
    },
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      username: "Tom_received",
      nickname: "ZOOOO",
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
    setReceived((currentReceived) => currentReceived.slice(1));
  };
  const acceptFriend = () => {
    console.log("accept Friend,delete current notificate");
    setReceived((currentReceived) => currentReceived.slice(1));
  };
  const deleteCurrent = (item, i) => {
    if (item == "sent") {
      console.log("delete current sent notificate");
      setSent((currentSent) => currentSent.slice(1));
    }
    if (item === "notificates") {
      console.log("delete current system notificate");
      if (i == 1) {
        setNotificates((currentNotificates) => currentNotificates.slice(1));
      } else {
        setNotificates((currentNotificates) => [
          ...currentNotificates.slice(0, i - 1),
          ...currentNotificates.slice(i),
        ]);
      }
    }
  };
  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems="center">
        <Box safeArea w="90%" alignItems="center">
          <Box mt="5" w="95%">
            <VStack space={1} alignItems="left">
              <Image
                size={30}
                source={require("../assets/Buttonicons/PaperPlaneRight.png")}
                alt="received"
              />

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
                      <Button
                        size={"7"}
                        bg="#f9f8f2"
                        _pressed={{
                          bg: "#a8a29e",
                        }}
                        onPress={() => acceptFriend()}
                      >
                        <AntDesign
                          name="checksquareo"
                          size={30}
                          color="black"
                        />
                      </Button>
                      <Button
                        size={"7"}
                        bg="#f9f8f2"
                        _pressed={{
                          bg: "#a8a29e",
                        }}
                        onPress={() => rejectFriend()}
                      >
                        <AntDesign
                          name="closesquareo"
                          size={30}
                          color="black"
                        />
                      </Button>
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
                marginTop={"0"}
                marginBottom="0"
                _light={{
                  bg: "muted.800",
                }}
                _dark={{
                  bg: "muted.50",
                }}
                alignSelf={"center"}
                w="90%"
              />

              <Image
                size={30}
                source={require("../assets/Buttonicons/PaperPlaneTilt.png")}
                alt="sent"
              />
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
                      <Button
                        size={"7"}
                        bg="#f9f8f2"
                        _pressed={{
                          bg: "#a8a29e",
                        }}
                      >
                        <AntDesign name="link" size={30} color="black" />
                      </Button>
                      <Button
                        size={"7"}
                        bg="#f9f8f2"
                        _pressed={{
                          bg: "#a8a29e",
                        }}
                        onPress={() => deleteCurrent("sent", 1)}
                      >
                        <AntDesign
                          name="closesquareo"
                          size={30}
                          color="black"
                        />
                      </Button>
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
                my="0"
                _light={{
                  bg: "muted.800",
                }}
                _dark={{
                  bg: "muted.50",
                }}
                alignSelf={"center"}
                w="90%"
              />

              <Image
                size={30}
                source={require("../assets/Buttonicons/MegaphoneSimple.png")}
                alt="notificate"
              />

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
                      <Button
                        size={"7"}
                        bg="#f9f8f2"
                        _pressed={{
                          bg: "#a8a29e",
                        }}
                        onPress={() => deleteCurrent("notificates", 1)}
                      >
                        <AntDesign
                          name="closesquareo"
                          size={30}
                          color="black"
                        />
                      </Button>
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
                        <Button
                          size={"7"}
                          bg="#f9f8f2"
                          _pressed={{
                            bg: "#a8a29e",
                          }}
                          onPress={() => deleteCurrent("notificates", 2)}
                        >
                          <AntDesign
                            name="closesquareo"
                            size={30}
                            color="black"
                          />
                        </Button>
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
                margin="3"
                _light={{
                  bg: "muted.800",
                }}
                _dark={{
                  bg: "muted.50",
                }}
                alignSelf={"center"}
                w="90%"
              />
              <Text fontFamily={"Regular Semi Bold"} fontSize="2xl">
                Last 30 days
              </Text>
              <Box w={"93%"} h={"30%"} alignSelf={"center"}>
              <ScrollView w={"100%"} h="100%">
                <Box w="95%">
                {history.map((item, index) => (
                  <HStack w={"100%"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  m={1}>
                    {item.profileImageUrl?
                    (<Avatar
                      bg="white"
                      mb="1"
                      size={"md"}
                      source={{ uri: item.profileImageUrl }}
                    />):(  <FontAwesome name="check" size={40} color="black" />)}
                    <Text fontFamily={"Regular"} fontSize="md">
                      {item.user?item.user:item.title}
                    </Text>
                    <Text fontFamily={"Regular"} fontSize="md">
                      {item.content}
                    </Text>
                  </HStack>
                ))}
                {/* :(<Text fontFamily={"Regular"} fontSize="2xl" textAlign={"center"}>No previous data</Text>)} */}
                </Box>
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
