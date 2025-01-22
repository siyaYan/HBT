import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  IconButton,
  Text,
  Pressable,
  Button,
  NativeBaseProvider,
  Flex,
} from "native-base";
import { Avatar } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import Background from "../components/Background";



const AppHomeScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  const handleAvatarPress = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate("MainStack", { screen: "Account" });
  };
  // useEffect(() => {
  //   // Fetch or update avatar dynamically
  //   // userData=useData().useData
  //   console.log(userData, "inHome");
  // }, [userData]);

  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems="center" justifyContent="center">
        <Box
          safeArea
          w="100%"
          maxW="300"
          h="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontFamily={"Bold"} fontSize={30}>
            APP Home Page
          </Text>
          <Button
            mt="2"
            width="100%"
            size="lg"
            rounded="30"
            shadow="6"
            bg="#49a579"
            _text={{
              color: "#f9f8f2",
              fontFamily: "Regular Medium",
              fontSize: "lg",
            }}
            _pressed={{
              // below props will only be applied on button is pressed
              bg: "emerald.600",
              _text: {
                color: "warmGray.50",
              },
            }}
            onPress={() => {
              navigation.navigate("LoginStack", { screen: "Login" });
            }}
          >
            Login
          </Button>
        </Box>
      </Flex>
    </NativeBaseProvider>
  );
};

export default AppHomeScreen;
