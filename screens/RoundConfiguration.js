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
  Modal,
} from "native-base";
import { useState, useEffect } from "react";
import { SvgXml } from "react-native-svg";
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
import { Keyboard, TouchableWithoutFeedback } from "react-native";

// Function to add days to a date
function calculateEndDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function calculateDatePickerMin(acceptRound) {
  if (acceptRound) {
    const endDatePlus1 = calculateEndDate(
      acceptRound.startDate,
      parseInt(acceptRound.level, 10)
    );

    return endDatePlus1;
  } else {
    const datePickerMin = new Date();
    datePickerMin.setDate(datePickerMin.getDate() + 2);

    return datePickerMin;
  }
}

const RoundConfigurationScreen = ({ route, navigation }) => {
  const { acceptRoundData, insertRoundData, deleteRoundData } = useRound();
  // validation
  const [isInvalid, setIsInvalid] = useState({
    roundName: false,
    level: false,
    maxCapacity: false,
    isAllowed: false,
  });
  // const [startDateError, setStartDateError] = useState("");
  const acceptRound = acceptRoundData?.data.find(
    (r) => r.status === "A" || r.status === "P"
  );

  // Initialization
  const { userData } = useData();

  const emptyState = route.params.emptyState;
  const source = route.params.source;
  const roundId = route.params.id;

  //TODO: change it to RoundContext with index

  const round = acceptRoundData?.data.find((r) => r._id === roundId);
  const ButtonUpdateRound = source === "home" ? "Create round" : "Update round";

  const datePickerMin = calculateDatePickerMin(acceptRound);
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
    { label: "21 days", value: "21" },
    { label: "35 days", value: "35" },
    { label: "66 days", value: "66" },
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
        params: { id: response.data._id, state: emptyState, gohabit: true },
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
        status: round.status,
      };
      const response = await updateRoundInfo(userData.token, newRoundData);

      if (response.status == "success") {
        insertRoundData(newRoundData);
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
        Alert.alert("Error", "was unsucessful. to delete the round");
      }
    } catch (error) {
      console.error("Error deleting round:", error);
      Alert.alert("Error", "An error occurred while deleting the round");
    }
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
  };
  // useEffect(() => {
  //   // Effect code
  // }, [isModalVisible]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
                {/* Round name */}
                <FormControl isInvalid={isInvalid.roundName}>
                  <FormControl.Label
                    ml={1}
                    mt={-5}
                    _text={{
                      fontFamily: "Regular Semi Bold",
                      fontSize: "lg",
                      color: "#191919",
                    }}
                  >
                    Round name
                  </FormControl.Label>
                  <Input
                    borderColor="#49a579"
                    rounded="30"
                    fontFamily={"Regular Medium"}
                    size="lg"
                    mr={3}
                    w="93%"
                    placeholder="Enter Round name"
                    value={roundName}
                    onChangeText={setRoundName}
                  />
                  {isInvalid.roundName && (
                    <FormControl.ErrorMessage>
                      Please enter a round name.
                    </FormControl.ErrorMessage>
                  )}
                </FormControl>
                {/* Level */}
                <FormControl isInvalid={isInvalid.level}>
                  <FormControl.Label
                    ml={1}
                    mt={1}
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
                  open={open}
                  value={level}
                  items={items}
                  disabled={round?.status === "A"}
                  setOpen={setOpen}
                  setValue={(callback) => {
                    setValue(callback);
                    const newValue = callback(value);
                    setLevel(newValue);
                  }}
                  setItems={setItems}
                  placeholder="Select level"
                  containerStyle={{
                    width: "93%",
                    marginRight: 3,
                  }}
                  style={{
                    borderColor: "#49a579",
                    minHeight: 46, // instead of height, use minHeight to enforce the size
                    maxHeight: 46, // instead of height, use minHeight to enforce the size
                    borderRadius: 30,
                    backgroundColor: "transparent", // Make placeholder background transparent
                  }}
                  dropDownContainerStyle={{
                    borderColor: "#49a579",
                    borderWidth: 1,
                    borderRadius: 30,
                    backgroundColor: "#f9f8f2", // Consistent with your text input background
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    marginTop: 5,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                  labelStyle={{
                    fontFamily: "Regular Medium",
                    fontSize: 16,
                    color: "#191919",
                  }}
                  placeholderStyle={{
                    fontFamily: "Regular Medium",
                    fontSize: 16,
                    color: "#a0a0a0",
                    backgroundColor: "transparent", // Make placeholder background transparent
                    // paddingLeft: 10, // Add padding for the placeholder as well
                  }}
                  listItemLabelStyle={{
                    marginLeft: 0, // Additional left margin for individual option labels, if supported
                  }}
                />

                {isInvalid.level && (
                  <FormControl isInvalid={isInvalid.level}>
                    <FormControl.ErrorMessage>
                      Please select a level.
                    </FormControl.ErrorMessage>
                  </FormControl>
                )}
                {/* Start date */}
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
                        Start date
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

                    {new Date() < startDate ? (
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
                                      size={26}
                                      color="black"
                                    />
                                  </Pressable>
                                );
                              }}
                            >
                              <DateTimePicker
                                mode="single"
                                date={startDate}
                                colorScheme="green"
                                // minDate={minDaysFromNow}
                                minDate={datePickerMin}
                                onChange={(params) => {
                                  setDate(new Date(params.date));
                                }}
                                selectedItemColor="#49a579"
                                // timePickerContainerStyle={{width: "50%", height: "80%"}}
                              />
                            </Menu>
                          </Box>
                        </ZStack>
                      </View>
                    ) : null}
                  </HStack>
                </FormControl>
                {/* Maximum capacity */}
                <FormControl isInvalid={isInvalid.maxCapacity}>
                  <FormControl.Label
                    ml={1}
                    _text={{
                      fontFamily: "Regular Semi Bold",
                      fontSize: "lg",
                      color: "#191919",
                    }}
                  >
                    Max capacity
                  </FormControl.Label>
                  <Input
                    borderColor="#49a579"
                    rounded="30"
                    // fontFamily={"Regular Medium"}
                    // size="lg"
                    fontSize={16} // sets the font size to 16
                    px={2} // horizontal padding of 12px
                    py={2.5} // vertical padding; 2.5 in theme units may equal about 10px
                    mr={3}
                    w="93%"
                    placeholder="A digit between 2 and 50."
                    value={maxCapacity}
                    onChangeText={validateMaxCapacity}
                  />
                  {isInvalid.maxCapacity && (
                    <FormControl.ErrorMessage>
                      Please enter a digit between 2 and 50.
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
                    color={allowOthers ? "#49a579" : "bluegrey"}
                  />
                </FormControl>
                <Button
                  onPress={() => {
                    handleValidateUpload();
                    // console.log("Calendar icon pressed. info:", startDate,level,roundName,allowOthers,userData.data._id);
                  }}
                  mt="3"
                  width="100%"
                  // size="lg"

                  h={50} // sets the height to 50px
                  fontSize={16} // sets the font size to 16
                  px={2} // horizontal padding of 12px
                  py={2.5} // vertical padding; 2.5 in theme units may equal about 10px
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
                    mt="2"
                    width="100%"
                    // bg="rgba(255, 6, 30, 0.1)" // 0.5 is the alpha value for 50% transparency
                    backgroundColor={"rgba(250,250,250,0.2)"}
                    borderColor="red.350"
                    borderWidth={1}
                    _pressed={{
                      bg: "#rgba(250,250,250,0.5)",
                    }}
                  >
                    <HStack>
                      <SvgXml
                        xml={deleteSVG("#191919")}
                        width={28}
                        height={28}
                      />
                      <Text ml={1} fontFamily={"Regular Medium"} fontSize="lg">
                        Delete round
                      </Text>
                    </HStack>
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
                        Please note that it will delete all posts, scores, and
                        record that can be your important memories.
                      </Text>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button.Group space={2}>
                        <Button
                          rounded={30}
                          // shadow="7"
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
    </TouchableWithoutFeedback>
  );
};

