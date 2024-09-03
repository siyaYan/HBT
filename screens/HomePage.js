import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Text,
  Button,
  NativeBaseProvider,
  Flex,
  View,
  Avatar,
  Badge,
  Modal,
  HStack,
} from "native-base";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ImageBackground,
  ScrollView,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import OptionMenu from "../components/OptionMenu";
import Background from "../components/Background";
import {
  getScoreBoard,
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
// import ScoreBoardModal from "../components/ScoreBoard.js";
import RewardStageBackground from "../assets/UIicons/checkout.webp";
import { color } from "react-native-elements/dist/helpers";

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
  const [scoreBoardOpen, setScoreBoardOpen] = useState(false);
  const [showRoundDetails, setShowRoundDetails] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [pendingReceived, setPendingReceived] = useState([]);
  const [showRoundValidation, setShowRoundValidation] = useState(false);
  const [showRoundValidationDate, setShowRoundValidationDate] = useState(false);
  const [rest, setRest] = useState([]);
  const [topThree, setTopThree] = useState([]);

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

  // const topThree = round ? round.roundFriends.slice(0, 3) : [];
  // const rest = round ? round.roundFriends.slice(3) : [];
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
  const getExistScoreBoard = async (roundId) => {
    // console.log(userData.token, roundId)
    const res = await getScoreBoard(userData.token, roundId);
    if (res) {
      const topThree = res.data.ranking.slice(0, 3);
      const rest = res.data.ranking.slice(3);
      // console.log('11-----321-----------'+JSON.stringify(topThree));
      updateRoundData({ ...roundData, scoreBoard: res.data });
      setRest(rest);
      setTopThree(topThree);
      setScoreBoardOpen(true);
    }
  };
  // const getSortedFriends = (round) => {
  //   if (!round) return { topThree: [], rest: [] };

  //   // Sort the friends array based on score in descending order
  //   const sortedFriends = [...round.roundFriends].sort(
  //     (a, b) => b.score - a.score
  //   );

  //   // Get top three and the rest
  //   const topThree = sortedFriends.slice(0, 3);
  //   const rest = sortedFriends.slice(3);

  //   return { topThree, rest };
  // };
  const round = roundData.data[0];
  // const updateNote = async () => {
  //   const res = await getNoteUpdate(userData.token, userData.data.email);
  //   if (res > 0) {
  //     updateNotes(res);
  //   }
  // };

  // useEffect(() => {
  //   // Function to run when entering the page
  //   console.log("-------------Enter page--------");
  //   updateRoundContext(); // Update round data when screen is focused
  // }, [userData]); // Empty dependency array means this effect runs only once when the component mounts

  // useFocusEffect(
  //   useCallback(() => {
  //     // updateNote();
  //     updateRoundContext(); // Update round data when screen is focused
  //   }, [userData]) // Depend on `userInfo` to re-run the effect when it changes or the tab comes into focus
  // );

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

  const handleRoundPress = (roundId, status) => {
    if (status === "A") {
      navigation.navigate("ForumStack", {
        screen: "ForumPage",
        params: { id: roundId },
      });
    } else {
      navigation.navigate("RoundStack", {
        screen: "RoundInfo",
        params: { roundId },
      });
    }
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
    setScoreBoardOpen(false);
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
    console.log("----roundInvitationData---notification", roundInvitationData);
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
  const medalColors = {
    Gold: "rgb(255, 215, 0)", // Gold in RGB
    Silver: "rgb(192, 192, 192)", // Silver in RGB
    Bronze: "rgb(205, 127, 50)", // Bronze in RGB
  };
  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems="center">
        <OptionMenu navigation={navigation} />

        {/* {scoreBoardOpen ? (
          <ScoreBoardModal
            isOpen={scoreBoardOpen}
            onClose={handleClose}
            roundData={roundData}
          />
        ) : (
          ""
        )} */}
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
                  handleRoundPress(round._id, round.status);
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
          {round ? (
            <Button
              onPress={() => {
                getExistScoreBoard(round._id);
              }}
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
              }}
            >
              checkScoreBoard
            </Button>
          ) : (
            ""
          )}
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
      <Modal
        isOpen={scoreBoardOpen}
        onClose={handleClose}
        size="full"
        style={{ marginTop: "15%", overflow: "hidden", flex: 1 }}
      >
        <Modal.Content
          maxWidth="400px"
          width="90%"
          height={'95%'}
        >
          <Modal.CloseButton />
          <Modal.Body >
            <View
            >
              <Box height={"25%"}>
                <View style={styles.topThreeContainer}>
                  <View style={styles.stageContainer}>
                    {topThree[1] ? (
                      <View
                        style={[
                          styles.stage,
                          topThree[1].rank == 1
                            ? styles.firstPlace
                            : topThree[1].rank == 2
                            ? styles.secondPlace
                            : topThree[1].rank == 3
                            ? styles.thirdPlace
                            : styles.restPlcae,
                        ]}
                      >
                        <Text>{topThree[1]?.nickname}</Text>
                        <Avatar
                          bg="white"
                          mb="1"
                          size="md"
                          source={{ uri: topThree[1]?.avatar }}
                          style={{
                            position: "relative",
                            right: 5,
                          }}
                        />
                        <Badge
                          colorScheme="coolGray" // or use any other color scheme if needed
                          style={{
                            position: "absolute",
                            bottom: 30,
                            right: 10,
                            backgroundColor: "rgba(255,255,255,0)", // Set badge background color to the medal color
                            padding: 0, // Adjust padding if necessary
                          }}
                        >
                          <AntDesign
                            name="Trophy"
                            size={30}
                            color={medalColors[topThree[1].medal] || "#49a579"}
                          />
                        </Badge>
                        <Text>
                          {topThree[1]?.score} | {topThree[2]?.credit}
                        </Text>
                      </View>
                    ) : (
                      ""
                    )}
                  </View>
                  <View style={styles.stageContainer}>
                    {topThree[0] ? (
                      <View
                        style={[
                          styles.stage,
                          topThree[0].rank == 1
                            ? styles.firstPlace
                            : topThree[0].rank == 2
                            ? styles.secondPlace
                            : topThree[0].rank == 3
                            ? styles.thirdPlace
                            : styles.restPlcae,
                        ]}
                      >
                        <Text>{topThree[0]?.nickname}</Text>
                        <Avatar
                          bg="white"
                          mb="1"
                          size="md"
                          source={{ uri: topThree[0]?.avatar }}
                          style={{
                            position: "relative",
                            right: 5,
                          }}
                        />
                        <Badge
                          colorScheme="coolGray" // or use any other color scheme if needed
                          style={{
                            position: "absolute",
                            bottom: 30,
                            right: 10,
                            backgroundColor: "rgba(255,255,255,0)", // Set badge background color to the medal color
                            padding: 0, // Adjust padding if necessary
                          }}
                        >
                          <AntDesign
                            name="Trophy"
                            size={30}
                            color={medalColors[topThree[0].medal] || "#49a579"}
                          />
                        </Badge>
                        <Text>
                          {topThree[0]?.score} | {topThree[0]?.credit}
                        </Text>
                      </View>
                    ) : (
                      ""
                    )}
                  </View>
                  <View style={styles.stageContainer}>
                    {topThree[2] ? (
                      <View
                        style={[
                          styles.stage,
                          topThree[2].rank == 1
                            ? styles.firstPlace
                            : topThree[2].rank == 2
                            ? styles.secondPlace
                            : topThree[2].rank == 3
                            ? styles.thirdPlace
                            : styles.restPlcae,
                        ]}
                      >
                        <Text>{topThree[2]?.nickname}</Text>
                        <Avatar
                          bg="white"
                          mb="1"
                          size="md"
                          source={{ uri: topThree[2]?.avatar }}
                          style={{
                            position: "relative",
                            right: 5,
                          }}
                        />
                        <Badge
                          colorScheme="coolGray" // or use any other color scheme if needed
                          style={{
                            position: "absolute",
                            bottom: 30,
                            right: 10,
                            backgroundColor: "rgba(255,255,255,0)", // Set badge background color to the medal color
                            padding: 0, // Adjust padding if necessary
                          }}
                        >
                          <AntDesign
                            name="Trophy"
                            size={30}
                            color={medalColors[topThree[2].medal] || "#49a579"}
                          />
                        </Badge>

                        <Text>
                          {topThree[2]?.score} | {topThree[2]?.credit}
                        </Text>
                      </View>
                    ) : (
                      ""
                    )}
                  </View>
                </View>
              </Box>
              <Box height={"60%"}>
                <ScrollView style={styles.listContainer}>
                  <FlatList
                    data={rest}
                    keyExtractor={(item) => item.nickname}
                    renderItem={({ item, index }) => (
                      <View key={index} style={styles.playerItem}>
                        <View>
                          <Text style={styles.rankText}>{item.rank}th</Text>
                          <MaterialCommunityIcons
                            name="medal-outline"
                            size={25}
                            color={medalColors[item.medal] || "#49a579"}
                          />
                        </View>

                        <Avatar
                          bg="white"
                          mb="1"
                          size="md"
                          source={{ uri: item?.avatar }}
                        />
                        <Text>{item.nickname}</Text>
                        <Text>
                          {item.score} | {item.credit}
                        </Text>
                      </View>
                    )}
                  />
                </ScrollView>
              </Box>
              <Box height={"15%"}>
                {
                  rest.filter((item) => item.id === userData.data._id).length >
                  0
                    ? rest
                        .filter((item) => item.id === userData.data._id)
                        .map((item, index) => (
                          <View key={index} style={styles.placementContainer}>
                            <Text style={{ fontSize: 20, color: "#f9f8f2" }}>
                              {item.nickname}
                            </Text>
                            <Text
                              style={{
                                fontWeight: "bold",
                                fontSize: 20,
                                color: "#f9f8f2",
                              }}
                            >{`${index + 1}th  place`}</Text>
                            <Text
                              style={{
                                fontWeight: "bold",
                                fontSize: 20,
                                color: "#f9f8f2",
                              }}
                            >{`${item.score} | ${item.credit} `}</Text>
                          </View>
                        ))
                    : topThree
                        .filter((item) => item.id === userData.data._id)
                        .map((item, index) => (
                          <View key={index} style={styles.placementContainer}>
                            <Text style={{ fontSize: 20, color: "#f9f8f2" }}>
                              {item.nickname}
                            </Text>
                            <Text
                              style={{
                                fontWeight: "bold",
                                fontSize: 20,
                                color: "#f9f8f2",
                              }}
                            >{`${index + 1}th  place`}</Text>
                            <Text
                              style={{
                                fontWeight: "bold",
                                fontSize: 20,
                                color: "#f9f8f2",
                              }}
                            >{`${item.score} | ${item.credit} `}</Text>
                          </View>
                        )) // or you can replace null with some fallback JSX if needed
                }
              </Box>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      {/* <Modal isOpen={scoreBoardOpen} onClose={handleClose}>
        <Modal.Content maxWidth="400px" width="90%">
          <Modal.CloseButton />
          <Modal.Header>
            Score Board:{roundData.data[0] ? roundData.data[0]._id : ""}
          </Modal.Header>
          <Modal.Body>
            {roundData.data[0] ? (
              <View>
                {roundData.data[0].roundFriends.map((item) => {
                  return (
                    <View>
                      <Text>{item.nickname}</Text>
                      <Text>{item.score}</Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              ""
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal> */}
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

  background: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    height: "100%",
  },

  topThreeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  placementContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(102, 102, 255)",
    fontSize: 20,
    paddingHorizontal: "10%",
    paddingVertical: "8%",
    borderRadius: 10,
  },
  stageContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "rgba(205, 200, 200, 0.2)",
    paddingVertical: 20,
  },
  stage: {
    width: 110, // Example width
    height: 110, // Example height
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
    fontSize: 16,
  },
  firstPlace: {
    // backgroundColor: "rgba(205, 200, 200, 0.2)",
    backgroundColor: "rgba(255, 215, 0, 0.2)", // Gold in RGB
  },
  secondPlace: {
    backgroundColor: "rgba(192, 192, 192,0.2)",
  },
  thirdPlace: {
    backgroundColor: "rgba(205, 127, 50,0.2)", // Bronze
  },
  restPlcae: {
    backgroundColor: "rgba(73, 165, 121,0.2)",
  },
  rankText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  listContainer: {
    marginVertical: 20,
    height: "70%",
    borderRadius: 10,
    flex: 1,
    backgroundColor: "rgba(200, 200, 200, 0.2)",
  },
  playerItem: {
    borderRadius: 10,
    backgroundColor: "rgba(147, 216, 197, 0.5)",
    fontSize: 20,
    flexDirection: "row",
    paddingHorizontal: "10%",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 5,
    paddingVertical: 15,
  },
});
export default HomeScreen;
