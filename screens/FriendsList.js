import { useState, useEffect, useCallback } from "react";
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
import Background2 from "../components/Background2";
import { FontAwesome } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { getFriends, deleteFriendOrWithdrawRequestById, deleteFriends, getSendRequest, getReceivedRequest,reactReceivedRequest } from "../components/Endpoint";
import { useFocusEffect } from '@react-navigation/native';

// TODO: change the layout to match the new ios version
const FriendsScreen = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const {userData, updateUserData } = useData();
  const [deleted, setDelete] = useState(0);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [friends, setFriends] = useState([]);
  // Call the mock registration function
  useFocusEffect(
    useCallback(() => {
      // This code runs when the tab comes into focus
      console.log('Tab is in focus, userInfo:', userData);

      updateFriendList();
      updateSendRequest();
      updateReceivedRequest();
    }, [userData]) // Depend on `userInfo` to re-run the effect when it changes or the tab comes into focus
  );
  const updateFriendList = async()=>{
    const response = await getFriends(userData.token);
    // Handle success or error response
    if(!response){
      console.log('get friends failed')
    }
    if (response.status == "success") {
      // console.log('get friends success:',response.data);
      let newFriends=[]
      console.log(response)
      response.users.map((user)=>{
        const newFriend={
          _id:'',
          email:user.email,
          profileImageUrl:user.profileImageUrl,
          username:user.username,
          nickname:user.nickname
        }
        newFriends.push(newFriend)
      })
      response.data.map((data,index)=>{
        newFriends[index]._id=data._id
      })
      setFriends(newFriends)
      console.log('friends:',friends)
    } else {
      console.error('get friends failed:',response.message);
    }
  }
  const updateSendRequest = async()=>{
    const response = await getSendRequest(userData.token);
    // Handle success or error response
    if(!response){
      console.log('get send friends request failed')
    }
    if (response.status == "success") {
      // console.log('get friends success:',response.data);
      let sendFriends=[]
      console.log(response)
      response.users.map((user)=>{
        const newFriend={
          _id:'',
          email:user.email,
          profileImageUrl:user.profileImageUrl,
          username:user.username,
          nickname:user.nickname
        }
        sendFriends.push(newFriend)
      })
      response.data.map((data,index)=>{
        sendFriends[index]._id=data._id
      })
      setSent(sendFriends)
      console.log('send request:',sent)
    } else {
      console.error('get send friend request failed:',response.message);
    }
  }
  const updateReceivedRequest = async()=>{
    const response = await getReceivedRequest(userData.token);
    // Handle success or error response
    if(!response){
      console.log('get received friends failed')
    }
    if (response.status == "success") {
      // console.log('get friends success:',response.data);
      let receivedFriends=[]
      console.log(response)
      response.users.map((user)=>{
        const newFriend={
          _id:'',
          email:user.email,
          profileImageUrl:user.profileImageUrl,
          username:user.username,
          nickname:user.nickname
        }
        receivedFriends.push(newFriend)
      })
      response.data.map((data,index)=>{
        receivedFriends[index]._id=data._id
      })
      setReceived(receivedFriends)
      console.log('received requests:',received)
    } else {
      console.error('get reeived friend requests failed:',response.message);
    }
  }
  const rejectFriend = (i) => {
    console.log("reject Friend,delete current notificate");
    setReceived((currentReceived) => [
      ...currentReceived.slice(0, i - 1),
      ...currentReceived.slice(i),
    ]);
    const id=received[i-1]._id
    reactRequest(id,"R")
  };
  const acceptFriend = (i) => {
    console.log("accept Friend,delete current notificate");
    setReceived((currentReceived) => [
      ...currentReceived.slice(0, i - 1),
      ...currentReceived.slice(i),
    ]);
    const id=received[i-1]._id
    reactRequest(id,"A")
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
  const deleteAllFriends = async() =>{
    const response = await deleteFriends(userData.token);
    if(!response){
      console.log('delete friends failed')
    }
    // Handle success or error response
    if (response.status == "success") {
      console.log('delete friends success:',response);
    } else {
      console.error('delete friends failed:',response.message);
    }
  }
  const deleteFriendOrRequestByID = async(id) =>{
    const response = await deleteFriendOrWithdrawRequestById(userData.token, id);
    if(!response){
      console.log('delete friends failed')
    }
    // Handle success or error response
    if (response.status == "success") {
      console.log('delete friends success:',response);
    } else {
      console.error('delete friends failed:',response.message);
    }
  }
  const deleteCurrent = (item, i) => {
    if (item == "sent") {
      console.log("delete current item");
      setSent((currentSent) => [
        ...currentSent.slice(0, i - 1),
        ...currentSent.slice(i),
      ]);
      const id=sent[i-1]._id
      deleteFriendOrRequestByID(id);
    }
    if (item === "friend") {
      setShowModal(false);
      console.log("delete current friend");
      if (deleted > 0) {
        setFriends((currentFriends) => [
          ...currentFriends.slice(0, deleted - 1),
          ...currentFriends.slice(deleted),
        ]);
        const id=friends[deleted-1]._id
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
                onPress={() => deleteOption(-1)}
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
                          {item.username}
                        </Text>
                        <Text fontFamily={"Regular"} fontSize="md">
                          {item.nickname}
                        </Text>
                        <Foundation
                          onPress={() => deleteOption(index + 1)}
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
