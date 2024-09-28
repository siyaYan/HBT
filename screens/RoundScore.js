import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList,ScrollView } from "react-native";
import { Text, NativeBaseProvider, View } from "native-base";
import { getRoundInfo } from "../components/Endpoint";
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";
import Background from "../components/Background";
function calculateEndDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const RoundScoreScreen = ({ route, navigation }) => {
  const { userData } = useData();
  const { acceptRoundData } = useRound();
  const roundId = route.params.id; // Safe access to route params
  const [sortedUsers, setSortedUsers] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const round = acceptRoundData.data.find((r) => r._id === roundId);
  const startDate = new Date(round.startDate);
  const endDate = calculateEndDate(startDate, parseInt(round.level, 10));

const calculateDaysLeft = (endDate) => {
  console.log("end date",endDate);
  const today = new Date(); // Get today's date
  const end = new Date(endDate); // Parse the end date into a Date object

  // Calculate the time difference in milliseconds
  const timeDifference = end.getTime() - today.getTime();

  // Convert the time difference from milliseconds to days
  const daysLeft = Math.ceil(timeDifference / (1000 * 3600 * 24));

  return daysLeft;
};

const daysLeft = calculateDaysLeft(endDate);


  const currentUserId = userData.data._id; // Assuming userData contains the current user's id

  const getScoreBoard = async (roundId) => {
    try {
      console.log("Fetching round score:", userData.token, roundId);
      const res = await getRoundInfo(userData.token, roundId);
      if (res && res.data && res.data[0].roundFriends) {
        const activeUsers = res.data[0].roundFriends.filter(
          (user) => user.status === "A"
        );
        const sortedUsers = activeUsers.sort((a, b) => b.score - a.score);

        const currentUser = sortedUsers.find(
          (user) => user.id === currentUserId
        );
        const currentUserRank =
          sortedUsers.findIndex((user) => user.id === currentUserId) + 1;
        setSortedUsers(sortedUsers); // Set sorted users in state
        setCurrentUserRank(currentUserRank); // Set the current user's rank
        setLoading(false); // Set loading to false after data is fetched
      } else {
        console.log("No valid roundFriends data found.");
      }
    } catch (error) {
      console.error("Error fetching score board:", error);
      setLoading(false); // Set loading to false on error
    }
  };

  useEffect(() => {
    // Fetch scoreboard data on component mount
    getScoreBoard(roundId);
  }, [roundId]);

  return (
    <NativeBaseProvider>
      <Background />
      
       {/* Round Info Header */}
       <View style={styles.roundInfoCard}>
        {/* <Text style={styles.roundName}>{round.name}</Text> */}
        <Text style={styles.daysLeftText}>Days left: {daysLeft}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>

      {/* Entire List as a Single Card */}
      <View style={styles.cardContainer}>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={sortedUsers}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={styles.userItem}>
                <Text style={styles.userNickname}>
                  {index + 1 + ". " + item.nickname}
                </Text>
                <Text style={styles.userScore}>{item.score}</Text>
              </View>
            )}
          />
        )}
      </View>
      </ScrollView>

      {currentUserRank && (
        <View style={styles.currentUserContainer}>
          <Text style={styles.currentUserText}>
            {"You are ranked #" + currentUserRank}
          </Text>
        </View>
      )}
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1, // Ensure ScrollView takes the available space
    justifyContent: "center",
    paddingBottom: 20, // Padding for better scrolling experience
  },
  roundInfoCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4, // For Android shadow
    alignItems: "center",
  },
  listContainer: {
    flex: 1, // Ensure the FlatList takes up the remaining space
    marginTop: 10,
  },
  cardContainer: {
    backgroundColor: "#ffffff", // Card background color
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4, // For Android shadow
    flex: 1, // Allow the card to take up available space
  },
  roundName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  daysLeftText: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  userItem: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // For Android shadow
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userCard: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2, // For Android shadow
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userNickname: {
    fontSize: 16,
    color: "#333",
  },
  userScore: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
  },
  currentUserContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#6666ff",
    borderRadius: 5,
    width: "90%",
    alignSelf: "center",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  currentUserText: {
    fontSize: 16,
    color: "#f9f8f2",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RoundScoreScreen;
