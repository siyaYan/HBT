import React from 'react';
import {
  Input,
  Center,
  NativeBaseProvider,
} from "native-base";
import { useState, useEffect } from "react";
import {
  VStack,
  FormControl,
  Button,
  Box,
} from "native-base";
import {
  updateRound
} from "../components/Endpoint";
import Background from "../components/Background";


// Define your style constant here
const textStyle = {
  ml: "1", // This will apply margin left
  _text: {
    fontFamily: "Regular Semi Bold", // Your font family
    fontSize: "lg", // 'lg' is a size token from NativeBase, make sure it's defined in your theme
    color: "#191919" // Font color
  }
};

const RoundConfigurationScreen = ({ navigation }) => {

  // Initialize state with dummy data
  const [roundName, setRoundName] = useState('Championship Qualifiers');
  const [level, setLevel] = useState('Intermediate');
  const [startDate, setStartDate] = useState('2024-01-15');
  const [maxCapacity, setMaxCapacity] = useState('100');
  const [allowOthers, setAllowOthers] = useState(true);
/*----------------------------------------------------------------*/
// Wait for Backend to setup Round Info
/*----------------------------------------------------------------*/
  // Function to handle form submission 
  // const handleUpdate = async () => {
  //   const id = "roundId"; // Assume you have a way to get the round ID, perhaps passed via navigation or context

  //   // Call the update API
  //   const result = await updateRound(id, roundName, level, startDate, parseInt(maxCapacity, 10), allowOthers);
  //   if (result.status === 'success') {
  //     Alert.alert('Success', 'Round updated successfully');
  //     // Optionally navigate back or to another screen
  //     navigation.goBack(); // or navigation.navigate('SomeOtherScreen');
  //   } else {
  //     Alert.alert('Error', result.message || 'Failed to update round');
  //   }
  // };
  const handleUpdate = async () => {
    // This would be your API call normally
    console.log("Updating round with:", { roundName, level, startDate, maxCapacity, allowOthers });
    // Mock response simulation
    setTimeout(() => {
      alert("Round updated successfully!");
      navigation.goBack(); // Simulate navigation on success
    }, 1000);
  };

  return (
    <NativeBaseProvider>
      <Center w="100%">
        <Background />
        <Box w="80%" h="100%" maxW="320">
      <VStack space={3} mt="10" style={{justifyContent: 'center'}} >
        <FormControl>
          <FormControl.Label  ml={1}
                _text={{
                  fontFamily: "Regular Semi Bold",
                  fontSize: "lg",
                  color: "#191919",
                }}>Round Name</FormControl.Label>
          <Input 
            placeholder="Enter Round Name"
            value={roundName}
            onChangeText={setRoundName}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label  ml={1}
                _text={{
                  fontFamily: "Regular Semi Bold",
                  fontSize: "lg",
                  color: "#191919",
                }}>Level</FormControl.Label>
          <Input 
            placeholder="Enter Level"
            value={level}
            onChangeText={setLevel}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label  ml={1}
                _text={{
                  fontFamily: "Regular Semi Bold",
                  fontSize: "lg",
                  color: "#191919",
                }}>Start Date</FormControl.Label>
          <Input 
            placeholder="Enter Start Date"
            value={startDate}
            onChangeText={setStartDate}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label ml={1}
                _text={{
                  fontFamily: "Regular Semi Bold",
                  fontSize: "lg",
                  color: "#191919",
                }}>Maximum Capacity</FormControl.Label>
          <Input 
            placeholder="Enter Max Capacity"
            keyboardType="numeric"
            value={maxCapacity}
            onChangeText={setMaxCapacity}
          />
        </FormControl>
        <FormControl>
          <FormControl.Label  ml={1}
                _text={{
                  fontFamily: "Regular Semi Bold",
                  fontSize: "lg",
                  color: "#191919",
                }}>Allow Others</FormControl.Label>
          <Input 
            placeholder="Enter true or false"
            value={allowOthers.toString()}
            onChangeText={text => setAllowOthers(text.toLowerCase() === 'true')}
          />
        </FormControl>
        <Button onPress={handleUpdate} mt={5}>Update Round</Button>
      </VStack>
    </Box>
    </Center>
    </NativeBaseProvider>
    
  );
};


export default RoundConfigurationScreen;