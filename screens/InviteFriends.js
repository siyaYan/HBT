import { useState, useEffect } from "react";
import {
  Center,
  Box,
  VStack,
  Pressable,
  IconButton,
  Icon,
  Text,
  Actionsheet,
  useDisclose,
  Button,
  NativeBaseProvider,
  Flex,
} from "native-base";
import { Avatar } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Background from "../components/Background";

const AccountScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();

  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems="center">
        <Box safeArea py="2" w="100%" maxW="290">
          <VStack space={3} alignItems="center">
            <Box py="2" alignItems="center" justifyContent="center">
              <Avatar
                bg="white"
                mb="1"
                size="lg"
                source={{ uri: userData.avatar.uri }}
              >
                <Avatar.Badge bg="white" position="absolute" top={0} right={0}>
                  <Ionicons name="settings-sharp" size={16} color="black" />
                </Avatar.Badge>
              </Avatar>
              <Text fontFamily={"Regular"} fontSize="lg">
                {userData.data.nickname}
              </Text>
            </Box>

            <Box safeArea w="100%" maxW="300" alignItems="center">
              <Text
                fontFamily={"Bold"}
                fontSize={"3xl"}
                style={{ marginTop: "50%" }}
              >
                Invite friend Page
              </Text>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </NativeBaseProvider>
  );
};

export default AccountScreen;
