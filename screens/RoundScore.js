import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
} from "react-native";
import {
  Box,
  Text,
  Button,
  NativeBaseProvider,
  Flex,
  View,
  Avatar,
  Badge,
} from "native-base";
import { getScoreBoard } from "../components/Endpoint";
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";
import Background from "../components/Background";

const RoundScoreScreen = ({ route, navigation }) => {
  const { userData } = useData();
  const { activeRoundData } = useRound();
  const { roundId } = route.params || {}; // Safe access to route params
  const [topThree, setTopThree] = useState([]);
  const [rest, setRest] = useState([]);

  const getExistScoreBoard = async (roundId) => {
    console.log("round score:----",userData.token, roundId)
    const res = await getScoreBoard(userData.token, roundId);
    if (res) {
      const topThree = res.data.ranking.slice(0, 3);
      const rest = res.data.ranking.slice(3);
      setRest(rest);
      setTopThree(topThree);
      return true;
    }
    return false;
  };
  const isBoardExit = getExistScoreBoard(roundId);
  return (
    <NativeBaseProvider>
      <Background />
      {isBoardExit ? (
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
            
          </Box>
          <Box height={"15%"}>
            {
              rest.filter((item) => item.id === userData.data._id).length > 0
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
                    ))
            }
          </Box>
        </View>
      ) : (
        <View>
          {" "}
          <Text>No score board available</Text>
        </View>
      )}
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

export default RoundScoreScreen;
