import React from "react";
import {
  Box,
  Text,
  Button,
  FlatList,
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
  const { roundId } = route.params || {}; // Safe access to route params

  if (!roundId) {
    console.error("roundId is not defined");
    navigation.goBack(); // Navigate back if roundId is not available
    return null; // Render nothing while navigating back
  }

  const { roundData, updateRounds, deleteRoundData , updateActiveRoundData} = useRound();
  // console.log("round context", roundData);

  const round = roundData.data.find((r) => r._id === roundId);
  // console.log("roundinfo page round data:", round);

  // Update round info to RoundContext and DB

  // useEffect(() => {
  //   if (!round) {
  //     console.error("Round not found in roundData");
  //     navigation.navigate("MainStack", { screen: "Home" }); // Navigate to Home if round is not found
  //   }
  // }, [round]);

  // if (!round) {
  //   return null; // Render nothing if round is not found
  // }
  // Leave round
  const [isLeaveModalVisible, setLeaveModalVisible] = useState(false);
  const handleLeaveRound = () => {
    setLeaveModalVisible(true);
  };
  
  const updateRoundContext = async () => {
    const newRoundData = await getRoundInfo(userData.token, userData.data._id); // Fetch latest round data
    // updateRoundData(newRoundData); // Update context with new data
    console.log("home page --- round context", newRoundData);
    updateRounds(newRoundData);
    updateActiveRoundData(newRoundData)
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
        Alert.alert("Error", "Failed to leave the round");
      }
    } catch (error) {
      console.error("Error leaving round:", error);
      Alert.alert("Error", "An error occurred while leaving the round");
    }
  };

  const handleCancelLeave = () => {
    setLeaveModalVisible(false);
  };
  const friendsList = round?round.roundFriends:[];
  // console.log("round friend list:", round.roundFriends);

  // Navigate to invite friend page
  const inviteFriend = () => {
    navigation.navigate("RoundStack", {
      screen: "RoundInviteFriend",
      params: { roundId: roundId },
    });
  };

  const goHabit = () => {
    navigation.navigate("RoundStack", {
      screen: "RoundHabit",
      params: { roundId: roundId },
    });
  };

  const goScoreBoard = () => {
    navigation.navigate("RoundStack", {
      screen: "RoundScore",
      params: { roundId: roundId },
    });
  }
  // Navigate to Round Config page
  const goRoundConfig = () => {
    navigation.navigate("RoundStack", {
      screen: "RoundConfig",
      params: { emptyState: false, roundId: roundId, source: "info" },
    });
  };

  const levelInt = round?parseInt(round.level, 10):0;
  const startDate = round?new Date(round.startDate):new Date();
  const endDate = new Date(
    startDate.getTime() + levelInt * 24 * 60 * 60 * 1000
  ); // Convert days to milliseconds

  return (
    <NativeBaseProvider>
      {/* <Center w="100%"> */}
      <Background />
      <Box flex={1} p={4}>
        {round ? (
          <VStack space={4}>
            <HStack>
              <Heading size="lg" color="coolGray.800">
                {round.name}
              </Heading>
              {/* Edit round, which leads to Round Config page */}
              {round.userId == userData.data._id ? (
                <Box alignItems="center" justifyContent="center">
                  <Button p={0} variant="unstyled" onPress={goRoundConfig}>
                    <Icon name="pencil" size={24} color="#000" />{" "}
                    {/* Pen icon */}
                  </Button>
                </Box>
              ) : (
                ""
              )}
            </HStack>
            <Text fontSize="md">Level: {round.level}</Text>
            <Text fontSize="md">
              Start Date:{" "}
              {new Date(round.startDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
            <Text fontSize="md">
              End Date:{" "}
              {endDate.toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </Text>
            <Divider my="2" />
            {round.status=="A"?(<Button
              onPress={() => {
                goScoreBoard();
              }}
              mt="5"
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
            </Button>):("")}
            <Button
              onPress={() => {
                goHabit();
              }}
              mt="5"
              width="100%"
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
            {round.isAllowedInvite || round.userId == userData.data._id ? (
              <Button
                onPress={() => {
                  inviteFriend();
                  // console.log("Calendar icon pressed. info:", startDate,level,roundName,allowOthers,userData.data._id);
                }}
                mt="5"
                width="100%"
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
            ) : (
              ""
            )}

            {userData.data._id !== round.userId && (
              <Button
                onPress={() => {
                  handleLeaveRound();
                }}
                mt="5"
                width="100%"
                size="lg"
                // bg="#ff061e"
                // bg="rgba(255, 6, 30, 0.1)" // 0.5 is the alpha value for 50% transparency
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
            {friendsList.length > 0 ? (
              <View>
                <Text fontSize="lg" bold>
                  Friends List
                </Text>
                <ScrollView
                  style={{
                    w: "100%",
                    h: "10%",
                    backgroundColor: "#f0f0f0", // Light background color
                  }}
                  persistentScrollbar={true} // Makes the scrollbar always visible on Android
                  showsVerticalScrollIndicator={true} // Ensures the scrollbar is visible on iOS (when scrolling)
                >
                  {friendsList.map((item) =>
                    item.id !== userData.data._id && item.status !== "R" ? (
                      <View
                        key={item.id}
                        style={{ width: "95%", marginVertical: 5 }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingHorizontal: 10,
                            paddingVertical: 8,
                            backgroundColor: "#E5E7EB", // Example background color
                            borderRadius: 8,
                          }}
                        >
                          <Text style={{ fontSize: 16 }}>{item.username}</Text>
                          <Text style={{ fontSize: 16 }}>{item.nickname}</Text>
                          {item.status === "A" ? (
                            <Icon
                              name="checkmark-circle"
                              size={24}
                              color="green"
                            /> // Active icon
                          ) : (
                            <Icon name="time" size={24} color="orange" /> // Pending icon
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
