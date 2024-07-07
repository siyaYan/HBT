import React from "react";
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
} from "native-base";
import { updateRoundFriendList } from "../components/Endpoint";
import { Avatar } from "native-base";
import { Foundation, Feather } from "@expo/vector-icons";
import Background from "../components/Background";
import { getFriends,createRoundNotification } from "../components/Endpoint";
import { useData } from "../context/DataContext";
import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRound } from "../context/RoundContext";
import { StyleSheet, TouchableOpacity, Dimensions } from "react-native";

// functions:
// 1. add global friends into this round
// 2. remove round friends

const RoundInviteFriendsScreen = ({ route, navigation }) => {
  const [friends, setFriends] = useState([]);
  const { userData, updateUserData } = useData();
  const roundId = route.params.roundId;
  const { roundData, insertRoundFriendList } = useRound();
  const round = roundData.data.find((r) => r._id === roundId);
  console.log("Round Friend List", round.roundFriends);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log("modal visible", isModalVisible);
  }, [isModalVisible]);

  useEffect(() => {
    console.log("friends updated:", friends);
    console.log("round data updated:", roundData);
    console.log("round data friend list: ", round.roundFriends);
  }, [friends, roundData]);

  const countCurrentRoundFriends = (round) => {
    const count = round.roundFriends.length>0?round.roundFriends.filter(
      (friend) => friend.status === "P" || friend.status === "A"
    ).length:0;
    return count;
  };
  const currentRoundFriendCount = countCurrentRoundFriends(round);

  // TODO: duplicate functions with FriendsList
  // Global friends
  useFocusEffect(
    useCallback(() => {
      // This code runs when the tab comes into focus
      console.log("Tab is in focus, userInfo:", userData);

      getGlobalFriendList();
    }, [userData]) // Depend on `userInfo` to re-run the effect when it changes or the tab comes into focus
  );

  const getGlobalFriendList = async () => {
    const response = await getFriends(userData.token);
    // Handle success or error response
    if (!response) {
      console.log("get friends failed");
    }
    if (response.status == "success") {
      // console.log('get friends success:',response.data);
      //TODO round/id/friendlist/add, add a single friend into the round
      let newFriends = [];
      console.log("end point get friends response:", response);
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
      setFriends(newFriends);
      console.log("newfriends:", newFriends);
      console.log("friends: ", friends);
    } else {
      console.error("get friends failed:", response.message);
    }
  };

  // Round friends
  // update round info friend list
  const handlePressInvite = (item) => {
    console.log("counttttting:", currentRoundFriendCount);
    console.log("maxx", round.maximum);
    if (currentRoundFriendCount >= round.maximum) {
      console.log(true);
      setModalVisible(true);
      console.log("modal visible", isModalVisible);
    } else {
      const newFriend = {
        habit: "",
        id: item._id,
        nickname: item.nickname,
        status: "P",
        username: item.username,
      };
      handleInviteFriendToRound(newFriend);
    }
  };
  const handleInviteFriendToRound = async (newFriend) => {
    // 1. update database
    // 1.1 check existing friends
    console.log("new friend", newFriend);
    console.log("new friend checking before sending to endpoint", newFriend);
    const response = await updateRoundFriendList(
      userData.token,
      roundId,
      newFriend
    );

    // console.log("newRoundFriendList", newRoundFriendList);
    console.log("update friend response", response);
    if (response.status === "success") {
      console.log("connect!!");
    } else {
      console.log("fail!!");
    }
    // 2. update roundContext
    insertRoundFriendList(roundId,newFriend);

    // 3. create round invitation
    const responseCR = createRoundNotification(roundId,userData.token,userData.data._id,newFriend.id);
    console.log("userID______",userData);
    console.log("friend id",newFriend.id)
    console.log("round invitation: ", responseCR);
    //TODO: backend sending 500 error
  };

  const addFriend = () => {
    navigation.navigate("Invite");
  };

  return (
    <NativeBaseProvider>
      {/* <Center w="100%"> */}
      <Background />

      <Box flex={1} p={5}>
        <VStack space={4} flex={1}>
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
                    {/* <Foundation
                          onPress={() => deleteOption(index + 1)}
                          name="inviteToRound"
                          size={24}
                          color="black"
                        /> */}
                    <Pressable
                      onPress={() => {
                        console.log("item", item);

                        handlePressInvite(item);
                      }}
                    >
                      <Feather name="send" size={30} color="black" />
                      <Text fontFamily={"Regular"} fontSize="xs">
                        invite
                      </Text>
                    </Pressable>
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
            <Modal
              isOpen={isModalVisible}
              // onClose={handleCancelDelete}
              animationPreset="fade"
            >
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                {/* <Modal.Header>
                      <Text fontFamily={"Regular Medium"} fontSize="xl">
                        Delete Round
                      </Text>
                    </Modal.Header> */}
                <Modal.Body>
                  <Text>Maximum capacity reached!</Text>
                </Modal.Body>
                <Modal.Footer>
                  {/* <Button.Group space={1}> */}
                  <Button
                    rounded={30}
                    shadow="7"
                    width="50%"
                    size={"md"}
                    alignItems="center"
                    _text={{
                      color: "#f9f8f2",
                    }}
                    colorScheme="blueGray"
                    onPress={() => setModalVisible(false)}
                  >
                    OK
                  </Button>

                  {/* </Button.Group> */}
                </Modal.Footer>
              </Modal.Content>
            </Modal>

          </ScrollView>

          {/* {modalVisible && (
        
      )} */}
          {/* A button links to the global friend invitation */}
          <Button
            onPress={addFriend}
            position="absolute"
            bottom="5"
            width="90%"
            alignSelf="center"
            mt="auto"
          >
            Add More Friends
          </Button>
        </VStack>
      </Box>
      {/* </Center> */}
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "white",
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default RoundInviteFriendsScreen;
