import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Box,
  Text,
  Button,
  NativeBaseProvider,
  Flex,
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
import {
  getNoteUpdate,
  getRoundInfo,
  getRoundInvitation,
  reactRoundRequest,
  updateRoundStatus,
  // createNotification,
} from "../components/Endpoint";
import { useRound } from "../context/RoundContext";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Add this at the top of your file
import ScoreBoardModal from "../components/ScoreBoard";
import { SvgXml } from "react-native-svg"; // Import SvgXml to use custom SVGs

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
  const halfwayDate = new Date(
    start.getTime() + (duration / 2) * 24 * 60 * 60 * 1000
  );
  const endDate = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
  const oneWeekBeforeEndDate = new Date(
    endDate.getTime() - 7 * 24 * 60 * 60 * 1000
  );

  // Check if today is Monday
  const isMonday = today.getDay() === 1; // 1 represents Monday

  // Check if today is halfway through, Monday, or 1 week before end
  const isHalfway = today.toDateString() === halfwayDate.toDateString();
  const isOneWeekLeft =
    today.toDateString() === oneWeekBeforeEndDate.toDateString();

  return isMonday || isHalfway || isOneWeekLeft;
}

const HomeScreen = ({ navigation }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [scoreBoardOpen, setScoreBoardOpen] = useState(false);
  const [showRoundDetails, setShowRoundDetails] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [showRoundValidation, setShowRoundValidation] = useState(false);
  const [showRoundValidationDate, setShowRoundValidationDate] = useState(false);
  const [showRoundCompleteValidation, setShowRoundCompleteValidation] =
    useState(false);

  const [pendingReceived, setPendingReceived] = useState([]);

  const [processedRounds, setProcessedRounds] = useState(null);

  const [showRoundFriendValidation, setShowRoundFriendValidation] =
    useState(false);

  const handleCloseRoundFriendValidation = () => {
    setShowRoundFriendValidation(false);
  };
  const { userData, updateNotes } = useData();
  const { acceptRoundData, roundData, updateRounds } = useRound();

  const { width, height } = Dimensions.get("window");
  const [showFinalScore, setShowFinalScore] = useState(null);

  // const medalColors = {
  //   Gold: "rgb(255, 215, 0)", // Gold in RGB
  //   Silver: "rgb(192, 192, 192)", // Silver in RGB
  //   Bronze: "rgb(205, 127, 50)", // Bronze in RGB
  // };
  

  const [show10PerRoundValidation, setShow10PerRoundValidation] =
    useState(false);

  // const updateNote = async () => {
  //   const res = await getNoteUpdate(userData.token, userData.data.email);
  //   // if (res > 0) {
  //   updateNotes(res);
  //   // }
  // };
  useFocusEffect(
    useCallback(() => {
      // This code runs when the tab comes into focus
      // console.log("Tab is in focus, userInfo:------------", userData);
      getRoundInvitationData();
      getRoundData();
      // updateNote();
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
      const fallbackRounds = rounds.filter(
        (round) => round.round.status === "F"
      );

      sortedPriorityRounds.push(
        ...fallbackRounds.slice(0, 2 - sortedPriorityRounds.length)
      );
    }

    // Step 4: Return only the first 2 rounds
    return sortedPriorityRounds.slice(0, 2);
  };

  const getRoundInvitationData = async () => {
    const res = await getRoundInvitation(userData.token);
    const pending = res?.data.filter((invitation) => invitation.status === "P");
    setPendingReceived(pending);
  };

  const getRoundData = async () => {
    const res = await getRoundInfo(userData.token, userData.data._id);
    updateRounds(res);
  };

  const handle10PerRoundValidationClose = () => {
    setShow10PerRoundValidation(!show10PerRoundValidation);
  };

  const handleCloseRoundCompleteValidation = () => {
    setShowRoundCompleteValidation(!showRoundCompleteValidation);
  };

  const handleAvatarPress = () => {
    navigation.navigate("AccountStack", { screen: "Account" });
  };

  // const getExistScoreBoard = async (roundId) => {
  //   const res = await getScoreBoard(userData.token, roundId);
  //   if (res) {
  //     const topThree = res.data.ranking.slice(0, 3);
  //     const rest = res.data.ranking.slice(3);
  //     setRest(rest);
  //     setTopThree(topThree);
  //   }
  // };

  const startRound = () => {
    navigation.navigate("RoundStack", {
      screen: "RoundConfig",
      params: { emptyState: true, source: "home", roundId: 0 },
    });
  };

  const handleRoundPress = async (roundId, status, startDate, level) => {
    try {
      const today = new Date().toDateString(); // Get today's date as a string
      const lastCheckedDate = await AsyncStorage.getItem(
        `lastCheck_1${roundId}`
      );

      if (
        shouldRedirectToScoreBoard(startDate, level) &&
        lastCheckedDate !== today &&
        (status === "A" || status === "F")
      ) {
        // If it's Monday, halfway, or 1 week left, and hasn't been checked today
        await AsyncStorage.setItem(`lastCheck_1${roundId}`, today); // Store today's date
        navigation.navigate("RoundStack", {
          screen: "RoundScore", // Navigate to ScoreBoard
          params: { id: roundId, isFromHome: true },
        });
      } else if (status === "A" || status === "F") {
        // Navigate to the forum for active rounds
        navigation.navigate("ForumStack", {
          screen: "ForumPage",
          params: { id: roundId, isFromHome: true },
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

  const handlePress = async () => {
    let filteredRound = [];
    let filteredUsers = [];
    const filtering = await Promise.all(
      pendingReceived.map(async (invitation) => {
        const round = await fetchRoundInfo(invitation.roundId);
        filteredRound.push(round);
        filteredUsers.push(
          round.data[0].roundFriends?.find(
            (user) => user.id === invitation.senderId
          )
        );
      })
    );
    // console.log("filteredUsers", filteredUsers);
    setFilteredUsers({ filtered: filteredUsers, filteredRound });
    setIsOpened(true);
  };

  const handleClose = () => {
    setIsOpened(false);
    setScoreBoardOpen(false);
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

  // const findPendingReceived = () => {
  //   // console.log("----roundInvitationData", roundInvitationData);
  //   if (roundInvitationData && roundInvitationData.status === "success") {
  //     const pending = roundInvitationData.data.filter(
  //       (invitation) => invitation.status === "P"
  //     );
  //     setPendingReceived(pending);
  //   }
  // };

  // const loadAllReceivedNotification = () => {
  //   // console.log("----roundInvitationData---notification", roundInvitationData);
  //   findPendingReceived();
  // };

  useEffect(() => {
    // const filteredRound = pendingReceived.map(
    //   (invitation) => {return await fetchRoundInfo(invitation.roundId)}
    // );
    // const filtered = filteredRound.map(item=>{
    //   return roundInfo.users.find(
    //     (user) => user._id === item.senderId
    //   )}
    // );

    // setFilteredUsers({ filtered, pendingReceived });
    // console.log('update the envelope',filteredUsers)
    if (pendingReceived.length > 0) {
      console.log("update the envelope open");
    } else {
      setIsOpened(false);
      console.log("update the envelope close");
    }
    // Optional clean-up function can be returned here if needed
  }, [pendingReceived]); // The effect runs when pendingReceived changes

  const fetchRoundInfo = async (roundId) => {
    const thisRoundId = roundId;

    const aRoundInfo = await getRoundInfo(userData.token, thisRoundId);
    // setThisRoundInfo(aRoundInfo);
    return aRoundInfo;
  };

  const openRoundInvitationInfo = () => {
    setShowRoundDetails(!showRoundDetails);
  };

  const acceptRoundFriend = async (i, thisRoundInfo) => {
    // console.log("thisRoundInfo calling acceptRoundFriend:", thisRoundInfo);

    // 1. validate the new round status
    if (thisRoundInfo.data[0].status == "F") {
      setShowRoundCompleteValidation(!showRoundCompleteValidation);
      rejectRoundFriend(i);
      return;
    }
    thisRoundStartDate = new Date(thisRoundInfo.data[0].startDate);

    // 2. validate the new round 10%
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

    // 3. validate owned rounds
    unFinishedRound = acceptRoundData?.data.filter(
      (item) => item.status == "A" || item.status == "P"
    );
    // 2 round already, then warning, keep the invitation
    if (unFinishedRound.length >= 2) {
      setShowRoundValidation(!showRoundValidation);
      return;
    } else {
      // 1 active or pending round, check Start date if it is before the active round ends
      if (unFinishedRound.length == 1) {
        const acceptRound = unFinishedRound[0];
        //no matter active or pending round, both validate the time overlap
        const levelInt = parseInt(acceptRound.level, 10);
        const startDate = new Date(acceptRound.startDate);
        const endDate = new Date(
          startDate.getTime() + levelInt * 24 * 60 * 60 * 1000
        );
        if (thisRoundStartDate < endDate) {
          setShowRoundValidationDate(!showRoundValidationDate);
          return;
        }
      }
      // no accept round
      // console.log("accept round Friend,delete current notification");
      // 4. accept the round invitation
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
      // getRoundInvitationData();
    }
  };

  const rejectRoundFriend = (i) => {
    // console.log("reject round Friend,delete current notification");
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
    // getRoundInvitationData();
  };

  const reactRequest = async (id, react) => {
    const response = await reactRoundRequest(userData.token, id, react);
    if (!response) {
      console.log("react request was unsucessful.");
    }
    if (response.status == "success") {
      console.log("react request success:", response);
      return true;
    } else {
      console.error("react request was unsucessful.:", response.message);
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
      //   throw new Error("was unsucessful. to update status");
      // }
      //If this is a newly finsihed round, calculate the scoreboard and show up
      if (newStatus === "F") {
        console.log("Round finished, get scoreboard");
        // getExistScoreBoard(roundId);
        setShowFinalScore(roundId);
        setScoreBoardOpen(true);
      }

      console.log("Status updated successfully");
    } catch (error) {
      console.error("was unsucessful. to update status and date:", error);
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
        // console.log('-----111',round)
        const activeFriend = round.roundFriends.filter(
          (item) => item.id != round.userId && item.status == "A"
        ).length;
        if (activeFriend == 0) setShowRoundFriendValidation(true);
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
                  handleRoundPress(
                    round._id,
                    round.status,
                    round.startDate,
                    round.level
                  );
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
            left: width / 2 - 175,
          },
        ]}
      >
        {/* <Icon name="envelope" size={300} color="#606060" /> */}
        {isOpened ? (
          <SvgXml
            xml={RoundInvitationNewMessage}
            opacity="0.5"
            width={350}
            height={350}
          />
        ) : (
          <SvgXml
            xml={
              pendingReceived.length > 0
                ? RoundInvitationBefore
                : RoundInvitationAfter
            }
            opacity={pendingReceived.length > 0 ? 1 : 0.8}
            width={350}
            height={350}
          />
        )}
      </TouchableOpacity>

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
                      {item.avatar ? (
                        <Avatar
                          bg="white"
                          mb="1"
                          size={"md"}
                          source={{ uri: item.avatar }}
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
                            {/* <Modal.Header>Round Details</Modal.Header> */}
                            <Modal.Body
                              style={{
                                marginHorizontal: 10,
                                marginVertical: 20,
                              }}
                            >
                              {filteredUsers.filteredRound[index] &&
                                filteredUsers.filteredRound[index].data && (
                                  <>
                                    <Text fontSize="md">
                                      Round name:{" "}
                                      {
                                        filteredUsers.filteredRound[index]
                                          .data[0]?.name
                                      }
                                    </Text>

                                    <Text fontSize="md">
                                      Start date:{" "}
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
                                      Maximum capacity:{" "}
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
                                  You already have two active rounds. Unable to
                                  accept another.
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
                                  You cannot join a round that overlaps with
                                  your current active round.
                                </Text>
                              </>
                            </Modal.Body>
                          </Modal.Content>
                        </Modal>

                        <TouchableOpacity
                          onPress={() =>
                            acceptRoundFriend(
                              1,
                              filteredUsers.filteredRound[index]
                            )
                          }
                        >
                          <SvgXml xml={ReadAllNoti} width={30} height={30} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => rejectRoundFriend(1)}>
                          <SvgXml xml={Decline} width={30} height={30} />
                        </TouchableOpacity>
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
      {showFinalScore && (
        <ScoreBoardModal
          scoreBoardOpen={scoreBoardOpen}
          handleClose={handleClose}
          roundId={showFinalScore}
        />
      )}

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
                Your friend has not accepted the invitation yet. Remind them to
                keep the round active or it may be deleted.{" "}
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
              <Text fontSize="md">This round has already been completed. </Text>
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

const RoundInvitationBefore = `
<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">

<path fill="#93D8C5"  d="M15.01,35.39c4.84,4.13,9.47,8.07,14.09,12.02c6.07,5.18,12.14,10.36,18.21,15.53c1.95,1.66,3.5,1.62,5.53-0.12
	c10.38-8.88,20.76-17.76,31.14-26.64c0.27-0.23,0.55-0.45,0.95-0.77c0.03,0.44,0.06,0.74,0.06,1.05c0,11.59,0,23.17,0,34.76
	c0,2.6-1.38,3.98-3.98,3.98c-20.66,0-41.32,0-61.97,0c-2.66,0-4.02-1.37-4.02-4.05c0-11.51,0-23.03,0-34.54
	C15.01,36.29,15.01,35.97,15.01,35.39z"/>

<path fill="#93D8C5"   d="M81.59,33.64c-10.28,8.8-20.57,17.61-30.94,26.48c-0.37,0.32-0.92,0.32-1.29,0L18.35,33.57
	c-0.44-0.37-0.57-0.97-0.34-1.45c0.22-0.45,0.81-0.6,1.04-0.65c1.91-0.44,21.73-0.08,25.17-0.02c12.21,0,24.41,0.01,36.62,0.01
	c0.46,0.01,0.88,0.25,1.09,0.64C82.17,32.6,82.04,33.24,81.59,33.64z"/>

<path fill="#FF061E" d="M53.59,57.18c-1.75-1.27-4.3-1.65-5.34-0.88c-0.1,0.07-0.34,0.27-0.7,0.45c-0.16-0.8-1.34-5.75-6.66-7.06
	c0.19-0.41,0.48-0.76,0.93-0.97c0.22-0.1,0.31-0.35,0.21-0.57c-0.1-0.22-0.36-0.31-0.57-0.21c-2.31,1.05-1.68,4.43-1.65,4.57
	c0.04,0.21,0.22,0.35,0.42,0.35c0.03,0,0.06,0,0.08-0.01c0.23-0.05,0.39-0.27,0.34-0.51c0-0.02-0.17-0.91-0.02-1.82
	c5.23,1.26,6.04,6.25,6.07,6.47c0,0.02,0.01,0.04,0.01,0.06c-0.46,0.11-0.82,0.09-0.95,0.1c-1.34,0.07-3.94,3.46-3.14,6.83
	c0.72,3.02,3.88,4.81,6.71,4.73c3.52-0.1,6.66-3.08,6.76-6.42C56.18,60.36,55.24,58.37,53.59,57.18z"/>
</svg>
`;

const RoundInvitationAfter = `
<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">

<path fill="#93D8C5" d="M15.01,35.39c4.84,4.13,9.47,8.07,14.09,12.02c6.07,5.18,12.14,10.36,18.21,15.53c1.95,1.66,3.5,1.62,5.53-0.12
	c10.38-8.88,20.76-17.76,31.14-26.64c0.27-0.23,0.55-0.45,0.95-0.77c0.03,0.44,0.06,0.74,0.06,1.05c0,11.59,0,23.17,0,34.76
	c0,2.6-1.38,3.98-3.98,3.98c-20.66,0-41.32,0-61.97,0c-2.66,0-4.02-1.37-4.02-4.05c0-11.51,0-23.03,0-34.54
	C15.01,36.29,15.01,35.97,15.01,35.39z"/>

<path fill="#93D8C5" d="M81.59,33.64c-10.28,8.8-20.57,17.61-30.94,26.48c-0.37,0.32-0.92,0.32-1.29,0L18.35,33.57
	c-0.44-0.37-0.57-0.97-0.34-1.45c0.22-0.45,0.81-0.6,1.04-0.65c1.91-0.44,21.73-0.08,25.17-0.02c12.21,0,24.41,0.01,36.62,0.01
	c0.46,0.01,0.88,0.25,1.09,0.64C82.17,32.6,82.04,33.24,81.59,33.64z"/>

<path fill="gray" d="M53.59,57.18c-1.75-1.27-4.3-1.65-5.34-0.88c-0.1,0.07-0.34,0.27-0.7,0.45c-0.16-0.8-1.34-5.75-6.66-7.06
	c0.19-0.41,0.48-0.76,0.93-0.97c0.22-0.1,0.31-0.35,0.21-0.57c-0.1-0.22-0.36-0.31-0.57-0.21c-2.31,1.05-1.68,4.43-1.65,4.57
	c0.04,0.21,0.22,0.35,0.42,0.35c0.03,0,0.06,0,0.08-0.01c0.23-0.05,0.39-0.27,0.34-0.51c0-0.02-0.17-0.91-0.02-1.82
	c5.23,1.26,6.04,6.25,6.07,6.47c0,0.02,0.01,0.04,0.01,0.06c-0.46,0.11-0.82,0.09-0.95,0.1c-1.34,0.07-3.94,3.46-3.14,6.83
	c0.72,3.02,3.88,4.81,6.71,4.73c3.52-0.1,6.66-3.08,6.76-6.42C56.18,60.36,55.24,58.37,53.59,57.18z"/>
</svg>
`;

const RoundInvitationNewMessage = `
<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">

<path fill="#93D8C5" d="M20.77,34.47c10.28-8.8,20.57-17.61,30.94-26.48c0.37-0.32,0.92-0.32,1.29,0l31.01,26.55
	c0.44,0.37,0.57,0.97,0.34,1.45c-0.22,0.45-0.81,0.6-1.04,0.65c-1.91,0.44-21.73,0.08-25.17,0.02c-12.21,0-24.41-0.01-36.62-0.01
	c-0.46-0.01-0.88-0.25-1.09-0.64C20.19,35.5,20.31,34.87,20.77,34.47z"/>

<path fill="#FF061E" d="M61.76,42.01c-3.71-2.69-9.13-3.49-11.33-1.88c-0.22,0.16-0.71,0.57-1.49,0.96
	c-0.33-1.7-2.84-12.21-14.14-14.99c0.4-0.87,1.02-1.62,1.98-2.06c0.46-0.21,0.66-0.75,0.46-1.21c-0.21-0.46-0.76-0.66-1.21-0.46
	c-4.91,2.23-3.56,9.4-3.5,9.71c0.09,0.44,0.47,0.74,0.9,0.74c0.06,0,0.12-0.01,0.18-0.02c0.5-0.1,0.82-0.58,0.72-1.08
	c-0.01-0.03-0.36-1.92-0.04-3.87c11.09,2.67,12.82,13.27,12.89,13.74c0.01,0.04,0.02,0.08,0.03,0.12c-0.99,0.23-1.74,0.2-2.02,0.22
	c-2.85,0.14-8.37,7.34-6.66,14.49c1.53,6.4,8.23,10.21,14.25,10.04c7.46-0.21,14.13-6.54,14.35-13.64
	C67.25,48.77,65.25,44.55,61.76,42.01z"/>

<path fill="#93D8C5" d="M87.38,45.47c0-2.32,0-4.63,0-6.95c0-0.31-0.03-0.61-0.06-1.05c-4.96,1.39-11.42,3.74-18.36,7.82
c-7.39,4.34-12.83,9.18-16.55,13.02c-4.22-4.09-10.15-9.03-17.98-13.46c-6.29-3.56-12.17-5.87-17.03-7.39c0,9.51,0,19.02,0,28.54
c-0.22,3.05-0.13,5.5,0,7.22c0.09,1.15,0.22,2.24,1.03,3.04c0.67,0.67,1.67,1.01,3,1.01c20.66,0,41.32,0,61.97,0
c2.6,0,3.98-1.38,3.98-3.98c0-2.4,0-4.8,0-7.2c0,0,0,0,0-0.01C87.42,63.8,87.44,56.2,87.38,45.47z"/>
</svg>
`;

const Decline = `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#000;stroke-width:0px;}</style></defs><path class="cls-1" d="M25,45.47c-11.29,0-20.47-9.18-20.47-20.47S13.71,4.53,25,4.53s20.47,9.18,20.47,20.47-9.18,20.47-20.47,20.47ZM25,8.53c-9.08,0-16.47,7.39-16.47,16.47s7.39,16.47,16.47,16.47,16.47-7.39,16.47-16.47-7.39-16.47-16.47-16.47Z"/><rect class="cls-1" x="14.7" y="22.97" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(24.81 60.35) rotate(-134.69)"/><rect class="cls-1" x="14.7" y="22.9" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(60.31 25.08) rotate(135.31)"/></svg>`;
const ReadAllNoti = `<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
  <path fill="#191919" d="M25,45.47c-11.29,0-20.47-9.18-20.47-20.47S13.71,4.53,25,4.53s20.47,9.18,20.47,20.47-9.18,20.47-20.47,20.47ZM25,8.53c-9.08,0-16.47,7.39-16.47,16.47s7.39,16.47,16.47,16.47,16.47-7.39,16.47-16.47-7.39-16.47-16.47-16.47Z"/>
  <rect fill="#191919" x="13.98" y="26.52" width="11.88" height="4.07" rx="2.03" ry="2.03" transform="translate(28.16 -5.28) rotate(48.58)"/>
  <rect fill="#191919" x="17.29" y="22.97" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(64.26 18.56) rotate(127.86)"/>
</svg>`;
