import React from "react";
import {
  Input,
  Center,
  NativeBaseProvider,
  VStack,
  FormControl,
  Button,
  Box,
  View,
  Text,
  ZStack,
  Menu,
  Pressable,
  HStack,
} from "native-base";
import { useState, useEffect } from "react";
import Background from "../components/Background";
import { Switch } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import enUS from "@ant-design/react-native/lib/locale-provider/en_US";
import { DatePicker, List, Provider } from "@ant-design/react-native";
import RoundDatePicker from "./RoundDatePicker";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { AntDesign } from "@expo/vector-icons";

const RoundConfigurationScreen = ({ navigation }) => {
  const minDaysFromNow = new Date(); // Start with today's date
  minDaysFromNow.setDate(minDaysFromNow.getDate() + 3); // 3 days
  // Date picker antd version
  // const [selectedDate, setSelectedDate] = useState(); // Renamed from value to selectedDate

  // const onChangeStartDate = (newDate) => {
  //   setSelectedDate(newDate); // Renamed from setValue to setSelectedDate
  // };
  //Date picker react native ui version
  // const [date, setDate] = useState(dayjs());
  // const [startDate, setDate] = useState(dayjs());
  const [startDate, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState("");

  const onChangeStartDate = (event, selectedDate) => {
    setDate(selectedDate || startDate);
    setShow(false);
  };

  const showDatePicker = () => {
    setShow(true);
  };
  // Define your style constant here
  const textStyle = {
    ml: "1", // This will apply margin left
    _text: {
      fontFamily: "Regular Semi Bold", // Your font family
      fontSize: "lg", // 'lg' is a size token from NativeBase, make sure it's defined in your theme
      color: "#191919", // Font color
    },
  };

  // Initialize state with dummy data
  const [roundName, setRoundName] = useState("Championship Qualifiers");
  const [level, setLevel] = useState("Intermediate");
  // const [startDate, setStartDate] = useState(new Date("2024-01-15"));
  const [maxCapacity, setMaxCapacity] = useState("10");
  const [allowOthers, setAllowOthers] = useState(false);
  // Toggle button
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };
  //Drop down list
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "21", value: "21" },
    { label: "35", value: "35" },
    { label: "66", value: "66" },
  ]);

  const handleUpdate = async () => {
    // This would be your API call normally
    console.log("Updating round with:", {
      roundName,
      level,
      startDate,
      maxCapacity,
      allowOthers,
    });
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
          <VStack space={3} mt="10" style={{ justifyContent: "center" }}>
            <FormControl>
              <FormControl.Label
                ml={1}
                _text={{
                  fontFamily: "Regular Semi Bold",
                  fontSize: "lg",
                  color: "#191919",
                }}
              >
                Round Name
              </FormControl.Label>
              <Input
                placeholder="Enter Round Name"
                value={roundName}
                onChangeText={setRoundName}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label
                ml={1}
                _text={{
                  fontFamily: "Regular Semi Bold",
                  fontSize: "lg",
                  color: "#191919",
                }}
              >
                Level
              </FormControl.Label>
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
            {/* Start Date */}
            <FormControl>
              <HStack
                space={2}
                alignItems="center"
                justifyContent="space-between"
              >
              <VStack>
                <FormControl.Label
                  ml={1}
                  _text={{
                    fontFamily: "Regular Semi Bold",
                    fontSize: "lg",
                    color: "#191919",
                  }}
                >
                  Start Date
                </FormControl.Label>
                <Text>{startDate.toString()}</Text>
                </VStack>

                <View style={{ padding: 20, alignSelf: "flex-end" }}>
                  <ZStack alignSelf="flex-end" mr="15%" mt="10%">
                    <Box alignSelf="flex-end">
                      <Menu
                        mt="-50%"
                        // mr="10"
                        w="280"
                        trigger={(triggerProps) => {
                          return (
                            <Pressable
                              accessibilityLabel="Date picker"
                              {...triggerProps}
                              //                         onPress={() => {
                              //   console.log("Calendar icon pressed. Start Date is:", startDate); // Replace this with your actual function to show date picker
                              // }}
                            >
                              <AntDesign
                                name="calendar"
                                size={24}
                                color="black"
                              />
                            </Pressable>
                          );
                        }}
                      >
                        <DateTimePicker
                          mode="single"
                          date={startDate}
                          minDate={minDaysFromNow}
                          // onChange={(params) => setDate(params.date)}
                          onChange={(params) => {
                            setDate(params.date);
                            console.log(
                              "Calendar icon pressed. Start Date is:",
                              startDate
                            );
                          }}
                        />
                      </Menu>
                    </Box>
                  </ZStack>
                </View>
              </HStack>
            </FormControl>
            <FormControl>
              <FormControl.Label
                ml={1}
                _text={{
                  fontFamily: "Regular Semi Bold",
                  fontSize: "lg",
                  color: "#191919",
                }}
              >
                Maximum Capacity
              </FormControl.Label>
              <Input
                placeholder="Enter Max Capacity"
                keyboardType="numeric"
                value={maxCapacity}
                onChangeText={setMaxCapacity}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label
                ml={1}
                _text={{
                  fontFamily: "Regular Semi Bold",
                  fontSize: "lg",
                  color: "#191919",
                }}
              >
                Allow others to invite friends
              </FormControl.Label>
              <Switch
                value={isEnabled}
                onValueChange={toggleSwitch}
                color={isEnabled ? "green" : "gray"}
              />
            </FormControl>

            <Button onPress={handleUpdate} mt={5}>
              Update Round
            </Button>
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

export default RoundConfigurationScreen;