const deleteSVG = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <path class="cls-1" d="M37.01,15.62c0,3.38,0,6.62,0,9.86,0,4.89,0,9.78,0,14.67,0,2.66-.94,3.61-3.53,3.62-5.77.01-11.54.02-17.31,0-2.14,0-3.26-1.03-3.26-3.06-.03-8.08-.01-16.15,0-24.23,0-.26.06-.52.1-.85h24ZM17.18,29.81c0,2.25,0,4.49,0,6.74,0,1.17.31,2.17,1.67,2.14,1.26-.03,1.57-1,1.57-2.09,0-4.6,0-9.21,0-13.81,0-1.16-.29-2.16-1.68-2.13-1.28.03-1.56.98-1.56,2.08,0,2.36,0,4.71,0,7.07ZM23.38,29.64c0,2.36,0,4.73,0,7.09,0,1.07.36,1.91,1.52,1.96,1.28.05,1.66-.85,1.65-1.98,0-4.67,0-9.35,0-14.02,0-1.11-.3-2.05-1.6-2.03-1.29.01-1.58.95-1.57,2.06.01,2.31,0,4.62,0,6.93ZM32.73,29.65c0-2.35,0-4.71,0-7.06,0-1.06-.34-1.9-1.52-1.94-1.29-.04-1.65.85-1.65,1.97,0,4.71,0,9.42,0,14.13,0,1.05.33,1.92,1.51,1.94,1.26.03,1.66-.83,1.65-1.97-.01-2.35,0-4.71,0-7.06Z"/>
    <path class="cls-1" d="M29.24,9.65c1.26,0,2.56,0,3.87,0q2.62,0,3.15,2.41,2.55.43,2.51,1.96H11.36q-.29-1.51,2.35-1.97c.42-2.35.47-2.4,2.97-2.4,1.31,0,2.62,0,3.49,0,3.02,0,6.05,0,9.07,0ZM26.12,6.91"/>
    <path class="cls-1" d="M24.62,6.22c-1.89,0-3.42,1.53-3.42,3.42h1.56c0-1.03.83-1.86,1.86-1.86s1.86.83,1.86,1.86h1.56c0-1.89-1.53-3.42-3.42-3.42Z"/>
  </svg>`;

export default RoundConfigurationScreen;
