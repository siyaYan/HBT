import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { Text, NativeBaseProvider, View } from "native-base";
import { getRoundInfo } from "../components/Endpoint";
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";
import Background from "../components/Background";

const RoundScoreScreen = ({ route, navigation }) => {
  const { userData } = useData();
  const { activeRoundData } = useRound();
  const roundId = route.params.id; // Safe access to route params
  const [sortedUsers, setSortedUsers] = useState([]);
  const [currentUserRank, setCurrentUserRank] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const currentUserId = userData.id; // Assuming userData contains the current user's id

  const getScoreBoard = async (roundId) => {
    try {
      console.log("Fetching round score:", userData.token, roundId);
      const res = await getRoundInfo(userData.token, roundId);
      if (res && res.data && res.data[0].roundFriends) {
        const activeUsers = res.data[0].roundFriends.filter(
          (user) => user.status === "A"
        );
        const sortedUsers = activeUsers.sort((a, b) => b.score - a.score);

        const currentUser = sortedUsers.find((user) => user.id === currentUserId);
        const currentUserRank = sortedUsers.findIndex((user) => user.id === currentUserId) + 1;

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
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={sortedUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={styles.userItem}>
              {/* Wrap text in <Text> components */}
              <Text style={styles.userNickname}>
                {index + 1 + "." +item.nickname}
              </Text>
              <Text style={styles.userScore}>{item.score}</Text>
            </View>
          )}
        />
      )}

      {/* {currentUserRank && (
        <View style={styles.currentUserContainer}>
          <Text style={styles.currentUserText}>
            You are ranked #{currentUserRank}
          </Text>
        </View>
      )} */}
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
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  userNickname: {
    fontSize: 16,
  },
  userScore: {
    fontSize: 16,
    fontWeight: "bold",
  },
  currentUserContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#d9f9d9",
    borderRadius: 5,
  },
  currentUserText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default RoundScoreScreen;
