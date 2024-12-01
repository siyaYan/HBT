import { useEffect } from "react";
import * as SecureStore from "expo-secure-store";
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
import { Ionicons } from "@expo/vector-icons";
import Background2 from "../components/Background2";
import Feather from "@expo/vector-icons/Feather";
import { deleteUser } from "../components/Endpoint";

const SettingScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  useEffect(() => {
    // Fetch or update avatar dynamically
    // userData=useData().useData
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

  const deleteCredentials = async () => {
    try {
      await SecureStore.deleteItemAsync("userData");
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

  const deleteAccount = async () => {
    // console.log(userData.data._id,userData.token)
    try {
      const data= await deleteUser(userData.data._id,userData.token)
      if (data.status == "success") {
        navigation.navigate("LoginStack", { screen: "Login" });
        await deleteCredentials();
      }
    } catch (error) {
      // Error clearing the credentials
    }
  };

  const goArchivePage = async () => {
    navigation.navigate("Archive");
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
          <Text fontFamily={"Regular"} fontSize="lg">
            {userData.data.nickname}
          </Text>
        </Box>

        <Box mt="10" w="90%" maxW="290">
          <VStack space={1} alignItems="left">
            <Text fontFamily={"Regular Semi Bold"} fontSize="2xl">
              System settings
            </Text>

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
                  <Avatar bg="white" size={7} borderWidth={2}>
                    <Feather name="user" size={20} color="black" />
                    {/* <AntDesign name="user" size={15} color="black" /> */}
                    <Avatar.Badge
                      bg="white"
                      position="absolute"
                      top={-4}
                      right={-4}
                    >
                      <Ionicons name="settings-sharp" size={8} color="black" />
                    </Avatar.Badge>
                  </Avatar>
                  <Text ml={2} fontFamily={"Regular Medium"} fontSize="lg">
                    Account settings
                  </Text>
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
              <Button
                onPress={goArchivePage}
                size="md"
                p={0}
                variant="unstyled"
              >
                <HStack>
                  <Feather name="archive" size={26} color="black" />
                  <Text ml={2} fontFamily={"Regular Medium"} fontSize="lg">
                    Archived rounds
                  </Text>
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
                  {/* <AntDesign name="logout" size={24} color="black" /> */}
                  <Feather name="log-out" size={26} color="black" />
                  <Text ml={2} fontFamily={"Regular Medium"} fontSize="lg">
                    Log out
                  </Text>
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
              <Button onPress={deleteAccount} size="md" p={0} variant="unstyled">
                <HStack>
                  {/* <Ionicons name="remove-circle-outline" size={30} color="red" /> */}
                  <Ionicons name="person-remove-outline" size={26} color="red" />
                  <Text ml={2} fontFamily={"Regular Medium"} fontSize="lg" style={{color:'red'}}>
                    Delete
                  </Text>
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
