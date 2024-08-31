import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
} from "react-native";
import { Modal, ZStack, Box } from "native-base";

// Replace this with the correct path to your image file
import RewardStageBackground from "../assets/UIicons/checkout.webp";

const ScoreBoardModal = ({ scoreBoardOpen, handleClose, roundData }) => {
  const round = roundData.data[0];
  const topThree = round ? round.roundFriends.slice(0, 3) : [];
  const rest = round ? round.roundFriends.slice(3) : [];

  return (
    <ZStack alignItems="center" justifyContent="center">
      <Box alignItems="center">
        <View>
          <Modal isOpen={scoreBoardOpen} onClose={handleClose}>
            <Modal.Content maxWidth="400px" width="90%">
              <Modal.CloseButton />
              <Modal.Header>Score Board: {round ? round._id : ""}</Modal.Header>
              <Modal.Body>
                {round ? (
                  <ImageBackground
                    source={RewardStageBackground}
                    style={styles.background}
                  >
                    <View style={styles.topThreeContainer}>
                      <View style={styles.stage}>
                        <Text style={styles.rankText}>2nd</Text>
                        <Text>{topThree[1]?.nickname}</Text>
                        <Text>{topThree[1]?.score}</Text>
                      </View>
                      <View style={[styles.stage, styles.firstPlace]}>
                        <Text style={styles.rankText}>1st</Text>
                        <Text>{topThree[0]?.nickname}</Text>
                        <Text>{topThree[0]?.score}</Text>
                      </View>
                      <View style={styles.stage}>
                        <Text style={styles.rankText}>3rd</Text>
                        <Text>{topThree[2]?.nickname}</Text>
                        <Text>{topThree[2]?.score}</Text>
                      </View>
                    </View>
                    {/* <FlatList
                  data={rest}
                  keyExtractor={(item) => item.nickname}
                  renderItem={({ item, index }) => (
                    <View style={styles.playerItem}>
                      <Text>{index + 4}.</Text>
                      <Text>{item.nickname}</Text>
                      <Text>{item.score}</Text>
                    </View>
                  )}
                /> */}
                  </ImageBackground>
                ) : (
                  ""
                )}
              </Modal.Body>
            </Modal.Content>
          </Modal>
        </View>
      </Box>
    </ZStack>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover", // or 'contain' depending on your preference
    padding: 10,
  },
  topThreeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  stage: {
    alignItems: "center",
    padding: 5,
  },
  firstPlace: {
    backgroundColor: "rgba(255, 215, 0, 0.5)", // Semi-transparent gold background
  },
  rankText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  playerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default ScoreBoardModal;
