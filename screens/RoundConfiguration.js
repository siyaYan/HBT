import React from 'react';
import {
  Input,
  Icon,
  Pressable,
  Center,
  IconButton,
  Actionsheet,
  useDisclose,
  NativeBaseProvider,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { Avatar } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import {
  VStack,
  HStack,
  FormControl,
  Button,
  Box,
  Heading,
  Text,
  Label,
} from "native-base";
import {
  resetEmail,
  resetProfile,
  resetSendEmail,
} from "../components/Endpoint";
import { useData } from "../context/DataContext";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Background from "../components/Background";
import { updateAvatar } from "../components/Endpoint";


const RoundConfiguration = ({ navigation }) => {
  const [RoundStartDate, setRoundStartDate] = React.useState(new Date());
  // const date = new Date(roundStartDate);
  return (
    <NativeBaseProvider>
    <Background />
      <Center w="100%">
        <Background />
        <VStack space={3} mt="10" style={{justifyContent: 'center'}} >
        {/* <FormControl isInvalid={errors.nickname}>
              <FormControl.Label
                ml={1}
                _text={{
                  fontFamily: "Regular Semi Bold",
                  fontSize: "lg",
                  color: "#191919",
                }}
              >
                Nickname
              </FormControl.Label> */}
              <Text>Round name</Text>
        {/* <Box flexDir="row" w="80%">
                <Input
                  borderColor="#49a579"
                  rounded="30"
                  fontFamily={"Regular Medium"}
                  size="lg"
                  mr={3}
                  w="93%"
                  placeholder="e.g. xxx"
                /></Box>
                <Text>Level</Text> */}
        <Text>Start date</Text>
        {/* Start Date Picker */}
       
        <Text>End date</Text>
        <Text>Maximum capacity</Text>
        <Text>Allow others to invite friends</Text>
        </VStack>
        
      </Center>
    </NativeBaseProvider>
  );
};


export default RoundConfiguration;