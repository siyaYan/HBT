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
  getRoundInvitation,
} from "../components/Endpoint";
import { useRound } from "../context/RoundContext";
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/FontAwesome";

const HomeScreen = ({ navigation }) => {
  const today = new Date();

  const { userData, updateUserData, note, updateNotes } = useData();
  const { roundData, updateRoundData } = useRound();
  console.log("rounddata", roundData);
  //const animation = useRef(null);

  // Get screen dimensions
  const { width, height } = Dimensions.get("window");
  const updateNote = async () => {
    const res = await getNoteUpdate(userData.token, userData.data.email);
    if (res > 0) {
      updateNotes(res);
    }
  };
  const updateRoundContext = async () => {
    const newRoundData = await getRoundInfo(userData.token, userData._id); // Fetch latest round data
    updateRoundData(newRoundData); // Update context with new data
  };

  useEffect(() => {
    console.log("roundData updated on home page", roundData);
  }, [roundData]);

  useFocusEffect(
    useCallback(() => {
      console.log("call back", roundData);
      // This code runs when the tab comes into focus
      // console.log('Tab is in focus, userInfo:', userData);
      updateNote();
      updateRoundContext(); // Update round data when screen is focused

      //console.log(userData);
    }, [userData]) // Depend on `userInfo` to re-run the effect when it changes or the tab comes into focus
  );
  console.log("rounddata after callback", roundData);

  const handleAvatarPress = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate("AccountStack", { screen: "Account" });
  };

  {
    /* Round */
  }
  //Navigation
  const startRound = () => {
    // Navigate to round configuration when pressed
    navigation.navigate("RoundStack", {
      screen: "RoundConfig",
      params: { emptyState: true, source: "home" },
    });
    console.log("Home page", roundData);
  };

  const handleRoundPress = (roundId) => {
    // console.log('function, roundinfo:', round);
    navigation.navigate("RoundStack", {
      screen: "RoundInfo",
      params: { roundId },
    });
    console.log("home page roundId", roundId);
  };

  // Animated Envelope
  const [isOpened, setIsOpened] = useState(false);

  const handlePress = () => {
    setIsOpened(true);
    console.log("isOpened", isOpened);
    loadAllReceivedNotification();
  };

  const handleClose = () => {
    setIsOpened(false);
    console.log("isOpened", isOpened);
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

  const loadAllReceivedNotification = async() => {
    const receivedRoundInvitation = await getRoundInvitation(userData.token);
    console.log("----receivedroundinvitation",receivedRoundInvitation);
    if (receivedRoundInvitation.status === "success") {
      const pendingReceiverIds = receivedRoundInvitation.data
        .filter((invitation) => invitation.status === "P")
        .map((invitation) => invitation.receiverId);

      console.log(pendingReceiverIds);
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
      </Flex>
      {/* Linda Sprint 4 Show round/s*/}

      <Flex direction="column" alignItems="center">
        {roundData?.data?.map((round, index) => {
          //<View key={round._id} >
          const startDate = new Date(round.startDate);
          const timeDifference = startDate - today;
          const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

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
        })}
        {/* Linda Sprint 4 Start a round*/}
        {(!roundData.data || roundData?.data?.length < 2) && (
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
            {roundData?.data?.length === 1
              ? "Plan the next round"
              : "Start a round"}
          </Button>
        )}
      </Flex>
      {/* Round Notification Animation */}
      {/* <AnimatedEnvelope></AnimatedEnvelope> */}
      <View style={styles.envelopeContainer}>
        <TouchableOpacity onPress={handlePress}>
          <Icon name="envelope" size={50} color="#666" />
        </TouchableOpacity>
        <Modal isOpen={isOpened} onClose={handleClose} animationType="slide">
          <View style={[styles.modalContent, { width: width * 1 }]}>
            <Text>TODO: show a list of received notifications, a button to accept or reject.</Text>
            <Button onPress={handleClose}>Close</Button>
          </View>
        </Modal>
      </View>
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
