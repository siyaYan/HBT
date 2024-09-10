import React from "react";
import {
  Input,
  Center,
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
  KeyboardAvoidingView,
  Modal,
} from "native-base";
import { useState, useEffect } from "react";
import Background from "../components/Background";
import { Switch } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "react-native-ui-datepicker";
import { AntDesign } from "@expo/vector-icons";
import {
  createRound,
  updateRoundInfo,
  deleteRound,
} from "../components/Endpoint";
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";

// Function to add days to a date
function calculateEndDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function calculateDatePickerMin(activeRound) {
  if (activeRound) {
    const endDatePlus1 = calculateEndDate(
      activeRound.startDate,
      parseInt(activeRound.level, 10)
    );

    return endDatePlus1;
  } else {
    const datePickerMin = new Date();
    datePickerMin.setDate(datePickerMin.getDate() + 2);

    return datePickerMin;
  }
}

const RoundConfigurationScreen = ({ route, navigation }) => {
  const { activeRoundData, insertRoundData, deleteRoundData } = useRound();
  // validation
  const [isInvalid, setIsInvalid] = useState({
    roundName: false,
    level: false,
    maxCapacity: false,
    isAllowed: false,
  });
  // const [startDateError, setStartDateError] = useState("");
  const activeRound = activeRoundData?.find((r) => r.status === "A");

  // Initialization
  const { userData } = useData();

  const emptyState = route.params.emptyState;
  const source = route.params.source;
  const roundId = route.params.roundId;
  
  //TODO: change it to RoundContext with index

  const round = activeRoundData?.find((r) => r._id === roundId);
  const ButtonUpdateRound = source === "home" ? "Create round" : "Update round";

  const datePickerMin = calculateDatePickerMin(activeRound);
  const datePickerMinPlus1 = new Date(datePickerMin);
  datePickerMinPlus1.setDate(datePickerMinPlus1.getDate() + 1);

  const [startDate, setDate] = useState(
    emptyState
      ? datePickerMinPlus1
      : round
      ? new Date(round.startDate)
      : datePickerMinPlus1
  );

  const [roundName, setRoundName] = useState(
    emptyState ? null : round ? round.name : null
  );
  const [level, setLevel] = useState(
    emptyState ? null : round ? round.level : null
  );
  const [maxCapacity, setMaxCapacity] = useState(() => {
    if (emptyState) {
      return "10";
    }
    return round.maximum != null ? round.maximum.toString() : "10";
  });
  const [allowOthers, setAllowOthers] = useState(
    emptyState ? true : round ? round.isAllowedInvite : true
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
  // Delete round
  const [isModalVisible, setModalVisible] = useState(false);

  const validateMaxCapacity = (text) => {
    // Allow the state to be updated immediately
    setMaxCapacity(text);

    // Convert the text to a number and validate
    const value = parseInt(text, 10);
    if (isNaN(value) || value < 2 || value > 50) {
      setIsInvalid({
        ...isInvalid,
        maxCapacity: "Cannot be less than 2 or greater than 50.",
      });
    } else {
      setIsInvalid({
        ...isInvalid,
        maxCapacity: false,
      });
    }
  };


  const handleUpdateRound = async () => {
    if (emptyState) {
      const newRoundData = {
        userId: userData.data._id,
        name: roundName,
        level: level,
        startDate: startDate,
        maxCapacity: maxCapacity,
        isAllowedInvite: allowOthers,
      };

      const response = await createRound(newRoundData, userData.token);

      insertRoundData(response.data);

      navigation.navigate("RoundStack", {
        screen: "RoundInfo",
        params: { roundId: response.data._id },
      });
    } else {
      const newRoundData = {
        _id: roundId,
        userId: userData.data._id,
        name: roundName,
        level: level,
        startDate: startDate,
        maxCapacity: maxCapacity,
        isAllowedInvite: allowOthers,
      };

      const response = await updateRoundInfo(userData.token, newRoundData);

      if (response.status == "success") {
        insertRoundData(newRoundData)
      }
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

  const handleDeleteRound = () => {
    setModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    setModalVisible(false);
    try {
      const response = await deleteRound(userData.token, roundId);
      //response is true, if it is successful
      if (response) {
        await deleteRoundData(roundId); // round invitation is deleted in backend as well.
        navigation.navigate("MainStack", { screen: "Home" });

      } else {
        // Handle case when response is not as expected
        Alert.alert("Error", "Failed to delete the round");
      }
    } catch (error) {
      console.error("Error deleting round:", error);
      Alert.alert("Error", "An error occurred while deleting the round");
    }
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
  };
  useEffect(() => {
    // Effect code
  }, [isModalVisible]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Center w="100%">
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
                        {startDate
                          ? startDate.toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : ""}
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
                              // minDate={minDaysFromNow}
                              minDate={datePickerMin}
                              onChange={(params) => {
                                setDate(new Date(params.date));
                              }}
                            />

                          </Menu>
                        </Box>
                      </ZStack>
                    </View>
                  </HStack>
                </FormControl>
                {/* Maximum Capacity */}
                <FormControl isInvalid={isInvalid.maxCapacity}>
                  <FormControl.Label
                    ml={1}
                    _text={{
                      fontFamily: "Regular Semi Bold",
                      fontSize: "lg",
                      color: "#191919",
                    }}
                  >
                    Max Capacity
                  </FormControl.Label>
                  <Input
                    borderColor="#49a579"
                    rounded="30"
                    fontFamily={"Regular Medium"}
                    size="lg"
                    mr={3}
                    w="93%"
                    placeholder="Enter Max Capacity"
                    value={maxCapacity}
                    onChangeText={validateMaxCapacity}
                  />
                  {isInvalid.maxCapacity && (
                    <FormControl.ErrorMessage>
                      Max Capacity must be between 2 and 50.
                    </FormControl.ErrorMessage>
                  )}
                </FormControl>
                {/* Allow others to invite friends */}
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
                  {ButtonUpdateRound}
                </Button>
                {source === "info" && (
                  <Button
                    onPress={() => {
                      handleDeleteRound();
                    }}
                    mt="5"
                    width="100%"
                    size="lg"
                    // bg="#ff061e"
                    // bg="rgba(255, 6, 30, 0.1)" // 0.5 is the alpha value for 50% transparency
                    backgroundColor={"rgba(250,250,250,0.2)"}
                    _pressed={{
                      bg: "#ff061e",
                    }}
                    _text={{
                      color: "#f9f8f2",
                      fontFamily: "Regular Medium",
                      fontSize: "lg",
                    }}
                  >
                    Delete Round
                  </Button>
                )}

                <Modal
                  isOpen={isModalVisible}
                  onClose={handleCancelDelete}
                  animationPreset="fade"
                >
                  <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>
                      <Text fontFamily={"Regular Medium"} fontSize="xl">
                        Delete Round
                      </Text>
                    </Modal.Header>
                    <Modal.Body>
                      <Text>
                        Are you sure? It will delete everything including posts,
                        scores, that can be your important memories.
                      </Text>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button.Group space={2}>
                        <Button
                          rounded={30}
                          shadow="7"
                          width="50%"
                          size={"md"}
                          _text={{
                            color: "#f9f8f2",
                          }}
                          colorScheme="blueGray"
                          onPress={handleCancelDelete}
                        >
                          Cancel
                        </Button>
                        <Button
                          rounded={30}
                          shadow="7"
                          width="50%"
                          size={"md"}
                          colorScheme="danger"
                          onPress={handleConfirmDelete}
                        >
                          Delete
                        </Button>
                      </Button.Group>
                    </Modal.Footer>
                  </Modal.Content>
                </Modal>
              </VStack>
            </VStack>
          </Center>
        </Box>
      </Center>
    </KeyboardAvoidingView>
  );
};

export default RoundConfigurationScreen;
