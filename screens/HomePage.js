import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Text,
  Button,
  NativeBaseProvider,
  Flex,
  View,
  Avatar,
  Modal,
  HStack,
} from "native-base";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import OptionMenu from "../components/OptionMenu";
import Background from "../components/Background";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import {
  getNoteUpdate,
  getRoundInfo,
  reactRoundRequest,
  updateRoundStatus,
} from "../components/Endpoint";
import { useRound } from "../context/RoundContext";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/FontAwesome";

// Function to add days to a date
function calculateEndDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Function to check if round is accepted/owned by the current user
function isRoundAccepted(round, currentUserId) {
  if (round.userId === currentUserId) {
    return true;
  } else {
    const hasId =
      round.roundFriends.find(
        (item) => item.id === currentUserId && item.status === "A"
      ) !== undefined;
    if (hasId) {
      return true;
    } else {
      return false;
    }
  }
}

const HomeScreen = ({ navigation }) => {
  const [thisRoundInfo, setThisRoundInfo] = useState(null); // State for round info
  const [isOpened, setIsOpened] = useState(false);
  const [scoreBoardOpen, setScoreBoardOpen] = useState(false)
  const [showRoundDetails, setShowRoundDetails] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [pendingReceived, setPendingReceived] = useState([]);
  const [showRoundValidation, setShowRoundValidation] = useState(false);
  const [showRoundValidationDate, setShowRoundValidationDate] = useState(false);

  const today = new Date();

  const { userData, updateNotes } = useData();
  const {
    roundData,
    updateRoundData,
    roundInvitationData,
    loadRoundInvitationData,
    updateRounds,
    activeRoundData,
  } = useRound();

  console.log("active round---", activeRoundData);
  // Get screen dimensions
  const { width, height } = Dimensions.get("window");
  const updateRoundContext = async () => {
    console.log("home page round context", roundData.data);
    const newRoundData = await getRoundInfo(userData.token, userData.data._id); // Fetch latest round data
    // updateRoundData(newRoundData); // Update context with new data
    console.log("home page --- round context", newRoundData);
    updateRounds(newRoundData);
    // const {roundData} = useRound();
    console.log("-----home page round context", roundData.data);
    // setActiveRounds(roundData.data.filter(round => isRoundAccepted(round,userData.data._id)));
    console.log("active round----", activeRoundData);
  };
  const updateNote = async () => {
    const res = await getNoteUpdate(userData.token, userData.data.email);
    if (res > 0) {
      updateNotes(res);
    }
  };

  // useEffect(() => {
  //   // Function to run when entering the page
  //   console.log("-------------Enter page--------");
  //   updateRoundContext(); // Update round data when screen is focused
  // }, []); // Empty dependency array means this effect runs only once when the component mounts

  useFocusEffect(
    useCallback(() => {
      updateNote();
      // updateRoundContext(); // Update round data when screen is focused
    }, [userData]) // Depend on `userInfo` to re-run the effect when it changes or the tab comes into focus
  );

  const handleAvatarPress = () => {
    navigation.navigate("AccountStack", { screen: "Account" });
  };

  const startRound = () => {
    navigation.navigate("RoundStack", {
      screen: "RoundConfig",
      params: { emptyState: true, source: "home" },
    });
    console.log("Home page round data", roundData);
  };

  const handleRoundPress = (roundId) => {
    navigation.navigate("RoundStack", {
      screen: "RoundInfo",
      params: { roundId },
    });
    console.log("home page roundId", roundId);
  };

  const handlePress = () => {
    console.log("UserData", userData);
    setIsOpened(true);
    // console.log("isOpened", isOpened);
    loadAllReceivedNotification();
  };

  const handleClose = () => {
    setIsOpened(false);
    setScoreBoardOpen(false)
    // console.log("isOpened", isOpened);
  };

  const handleRoundValidationClose = () => {
    setShowRoundValidation(!showRoundValidation);
  };
  const handleRoundValidationDateClose = () => {
    setShowRoundValidationDate(!showRoundValidationDate);
  };

  const handleRoundInfoClose = () => {
    setShowRoundDetails(!showRoundDetails);
  };

  const animation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: withSpring(animation.value) }],
    };
  });

  const triggerAnimation = () => {
    animation.value = 0; // Reset to initial position
    animation.value = withSpring(10, { stiffness: 300, damping: 5 }); // Shaking effect
  };

  useEffect(() => {
    triggerAnimation();
  }, []);

  const findPendingReceived = () => {
    console.log("----roundInvitationData", roundInvitationData);
    if (roundInvitationData && roundInvitationData.status === "success") {
      const pending = roundInvitationData.data.filter(
        (invitation) => invitation.status === "P"
      );
      setPendingReceived(pending);
    }
  };

  useEffect(() => {
    loadRoundInvitationData(userData.token);
  }, [userData.token]);

  const loadAllReceivedNotification = () => {
    console.log("----roundInvitationData", roundInvitationData);
    findPendingReceived();
  };

  useEffect(() => {
    // console.log("Updated pendingReceived:", pendingReceived);
    if (pendingReceived && pendingReceived.length > 0) {
      const pendingSenderIds = pendingReceived.map(
        (invitation) => invitation.senderId
      );
      // console.log(pendingReceived, "--------");
      const filtered = pendingSenderIds.map((senderId) =>
        roundInvitationData.users.find((user) => user._id === senderId)
      );
      setFilteredUsers(filtered);
    }
  }, [pendingReceived]);

  useEffect(() => {
    loadAllReceivedNotification();
  }, []);

  const openRoundInvitationInfo = async (i) => {
    const thisRoundId = roundInvitationData.data[i].roundId;
    setShowRoundDetails(!showRoundDetails);
    const aRoundInfo = await getRoundInfo(userData.token, thisRoundId);
    console.log(aRoundInfo, "-------------");
    setThisRoundInfo(aRoundInfo);
  };

  useEffect(() => {
    console.log("Updated thisRoundInfo:", thisRoundInfo);
  }, [thisRoundInfo]);

  const acceptRoundFriend = (i, thisRoundStartDate) => {
    // Validation first
    // 2 round already, then warning, keep the invitation
    if (activeRoundData.length == 2) {
      setShowRoundValidation(!showRoundValidation);
      return;
    }
    // 1 active, check start date if it is before the active round ends
    else if (activeRoundData.length == 1) {
      const activeRound = activeRoundData[0];
      if (activeRound.status == "A") {
        const levelInt = parseInt(activeRound.level, 10);
        const startDate = new Date(activeRound.startDate);
        const endDate = new Date(
          startDate.getTime() + levelInt * 24 * 60 * 60 * 1000
        ); // Convert days to milliseconds
        if (thisRoundStartDate < endDate) {
          setShowRoundValidationDate(!showRoundValidationDate);
          return;
        }
      }
    }
    // no active round
    console.log("accept round Friend,delete current notification");
    setFilteredUsers((currentReceived) => [
      ...currentReceived.slice(0, i - 1),
      ...currentReceived.slice(i),
    ]);
    setPendingReceived((currentReceived) => [
      ...currentReceived.slice(0, i - 1),
      ...currentReceived.slice(i),
    ]);
    const id = pendingReceived[i - 1]._id;
    reactRequest(id, "A"); //update round invitation data
    // show the new accepted round on it
    updateRoundContext();
  };

  const rejectRoundFriend = (i) => {
    console.log("reject round Friend,delete current notification");
    setFilteredUsers((currentReceived) => [
      ...currentReceived.slice(0, i - 1),
      ...currentReceived.slice(i),
    ]);
    setPendingReceived((currentReceived) => [
      ...currentReceived.slice(0, i - 1),
      ...currentReceived.slice(i),
    ]);
    const id = pendingReceived[i - 1]._id;
    reactRequest(id, "R");
  };

  const reactRequest = async (id, react) => {
    const response = await reactRoundRequest(userData.token, id, react);
    if (!response) {
      console.log("react request failed");
    }
    if (response.status == "success") {
      console.log("react request success:", response);
    } else {
      console.error("react request failed:", response.message);
    }
  };

  // Function to update status and date context
  const updateStatusAndDate = async (roundId, newStatus) => {
    try {
      const response = await updateRoundStatus(
        userData.token,
        roundId,
        newStatus
      );
      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Assuming the API doesn't return the updated data, you might need to fetch it again
      // or handle the date update in a different way
      // Update date context code goes here (if needed)

      console.log("Status updated successfully");
    } catch (error) {
      console.error("Failed to update status and date:", error);
    }
  };

  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems="center">
        <OptionMenu navigation={navigation} />
        <Pressable onPress={handleAvatarPress}>
          <Box py="5" px="2" alignItems="center" justifyContent="center">
            {userData.avatar && userData.avatar.uri ? (
              <Avatar
                bg="white"
                mb="1"
                size="md"
                source={{ uri: userData.avatar.uri }}
              />
            ) : (
              <Avatar bg="white" mb="1" size="md" borderWidth={2}>
                <AntDesign name="user" size={30} color="black" />
              </Avatar>
            )}
            <Text fontFamily={"Regular"} fontSize="lg">
              {userData.data.nickname}
            </Text>
          </Box>
        </Pressable>
        {roundData?.data?.map((round, index) => {
          // Add condition to check the round if owner or active participant
          if (isRoundAccepted(round, userData.data._id)) {
            //<View key={round._id} >
            const startDate = new Date(round.startDate);
            const timeDifference = startDate - today;
            const daysDifference = Math.ceil(
              timeDifference / (1000 * 3600 * 24)
            );
            {
              /* console.log("-------daysdifference",daysDifference); */
            }

            if (daysDifference <= 0 && round.status !== "A") {
              //update the status
              updateStatusAndDate(round._id, "A");
            }
            const endDate = calculateEndDate(
              startDate,
              parseInt(round.level, 10)
            );
            const endTimeDifference = Math.ceil(
              (endDate - today) / (1000 * 3600 * 24)
            );
            if (
              endTimeDifference <= 0 &&
              round.status === "A" &&
              round.status !== "F" &&
              round.status !== "C"
            ) {
              updateStatusAndDate(round._id, "F");
            }
            {
              /* console.log("-------enddaysdifference",endTimeDifference); */
            }

            const prefix = timeDifference > 0 ? "D-" : "D+";
            const formattedDifference = `${prefix}${Math.abs(
              daysDifference
            )} days`;

            return (
              // <View>
              <Button
                key={index}
                title={"Round ${index+1}"}
                onPress={() => {
                  handleRoundPress(round._id);
                }}
                rounded="30"
                // shadow="1"
                mt="5"
                width="80%"
                height="100"
                size="lg"
                style={{
                  borderWidth: 1, // This sets the width of the border
                  borderColor: "#49a579", // This sets the color of the border
                }}
                backgroundColor={
                  round.status === "P"
                    ? "#606060"
                    : round.status === "R"
                    ? "#666ff"
                    : round.status === "A"
                    ? "#49a579"
                    : round.status === "F"
                    ? "#f9f8f2"
                    : "rgba(250,250,250,0.2)"
                }
                // _text={{
                //   color: "#FFFFFF",
                //   fontFamily: "Regular Semi Bold",
                //   fontSize: "lg",
                // }}
                _pressed={{
                  bg:
                    round.status === "P"
                      ? "#252525"
                      : round.status === "R"
                      ? "#323280"
                      : round.status === "A"
                      ? "173225"
                      : round.status === "F"
                      ? "C0C0C0"
                      : "rgba(0, 0, 0, 0)", // default is transparent
                }}
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "Regular Semi Bold",
                    fontSize: 20, // Use a number for fontSize instead of "lg"
                  }}
                >
                  {round.name}
                </Text>
                {(round.status === "P" || "R") && (
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "Regular Semi Bold",
                      fontSize: 20, // Use a number for fontSize instead of "lg"
                    }}
                  >
                    {formattedDifference} (
                    {startDate.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    )
                  </Text>
                )}
              </Button>
              // </View>
            );
          }
        })}
        {/* Linda Sprint 4 Start a round*/}
        {(!activeRoundData || activeRoundData.length < 2) && (
          <Button
            onPress={startRound}
            rounded="30"
            // shadow="1"
            mt="5"
            width="80%"
            size="lg"
            style={{
              borderWidth: 1, // This sets the width of the border
              borderColor: "#49a579", // This sets the color of the border
            }}
            backgroundColor={"rgba(250,250,250,0.2)"}
            _text={{
              color: "#191919",
              fontFamily: "Regular Semi Bold",
              fontSize: "lg",
            }}
            _pressed={{
              bg: "#e5f5e5",
            }}
          >
            {activeRoundData.length === 1
              ? "Plan the next round"
              : "Start a round"}
          </Button>
        )}
      {/* Just for testing TODO: this button need to be on Round card */}
        <Box py="5" px="2" alignItems="center" justifyContent="center">
          <Button             
            onPress={()=>navigation.navigate('ForumStack', { screen: 'ForumPage' , params: { id: roundData.data[0]._id }})}
            rounded="30"
            width="80%"
            size="lg"
            style={{
              borderWidth: 1, // This sets the width of the border
              borderColor: "#49a579", // This sets the color of the border
            }}
            backgroundColor={"rgba(250,250,250,0.2)"}
            _text={{
              color: "#191919",
              fontFamily: "Regular Semi Bold",
              fontSize: "lg",
            }}
            _pressed={{
              bg: "#e5f5e5",
            }} >checkForum</Button>
          <Button    
            onPress={()=>{setScoreBoardOpen(true)}}                 
            rounded="30"
            mt="5"
            width="80%"
            size="lg"
            style={{
              borderWidth: 1, // This sets the width of the border
              borderColor: "#49a579", // This sets the color of the border
            }}
            backgroundColor={"rgba(250,250,250,0.2)"}
            _text={{
              color: "#191919",
              fontFamily: "Regular Semi Bold",
              fontSize: "lg",
            }}
            _pressed={{
              bg: "#e5f5e5",
            }}>checkScoreBoard</Button>
        </Box>
      </Flex>
      {/* Linda Sprint 4 Show round/s*/}
      {/* <Flex direction="column" alignItems="center">

      </Flex> */}
      <TouchableOpacity
        onPress={handlePress}
        style={[
          styles.button,
          {
            position: "absolute",
            top: height - 420,
            left: width - 350,
            right: "auto",
          },
        ]}
      >
        <Icon name="envelope" size={300} color="#606060" />
      </TouchableOpacity>
      {/* <View style={styles.envelopeContainer}> */}

      {/* <TouchableOpacity onPress={handlePress}>
          <Icon name="envelope" size={50} color="#666" />
        </TouchableOpacity> */}
        {/* Modal 1: round invitation notification */}
      <Modal isOpen={isOpened} onClose={handleClose}>
        <Modal.Content maxWidth="400px" width="90%">
          <Modal.CloseButton />
          <Modal.Header>Received Invitations</Modal.Header>
          <Modal.Body>
            {/* <View style={[styles.modalContent, { width: width * 1 }]}> */}
            {filteredUsers.length > 0 ? (
              <Box w={"95%"}>
                {filteredUsers.map((item, index) => {
                  return (
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
                      <HStack space="3">
                        <AntDesign
                          onPress={() => openRoundInvitationInfo(index)}
                          name="info"
                          color="black"
                          size={30}
                        />
                        <Modal
                          isOpen={showRoundDetails}
                          onClose={handleRoundInfoClose}
                        >
                          <Modal.Content maxWidth="400px">
                            <Modal.CloseButton />
                            <Modal.Header>Round Details</Modal.Header>
                            <Modal.Body>
                              {thisRoundInfo && thisRoundInfo.data && (
                                <>
                                  <Text fontSize="md">
                                    Round Name: {thisRoundInfo.data[0].name}
                                  </Text>

                                  <Text fontSize="md">
                                    Start Date:{" "}
                                    {new Date(
                                      thisRoundInfo.data[0].startDate
                                    ).toLocaleDateString(undefined, {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </Text>
                                  <Text fontSize="md">
                                    Level: {thisRoundInfo.data[0].level}
                                  </Text>
                                  <Text fontSize="md">
                                    Maximum Capacity:{" "}
                                    {thisRoundInfo.data[0].maximum}
                                  </Text>
                                </>
                              )}
                            </Modal.Body>
                          </Modal.Content>
                        </Modal>

                        <Modal
                          isOpen={showRoundValidation}
                          onClose={handleRoundValidationClose}
                        >
                          <Modal.Content maxWidth="400px">
                            <Modal.CloseButton />
                            <Modal.Header>Warning</Modal.Header>
                            <Modal.Body>
                              <>
                                <Text fontSize="md">
                                  Two active round already, cannot accept this
                                  one.
                                </Text>
                              </>
                            </Modal.Body>
                          </Modal.Content>
                        </Modal>
                        <Modal
                          isOpen={showRoundValidationDate}
                          onClose={handleRoundValidationDateClose}
                        >
                          <Modal.Content maxWidth="400px">
                            <Modal.CloseButton />
                            <Modal.Header>Warning</Modal.Header>
                            <Modal.Body>
                              <>
                                <Text fontSize="md">
                                  Cannot accept a round before current active
                                  round.
                                </Text>
                              </>
                            </Modal.Body>
                          </Modal.Content>
                        </Modal>
                        <AntDesign
                          onPress={() =>
                            acceptRoundFriend(
                              1,
                              new Date(thisRoundInfo.data[0].startDate)
                            )
                          }
                          name="checksquareo"
                          size={30}
                          color="black"
                        />
                        <AntDesign
                          onPress={() => rejectRoundFriend(1)}
                          name="closesquareo"
                          size={30}
                          color="black"
                        />
                      </HStack>
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
                No round invitation
              </Text>
            )}
            {/* </View> */}
          </Modal.Body>
        </Modal.Content>
      </Modal>
      {/* Modal 2: score board of Finished Round */}
      <Modal isOpen={scoreBoardOpen} onClose={handleClose}>
        <Modal.Content maxWidth="400px" width="90%">
          <Modal.CloseButton />
          <Modal.Header>Round Score Board</Modal.Header>
          <Modal.Body>
            <Text fontSize="md">Round ID: {roundData.data[0]._id}</Text>
            
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  envelopeContainer: {
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10, // Optional: Add border radius for a more polished look
  },
});

export default HomeScreen;
