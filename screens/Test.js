import { Menu, Pressable, Box, ZStack } from "native-base";
import React, { useRef } from "react";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

export default HoverEffectComponent = ({ navigation }) => {
  const [startDate, setDate] = useState(dayjs());
  const [show, setShow] = useState(false);
  const [dateText, setDateText] = useState("");

  const onChangeStartDate = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setDateText(selectedDate.toLocaleDateString());
      setShow(false);
    } else {
      setShow(Platform.OS === "ios");
    }
  };

  const showDatePicker = () => {
    setShow(true);
  };
  const minDaysFromNow = new Date(); // Start with today's date
  minDaysFromNow.setDate(minDaysFromNow.getDate() + 3); // 3 days
  return (
    <ZStack alignSelf="flex-end" mr="15%" mt="10%">
      <Box alignItems="flex-start">
        <Menu
          shadow={2}
          mr="20"
          w="280"
          trigger={(triggerProps) => {
            return (
              <Pressable accessibilityLabel="Options menu" {...triggerProps}>
                <AntDesign name="calendar" size={24} color="black" />
              </Pressable>
            );
          }}
        >
          <DateTimePicker
            mode="single"
            date={startDate}
            minDate={minDaysFromNow}
            onChange={(params) => setDate(params.date)}
          />
          {/* <Menu.Item px='0' onPress={inviteFriend}><AntDesign name="adduser" size={24} color="black" />Add a friend</Menu.Item> */}
          {/* <Menu.Item px="0">Test</Menu.Item>
          <Menu.Item px="0">Test</Menu.Item> */}
        </Menu>
      </Box>
    </ZStack>
  );
};
