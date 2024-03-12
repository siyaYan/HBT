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
} from "native-base";
import { Avatar } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import Background from "../components/Background";
import { FontAwesome } from "@expo/vector-icons";

// TODO: change the layout to match the new ios version
const FriendsScreen = ({ navigation }) => {
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
  const [friends, setfriends] = useState([
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
      user: "Siya1",
      content: "reacted to your action item.",
    },
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      user: "Tom1",
      content: "reacted to your action item.",
    },
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      user: "Siya2",
      content: "reacted to your action item.",
    },
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      user: "Tom2",
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
    {
      profileImageUrl:
        "https://habital-image.s3.ap-southeast-2.amazonaws.com/profiles/656c7e11ee620cef3279d358.jpeg",
      user: "Siya1",
      content: "reacted to your action item.",
    },
  ]);
  const rejectFriend = (i) => {
    console.log("reject Friend,delete current notificate");
    setReceived((currentReceived) => [
      ...currentReceived.slice(0, i - 1),
      ...currentReceived.slice(i),
    ]);
  };
  const acceptFriend = (i) => {
    console.log("accept Friend,delete current notificate");
    setReceived((currentReceived) => [
      ...currentReceived.slice(0, i - 1),
      ...currentReceived.slice(i),
    ]);
  };
  const deleteCurrent = (item, i) => {
    console.log("delete current friend or item");
    if (i == 1) {
      setfriends((currentfriends) => currentfriends.slice(1));
    } else {
      setfriends((currentfriends) => [
        ...currentfriends.slice(0, i - 1),
        ...currentfriends.slice(i),
      ]);
    }
  };
  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems="center">
        <OptionMenu navigation={navigation} />
        <Box mt="9" w="85%">
          <VStack space={1} alignItems="left">
            <Image
              size={30}
              source={require("../assets/Buttonicons/PaperPlaneRight.png")}
              alt="received"
            />
            <Box
            mt={3}
              h="15%"
              w={"90%"}
              alignSelf={"center"}
              justifyContent={"center"}
            >
              {received.length > 0 ? (
                <VStack space={3}>
                  <HStack
                    w={"100%"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    {received[0] && received[0].profileImageUrl ? (
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
                        onPress={() => acceptFriend(1)}
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
                        onPress={() => rejectFriend(1)}
                      >
                        <AntDesign
                          name="closesquareo"
                          size={30}
                          color="black"
                        />
                      </Button>
                    </HStack>
                  </HStack>
                  {received.length > 1 ? (
                    <HStack
                      w={"100%"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      {received[1] && received[1].profileImageUrl ? (
                        <Avatar
                          bg="white"
                          mb="1"
                          size={"md"}
                          source={{ uri: received[1].profileImageUrl }}
                        />
                      ) : (
                        <Avatar bg="white" mb="1" size="md" borderWidth={2}>
                          <AntDesign name="user" size={20} color="black" />
                        </Avatar>
                      )}

                      <Text fontFamily={"Regular"} fontSize="lg">
                        {received[1].username}
                      </Text>
                      <Text fontFamily={"Regular"} fontSize="lg">
                        {received[1].nickname}
                      </Text>
                      <HStack space="3">
                      <Button
                        size={"7"}
                        bg="#f9f8f2"
                        _pressed={{
                          bg: "#a8a29e",
                        }}
                        onPress={() => acceptFriend(2)}
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
                        onPress={() => rejectFriend(2)}
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
              marginTop={"3"}
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
            <Box
            mt={3}
              h="15%"
              w={"90%"}
              alignSelf={"center"}
              justifyContent={"center"}
            >
              {sent.length > 0 ? (
                <VStack space={3}>
                  <HStack
                    w={"100%"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    {sent[0] && sent[0].profileImageUrl ? (
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
                    <Button
                      size={"7"}
                      bg="#f9f8f2"
                      _pressed={{
                        bg: "#a8a29e",
                      }}
                      onPress={() => deleteCurrent("sent", 1)}
                    >
                      <AntDesign name="closesquareo" size={30} color="black" />
                    </Button>
                  </HStack>
                  {sent.length > 1 ? (
                    <HStack
                      w={"100%"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      {sent[1] && sent[1].profileImageUrl ? (
                        <Avatar
                          bg="white"
                          mb="1"
                          size={"md"}
                          source={{ uri: sent[1].profileImageUrl }}
                        />
                      ) : (
                        <Avatar bg="white" mb="1" size="md" borderWidth={2}>
                          <AntDesign name="user" size={20} color="black" />
                        </Avatar>
                      )}

                      <Text fontFamily={"Regular"} fontSize="lg">
                        {sent[1].username}
                      </Text>
                      <Text fontFamily={"Regular"} fontSize="lg">
                        {sent[1].nickname}
                      </Text>
                      <Button
                        size={"7"}
                        bg="#f9f8f2"
                        _pressed={{
                          bg: "#a8a29e",
                        }}
                        onPress={() => deleteCurrent("sent", 2)}
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
              marginTop={3}
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
              source={require("../assets/Buttonicons/UsersThree.png")}
              alt="friends"
            />

            <Box w={"90%"} alignSelf={"center"}>
              {friends.map((item, index) => (
                <HStack
                  w={"100%"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  m={1}
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
                  <Text fontFamily={"Regular"} fontSize="lg">
                    {item.user ? item.user : item.title}
                  </Text>
                  <Text fontFamily={"Regular"} fontSize="lg">
                    {item.content}
                  </Text>
                  <Button
                    size={"7"}
                    bg="#f9f8f2"
                    _pressed={{
                      bg: "#a8a29e",
                    }}
                    onPress={() => deleteCurrent("friends", index + 1)}
                  >
                    <AntDesign name="closesquareo" size={30} color="black" />
                  </Button>
                </HStack>
              ))}
              {friends.length == 0 ? (
                <Text
                  fontFamily={"Regular"}
                  fontSize="2xl"
                  textAlign={"center"}
                >
                  No friends data
                </Text>
              ) : (
                ""
              )}
            </Box>
          </VStack>
        </Box>
      </Flex>
    </NativeBaseProvider>
  );
};

export default FriendsScreen;
