import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Button, Center } from "native-base";
import { updateRoundhabit } from "../components/Endpoint";
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";

const RoundHabit = ({ route, navigation }) => {
  const [text, setText] = useState("");
  const { userData } = useData();
  const { roundData, insertRoundData } = useRound();

  const { id: roundId, state: fromNew } = route.params || {}; // Use optional chaining to prevent crashes if params are missing

  const thisRoundData = roundData.data.filter((item) => item._id == roundId)[0];
  const meInrRund = thisRoundData.roundFriends.filter(
    (item) => item.id == userData.data._id
  )[0];
  const myhabit = meInrRund.habit;
  const handleSubmit = async () => {
    const res = await updateRoundhabit(userData.token, thisRoundData._id, text);
    const updatedUser = {
      ...meInrRund,
      habit: text,
    };
    const updatedRoundFriends = thisRoundData.roundFriends.map((friend) =>
      friend.id === updatedUser.id ? updatedUser : friend
    );
    const updatedRound = {
      ...thisRoundData,
      roundFriends: updatedRoundFriends,
    };
    console.log(updatedRound);
    insertRoundData(updatedRound);
    if (fromNew) {
      navigation.navigate("RoundStack", {
        screen: "RoundInfo",
        params: { id: roundId, state: true },
      });
    }
  };
  return (
    <View style={styles.container}>
      <Center w="90%" h="100%">
        <Text style={styles.label} >Enter your habit:</Text>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder={myhabit}
        />
        <Button
          variant="info"
          onPress={handleSubmit}
          width="93%"
          rounded={30}
          size="lg"
          bg="#49a579"
          _text={{
            color: "#f9f8f2",
            fontFamily: "Regular Medium",
            fontSize: "lg",
          }}
        >
          Submit
        </Button>
      </Center>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    // justifyContent: "top",
    alignItems: "center",
    padding: 16,
    transform: [{ translateY: -25 }],
  },
  label: {
    fontSize: 20,
    marginBottom: 8,
    fontFamily: "Regular Semi Bold",
    color: "#191919",
  },
  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    padding: 8,
    width: "93%",
    marginBottom: 16,
    borderRadius: 30,
  },
  displayText: {
    fontSize: 18,
    marginTop: 16,
  },
});

export default RoundHabit;
