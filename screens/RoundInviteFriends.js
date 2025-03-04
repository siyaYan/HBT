import React from "react";
import { SvgXml } from "react-native-svg";

import {
  Box,
  Text,
  Pressable,
  Button,
  NativeBaseProvider,
  VStack,
  HStack,
  ScrollView,
  Modal,
} from "native-base";
import { Avatar } from "native-base";
import { Feather } from "@expo/vector-icons";
import Background from "../components/Background";
import { getFriends, createRoundNotification } from "../components/Endpoint";
import { useData } from "../context/DataContext";
import { useState, useCallback, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRound } from "../context/RoundContext";
import { StyleSheet } from "react-native";

// functions:
// 1. add global friends into this round
// 2. remove round friends

const RoundInviteFriendsScreen = ({ route, navigation }) => {
  const [friends, setFriends] = useState([]);
  const { userData, updateUserData } = useData();
  const roundId = route.params.id;
  const { roundData, insertRoundData } = useRound();
  const [round, setRound] = useState(
    roundData.data.find((r) => r._id === roundId)
  );

  console.log("Round Friend List", round.roundFriends);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    console.log("modal visible", isModalVisible);
  }, [isModalVisible]);

  useEffect(() => {
    setRound(roundData.data.find((r) => r._id === roundId));
  }, [roundData]);

  const countCurrentRoundFriends = (round) => {
    const count =
      round.roundFriends.length > 0
        ? round.roundFriends.filter(
            (friend) => friend.status === "P" || friend.status === "A"
          ).length
        : 0;
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
      console.log("get friends was unsucessful.");
    }
    if (response.status == "success") {
      //TODO round/id/friendlist/add, add a single friend into the round
      let newFriends = [];
      console.log("end point get friends response:", response);
      response.users.map((user) => {
        const newFriend = {
          _id: user._id,
          email: user.email,
          profileImageUrl: user.profileImageUrl,
          username: user.username,
          nickname: user.nickname,
        };
        newFriends.push(newFriend);
      });
      setFriends(newFriends);
      console.log("newfriends:", newFriends);
    } else {
      console.error("get friends was unsucessful.:", response.message);
    }
  };

  // Round friends
  // update round info friend list
  const handlePressInvite = (item) => {
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
        score: 0,
      };
      handleInviteFriendToRound(newFriend);
    }
  };
  const handleInviteFriendToRound = async (newFriend) => {
    const responseCR = await createRoundNotification(
      roundId,
      userData.token,
      userData.data._id,
      newFriend.id
    );
    if (responseCR.data) {
      insertRoundData(responseCR?.data?.newRound);
    }
  };

  const addFriend = () => {
    navigation.navigate("Invite");
  };

  return (
    <NativeBaseProvider>
      <Background />

      <Box flex={1} p={5}>
        <VStack space={4} flex={1}>
          <ScrollView w={"100%"} h="100%">
            {friends.length > 0 ? (
              <Box w={"95%"}>
                {friends.map((item, index) => {
                  const friendInRound = round.roundFriends.find(
                    (friend) => friend.id === item._id
                  );
                  const friendStatus = friendInRound?.status || null;
                  return (
                    <HStack
                      w={"100%"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      m={1}
                      key={index}
                      item={item}
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
                      {/* {item.profileImageUrl ? (
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
                      </Text> */}
                      {/* If already active, then hide invite button, show as linked */}
                      {friendInRound ? (
                        friendStatus === "A" ? (
                          <SvgXml xml={circleSvg("#606060")} width={30} height={30} />
                        ) : friendStatus === "P" ? (
                          <Feather name="refresh-cw" size={30} color="#606060" />
                        ) : (
                          <Pressable
                            onPress={() => {
                              console.log("item", item);
                              handlePressInvite(item);
                            }}
                            style={{
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <SvgXml xml={connectSvg()} width={30} height={30} />
                            <Text fontFamily={"Regular"} fontSize="xs">
                              Invite
                            </Text>
                          </Pressable>
                        )
                      ) : (

                        <Pressable
                        onPress={() => {
                         console.log("item", item);
                            handlePressInvite(item);
                        }}
                        style={{
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <SvgXml xml={connectSvg()} width={30} height={30} />
                        <Text fontFamily={"Regular"} fontSize="xs">
                          Invite
                        </Text>
                      </Pressable>
                      )}
                    </HStack>
                  );
                })}
              </Box>
            ) : (
              <Text
                marginTop={"30%"}
                fontFamily={"Regular"}
                fontSize="2xl"
                textAlign={"center"}
              >
                Create your circle | No Friends Yet
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
            alignSelf="center"
            mt="5"
            rounded={30}
            width="100%"
            size="lg"
            bg="#49a579"
            _text={{
              color: "#f9f8f2",
              fontFamily: "Regular Medium",
              fontSize: "lg",
            }}
          >
            Add More Friends
          </Button>
        </VStack>
      </Box>
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
const connectSvg = () =>
  `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#000;stroke:#000;stroke-miterlimit:10;}</style></defs><path class="cls-1" d="M31.67,42.77c-.89,0-1.73-.35-2.38-1.01l-.13-.13-5.8-15.07-14.99-5.72-.14-.13c-.88-.86-1.21-2.08-.9-3.26.32-1.19,1.22-2.08,2.41-2.38l14.44-3.69,14.32-4.02c1.18-.33,2.41-.01,3.27.86.87.87,1.19,2.09.86,3.27l-4.03,14.34-3.68,14.42c-.3,1.19-1.19,2.09-2.38,2.41-.29.08-.59.12-.88.12ZM30.72,40.6c.38.32.88.42,1.36.29.54-.14.95-.56,1.09-1.1l3.69-14.44,4.03-14.37c.15-.54,0-1.1-.39-1.49s-.96-.54-1.49-.39l-14.34,4.03-14.46,3.69c-.54.14-.95.54-1.1,1.08-.13.49-.02.98.29,1.36l15.37,5.86,5.95,15.46Z"/><path class="cls-1" d="M24.07,26.76c-.23,0-.47-.09-.64-.27-.36-.36-.36-.93,0-1.29l6.91-6.91c.36-.36.93-.36,1.29,0s.36.93,0,1.29l-6.91,6.91c-.18.18-.41.27-.64.27Z"/></svg>`;

const circleSvg = (color) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="${color}">
<path class="cls-1" d="M32.64,21.65c-.31-.98-.71-1.92-1.21-2.81-.28-.51-.72-.8-1.31-.82-1.19-.05-1.94,1.2-1.39,2.29.26.5.52,1.01.71,1.54.67,1.8.94,3.57.81,5.31,0,.04-.02.07-.03.11-.07.56-.13,1.13-.26,1.67-.11.47-.24.92-.39,1.36-.01.04-.03.07-.04.11-.12.33-.25.64-.38.95-.16.35-.33.7-.53,1.05-.01.02-.02.05-.04.07-.15.26-.31.51-.47.76-.08.11-.15.22-.23.33-.12.17-.25.33-.37.49-1.08,1.32-2.44,2.41-4.11,3.26-.24.12-.49.23-.73.33-.18.07-.35.15-.53.21-.01,0-.03,0-.04.01-1.18.42-2.35.65-3.51.72-.06,0-.13,0-.19.01-.21,0-.42,0-.63,0-.91-.02-1.83-.14-2.76-.37-.25-.06-.49-.14-.74-.22-.59-.19-1.18-.42-1.76-.7-1.13-.55-2.11-1.23-2.97-2.02-.85-.81-1.6-1.75-2.23-2.84-.14-.24-.26-.49-.38-.73-.27-.55-.51-1.12-.71-1.73-.32-1-.51-2-.57-3,0-.01,0-.02,0-.04-.02-.26-.01-.52-.01-.78,0-.17,0-.34.02-.51,0-.16.02-.32.03-.49.03-.29.07-.58.12-.87.01-.08.02-.17.04-.25.06-.3.13-.6.21-.9.11-.4.23-.8.37-1.19.56-1.51,1.37-2.84,2.41-3.98.05-.06.1-.12.16-.17.13-.14.27-.28.41-.41.12-.12.24-.23.37-.34.1-.09.2-.17.3-.25.18-.15.35-.29.54-.43.08-.06.16-.12.24-.17.2-.14.41-.28.61-.41.06-.03.11-.07.17-.1,1.92-1.17,4.04-1.75,6.33-1.76.37,0,.73.04,1.1.04.85,0,1.5-.64,1.54-1.5.03-.8-.59-1.51-1.41-1.56-.56-.04-1.12-.06-1.68-.05-2.8.09-5.4.88-7.77,2.37-.1.07-.2.14-.3.21-.12.08-.24.16-.36.24-.06.04-.11.08-.17.13-.17.13-.35.26-.51.39-.14.11-.28.23-.42.35-.15.13-.31.26-.45.39-.28.25-.54.51-.8.79-.04.04-.08.09-.12.14-.23.25-.46.52-.67.78-.03.04-.06.07-.09.1-.07.09-.13.19-.2.28-.09.12-.18.24-.27.37-.16.23-.32.47-.47.7,0,.01-.02.03-.03.04-.83,1.33-1.45,2.76-1.83,4.28,0,.04-.02.08-.03.11-.08.32-.14.64-.2.96-.03.19-.06.37-.09.56-.01.08-.03.16-.04.24,0,.07,0,.15-.02.22-.02.17-.05.35-.06.52-.02.19-.02.38-.03.57,0,.06,0,.12,0,.17-.01.44-.02.87,0,1.3,0,0,0,.02,0,.02.02.39.06.78.11,1.17.03.2.06.39.09.58.03.17.06.35.1.52.05.24.1.49.17.73.02.07.04.13.06.2.25.92.59,1.81,1.03,2.69.01.02.02.05.03.07,0,.02.02.03.02.04.18.36.38.72.59,1.07.05.08.1.16.15.24.09.14.16.28.25.42.19.28.38.55.57.83.31.37.62.73.94,1.1.16.15.32.31.48.46,0,0,.01,0,.02.01.73.72,1.53,1.37,2.4,1.93.97.64,1.99,1.14,3.05,1.53.12.05.24.1.37.15.16.05.32.09.49.14.15.04.3.09.45.13.15.04.3.09.45.13.21.04.42.08.63.11.43.08.88.14,1.33.18.11.01.22.03.33.04.17.01.35.01.52.02.42.02.83.04,1.24.03.36,0,.73-.03,1.08-.06.21-.02.42-.05.63-.08.25-.03.5-.07.75-.12.18-.03.35-.07.52-.11.38-.09.76-.19,1.13-.3.04-.01.08-.02.12-.03.47-.15.93-.33,1.38-.53.02,0,.04-.02.07-.03.9-.4,1.78-.88,2.62-1.45.27-.19.54-.38.81-.57.27-.23.55-.47.82-.7.03-.04.07-.07.1-.11,1.67-1.54,2.94-3.41,3.82-5.57.12-.31.24-.62.35-.92.1-.35.2-.69.3-1.04.01-.09.02-.18.04-.26.03-.13.05-.26.07-.4.04-.18.07-.37.1-.55.06-.36.11-.73.14-1.1,0-.06.02-.11.02-.17,0-.01,0-.03,0-.04.01-.14.03-.29.04-.43.09-1.85-.14-3.65-.69-5.41Z"/><path class="cls-1" d="M17.23,30.47c.28.99.66,1.94,1.13,2.85.27.52.7.82,1.29.86,1.19.08,1.97-1.15,1.45-2.25-.24-.51-.49-1.02-.67-1.56-.61-1.82-.83-3.6-.66-5.33,0-.04.03-.07.03-.11.08-.56.16-1.12.31-1.67.12-.46.27-.91.43-1.35.01-.04.03-.07.04-.11.12-.32.27-.64.41-.94.17-.35.35-.69.56-1.03.01-.02.03-.05.04-.07.16-.26.33-.5.5-.74.08-.11.16-.22.24-.33.13-.17.26-.33.39-.48,1.11-1.29,2.51-2.34,4.2-3.13.25-.11.49-.21.74-.31.18-.07.35-.14.54-.2.01,0,.03,0,.04-.01,1.19-.38,2.37-.59,3.53-.62.06,0,.13,0,.19,0,.21,0,.42.01.63.02.91.05,1.82.19,2.75.45.25.07.49.16.73.24.59.21,1.17.45,1.74.75,1.11.58,2.07,1.29,2.91,2.11.83.83,1.55,1.8,2.15,2.9.13.25.24.49.36.74.25.56.48,1.13.66,1.75.29,1.01.46,2.01.49,3.01,0,.01,0,.02,0,.04,0,.26,0,.52-.01.78,0,.17-.02.34-.03.51-.01.16-.03.32-.05.49-.04.29-.08.57-.14.86-.02.08-.03.17-.05.25-.06.3-.15.6-.24.89-.12.4-.25.79-.41,1.18-.6,1.5-1.45,2.8-2.52,3.9-.05.06-.11.11-.16.17-.14.14-.28.27-.43.4-.12.11-.25.22-.38.33-.1.08-.2.16-.3.24-.18.14-.36.28-.55.41-.08.06-.16.11-.24.16-.21.14-.41.27-.62.39-.06.03-.11.07-.17.1-1.95,1.11-4.09,1.63-6.38,1.58-.37,0-.73-.06-1.1-.07-.85-.03-1.52.6-1.58,1.45-.06.8.55,1.53,1.37,1.6.56.05,1.12.09,1.67.09,2.81,0,5.42-.72,7.84-2.15.11-.06.2-.13.31-.2.12-.08.25-.15.37-.23.06-.04.11-.08.17-.12.18-.12.35-.25.52-.37.15-.11.29-.22.43-.33.16-.13.31-.25.47-.38.28-.25.56-.5.82-.76.04-.04.08-.09.13-.13.24-.25.47-.5.69-.76.03-.03.06-.07.09-.1.07-.09.14-.18.21-.27.09-.12.19-.24.28-.36.17-.23.33-.46.49-.69,0-.01.02-.03.03-.04.87-1.31,1.52-2.72,1.95-4.23.01-.04.02-.07.03-.11.09-.31.16-.63.23-.96.04-.18.07-.37.1-.56.01-.08.03-.16.04-.24.01-.07.01-.15.02-.22.03-.17.06-.34.08-.52.02-.19.03-.38.04-.57,0-.06,0-.12.01-.17.03-.44.04-.87.03-1.3,0,0,0-.02,0-.02,0-.39-.04-.78-.08-1.17-.02-.2-.05-.39-.08-.59-.02-.17-.05-.35-.08-.52-.04-.25-.09-.49-.15-.74-.02-.07-.04-.14-.05-.2-.23-.92-.54-1.83-.95-2.71-.01-.02-.02-.05-.03-.07,0-.02-.02-.03-.02-.04-.17-.36-.36-.73-.56-1.08-.05-.08-.09-.17-.14-.25-.08-.14-.15-.29-.24-.43-.18-.29-.36-.56-.55-.85-.3-.38-.6-.75-.9-1.13-.15-.16-.31-.32-.46-.47,0,0-.01,0-.02-.01-.71-.74-1.49-1.41-2.35-2-.95-.67-1.95-1.2-3.01-1.62-.12-.05-.24-.11-.36-.16-.16-.05-.32-.1-.48-.15-.15-.05-.29-.1-.44-.14-.15-.05-.3-.1-.45-.14-.21-.04-.42-.09-.63-.13-.43-.09-.87-.16-1.32-.22-.11-.01-.22-.04-.33-.05-.17-.02-.35-.02-.52-.04-.42-.04-.83-.06-1.24-.06-.36,0-.73,0-1.08.03-.21.01-.42.04-.63.06-.25.03-.5.06-.75.1-.18.03-.35.06-.53.09-.38.08-.76.16-1.14.27-.04.01-.08.02-.12.03-.47.14-.93.3-1.39.49-.02,0-.04.02-.07.03-.91.37-1.8.82-2.66,1.38-.28.18-.55.37-.82.55-.28.23-.56.45-.84.68-.04.04-.07.07-.11.11-1.72,1.49-3.04,3.32-3.98,5.46-.13.3-.25.61-.38.91-.11.34-.22.69-.33,1.03-.02.09-.02.18-.05.26-.03.13-.05.26-.09.39-.04.18-.08.37-.12.55-.07.36-.13.73-.17,1.09,0,.06-.02.11-.03.17,0,.01,0,.03,0,.04-.02.14-.04.29-.05.43-.15,1.84.04,3.65.53,5.43Z"/>
</svg>`;
