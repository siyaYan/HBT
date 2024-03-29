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
  Modal,
} from "native-base";
import { Avatar } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import Background from "../components/Background";
import { FontAwesome } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

// TODO: change the layout to match the new ios version
const FriendsScreen = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    // Fetch or update avatar dynamically
    // userData=useData().useData
    console.log(userData, "Friendslist");
  }, [userData]);
  const { userData, updateUserData } = useData();
  const [deleted, setDelete] = useState(0);
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
  const [friends, setFriends] = useState([
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
    if (item == "sent") {
      console.log("delete current item");
      setSent((currentSent) => [
        ...currentSent.slice(0, i - 1),
        ...currentSent.slice(i),
      ]);
    }
    if (item === "friend") {
      setShowModal(false);
      console.log("delete current friend");
      if (deleted > 0) {
        setFriends((currentFriends) => [
          ...currentFriends.slice(0, deleted - 1),
          ...currentFriends.slice(deleted),
        ]);
      } else {
        console.log("delete all friends");
        setFriends({});
      }
    }
  };
  const deleteOption =(i)=>{
    setDelete(i)
    setShowModal(true)
  }
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
                      <AntDesign
                        onPress={() => acceptFriend(1)}
                        name="checksquareo"
                        size={30}
                        color="black"
                      />
                      <AntDesign
                        onPress={() => rejectFriend(1)}
                        name="closesquareo"
                        size={30}
                        color="black"
                      />
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
                        <AntDesign
                          onPress={() => acceptFriend(2)}
                          name="checksquareo"
                          size={30}
                          color="black"
                        />

                        <AntDesign
                          onPress={() => rejectFriend(2)}
                          name="closesquareo"
                          size={30}
                          color="black"
                        />
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
              m="2"
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
                    <VStack justifyContent={"center"} alignItems={"center"}>
                      <Entypo
                        onPress={() => deleteCurrent("sent", 1)}
                        name="back-in-time"
                        size={30}
                        color="black"
                      />
                      <Text fontFamily={"Regular"} fontSize="10">
                        Withdraw
                      </Text>
                    </VStack>
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

                      <VStack justifyContent={"center"} alignItems={"center"}>
                        <Entypo
                          onPress={() => deleteCurrent("sent", 2)}
                          name="back-in-time"
                          size={30}
                          color="black"
                        />
                        <Text fontFamily={"Regular"} fontSize="10">
                          Withdraw
                        </Text>
                      </VStack>
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
              m="2"
              _light={{
                bg: "muted.800",
              }}
              _dark={{
                bg: "muted.50",
              }}
              alignSelf={"center"}
              w="90%"
            />
            <HStack
              w={"100%"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Image
                size={30}
                source={require("../assets/Buttonicons/UsersThree.png")}
                alt="friends"
              />
              <FontAwesome5
                onPress={()=>deleteOption(-1)}
                name="unlink"
                size={24}
                color="black"
              />
            </HStack>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <Modal.Content maxWidth="400px">
                <Modal.Header>Unlink the friend(s)?</Modal.Header>
                <Modal.Footer>
                  <Button.Group justifyContent={"space-between"}>
                  <Button
                      onPress={() => {
                        deleteCurrent("friend");
                      }}
                    >
                      Ok
                    </Button>
                    <Button
                    colorScheme="secondary"
                      onPress={() => {
                        setShowModal(false);
                      }}
                    >
                      Cancel
                    </Button>
                    
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
            <Box w={"93%"} h={"45%"} alignSelf={"center"}>
              <ScrollView w={"100%"} h="100%">
                {friends.length > 0 ? (
                  <Box w={"95%"}>
                    {friends.map((item, index) => (
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
                          <FontAwesome name="check" size={24} color="black" />
                        )}
                        <Text fontFamily={"Regular"} fontSize="md">
                          {item.user ? item.user : item.title}
                        </Text>
                        <Text fontFamily={"Regular"} fontSize="md">
                          {item.content}
                        </Text>
                        <Foundation
                          onPress={()=>deleteOption(index + 1)}
                          name="unlink"
                          size={24}
                          color="black"
                        />
                      </HStack>
                    ))}
                  </Box>
                ) : (
                  <Text
                    marginTop={"30%"}
                    fontFamily={"Regular"}
                    fontSize="2xl"
                    textAlign={"center"}
                  >
                    No friends data
                  </Text>
                )}
              </ScrollView>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </NativeBaseProvider>
  );
};

export default FriendsScreen;
