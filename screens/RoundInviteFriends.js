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
} from "native-base";
import { updateRoundFriendList } from "../components/Endpoint";
import { Avatar } from "native-base";
import { Foundation, Feather } from "@expo/vector-icons";
import Background from "../components/Background";
import { getFriends } from "../components/Endpoint";
import { useData } from "../context/DataContext";
import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRound } from "../context/RoundContext";

// functions:
// 1. add global friends into this round
// 2. remove round friends

const RoundInviteFriendsScreen = ({ route, navigation }) => {
  const [friends, setFriends] = useState([]);
  const { userData, updateUserData } = useData();
  const roundId = route.params.roundId;
  const { roundData, updateRoundData, insertRoundData } = useRound();
  const round = roundData.data.find((r) => r._id === roundId);
  console.log("Round Friend List", round.roundFriends);

  useEffect(() => {
    console.log("friends updated:", friends);
    console.log("round data updated:", roundData);
    console.log("round data friend list: ", round.roundFriends);
  }, [friends, roundData]);

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

  const handleInviteFriendToRound = async (newFriend) => {
    // 1. update database
    // 1.1 check existing friends
    console.log("new friend", newFriend);
    // const newRoundFriendList = round.roundFriends.map((friend) => {
    //   return {
    //     habit: friend.habit,
    //     id: friend.id,
    //     nickname: friend.nickname,
    //     status: friend.status,
    //     username: friend.username,
    //   };
    // });

    // // 1.2 add new friend
    // newRoundFriendList.push(newFriend);
    console.log("new friend checking before sending to endpoint", newFriend);
    const response = await updateRoundFriendList(userData.token, roundId, newFriend);
    

    // console.log("newRoundFriendList", newRoundFriendList);
    console.log("update friend response",response);
    if (response.status === "success") {
      console.log("connect!!");
    } else {
      console.log("fail!!");
    }
    // 2. update roundContext
    // TODO
    // updateRoundData();
    // console.log("Round Friend List", round.roundFriends);
  };
  // // Dummy list of friends
  // const friends = [
  //   { id: "1", name: "Friend" },
  //   { id: "2", name: "Jane Smith" },
  //   { id: "3", name: "Emily Johnson" },
  //   { id: "4", name: "Michael Brown" },
  //   // Add more friends as needed
  // ];
  // Navigate to Global add friend page
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
                        const newFriend = {
                          habit: "",
                          id: item._id,
                          nickname: item.nickname,
                          status: "P",
                          username: item.username,
                        };
                        handleInviteFriendToRound(newFriend);
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
          </ScrollView>

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

export default RoundInviteFriendsScreen;
