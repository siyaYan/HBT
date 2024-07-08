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
} from "native-base";
import Background from "../components/Background";
import Icon from "react-native-vector-icons/Ionicons";
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";
import { useEffect } from "react";
import IconM from "react-native-vector-icons/MaterialIcons";

const RoundInfoScreen = ({ route, navigation }) => {
  const { userData } = useData();
  const { roundId } = route.params || {}; // Safe access to route params
  console.log("round info page round id", roundId);

  if (!roundId) {
    console.error("roundId is not defined");
    navigation.goBack(); // Navigate back if roundId is not available
    return null; // Render nothing while navigating back
  }

  const { roundData } = useRound();
  console.log("round context", roundData);

  const round = roundData.data.find((r) => r._id === roundId);
  console.log("roundinfo page round data:", round);

    // Update round info to RoundContext and DB
    useEffect(() => {
      // console.log("roundData updated___________", roundData);
    }, [roundData]);

  useEffect(() => {
    if (!round) {
      console.error("Round not found in roundData");
      navigation.navigate("MainStack", { screen: "Home" }); // Navigate to Home if round is not found
    }
  }, [round]);

  if (!round) {
    return null; // Render nothing if round is not found
  }

  // roundData.roundFriends
  // Read only
  // Feature: send notification again
  // const friendsList = [
  //   { id: "1", name: "John Doe" },
  //   { id: "2", name: "Jane Smith" },
  //   { id: "3", name: "William Johnson" },
  //   // Add more friends as needed
  // ];
  const friendsList = round.roundFriends;
  console.log("round friend list:", round.roundFriends);
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
  // Navigate to Round Config page
  const goRoundConfig = () => {
    navigation.navigate("RoundStack", {
      screen: "RoundConfig",
      params: { emptyState: false, roundId: roundId, source: "info" },
    });
  };

  const levelInt = parseInt(round.level, 10);
  const startDate = new Date(round.startDate);
  const endDate = new Date(
    startDate.getTime() + levelInt * 24 * 60 * 60 * 1000
  ); // Convert days to milliseconds

  return (
    <NativeBaseProvider>
      {/* <Center w="100%"> */}
      <Background />
      <Box flex={1} p={4}>
        <VStack space={4}>
          <HStack>
            <Heading size="lg" color="coolGray.800">
              {round.name}
            </Heading>
            {/* Edit round, which leads to Round Config page */}
            {round.userId == userData.data._id ? (
              <Box alignItems="center" justifyContent="center">
                <Button p={0} variant="unstyled" onPress={goRoundConfig}>
                  <Icon name="pencil" size={24} color="#000" /> {/* Pen icon */}
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

          {/* Friend list*/}
          {friendsList.length>0?
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
              item.status !== "R" ? (
                <View key={item.id} style={{ width: "95%", marginVertical: 5 }}>
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
                      <Icon name="checkmark-circle" size={24} color="green" /> // Active icon
                    ) : (
                      <Icon name="time" size={24} color="orange" /> // Pending icon
                    )}
                  </View>
                </View>
              ) : null
            )}
          </ScrollView>
          </View>
          :null}
        </VStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default RoundInfoScreen;
