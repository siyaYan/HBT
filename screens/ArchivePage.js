import { Center, Box, Flex,Text, View , Button} from "native-base";
import { useState, useEffect } from "react";
import React, { useRef } from "react";
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";
import { Card } from "@ant-design/react-native";
import Background from "../components/Background";
import { ScrollView } from "react-native";

const ArchivePage = ({ navigation }) => {
  const { userData } = useData();
  const { roundData } = useRound();
  const scrollViewRef = useRef(null);
  const [archivedRounds, setArchivedRounds] = useState([]);
  const [contentHeight, setContentHeight] = useState(0);
  const generateCards = () => {
    const finishedRound = roundData.data.filter((item) => item.status == "F");
    const roundList = [];
    finishedRound.map((item) => {
      const archivedItem = {
        id: item._id,
        name: item.name,
        startData: formatDate(item.startDate),
        num: item.roundFriends.filter((people) => people.status == "A").length,
        timeframe: item.updatedAt,
      };
      roundList.push(archivedItem);
    });
    setArchivedRounds(roundList);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    // Format the date and time according to the local time zone
    const formattedDate = date.toLocaleDateString(); // Local date
    const formattedTime = date.toLocaleTimeString(); // Local time

    const result = `${formattedDate} ${formattedTime}`;
    return result;
  };

  const handleRoundPress = async (roundId) => {
    navigation.navigate("ForumStack", {
      screen: "ForumPage",
      params: { id: roundId },
    });
  };

  useEffect(() => {
    generateCards();
  }, [roundData]);

  const handleContentSizeChange = (width, height) => {
    setContentHeight(height);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  return (
    <Center w="100%">
      <Background />
      <Flex direction="column" alignItems="center">

          <ScrollView
            ref={scrollViewRef}
            h={"100%"}
            w={"100%"}
            contentContainerStyle={{ flexGrow: 1 }}
            onContentSizeChange={handleContentSizeChange}
          >
            {archivedRounds.length > 0 ? (
              archivedRounds.map((item, index) => (
                <View
                  key={index}
                  w={'100%'}
                  minWidth='320'
                  style={{ flex: 1, marginVertical: 15}}
                >
              <Button
              key={index}
                title={`Round ${index + 1}`}
                onPress={() => {
                  handleRoundPress(item._id);
                }}
                rounded="30"
                mt="5"
                width="100%"
                height="100"
                size="lg"
                style={{
                  borderWidth: 1, // This sets the width of the border
                  borderColor: "#49a579", // This sets the color of the border
                }}
                backgroundColor={
                  item.userId == userData.data._id
                    ? "#49a579": "#6666ff"
                }
              >
                <Text
                  style={{
                    color: "#FFFFFF",
                    fontFamily: "Regular Semi Bold",
                    fontSize: 20, // Use a number for fontSize instead of "lg"
                  }}
                >
                  {item?.name}
                </Text>
              </Button>

                  {/* <Card
                    style={{
                      backgroundColor:
                        item.userId == userData.data._id
                          ? "#6666ff"
                          : "#f9f8f2",
                    }}
                    onPress={() => handleRoundPress(item._id)}
                  >
                    <Card.Body style={{ flexDirection: "col", padding: 8 }}>
                      <Text>Name:{item.name}</Text>
                      <Text>Participants:{item.num}</Text>
                    </Card.Body>
                    <Card.Footer
                      style={{
                        display: "flex",
                        alignItems: "center",
                        paddingVertical: 5,
                        paddingHorizontal: 20,
                      }}
                      content={
                        <Text
                          style={{
                            color:
                              item.userId == userData.data._id
                                ? "#f9f8f2"
                                : "#191919",
                          }}
                        >
                          {item.timeframe}
                        </Text>
                      }
                    />
                  </Card> */}
                </View>
              ))
            ) : (
              <Text>No Round History</Text>
            )}
          </ScrollView>


      {/* Modal 2: score board of Finished Round */}
      {/* <Modal
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
      </Modal> */}
      </Flex>
    </Center>
  );
};

export default ArchivePage;
