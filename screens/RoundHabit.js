import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const RoundHabit = () => {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your habit:</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type here"
      />
      <Text style={styles.displayText}>You entered: {text}</Text>
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