import { useState, useEffect } from "react";
import * as SecureStore from 'expo-secure-store';
import {
  Center,
  Pressable,
  Divider,
  Box,
  Heading,
  HStack,
  VStack,
  IconButton,
  Button,
  NativeBaseProvider,
  Flex,
  Text,
} from "native-base";
import { Avatar } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import OptionMenu from "../components/OptionMenu";
import { Ionicons } from "@expo/vector-icons";
import Background from "../components/Background";

const SettingScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  console.log(userData, "inSetting");

  const handleAvatarPress = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate("AccountStack", { screen: "Account" });
  };

  const goAccountSetting = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate("AccountStack", { screen: "AccountSetting" });
  };

  const deleteCredentials = async () => {
    try {
      await SecureStore.deleteItemAsync("userCredentials");
      updateUserData({
        token: "",
        data: "",
        avatar: "",
      });
    } catch (error) {
      console.error("Failed to delete the credentials", error);
      // Handle the error, like showing an alert to the user
    }
  };
  const logout = async () => {
    try {
      await deleteCredentials();
      navigation.navigate("LoginStack", { screen: "Login" });
    } catch (error) {
      // Error clearing the credentials
    }
  };
  useEffect(() => {
    // Fetch or update avatar dynamically
    // userData=useData().useData
    console.log(userData, "inHome");
  }, [userData]);

  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems="center">
        <OptionMenu />

        <Box
          mt="5"
          width="90%"
          py="2"
          px="2"
          alignItems="center"
          justifyContent="center"
        >
          <Pressable onPress={handleAvatarPress}>
            {userData.avatar.uri ? (
              <Avatar
                bg="white"
                mb="1"
                size="md"
                source={{ uri: userData.avatar.uri }}
              />
            ) : (
              <Avatar size="md" bg="white" borderWidth={2}>
                <AntDesign name="user" size={30} color="black" />
              </Avatar>
            )}
          </Pressable>
          <Text >{userData.data.nickname}</Text>
          
        </Box>

        <Box safeArea w="90%" maxW="290">
          <VStack space={1} alignItems="left">
            <Heading
              size="sm"
              fontWeight="600"
              color="coolGray.800"
              _dark={{
                color: "warmGray.50",
              }}
            >
              System settings
            </Heading>

            <Divider
              my="2"
              _light={{
                bg: "muted.800",
              }}
              _dark={{
                bg: "muted.50",
              }}
            />

            <Box alignItems="center" justifyContent="center">
              <Button p={0} variant="unstyled" onPress={goAccountSetting}>
                <HStack>
                  <Avatar bg="white" size={6} borderWidth={2}>
                    <AntDesign name="user" size={15} color="black" />
                    <Avatar.Badge
                      bg="white"
                      position="absolute"
                      top={-4}
                      right={-4}
                    >
                      <Ionicons name="settings-sharp" size={8} color="black" />
                    </Avatar.Badge>
                  </Avatar>
                  <Text ml={2}>Account setting</Text>
                </HStack>
              </Button>
            </Box>

            <Divider
              my="2"
              _light={{
                bg: "muted.800",
              }}
              _dark={{
                bg: "muted.50",
              }}
            />

            <Box alignItems="center" justifyContent="center">
              <Button onPress={logout} size="md" p={0} variant="unstyled">
                <HStack>
                  <AntDesign name="logout" size={24} color="black" />
                  <Text ml={2}>Log out</Text>
                </HStack>
              </Button>
            </Box>

            <Divider
              my="2"
              _light={{
                bg: "muted.800",
              }}
              _dark={{
                bg: "muted.50",
              }}
            />
          </VStack>
        </Box>

      </Flex>
    </NativeBaseProvider>
  );
};

export default SettingScreen;
