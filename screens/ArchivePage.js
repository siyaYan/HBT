import { Center, Box, Text, View } from "native-base";
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
      <Box
        height={"100%"}
        width={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            w={"100%"}
            h={"100%"}
            contentContainerStyle={{ flexGrow: 1 }}
            onContentSizeChange={handleContentSizeChange}
          >
            {archivedRounds.length > 0 ? (
              archivedRounds.map((item, index) => (
                <View
                  key={index}
                  style={{ flex: 1, marginVertical: 15, marginHorizontal: 10 }}
                >
                  <Card
                    style={{
                      backgroundColor:
                        item.userId == userData.data._id
                          ? "#6666ff"
                          : "#f9f8f2",
                    }}
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
                  </Card>
                </View>
              ))
            ) : (
              <Text>No Round History</Text>
            )}
          </ScrollView>
        </View>
      </Box>
    </Center>
  );
};

export default ArchivePage;
