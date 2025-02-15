import { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Box, Text, Avatar, Badge, Modal } from "native-base";
import { useData } from "../context/DataContext";
import { getScoreBoard } from "../components/Endpoint";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AntDesign } from "@expo/vector-icons";

const ScoreBoardModal = ({ scoreBoardOpen, handleClose, roundId }) => {
  const [rest, setRest] = useState([]);
  const [topThree, setTopThree] = useState([]);
  // const [scoreBoardOpen, setScoreBoardOpen] = useState(false);
  const { userData } = useData();

  const medalColors = {
    Gold: "rgb(255, 215, 0)", // Gold in RGB
    Silver: "rgb(192, 192, 192)", // Silver in RGB
    Bronze: "rgb(205, 127, 50)", // Bronze in RGB
  };
  const getExistScoreBoard = async (roundId) => {
    console.log("getinscore", roundId);
    const res = await getScoreBoard(userData.token, roundId);
    if (res) {
      const topThree = res.data.ranking.slice(0, 3);
      const rest = res.data.ranking.slice(3);
      setRest(rest);
      setTopThree(topThree);
    }
  };
  // const handleClose = () => {
  //   setIsOpened(false);
  //   setScoreBoardOpen(false);
  //   // console.log("isOpened", isOpened);
  // };
  useEffect(() => {
    getExistScoreBoard(roundId);
  }, [scoreBoardOpen]);

  return (
    <View>
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
                {topThree.length == 2 ? (
                  <View style={styles.topThreeContainer}>
                    <View style={styles.stageContainer}>
                      <View style={[styles.stage, styles.firstPlace]}>
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
                    </View>
                    <View style={styles.stageContainer}>
                      <View
                        style={[
                          styles.stage,

                          topThree[1].rank == 1
                            ? styles.firstPlace
                            : styles.secondPlace,
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
                          {topThree[1]?.score} | {topThree[1]?.credit}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.topThreeContainer}>
                    {topThree[1] ? (
                      <View style={styles.stageContainer}>
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
                              color={
                                medalColors[topThree[1].medal] || "#49a579"
                              }
                            />
                          </Badge>
                          <Text>
                            {topThree[1]?.score} | {topThree[1]?.credit}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      ""
                    )}
                    {topThree[0] ? (
                      <View style={styles.stageContainer}>
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
                              color={
                                medalColors[topThree[0].medal] || "#49a579"
                              }
                            />
                          </Badge>
                          <Text>
                            {topThree[0]?.score} | {topThree[0]?.credit}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      ""
                    )}
                    {topThree[2] ? (
                      <View style={styles.stageContainer}>
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
                              color={
                                medalColors[topThree[2].medal] || "#49a579"
                              }
                            />
                          </Badge>

                          <Text>
                            {topThree[2]?.score} | {topThree[2]?.credit}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      ""
                    )}
                  </View>
                )}
              </Box>
              <Box height={"60%"}>
                <View style={styles.listContainer}>
                  <ScrollView
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
                </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 25,
  },
  stageContainer: {
    flex: 1,
    alignItems: "center",
    // flexDirection: "row",
    backgroundColor: "rgba(205, 200, 200, 0.2)",
    paddingVertical: 20,
  },
  stage: {
    width: 100, // Example width
    height: 100, // Example height
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
    fontSize: 16
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
    minHeight: 450,
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

export default ScoreBoardModal;
