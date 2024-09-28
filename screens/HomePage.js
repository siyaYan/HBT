import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import OptionMenu from "../components/OptionMenu";
import Background from "../components/Background";
import {
  getScoreBoard,
  getNoteUpdate,
  getRoundInfo,
  getRoundInvitation,
  reactRoundRequest,
  updateRoundStatus,
} from "../components/Endpoint";
import { useRound } from "../context/RoundContext";
import Icon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Add this at the top of your file


// Function to add days to a date
function calculateEndDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function shouldRedirectToScoreBoard(startDate, level) {
  const start = new Date(startDate);
  const today = new Date();
  const duration = parseInt(level, 10);

  // Calculate halfway point and 1 week before end date
  const halfwayDate = new Date(start.getTime() + (duration / 2) * 24 * 60 * 60 * 1000);
  const endDate = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
  const oneWeekBeforeEndDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Check if today is Monday
  const isMonday = today.getDay() === 1; // 1 represents Monday

  // Check if today is halfway through, Monday, or 1 week before end
  const isHalfway = today.toDateString() === halfwayDate.toDateString();
  const isOneWeekLeft = today.toDateString() === oneWeekBeforeEndDate.toDateString();

  return isMonday || isHalfway || isOneWeekLeft;
}


const HomeScreen = ({ navigation }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [scoreBoardOpen, setScoreBoardOpen] = useState(false);
  const [showRoundDetails, setShowRoundDetails] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [pendingReceived, setPendingReceived] = useState([]);
  const [showRoundValidation, setShowRoundValidation] = useState(false);
  const [showRoundValidationDate, setShowRoundValidationDate] = useState(false);
  const [showRoundCompleteValidation, setShowRoundCompleteValidation]=useState(false);
  const [rest, setRest] = useState([]);
  const [topThree, setTopThree] = useState([]);
  const [roundInvitationData, setRoundInvitationData] = useState(null);

  const [processedRounds, setProcessedRounds] = useState(null);

  const [showRoundFriendValidation, setShowRoundFriendValidation] =
    useState(false);

  const handleCloseRoundFriendValidation = () => {
    setShowRoundFriendValidation(false);
  };
  const { userData, updateNotes } = useData();
  const { acceptRoundData, roundData, updateRounds } = useRound();

  // console.log("active round---", acceptRoundData);
  // Get screen dimensions
  const { width, height } = Dimensions.get("window");

  const medalColors = {
    Gold: "rgb(255, 215, 0)", // Gold in RGB
    Silver: "rgb(192, 192, 192)", // Silver in RGB
    Bronze: "rgb(205, 127, 50)", // Bronze in RGB
  };

  const [show10PerRoundValidation, setShow10PerRoundValidation] =
    useState(false);

  useFocusEffect(
    useCallback(() => {
      // This code runs when the tab comes into focus
      // console.log("Tab is in focus, userInfo:------------", userData);
      getRoundInvitationData();
      getRoundData();
    }, [userData]) // Depend on `userInfo` to re-run the effect when it changes or the tab comes into focus
  );

  useEffect(() => {
    // console.log("acceptRoundData----", acceptRoundData?.data[acceptRoundData.data.length - 1]?.roundFriends);
    const processing = processRounds(acceptRoundData.data, new Date());
    const sortedRounds = filterAndSortRounds(processing);
    setProcessedRounds(sortedRounds);
  }, [acceptRoundData]);
  


  const filterAndSortRounds = (rounds) => {
    
    // Step 1: Filter out "F" rounds
    const priorityRounds = rounds.filter((round) => round.round.status !== "F");
    // Step 2: Sort by priority of statuses and then by startDate
    const sortedPriorityRounds = priorityRounds.sort((a, b) => {
      const statusPriority = { P: 1, A: 2 }; // Prioritize "P" and "A"
      const statusA = statusPriority[a.status] || 3; // Default lower priority
      const statusB = statusPriority[b.status] || 3;
  
      if (statusA !== statusB) {
        return statusA - statusB; // Sort by status priority
      }
  
      // If statuses are the same, sort by startDate
      return new Date(a.startDate) - new Date(b.startDate);
    });
  
    // Step 3: If we have less than 2 rounds, include "F" rounds as fallback
    if (sortedPriorityRounds.length < 2) {
      const fallbackRounds = rounds.filter((round) => round.round.status === "F");
  
      sortedPriorityRounds.push(...fallbackRounds.slice(0, 2 - sortedPriorityRounds.length));
    }
  
    // Step 4: Return only the first 2 rounds
    return sortedPriorityRounds.slice(0, 2);
  };

  // useEffect(() => {
  //   // console.log("RoundData-------", roundData);
  // }, [roundData]);

  const getRoundInvitationData = async () => {
    const res = await getRoundInvitation(userData.token);
    setRoundInvitationData(res);
  };
  const getRoundData = async () => {
    const res = await getRoundInfo(userData.token, userData.data._id);
    updateRounds(res);
  };
  const handle10PerRoundValidationClose = () => {
    setShow10PerRoundValidation(!show10PerRoundValidation);
  };
  const handleCloseRoundCompleteValidation= () => {
    setShowRoundCompleteValidation(!showRoundCompleteValidation);
  };

  const handleAvatarPress = () => {
    navigation.navigate("AccountStack", { screen: "Account" });
  };

  const getExistScoreBoard = async (roundId) => {
    const res = await getScoreBoard(userData.token, roundId);
    if (res) {
      const topThree = res.data.ranking.slice(0, 3);
      const rest = res.data.ranking.slice(3);
      setRest(rest);
      setTopThree(topThree);
    }
  };

  const startRound = () => {
    navigation.navigate("RoundStack", {
      screen: "RoundConfig",
      params: { emptyState: true, source: "home", roundId: 0 },
    });
  };

  const handleRoundPress = async (roundId, status, startDate, level) => {
    try {
      const today = new Date().toDateString(); // Get today's date as a string
      const lastCheckedDate = await AsyncStorage.getItem(`lastCheck_${roundId}`);
  
      if (shouldRedirectToScoreBoard(startDate, level) && lastCheckedDate !== today) {
        // If it's Monday, halfway, or 1 week left, and hasn't been checked today
        await AsyncStorage.setItem(`lastCheck_${roundId}`, today); // Store today's date
        navigation.navigate("RoundStack", {
          screen: "RoundScore", // Navigate to ScoreBoard
          params: { id: roundId },
        });
      } else if (status === "A" || status === "F") {
        // Navigate to the forum for active rounds
        navigation.navigate("ForumStack", {
          screen: "ForumPage",
          params: { id: roundId },
        });
      } else {
        // Otherwise, navigate to the round info page
        navigation.navigate("RoundStack", {
          screen: "RoundInfo",
          params: { id: roundId },
        });
      }
    } catch (error) {
      console.error("Error handling round press:", error);
    }
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

  const findPendingReceived = () => {
    // console.log("----roundInvitationData", roundInvitationData);
    if (roundInvitationData && roundInvitationData.status === "success") {
      const pending = roundInvitationData.data.filter(
        (invitation) => invitation.status === "P"
      );
      setPendingReceived(pending);
    }
  };

  const loadAllReceivedNotification = () => {
    // console.log("----roundInvitationData---notification", roundInvitationData);
    findPendingReceived();
  };

  useEffect(() => {
    // Define the async function inside the useEffect
    const fetchData = async () => {
      // console.log("Fetching data-----", pendingReceived);
      // Ensure pendingReceived is valid and has data
      if (pendingReceived && pendingReceived.length > 0) {
        const pendingSenderIds = pendingReceived.map(
          (invitation) => invitation.senderId
        );

        let filteredRound = [];

        // Fetch invitation info and filter users
        const filtered = await Promise.all(
          pendingSenderIds.map(async (senderId, index) => {
            // Fetch invitation info and add to filteredRound
            const roundInfo = await fetchRoundInfo(index);
            filteredRound.push(roundInfo);

            // Find the user matching the senderId
            return roundInvitationData.users.find(
              (user) => user._id === senderId
            );
          })
        );

        // Once all promises are resolved, update the state
        setFilteredUsers({ filtered, filteredRound });
        // filteredUsers.filtered
      }
    };

    // Call the async function immediately
    fetchData();

    // Optional clean-up function can be returned here if needed
  }, [pendingReceived]); // The effect runs when pendingReceived changes

  const fetchRoundInfo = async (i) => {
    const thisRoundId = roundInvitationData.data[i].roundId;

    const aRoundInfo = await getRoundInfo(userData.token, thisRoundId);
    // setThisRoundInfo(aRoundInfo);
    return aRoundInfo;
  };
  const openRoundInvitationInfo = () => {
    setShowRoundDetails(!showRoundDetails);
  };

  const acceptRoundFriend = async (i, thisRoundInfo) => {
    console.log("thisRoundInfo calling acceptRoundFriend:", thisRoundInfo);

    // Validation first
    if(thisRoundInfo.data[0].status =="F"){
      setShowRoundCompleteValidation(!showRoundCompleteValidation);
      rejectRoundFriend(i);
      return;
    }
    thisRoundStartDate = new Date(thisRoundInfo.data[0].startDate);
    // check the round info, if it starts more than 10% of level:
    // show warning message, then remove invitation(reject)
    const thisRoundLevelInt = parseInt(thisRoundInfo.data[0].level, 10);
    const endDate10Percent = new Date(
      thisRoundStartDate.getTime() +
        thisRoundLevelInt * 24 * 60 * 60 * 1000 * 0.1
    ); // Convert days to milliseconds
    const today = new Date();

    if (today > endDate10Percent) {
      setShow10PerRoundValidation(!show10PerRoundValidation);
      rejectRoundFriend(i);
      return;
    }
    // 2 round already, then warning, keep the invitation
    if (
      acceptRoundData?.data.filter(
        (item) => item.status == "A" || item.status == "P"
      ).length == 2
    ) {
      setShowRoundValidation(!showRoundValidation);
      return;
    }
    // 1 active, check start date if it is before the active round ends
    else if (
      acceptRoundData?.data.filter(
        (item) => item.status == "A" || item.status == "P"
      ).length == 1
    ) {
      const activeRound = acceptRoundData[0];
      if (activeRound?.status == "A") {
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
    // setFilteredUsers((currentReceived) => [
    //   ...currentReceived.slice(0, i - 1),
    //   ...currentReceived.slice(i),
    // ]);
    setFilteredUsers((currentReceived) => ({
      ...currentReceived, // Spread the current state
      filtered: [
        ...currentReceived.filtered.slice(0, i - 1), // Keep items before index i
        ...currentReceived.filtered.slice(i), // Keep items after index i
      ],
      filteredRound: [
        ...currentReceived.filteredRound.slice(0, i - 1), // Keep items before index i
        ...currentReceived.filteredRound.slice(i), // Keep items after index i
      ],
    }));
    setPendingReceived((currentReceived) => [
      ...currentReceived.slice(0, i - 1),
      ...currentReceived.slice(i),
    ]);
    const id = pendingReceived[i - 1]._id;
    const res = reactRequest(id, "A"); //update round invitation data
    if (res) {
      console.log("react request success");
      const RoundInfoList = await getRoundInfo(
        userData.token,
        userData.data._id
      );
      console.log(
        "last roundfrinedlist",
        RoundInfoList.data[RoundInfoList.data.length - 1].roundFriends
      );
      updateRounds(RoundInfoList);
    }
    getRoundInvitationData();
    // show the new accepted round on it
    //Insert this new accepted round into round context directly
  };

  const rejectRoundFriend = (i) => {
    console.log("reject round Friend,delete current notification");
    // setFilteredUsers((currentReceived) => [
    //   ...currentReceived.slice(0, i - 1),
    //   ...currentReceived.slice(i),
    // ]);
    setFilteredUsers((currentReceived) => ({
      ...currentReceived, // Spread the current state
      filtered: [
        ...currentReceived.filtered.slice(0, i - 1), // Keep items before index i
        ...currentReceived.filtered.slice(i), // Keep items after index i
      ],
      filteredRound: [
        ...currentReceived.filteredRound.slice(0, i - 1), // Keep items before index i
        ...currentReceived.filteredRound.slice(i), // Keep items after index i
      ],
    }));
    setPendingReceived((currentReceived) => [
      ...currentReceived.slice(0, i - 1),
      ...currentReceived.slice(i),
    ]);
    const id = pendingReceived[i - 1]._id;
    reactRequest(id, "R");
    getRoundInvitationData();
  };

  const reactRequest = async (id, react) => {
    const response = await reactRoundRequest(userData.token, id, react);
    if (!response) {
      console.log("react request failed");
    }
    if (response.status == "success") {
      console.log("react request success:", response);
      return true;
    } else {
      console.error("react request failed:", response.message);
      return false;
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
      console.log("", response);
      // if (!response.ok) {
      //   throw new Error("Failed to update status");
      // }
      //If this is a newly finsihed round, calculate the scoreboard and show up
      if (newStatus === "F") {
        console.log("Round finished, get scoreboard");
        getExistScoreBoard(roundId);
        setScoreBoardOpen(true);
      }

      console.log("Status updated successfully");
    } catch (error) {
      console.error("Failed to update status and date:", error);
    }
  };

  const processRounds = (rounds, today) => {
    const newRound = rounds.map((round, index) => {
      const startDate = new Date(round.startDate);
      const timeDifference = startDate - today;
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      const endDate = calculateEndDate(startDate, parseInt(round.level, 10));
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
      } else if (
        daysDifference <= 0 &&
        endTimeDifference > 0 &&
        round.status !== "A"
      ) {
        // validate if there is any active friend
        setShowRoundFriendValidation(!showRoundFriendValidation);
        updateStatusAndDate(round._id, "A");
      }

      const prefix = timeDifference > 0 ? "D-" : "D+";
      const formattedDifference = `${prefix}${Math.abs(daysDifference)} days`;
      return {
        round,
        index,
        startDate,
        formattedDifference,
      };
    });
    return newRound;
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
        {processedRounds?.map(
          ({ round, index, startDate, formattedDifference }) => {
            return (
              <Button
                key={index}
                title={`Round ${index + 1}`}
                onPress={() => {
                  handleRoundPress(round._id, round.status, round.startDate, round.level);
                }}
                rounded="30"
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
                    ? "rgba(0,0,0,0.4)"
                    : "rgba(250,250,250,0.2)"
                }
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
                  {round?.name}
                </Text>
                {(round.status === "P" || round.status === "R") && (
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
            );
          }
        )}

        {/* Linda Sprint 4 Start a round*/}
        {(!acceptRoundData ||
          acceptRoundData?.data.filter(
            (item) => item.status == "A" || item.status == "P"
          ).length < 2) && (
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
            {acceptRoundData?.data.filter(
              (item) => item.status == "A" || item.status == "P"
            ).length === 1
              ? "Plan the next round"
              : "Start a round"}
          </Button>
        )}

        {/* Just for testing TODO: this button need to be on Round card */}
        {/* <Box py="5" px="2" alignItems="center" justifyContent="center">
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
        </Box> */}
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
            {filteredUsers?.filtered?.length > 0 ? (
              <Box w={"95%"}>
                {filteredUsers?.filtered?.map((item, index) => {
                  return (
                    <HStack
                      w={"100%"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                      m={1}
                      key={index}
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
                          onPress={() => openRoundInvitationInfo()}
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
                              {filteredUsers.filteredRound[index] &&
                                filteredUsers.filteredRound[index].data && (
                                  <>
                                    <Text fontSize="md">
                                      Round Name:{" "}
                                      {
                                        filteredUsers.filteredRound[index]
                                          .data[0]?.name
                                      }
                                    </Text>

                                    <Text fontSize="md">
                                      Start Date:{" "}
                                      {new Date(
                                        filteredUsers.filteredRound[
                                          index
                                        ].data[0]?.startDate
                                      ).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                      })}
                                    </Text>
                                    <Text fontSize="md">
                                      Level:{" "}
                                      {
                                        filteredUsers.filteredRound[index]
                                          .data[0]?.level
                                      }
                                    </Text>
                                    <Text fontSize="md">
                                      Maximum Capacity:{" "}
                                      {
                                        filteredUsers.filteredRound[index]
                                          .data[0]?.maximum
                                      }
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
                              filteredUsers.filteredRound[index]
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
        <Modal.Content maxWidth="400px" width="90%" height={"95%"}>
          <Modal.CloseButton />
          <Modal.Body>
            <View>
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

      <Modal
        isOpen={show10PerRoundValidation}
        onClose={handle10PerRoundValidationClose}
      >
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Warning</Modal.Header>
          <Modal.Body>
            <>
              <Text fontSize="md">
                The round is already 10% complete. You are no longer allowed to
                join.
              </Text>
            </>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Modal
        isOpen={showRoundFriendValidation}
        onClose={handleCloseRoundFriendValidation}
      >
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Warning</Modal.Header>
          <Modal.Body>
            <>
              <Text fontSize="md">
                Your friend hasn't accepted the invitation yet. Without
                participants, this round risks deletion. Please remind your
                friend to accept the invitation to keep the round active.{" "}
              </Text>
            </>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={showRoundCompleteValidation}
        onClose={handleCloseRoundCompleteValidation}
      >
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Warning</Modal.Header>
          <Modal.Body>
            <>
              <Text fontSize="md">
                This round is complete.{" "}
              </Text>
            </>
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
