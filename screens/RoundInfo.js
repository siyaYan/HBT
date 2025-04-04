import React from "react";
import { Avatar } from "native-base";
import DefaultProfile from "../assets/DefaultProfile.png";
import { Image } from "react-native";
import {
  Box,
  Text,
  Button,
  VStack,
  HStack,
  Divider,
  Heading,
  NativeBaseProvider,
  ScrollView,
  View,
  Modal,
} from "native-base";
import Background from "../components/Background";
import Icon from "react-native-vector-icons/Ionicons";
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";
import { useState, useEffect } from "react";
import { leaveRound, getRoundInfo } from "../components/Endpoint";

const RoundInfoScreen = ({ route, navigation }) => {
  const { userData } = useData();
  const { roundData, updateRounds, deleteRoundData, updateacceptRoundData } =
    useRound();
  const roundId = route.params.id;
  const { state: state, gohabit: gohabit } = route.params || {}; // Safe access to route params
  // const { roundId } = route.params;
  if (!roundId) {
    console.error("roundId is not defined roundinfo page");
    navigation.goBack(); // Navigate back if roundId is not available
    return null; // Render nothing while navigating back
  }

  // console.log("round context", roundData);

  const round = roundData.data.find((r) => r._id === roundId);

  const [isLeaveModalVisible, setLeaveModalVisible] = useState(false);
  const handleLeaveRound = () => {
    setLeaveModalVisible(true);
  };

  const updateRoundContext = async () => {
    const newRoundData = await getRoundInfo(userData.token, userData.data._id); // Fetch latest round data
    // updateRoundData(newRoundData); // Update context with new data
    console.log("home page --- round context", newRoundData);
    updateRounds(newRoundData);
    updateacceptRoundData(newRoundData);
    // const {roundData} = useRound();
    console.log("-----home page round context", roundData.data);
    // setActiveRounds(roundData.data.filter(round => isRoundAccepted(round,userData.data._id)));
  };
  const handleConfirmLeave = async () => {
    setLeaveModalVisible(false);
    roundData.data.map((round) => {
      if (round._id === roundId) {
        console.log("---- before leave round: ", round.roundFriends);
      }
    });
    try {
      const response = await leaveRound(userData.token, roundId);
      console.log("leave round response", response.data.roundFriends);
      if (response) {
        // await deleteRoundData(roundId);
        updateRoundContext();
        navigation.navigate("MainStack", { screen: "Home" });
      } else {
        // Handle case when response is not as expected
        Alert.alert("Error", "was unsucessful. to leave the round");
      }
    } catch (error) {
      console.error("Error leaving round:", error);
      Alert.alert("Error", "An error occurred while leaving the round");
    }
  };

  const handleCancelLeave = () => {
    setLeaveModalVisible(false);
  };
  const friendsList = round ? round.roundFriends : [];
  // console.log("round friend list:", round.roundFriends);

  // Navigate to invite friend page
  const inviteFriend = () => {
    navigation.navigate("RoundStack", {
      screen: "RoundInviteFriend",
      params: { id: roundId },
    });
  };

  const goHabit = (newState) => {
    navigation.navigate("RoundStack", {
      screen: "RoundHabit",
      params: { id: roundId, state: newState },
    });
  };

  const goScoreBoard = () => {
    navigation.navigate("RoundStack", {
      screen: "RoundScore",
      params: { id: roundId },
    });
  };

  if (gohabit) {
    goHabit(true);
  }

  const levelInt = round ? parseInt(round.level, 10) : 0;
  const startDate = round ? new Date(round.startDate) : new Date();
  const endDate = new Date(
    startDate.getTime() + (levelInt - 1) * 24 * 60 * 60 * 1000
  ); // Convert days to milliseconds
  const today = new Date();

  // Calculate the 10% point
  const tenPercentDuration = levelInt * 0.1;
  const tenPercentDate = new Date(
    startDate.getTime() + tenPercentDuration * 24 * 60 * 60 * 1000
  );

  const hasPassedTenPercent = today > tenPercentDate;

  return (
    <NativeBaseProvider>
      <Background />
      <Box flex={1} p={4}>
        {round ? (
          <VStack space={4}>
            <Text fontSize="md">Level: {round.level}</Text>
            <Text fontSize="md">
              Start date:{" "}
              {new Date(round.startDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
            <Text fontSize="md">
              Last date:{" "}
              {endDate.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
            <Divider my="2" />

            <Button
              onPress={() => {
                goHabit(false);
              }}
              mt="5"
              width="100%"
              rounded={30}
              size="lg"
              bg="#49a579"
              _text={{
                color: "#f9f8f2",
                fontFamily: "Regular Medium",
                fontSize: "lg",
              }}
            >
              My habit
            </Button>
            {round.status == "A" ? (
              <Button
                onPress={() => {
                  goScoreBoard();
                }}
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
                Score Board
              </Button>
            ) : (
              ""
            )}
            {/* Conditionally render the Invite Friend button */}
            {!hasPassedTenPercent &&
              (round.isAllowedInvite || round.userId == userData.data._id) && (
                <Button
                  onPress={inviteFriend}
                  mt="2"
                  width="100%"
                  rounded={30}
                  size="lg"
                  bg="#49a579"
                  _text={{
                    color: "#f9f8f2",
                    fontFamily: "Regular Medium",
                    fontSize: "lg",
                  }}
                >
                  Invite friend
                </Button>
              )}

            {userData.data._id !== round.userId && (
              <Button
                onPress={() => {
                  handleLeaveRound();
                }}
                mt="5"
                width="100%"
                size="lg"
                rounded={30}
                backgroundColor={"#f9f8f2"}
                _pressed={{
                  bg: "#ff061e",
                }}
                _text={{
                  color: "#94d3c5",
                  fontFamily: "Regular Medium",
                  fontSize: "lg",
                }}
              >
                Leave Round
              </Button>
            )}
            <Modal
              isOpen={isLeaveModalVisible}
              onClose={handleCancelLeave}
              animationPreset="fade"
            >
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>
                  <Text fontFamily={"Regular Medium"} fontSize="xl">
                    Leave Round
                  </Text>
                </Modal.Header>
                <Modal.Body>
                  <Text>
                    Are you sure? It will delete everything including posts,
                    scores, that can be your important memories.
                  </Text>
                </Modal.Body>
                <Modal.Footer>
                  <Button.Group space={2}>
                    <Button
                      rounded={30}
                      shadow="7"
                      width="50%"
                      size={"md"}
                      _text={{
                        color: "#f9f8f2",
                      }}
                      colorScheme="blueGray"
                      onPress={handleCancelLeave}
                    >
                      Cancel
                    </Button>
                    <Button
                      rounded={30}
                      shadow="7"
                      width="50%"
                      size={"md"}
                      colorScheme="danger"
                      onPress={handleConfirmLeave}
                    >
                      Leave
                    </Button>
                  </Button.Group>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
            {/* Friend list*/}
            {friendsList?.length > 0 ? (
              <View>
                <Text fontSize="lg" bold>
                  Friends List
                </Text>
                <ScrollView
                  style={{
                    w: "100%",
                    h: "10%",
                  }}
                  persistentScrollbar={true} // Makes the scrollbar always visible on Android
                  showsVerticalScrollIndicator={true} // Ensures the scrollbar is visible on iOS (when scrolling)
                >
                  {friendsList.map((item) =>
                    item.id !== userData.data._id && item.status !== "R" ? (
                      <View
                        key={item.id}
                        style={{
                          width: "90%", // Well-balanced width
                          marginVertical: 8, // More spacing between items
                          alignSelf: "center",
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingHorizontal: 12, // Keeps good spacing
                            paddingVertical: 10,
                            borderRadius: 10, // Keeps rounded edges for aesthetics
                          }}
                        >
                          {/* Left Section: Avatar + Name */}
                          <HStack alignItems="center" space={4} p={1}>
                            <Avatar
                              size="57"
                              bg="transparent"
                              source={item.avatar ? { uri: item.avatar } : null} // Show null if using DefaultProfile
                            >
                              {!item.avatar && (
                                <Image
                                  source={DefaultProfile}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    opacity: 0.5,
                                  }} // Apply 50% transparency
                                  resizeMode="contain"
                                />
                              )}
                            </Avatar>

                            <VStack>
                              <Text
                                fontFamily="Regular Medium"
                                fontSize="lg"
                              >
                                {item.nickname}
                              </Text>
                              <Text
                                fontFamily="Regular Medium"
                                fontSize="sm"
                                color="gray.500"
                              >
                                @{item.username}
                              </Text>
                            </VStack>
                          </HStack>

                          {/* Right Section: Status Icon */}
                          {item.status === "A" ? (
                            <Icon
                              name="checkmark-circle"
                              size={22}
                              color="grey"
                            />
                          ) : (
                            <Icon name="time" size={22} color="orange" />
                          )}
                        </View>
                      </View>
                    ) : null
                  )}
                </ScrollView>
              </View>
            ) : null}
          </VStack>
        ) : (
          ""
        )}
      </Box>
    </NativeBaseProvider>
  );
};

export default RoundInfoScreen;
