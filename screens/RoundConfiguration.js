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
  ScrollView,
  KeyboardAvoidingView,
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
import { createRound,updateRoundInfo } from "../components/Endpoint";
import { useData } from "../context/DataContext";
import {useRound } from "../context/RoundContext"

const RoundConfigurationScreen = ({ route, navigation }) => {
  const {updateRoundData} = useRound();
  // validation
  const [isInvalid, setIsInvalid] = useState({
    roundName: false,
    level: false,
    maxCapacity: false,
    isAllowed: false,
  });
  // Initialization
  const { userData } = useData();
  const emptyState = route.params.emptyState;
  const roundData = route.params.roundData;
  const roundId = roundData._id;
  console.log('roundconfig page round data:', roundData);
  // console.log('roundconfig page empty:', emptyState);

  const minDaysFromNow = new Date(); // Start with today's date
  minDaysFromNow.setDate(minDaysFromNow.getDate() + 3); // 3 days
  const [startDate, setDate] = useState(
    emptyState ? new Date() : new Date(roundData.startDate)
  );
  const [roundName, setRoundName] = useState(
    emptyState ? null : roundData.name
  );
  const [level, setLevel] = useState(emptyState ? null : roundData.level);
  const [maxCapacity, setMaxCapacity] = useState(
    emptyState ? "5" : roundData.maximum.toString()
  );
  const [allowOthers, setAllowOthers] = useState(
    emptyState ? true : roundData.isAllowedInvite
  );

  // Toggle button
  // const [allowOthers, setAllowOthers] = useState(false);

  const toggleSwitch = () => {
    setAllowOthers((previousState) => !previousState);
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
    if (emptyState) {
      const newRoundData = {
        userId: userData.data._id,
        name: roundName,
        level:level,
        startDate:startDate,
        maxCapacity: maxCapacity,
        isAllowedInvite:allowOthers,
      };
      createRound(newRoundData, userData.token);
      console.log("create round",newRoundData);
    } else {
      console.log("route",route.params)
      const newRoundData = {
        _id: roundId,
        userId: userData.data._id,
        name: roundName,
        level:level,
        startDate:startDate,
        maxCapacity: maxCapacity,
        isAllowedInvite:allowOthers,
      };
      const response = updateRoundInfo(userData.token, newRoundData);
      // updateRoundData(newRoundData);
      // console.log("Update round",newRoundData);
      if (response.status == "success") {

      console.log("response",response.data)
      updateRoundData(response.data)}
    }
  };
  const handleValidateUpload = () => {
    let newIsInvalid = { ...isInvalid };
    // Validate level
    if (!level) {
      newIsInvalid.level = true;
    } else {
      newIsInvalid.level = false;
    }
    // Validate roundName
    if (!roundName) {
      newIsInvalid.roundName = true;
    } else {
      newIsInvalid.roundName = false;
    }

    setIsInvalid(newIsInvalid);

    const isAnyInvalid = Object.values(newIsInvalid).some((value) => value);
    if (isAnyInvalid) {
      return;
    }

    handleUpdateRound();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Center w="100%">
        {/* <ScrollView
        w="100%"
        h="100%"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, minHeight: "100%" }}
      > */}
        <Background />
        <Box
          alignItems="center"
          alignSelf="center"
          position="relative"
          safeArea
          h="100%"
          w="80%"
          maxW={320}
        >
          <Center w="90%" h="100%">
            <VStack w="100%" h="100%" space={6}>
              <VStack w="100%" space={6}>
                {/* Round Name */}
                <FormControl isInvalid={isInvalid.roundName}>
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
                    borderColor="#49a579"
                    rounded="30"
                    fontFamily={"Regular Medium"}
                    size="lg"
                    mr={3}
                    w="93%"
                    placeholder="Enter Round Name"
                    value={roundName}
                    onChangeText={setRoundName}
                  />
                  {isInvalid.roundName && (
                    <FormControl.ErrorMessage>
                      Round Name is required.
                    </FormControl.ErrorMessage>
                  )}
                </FormControl>
                {/* Level */}
                <FormControl isInvalid={isInvalid.level}>
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
                  value={level}
                  items={items}
                  setOpen={setOpen}
                  setValue={(callback) => {
                    setValue(callback);
                    const newValue = callback(value);
                    setLevel(newValue);
                  }}
                  setItems={setItems}
                />
                {isInvalid.level && (
                  <FormControl isInvalid={isInvalid.level}>
                    <FormControl.ErrorMessage>
                      This field is required
                    </FormControl.ErrorMessage>
                  </FormControl>
                )}
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
                      <Text
                        ml={1}
                        _text={{
                          fontFamily: "Regular Semi Bold",
                          fontSize: "lg",
                          color: "#191919",
                        }}
                      >
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
                {/* Maximum Capacity */}
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
                    borderColor="#49a579"
                    rounded="30"
                    fontFamily={"Regular Medium"}
                    size="lg"
                    mr={3}
                    w="93%"
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
                    value={allowOthers}
                    onValueChange={toggleSwitch}
                    color={allowOthers ? "green" : "gray"}
                  />
                </FormControl>

                <Button
                  onPress={() => {
                    handleValidateUpload();
                    // console.log("Calendar icon pressed. info:", startDate,level,roundName,allowOthers,userData.data._id);
                  }}
                  mt="5"
                  width="100%"
                  size="lg"
                  bg="#49a579"
                  _text={{
                    color: "#f9f8f2",
                    fontFamily: "Regular Medium",
                    fontSize: "lg",
                  }}
                >
                  Update Round
                </Button>
              </VStack>
            </VStack>
          </Center>
        </Box>
      </Center>
    </KeyboardAvoidingView>
  );
};

export default RoundConfigurationScreen;
