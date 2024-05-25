import React from 'react';
import {
  Input,
  Center,
  NativeBaseProvider,
  VStack,
  FormControl,
  Button,
  Box,
  View,
} from "native-base";
import { useState, useEffect } from "react";
import Background from "../components/Background";
import { Switch } from 'react-native-elements';
import DropDownPicker from 'react-native-dropdown-picker';
import enUS from '@ant-design/react-native/lib/locale-provider/en_US'
import { DatePicker, List, Provider } from '@ant-design/react-native'
import RoundDatePicker from './RoundDatePicker';

const RoundConfigurationScreen = ({ navigation }) => {
  // Define your style constant here
  const textStyle = {
    ml: "1", // This will apply margin left
    _text: {
      fontFamily: "Regular Semi Bold", // Your font family
      fontSize: "lg", // 'lg' is a size token from NativeBase, make sure it's defined in your theme
      color: "#191919" // Font color
    }
  };

  // Initialize state with dummy data
  const [roundName, setRoundName] = useState('Championship Qualifiers');
  const [level, setLevel] = useState('Intermediate');
  const [startDate, setStartDate] = useState(new Date('2024-01-15'));
  const [maxCapacity, setMaxCapacity] = useState('100');
  const [allowOthers, setAllowOthers] = useState(true);
  // Toggle button
  const [isEnabled, setIsEnabled] = useState(false);

    const toggleSwitch = () => {
        setIsEnabled(previousState => !previousState);
    };
  //Drop down list
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
      {label: '21', value: '21'},
      {label: '35', value: '35'},
      {label: '66', value: '66'}
  ]);
  // Date picker
  const [selectedDate, setSelectedDate] = useState();  // Renamed from value to selectedDate

  const onChangeStartDate = (newDate) => {
    setSelectedDate(newDate);  // Renamed from setValue to setSelectedDate
  };
  
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
      {/* <OptionMenu navigation={navigation} /> */}
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
        </FormControl>
                {/* // Dropdown list */} 
                <DropDownPicker 
                // dropDownContainerStyle={dropDownContainer}
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
            />
        <FormControl>
          <FormControl.Label  ml={1}
                _text={{
                  fontFamily: "Regular Semi Bold",
                  fontSize: "lg",
                  color: "#191919",
                }}>Start Date</FormControl.Label>
        </FormControl>
       {/* Date picker */}
       {/* <RoundDatePicker /> */}
       <Provider locale={enUS}>
      <List>
        <DatePicker
          value={selectedDate}  // Use selectedDate here
          minDate={new Date(2015, 7, 6)}
          maxDate={new Date(2026, 11, 3)}
          onChange={onChangeStartDate}
          format="YYYY-MM-DD"
        >
          <List.Item arrow="horizontal">Select Date</List.Item>
        </DatePicker>
      </List>
    </Provider>
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
                }}>Allow others to invite friends</FormControl.Label>
          <Switch
            value={isEnabled}
            onValueChange={toggleSwitch}
            color={isEnabled ? 'green' : 'gray'}
          />
          {/* <Input 
            placeholder="Enter true or false"
            value={allowOthers.toString()}
            onChangeText={text => setAllowOthers(text.toLowerCase() === 'true')}
          /> */}
        </FormControl>
   
        <Button onPress={handleUpdate} mt={5}>Update Round</Button>
      </VStack>
    </Box>
    </Center>
    </NativeBaseProvider>
    
  );
};


export default RoundConfigurationScreen;