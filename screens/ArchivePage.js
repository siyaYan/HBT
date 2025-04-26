import { Center, Box, Flex, Text, View, Button, HStack } from "native-base";
import { useState, useEffect } from "react";
import React, { useRef } from "react";
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";
import Background from "../components/Background";
import { ScrollView } from "react-native";

import * as Sentry from "@sentry/react-native";

const ArchivePage = ({ navigation }) => {
  const { userData } = useData();
  const { roundData } = useRound();
  const scrollViewRef = useRef(null);
  const [archivedRounds, setArchivedRounds] = useState([]);
  const [contentHeight, setContentHeight] = useState(0);
  // In ArchivePage
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "Navigated to ArchivePage",
    });
  }, []);
  const generateCards = useCallback(() => {
    Sentry.addBreadcrumb({
      category: "data",
      message: "Generating archived rounds",
      data: { roundDataLength: roundData?.data?.length || 0 },
    });
    if (!roundData?.data) return; // Early return if data is not ready
    const finishedRound = roundData.data.filter((item) => item.status === "F");
    const roundList = finishedRound.map((item) => ({
      _id: item._id,
      name: item.name,
      userId: item.userId,
      startData: formatDate(item.startDate),
      num:
        item.roundFriends?.filter((people) => people.status === "A").length ||
        0,
      timeframe: calculateEndDate(item.startDate, item.level),
    }));
    setArchivedRounds(roundList);
  }, [roundData]); // Depend on roundData
  // const generateCards = () => {
  //   Sentry.addBreadcrumb({
  //     category: "data",
  //     message: "Generating archived rounds",
  //     data: { roundDataLength: roundData?.data?.length || 0 },
  //   });
  //   const finishedRound = roundData.data.filter((item) => item.status == "F");
  //   const roundList = [];
  //   finishedRound.map((item) => {
  //     const archivedItem = {
  //       _id: item._id,
  //       name: item.name,
  //       userId: item.userId,
  //       startData: formatDate(item.startDate),
  //       num: item.roundFriends.filter((people) => people.status == "A").length,
  //       timeframe: calculateEndDate(item.startDate, item.level),
  //     };
  //     roundList.push(archivedItem);
  //   });
  //   setArchivedRounds(roundList);
  // };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    // Format the date and time according to the local time zone
    const formattedDate = date.toLocaleDateString(); // Local date
    // const formattedTime = date.toLocaleTimeString(); // Local time

    const result = `${formattedDate}`;
    return result;
  };

  const calculateEndDate = (startDate, level) => {
    startTime = new Date(startDate).getTime();
    const millisecondsInLevelDays = level * 24 * 60 * 60 * 1000;
    const endDateTimestamp = startTime + millisecondsInLevelDays;

    return formatDate(endDateTimestamp);
  };

  // const handleRoundPress = async (roundId) => {
  //   navigation.navigate("ForumStack", {
  //     screen: "ForumPage",
  //     params: { id: roundId },
  //   });
  // };
  const handleRoundPress = (roundId) => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: `Navigating to ForumPage with roundId: ${roundId}`,
    });
    navigation.navigate("ForumStack", {
      screen: "ForumPage",
      params: { id: roundId },
    });
  };

  // useEffect(() => {
  //   generateCards();
  // }, [roundData]);
  useEffect(() => {
    generateCards();
  }, [generateCards, roundData?.data]);

  // const handleContentSizeChange = (width, height) => {
  //   setContentHeight(height);
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.scrollToEnd({ animated: false });
  //   }
  // };
  useEffect(() => {
    if (scrollViewRef.current && archivedRounds.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  }, [archivedRounds]);
  const handleContentSizeChange = (width, height) => {
    setContentHeight(height);
    // if (scrollViewRef.current) {
    //   scrollViewRef.current.scrollToEnd({ animated: false });
    // }
  };
  return (
    <Center w="100%">
      <Background />
      <Flex direction="column" justifyContent="flex-start">
        <Button
          title="Try!"
          onPress={() => {
            Sentry.captureException(new Error("First error"));
          }}
        />
        <ScrollView
          ref={scrollViewRef}
          h={"100%"}
          w={"100%"}
          contentContainerStyle={{ flexGrow: 1, marginVertical: 5 }}
        >
          {/* onContentSizeChange={handleContentSizeChange} */}
          {archivedRounds.length > 0 ? (
            archivedRounds.map((item, index) => (
              <View
                key={index}
                w={"100%"}
                minWidth="320"
                style={{ marginVertical: 15 }}
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
                    item.userId == userData.data._id ? "#49a579" : "#6666ff"
                  }
                >
                  <HStack justifyContent={"space-between"} marginY={2}>
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontFamily: "Regular Semi Bold",
                        fontSize: 20, // Use a number for fontSize instead of "lg"
                        alignSelf: "center",
                        paddingHorizontal: 10,
                      }}
                    >
                      {item?.name}
                    </Text>
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontFamily: "Regular Semi Bold",
                        fontSize: 20, // Use a number for fontSize instead of "lg"
                        alignSelf: "center",
                      }}
                    >
                      Num: {item?.num}
                    </Text>
                  </HStack>
                  <Text
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "Regular Semi Bold",
                      fontSize: 20, // Use a number for fontSize instead of "lg"
                    }}
                  >
                    {item?.startData} ---- {item?.timeframe}
                  </Text>
                </Button>
              </View>
            ))
          ) : (
            <Text>No Round History</Text>
          )}
        </ScrollView>
      </Flex>
    </Center>
  );
};

export default ArchivePage;
