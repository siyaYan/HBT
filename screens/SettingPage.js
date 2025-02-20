import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  Pressable,
  Divider,
  Box,
  HStack,
  VStack,
  Button,
  NativeBaseProvider,
  Flex,
  Text,
} from "native-base";
import { Avatar } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import OptionMenu from "../components/OptionMenu";
import Background2 from "../components/Background2";
import { SvgXml } from "react-native-svg";

const SettingScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  useEffect(() => {
    console.log(userData, "inSetting");
  }, [userData]);

  const handleAvatarPress = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate("AccountStack", { screen: "Account" });
  };

  const goAccountSetting = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate("AccountStack", { screen: "AccountSetting" });
  };

  const logout = async () => {
    try {
      await deleteCredentials();
      navigation.navigate("LoginStack", { screen: "Login" });
    } catch (error) {
      // Error clearing the credentials
    }
  };

  const goArchivePage = async () => {
    navigation.navigate("AccountStack", { screen: "Archive" });
  };

  const deleteCredentials = async () => {
    try {
      await deleteItemAsyncs(["userData"]);
      updateUserData({
        token: "",
        data: "",
        avatar: "",
      });
      const allKeys = await AsyncStorage.getAllKeys(); // Get all keys from AsyncStorage
      const matchingKeys = allKeys.filter((key) =>
        key.startsWith(`lastCheck_1`)
      ); // Filter keys that match the pattern
      await deleteItemAsyncs(matchingKeys);
    } catch (error) {
      console.error("was unsucessful. to delete the credentials", error);
      // Handle the error, like showing an alert to the user
    }
  };

  const deleteItemAsyncs = async (keys) => {
    try {
      if (keys.length > 0) {
        await AsyncStorage.multiRemove(keys); // Remove all keys in one operation
        console.log(`Keys removed:`, keys);
      } else {
        console.log("No keys to remove.");
      }
    } catch (error) {
      console.error("Failed to delete keys:", error);
    }
  };
  return (
    <NativeBaseProvider>
      <Background2 />
      <Flex direction="column" alignItems="center">
        <OptionMenu navigation={navigation} />
        <Box
          mt="5"
          width="90%"
          px="2"
          alignItems="center"
          justifyContent="center"
        >
          <Pressable onPress={handleAvatarPress}>
            {userData.avatar && userData.avatar.uri ? (
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
          <Text fontFamily={"Regular"} fontSize="md">
            {userData.data.nickname}
          </Text>
        </Box>

        <Box mt="2" w="90%" px="2">
          <VStack space={1} alignItems="left">
            <Text mt={1} fontFamily={"Regular Semi Bold"} fontSize="3xl">
              System settings
            </Text>
          </VStack>
        </Box>

        <Box mt="5" w="100%" px="2" bg="#f9f8f2" rounded="md">
          <VStack space={1} alignItems="left">
            <Box mt="3" alignItems="center" justifyContent="center">
              <Button p={0} variant="unstyled" onPress={goAccountSetting}>
                <HStack>
                  {/* <Avatar bg="white" size={7} borderWidth={2}>
                    <Feather name="user" size={20} color="black" />
                    {/* <AntDesign name="user" size={15} color="black" /> */}
                  {/* <Avatar.Badge
                      bg="white"
                      position="absolute"
                      top={-4}
                      right={-4}
                    >
                      <Ionicons name="settings-sharp" size={8} color="black" />
                    </Avatar.Badge>
                  </Avatar> */}
                  <SvgXml
                    xml={accountSettingSVG("#191919")}
                    width={25}
                    height={25}
                    style={{ marginLeft: 20 }}
                  />
                  <Text ml={4} fontFamily={"Regular Medium"} fontSize="lg">
                    Account settings
                  </Text>
                  <SvgXml
                    xml={backSvg("606060")}
                    width={20}
                    height={20}
                    style={{
                      marginLeft: 150,
                      marginTop: 6,
                      transform: [{ scaleX: -1 }],
                    }}
                  />
                </HStack>
              </Button>
            </Box>

            <Divider
              my="2"
              width="90%"
              alignSelf="center"
              _light={{
                bg: "muted.300",
              }}
              _dark={{
                bg: "muted.700",
              }}
            />

            <Box alignItems="center" justifyContent="center">
              <Button
                onPress={goArchivePage}
                size="md"
                p={0}
                variant="unstyled"
              >
                <HStack>
                  {/* <Feather name="archive" size={26} color="black" /> */}
                  <SvgXml
                    xml={archiveSVG("#191919")}
                    width={25}
                    height={25}
                    style={{ marginLeft: 20 }}
                  />
                  <Text ml={4} fontFamily={"Regular Medium"} fontSize="lg">
                    Archived rounds
                  </Text>
                  <SvgXml
                    xml={backSvg("#606060")}
                    width={20}
                    height={20}
                    style={{
                      marginLeft: 152,
                      marginTop: 6,
                      transform: [{ scaleX: -1 }],
                    }}
                  />
                </HStack>
              </Button>
            </Box>

            <Divider
              my="2"
              width="90%"
              alignSelf="center"
              _light={{
                bg: "muted.300",
              }}
              _dark={{
                bg: "muted.700",
              }}
            />

            <Box alignItems="center" justifyContent="center">
              <Button onPress={logout} size="md" p={0} variant="unstyled">
                <HStack>
                  <SvgXml
                    xml={logOutSVG("#191919")}
                    width={25}
                    height={25}
                    style={{ marginLeft: 20 }}
                  />
                  <Text ml={4} fontFamily={"Regular Medium"} fontSize="lg">
                    Log out
                  </Text>
                  <SvgXml
                    xml={backSvg("#606060")}
                    width={20}
                    height={20}
                    style={{
                      marginLeft: 217,
                      marginTop: 6,
                      marginBottom: 15,
                      transform: [{ scaleX: -1 }],
                    }}
                  />
                </HStack>
              </Button>
            </Box>

            {/* <Divider
              my="2"
              width="90%"
              alignSelf="center"
              _light={{
                bg: "muted.300",
              }}
              _dark={{
                bg: "muted.700",
              }}
            /> */}
          </VStack>
        </Box>
      </Flex>
    </NativeBaseProvider>
  );
};

const accountSettingSVG = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <path class="cls-1" d="M6.87,34.24c-.18-.41-.37-.81-.54-1.22-1.98-4.68-2.21-9.45-.66-14.29,1.14-3.55,3.11-6.57,5.92-9.03,1.76-1.54,3.73-2.75,5.9-3.61,3.45-1.37,7-1.76,10.66-1.19.73.11,1.45.28,2.16.47,1.05.27,1.69,1.35,1.45,2.37-.26,1.1-1.26,1.78-2.36,1.57-.48-.09-.94-.23-1.42-.32-3.46-.62-6.79-.21-9.96,1.31-3.36,1.6-5.92,4.07-7.57,7.41-2.03,4.11-2.33,8.38-.78,12.71,1.54,4.31,4.42,7.47,8.59,9.37,3.59,1.64,7.33,1.94,11.12.85,4.95-1.43,8.48-4.56,10.57-9.28.3-.68.52-1.4.74-2.11.48-1.54,2.34-2.03,3.42-.89.54.56.69,1.24.49,1.98-.35,1.31-.83,2.57-1.44,3.78-1.1,2.17-2.54,4.1-4.33,5.76-.88.82-1.83,1.55-2.84,2.2-.1.06-.19.14-.28.21l-1.24.71c-.4.18-.79.37-1.19.55-3.69,1.62-7.54,2.17-11.52,1.5-5.65-.95-10.13-3.78-13.46-8.45-.17-.24-.34-.48-.51-.71-.32-.55-.63-1.1-.95-1.65Z"/>
    <path class="cls-1" d="M15.02,42.73c-.37-.24-.75-.47-1.12-.72-4.23-2.81-7.06-6.65-8.45-11.54-1.02-3.59-1.04-7.19-.06-10.8.61-2.26,1.58-4.35,2.92-6.28,2.12-3.04,4.86-5.34,8.22-6.89.67-.31,1.36-.57,2.06-.81,1.02-.35,2.15.19,2.52,1.17.4,1.06-.07,2.18-1.1,2.61-.45.19-.91.33-1.36.52-3.22,1.39-5.77,3.58-7.58,6.6-1.91,3.2-2.68,6.66-2.21,10.36.59,4.55,2.7,8.27,6.38,11.02,3.67,2.74,7.82,3.77,12.34,3.06,3.89-.62,7.18-2.43,9.73-5.44,3.33-3.93,4.55-8.49,3.67-13.58-.13-.73-.34-1.45-.55-2.17-.45-1.55.82-2.99,2.36-2.64.76.17,1.26.65,1.51,1.38.43,1.28.73,2.6.89,3.94.28,2.42.15,4.82-.42,7.19-.28,1.17-.67,2.3-1.15,3.4-.05.11-.08.22-.12.33l-.64,1.28c-.23.37-.45.75-.68,1.11-2.18,3.4-5.08,5.97-8.77,7.62-5.23,2.33-10.53,2.46-15.88.41-.27-.1-.55-.21-.82-.31-.57-.28-1.14-.57-1.7-.85Z"/>
    <path class="cls-1" d="M42.2,11.43l-1.08-.52.7-.97c.88-1.21-.44-2.78-1.79-2.14l-1.08.52-.32-1.15c-.4-1.44-2.45-1.39-2.78.06l-.27,1.17-1.1-.47c-1.37-.58-2.62,1.05-1.69,2.22l.75.94-1.05.57c-1.31.71-.81,2.7.68,2.7h1.2l-.21,1.18c-.26,1.47,1.61,2.32,2.54,1.15l.75-.94.79.9c.98,1.12,2.81.19,2.48-1.27l-.27-1.17,1.2-.06c1.49-.07,1.9-2.08.56-2.73ZM37.37,12.74c-.59,0-1.06-.48-1.06-1.06s.48-1.06,1.06-1.06,1.06.48,1.06,1.06-.48,1.06-1.06,1.06Z"/>
    <path class="cls-1" d="M31.47,21.35c0,3.63-2.94,6.59-6.55,6.56-3.58-.02-6.49-2.94-6.51-6.53-.02-3.62,2.93-6.55,6.57-6.54,3.61.01,6.49,2.89,6.5,6.5Z"/>
    <rect class="cls-1" x="17.83" y="37.83" width="14.33" height="4.1"/>
  </svg>`;

const archiveSVG = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
  <path class="cls-1" d="M46.62,31.09c0-5.63-3.58-10.43-8.57-12.28-.52-6.75-6.17-12.08-13.05-12.08s-12.53,5.33-13.05,12.08c-5,1.85-8.57,6.65-8.57,12.28,0,.01,0,.03,0,.04h0v.85c0,1.56,1.27,2.83,2.83,2.83h10.47c1.02,0,1.84-.82,1.84-1.84s-.82-1.84-1.84-1.84H7.06s0-.03,0-.04c0-3.66,2.11-6.84,5.17-8.39,1.08-.55,2.28-.89,3.54-.99-.12-.61-.19-1.23-.19-1.88s.06-1.22.18-1.8c.84-4.33,4.67-7.62,9.24-7.62s8.4,3.28,9.24,7.62c.11.58.18,1.19.18,1.8s-.07,1.27-.19,1.88c1.27.09,2.46.44,3.54.99,3.06,1.56,5.17,4.73,5.17,8.39,0,.01,0,.03,0,.04h-9.62c-1.02,0-1.84.82-1.84,1.84s.82,1.84,1.84,1.84h10.47c1.56,0,2.83-1.27,2.83-2.83v-.85h0s0-.03,0-.04Z"/><path class="cls-1" d="M32.64,27.81c.79-.64.9-1.8.26-2.59l-6.76-8.24c-.36-.44-.9-.69-1.46-.67-.56.01-1.09.28-1.43.73l-6.2,8.24c-.61.81-.45,1.97.36,2.58.33.25.72.37,1.1.37.56,0,1.11-.25,1.47-.73l3.17-4.21v17.2c0,1.02.82,1.84,1.84,1.84s1.84-.82,1.84-1.84v-16.84l3.21,3.92c.64.79,1.8.9,2.59.26Z"/></svg>
  </svg>`;

const logOutSVG = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <path class="cls-1" d="M2.09,23.99c.05-.44.08-.88.14-1.32.62-5.04,2.79-9.29,6.54-12.72,2.75-2.52,5.97-4.15,9.63-4.89,2.29-.46,4.6-.53,6.92-.19,3.67.53,6.95,1.96,9.84,4.27.58.46,1.12.97,1.65,1.48.77.76.8,2.01.08,2.78-.77.83-1.98.91-2.83.18-.37-.32-.7-.67-1.07-.98-2.69-2.26-5.78-3.56-9.29-3.83-3.71-.28-7.16.58-10.25,2.66-3.81,2.56-6.19,6.11-7,10.64-.81,4.51.12,8.68,2.79,12.41,2.29,3.21,5.39,5.33,9.22,6.27,5.01,1.22,9.62.27,13.79-2.79.6-.44,1.15-.95,1.69-1.46,1.18-1.1,3.04-.6,3.41.93.18.76-.01,1.42-.56,1.97-.96.96-2,1.82-3.13,2.56-2.04,1.34-4.24,2.29-6.62,2.84-1.17.27-2.36.43-3.56.49-.12,0-.23.03-.35.05h-1.43c-.43-.04-.87-.07-1.3-.11-4.01-.43-7.61-1.87-10.73-4.43-4.42-3.63-6.91-8.32-7.47-14.02-.03-.29-.06-.58-.09-.87,0-.64,0-1.27,0-1.91Z"/>
    <path class="cls-1" d="M40.87,27.03c-.11,0-.22,0-.33,0-6.97,0-13.93,0-20.9,0-.44,0-.87-.06-1.26-.3-.79-.5-1.16-1.4-.91-2.29.24-.87,1.01-1.46,1.94-1.49.1,0,.19,0,.29,0,6.95,0,13.9,0,20.85,0h.39c-.1-.11-.15-.17-.21-.23-.79-.79-1.58-1.57-2.36-2.36-.93-.94-.83-2.34.2-3.12.64-.48,1.59-.52,2.26-.08.19.13.36.28.53.44,1.98,1.97,3.96,3.95,5.93,5.93.8.8.83,2.06.02,2.87-2.04,2.05-4.08,4.1-6.13,6.13-.8.79-2.05.78-2.83,0-.8-.79-.83-2.05-.04-2.87.79-.82,1.6-1.61,2.41-2.41.06-.06.15-.09.23-.13-.03-.04-.05-.08-.08-.11Z"/>
  </svg>`;

const backSvg = () => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
    <defs>
      <style>.cls-1{fill:#000;stroke-width:0px;}</style>
    </defs>
    <path class="cls-1" d="M36.43,42.47c-.46,0-.93-.13-1.34-.39L10.01,26.04c-.74-.47-1.18-1.3-1.15-2.18.03-.88.52-1.68,1.29-2.11l25.07-13.9c1.21-.67,2.73-.23,3.4.97.67,1.21.23,2.73-.97,3.4l-21.4,11.87 21.54,13.77c1.16.74,1.5,2.29.76,3.45-.48.75-1.28,1.15-2.11,1.15Z"/>
  </svg>`;

export default SettingScreen;
