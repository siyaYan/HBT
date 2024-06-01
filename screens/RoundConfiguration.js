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
import { updateRound } from "../components/Endpoint";
import { useData } from "../context/DataContext";

const RoundConfigurationScreen = ({ navigation }) => {
  const { userData } = useData();

  const minDaysFromNow = new Date(); // Start with today's date
  minDaysFromNow.setDate(minDaysFromNow.getDate() + 3); // 3 days

  const [startDate, setDate] = useState(new Date());

  // Initialize state with dummy data
  const [roundName, setRoundName] = useState("Championship Qualifiers");
  const [level, setLevel] = useState();
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

  const handleUpdateRound = () => {
    const roundData = {
      userId: userData.data._id,
      name: roundName,
      level,
      startDate,
      maxCapacity: parseInt(maxCapacity, 10),
      allowOthers,
    };
    updateRound(roundData, userData.token);
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
              setValue={(callback) => {
                setValue(callback);
                const newValue = callback(value);
                setLevel(newValue);
              }}
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
                  <Text>
                    {startDate.toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
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
                            setDate(new Date(params.date));
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

            <Button
              onPress={() => {
                handleUpdateRound();
                // console.log("Calendar icon pressed. info:", startDate,level,roundName,allowOthers,userData.data._id);
              }}
              mt={5}
            >
              Update Round
            </Button>
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

export default RoundConfigurationScreen;

//TODO: 1. validation on Level
//TODO: 2. Round name placeholder rather than default value