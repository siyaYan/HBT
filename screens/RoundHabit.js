import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet} from 'react-native';
import {Button } from "native-base"
import { updateRoundhabit } from "../components/Endpoint"
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";

const RoundHabit= ({ route, navigation }) => {
  const [text, setText] = useState('');
  const { userData } = useData();
  const { roundData } = useRound();
  const handleSubmit = async () => {
    // console.log(userData,roundData, text);
    const res= await updateRoundhabit(userData.token, roundData._id,text);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your habit:</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type here"
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