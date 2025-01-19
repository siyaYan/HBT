import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet} from 'react-native';
import {Button } from "native-base"
import { updateRoundhabit } from "../components/Endpoint"
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";

const RoundHabit= ({ route, navigation }) => {
  const [text, setText] = useState('');
  const { userData } = useData();
  const { roundData, insertRoundData} = useRound();

  const { id: roundId, state: fromNew} = route.params || {}; // Use optional chaining to prevent crashes if params are missing

  const thisRoundData=roundData.data.filter(item=>item._id==roundId)[0]
  const meInrRund=thisRoundData.roundFriends.filter(item=>item.id==userData.data._id)[0]
  const myhabit=meInrRund.habit
  const handleSubmit = async () => {
    const res= await updateRoundhabit(userData.token, thisRoundData._id,text);
    const updatedUser = {
      ...meInrRund,
      habit: text
    };
    const updatedRoundFriends = thisRoundData.roundFriends.map(friend =>
      friend.id === updatedUser.id ? updatedUser : friend
    );
    const updatedRound = {
      ...thisRoundData,
      roundFriends: updatedRoundFriends
    };
    console.log(updatedRound)
    insertRoundData(updatedRound)
    if(fromNew){
      navigation.navigate("RoundStack", {
        screen: "RoundInfo",
        params: { id: roundId , state: true},
      });
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your habit:</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={myhabit}
      />
      <Button  variant="info" onPress={handleSubmit}>
      Submit</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    width: '100%',
    marginBottom: 16,
  },
  displayText: {
    fontSize: 18,
    marginTop: 16,
  },
});

export default RoundHabit;