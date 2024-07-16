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
  Modal,
  View,
  Avatar,
} from "native-base";
import { StyleSheet } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import Background2 from "../components/Background2";
import { FontAwesome } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  getFriends,
  deleteFriendOrWithdrawRequestById,
  deleteFriends,
  getSendRequest,
  getReceivedRequest,
  reactReceivedRequest,
  getNoteUpdate,
} from "../components/Endpoint";
import { useFocusEffect } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";

const FriendsScreen = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);
  const { userData, updateUserData, note, updateNotes } = useData();
  const [deleted, setDelete] = useState(0);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [friends, setFriends] = useState([]);
  const [listViewData, setListViewData] = useState(
    Array(20)
      .fill("")
      .map((_, i) => ({ key: `${i}`, text: `item #${i}` }))
  );

  useFocusEffect(
    useCallback(() => {
      // This code runs when the tab comes into focus
      console.log('Tab is in focus, userInfo:', userData);
      updateFriendList();
      updateSendRequest();
      updateReceivedRequest();
      updateNote();
    }, [userData]) // Depend on `userInfo` to re-run the effect when it changes or the tab comes into focus
  );
  //   useEffect(() => {
  //   // Fetch or update avatar dynamically
  //   updateNote()
  //   console.log('This is friendlist :',note );
  // }, [note]);

  const updateNote = async () => {
    const res = await getNoteUpdate(userData.token, userData.data.email);
    // if (res > 0) {
    updateNotes(res);
    // }
  };
  const updateFriendList = async () => {
    const response = await getFriends(userData.token);
    // Handle success or error response
    if (!response) {
      console.log("get friends failed");
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
        newFriends[index]._id = data._id;
      });
      // console.log('new friends:',newFriends)
      // const reversedFriends = newFriends.slice().reverse();
      // console.log('reversed friends:',reversedFriends)
      setFriends(newFriends);
    } else {
      console.error("get friends failed:", response.message);
    }
  };
  const updateSendRequest = async () => {
    const response = await getSendRequest(userData.token);
    // Handle success or error response
    if (!response) {
      console.log("get send friends request failed");
      setSent({});
    }
    if (response.status == "success") {
      // console.log('get friends success:',response.data);
      let sendFriends = [];
      const pendingRes = response.data.filter((item) => item.status == "P");
      // const pendingRes=response.users
      if (pendingRes.length > 0) {
        response.data.map((data, index) => {
          if(data.status == "P"){
            const newFriend = {
              _id: data._id,
              email: response.users[index].email,
              profileImageUrl: response.users[index].profileImageUrl,
              username: response.users[index].username,
              nickname: response.users[index].nickname,
            };
            sendFriends.push(newFriend)
          }
        });
      }
      setSent(sendFriends);
      // console.log('send request:',sent)
    } else {
      // console.error('get send friend request failed:',response.message);
      console.log("get send friends request failed");
      setSent({});
    }
  };
  const updateReceivedRequest = async () => {
    const response = await getReceivedRequest(userData.token);
    // Handle success or error response
    if (!response) {
      console.log("get received friends failed");
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
            _id: data._id,
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
      // console.error('get received friend requests failed:',response.message);
      console.log("get received friends failed");
      setReceived({});
    }
  };
  const rejectFriend = (i) => {
    console.log("reject Friend,delete current notificate");
    setReceived((currentReceived) => [
      ...currentReceived.slice(0, i - 1),
      ...currentReceived.slice(i),
    ]);
    const id = received[i - 1]._id;
    reactRequest(id, "R");
  };
  const acceptFriend = (i) => {
    console.log("accept Friend,delete current notificate");
    setReceived((currentReceived) => [
      ...currentReceived.slice(0, i - 1),
      ...currentReceived.slice(i),
    ]);
    const id = received[i - 1]._id;
    reactRequest(id, "A");
  };
  const reactRequest = async (id, react) => {
    const response = await reactReceivedRequest(userData.token, id, react);
    if (!response) {
      console.log("react request failed");
    }
    // Handle success or error response
    if (response.status == "success") {
      console.log("react request success:", response);
    } else {
      console.error("react request failed:", response.message);
    }
  };
  const deleteAllFriends = async () => {
    const response = await deleteFriends(userData.token);
    if (!response) {
      console.log("delete friends failed");
    }
    // Handle success or error response
    if (response.status == "success") {
      console.log("delete friends success:", response);
    } else {
      console.error("delete friends failed:", response.message);
    }
  };
  const deleteFriendOrRequestByID = async (id) => {
    const response = await deleteFriendOrWithdrawRequestById(
      userData.token,
      id
    );
    if (!response) {
      console.log("delete friends failed");
    }
    // Handle success or error response
    if (response.status == "success") {
      console.log("delete friends success:", response);
    } else {
      console.error("delete friends failed:", response.message);
    }
  };
  const deleteCurrent = (item, i) => {
    if (item == "sent") {
      console.log("delete current item");
      setSent((currentSent) => [
        ...currentSent.slice(0, i - 1),
        ...currentSent.slice(i),
      ]);
      const id = sent[i - 1]._id;
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
        const id = friends[deleted - 1]._id;
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

  // const renderItem = ({
  //   item,
  //   index
  // }) => <Box>
  //     <Pressable onPress={() => console.log('You touched me')} _dark={{
  //     bg: 'coolGray.800'
  //   }} _light={{
  //     bg: 'white'
  //   }}>
  //       <Box pl="4" pr="5" py="2">
  //         <HStack alignItems="center" space={3}>
  //           <Avatar size="48px" source={{
  //           uri: item.avatarUrl
  //         }} />
  //           <VStack>
  //             <Text color="coolGray.800" _dark={{
  //             color: 'warmGray.50'
  //           }} bold>
  //               {item.fullName}
  //             </Text>
  //             <Text color="coolGray.600" _dark={{
  //             color: 'warmGray.200'
  //           }}>
  //               {item.recentText}
  //             </Text>
  //           </VStack>
  //           <Spacer />
  //           <Text fontSize="xs" color="coolGray.800" _dark={{
  //           color: 'warmGray.50'
  //         }} alignSelf="flex-start">
  //             {item.timeStamp}
  //           </Text>
  //         </HStack>
  //       </Box>
  //     </Pressable>
  //   </Box>;

  // const renderHiddenItem = (data, rowMap) => <HStack flex="1" pl="2">
  //     <Pressable w="70" ml="auto" cursor="pointer" bg="coolGray.200" justifyContent="center" onPress={() => closeRow(rowMap, data.item.key)} _pressed={{
  //     opacity: 0.5
  //   }}>
  //       <VStack alignItems="center" space={2}>
  //         <Icon as={<Entypo name="dots-three-horizontal" />} size="xs" color="coolGray.800" />
  //         <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
  //           More
  //         </Text>
  //       </VStack>
  //     </Pressable>
  //     <Pressable w="70" cursor="pointer" bg="red.500" justifyContent="center" onPress={() => deleteRow(rowMap, data.item.key)} _pressed={{
  //     opacity: 0.5
  //   }}>
  //       <VStack alignItems="center" space={2}>
  //         <Icon as={<MaterialIcons name="delete" />} color="white" size="xs" />
  //         <Text color="white" fontSize="xs" fontWeight="medium">
  //           Delete
  //         </Text>
  //       </VStack>
  //     </Pressable>
  //   </HStack>;
    
  return (
    <NativeBaseProvider>
      <Background2 />
      <Flex direction="column" alignItems="center">
        <OptionMenu navigation={navigation} />
        <Box mt="9" w="85%">
          <VStack space={1} alignItems="left">
            <HStack>
              <Image
                size={30}
                source={require("../assets/Buttonicons/PaperPlaneRight.png")}
                alt="received"
              />
              <Text fontFamily={"Regular"} fontSize="lg">
                {received.length}
              </Text>
            </HStack>
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
            <HStack>
              <Image
                size={30}
                source={require("../assets/Buttonicons/PaperPlaneTilt.png")}
                alt="sent"
              />
              <Text fontFamily={"Regular"} fontSize="lg">
                {sent.length}
              </Text>
            </HStack>
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
              <HStack>
                <Image
                  size={30}
                  source={require("../assets/Buttonicons/UsersThree.png")}
                  alt="friends"
                />
                <Text fontFamily={"Regular"} fontSize="lg">
                  {friends.length}
                </Text>
              </HStack>
              {/* <FontAwesome5
                onPress={() => deleteOption(-1)}
                name="unlink"
                size={24}
                color="black"
              /> */}
              {/* TODO:update to slide item */}
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
              <ScrollView w={"100%"}>
                {friends.length > 0 ? (
                  <Box w={"95%"}>
                    {/* <SwipeListView data={friends} renderItem={renderItem} renderHiddenItem={renderHiddenItem} rightOpenValue={-130} previewRowKey={'0'} previewOpenValue={-40} previewOpenDelay={3000} onRowDidOpen={onRowDidOpen} /> */}
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
// const styles = StyleSheet.create({
//   rowBack: {
//     alignItems: "center",
//     // backgroundColor: '#DDD',
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingLeft: 15,
//   },
// });
export default FriendsScreen;
