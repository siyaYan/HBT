import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Pressable,
  Icon,
  Text,
  Actionsheet,
  useDisclose,
  NativeBaseProvider,
  Flex,
  View,
  Avatar,
  Badge,
  Divider,
} from "native-base";
import { useData } from "../context/DataContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Background from "../components/Background";
import { updateAvatar } from "../components/Endpoint";
import AntDesign from "@expo/vector-icons/AntDesign";

const AccountScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  const [selectedImage, setSelectedImage] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclose();
  const [topThree, setTopThree] = useState([]);

  const medalColors = {
    Gold: "rgb(255, 215, 0)", // Gold in RGB
    Silver: "rgb(192, 192, 192)", // Silver in RGB
    Bronze: "rgb(205, 127, 50)", // Bronze in RGB
  };

  useEffect(() => {
    (async () => {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (
        cameraPermission.status !== "granted" ||
        mediaLibraryPermission.status !== "granted"
      ) {
        alert("Permission to access camera and media library is required!");
      }
    })();
  }, []);

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    try {
      if (!result.canceled) {
        setSelectedImage(result);
        const response = await updateAvatar(
          userData.token,
          userData.data.email,
          result.assets[0]
        );
        updateUserData({
          ...userData,
          avatar: result.assets[0],
        });
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  // const handleTakePicture = async () => {
  //   const result = await ImagePicker.launchCameraAsync({
  //     quality: 0.6, // Reduce image quality
  //     allowsEditing: true,
  //   });

  //   try {
  //     if (!result.canceled) {
  //       // Compress the image before upload
  //       const compressedImage = await ImageManipulator.manipulateAsync(
  //         result.assets[0].uri,
  //         [{ resize: { width: 800 } }], // Reduce resolution
  //         { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress quality
  //       );

  //       setSelectedImage(compressedImage); // Update UI with compressed image

  //       const response = await updateAvatar(
  //         userData.token,
  //         userData.data.email,
  //         {
  //           uri: compressedImage.uri,
  //           name: "compressed.jpg",
  //           type: "image/jpeg",
  //         }
  //       );

  //       updateUserData({
  //         ...userData,
  //         avatar: compressedImage,
  //       });
  //     }
  //   } catch (e) {
  //     console.log(e.message);
  //   }
  // };
  const handleTakePicture = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.6, // Reduce image quality
      allowsEditing: true,
    });

    try {
      if (!result.canceled) {
        setSelectedImage(result); // Update UI with compressed image

        const response = await updateAvatar(
          userData.token,
          userData.data.email,
          result.assets[0]
        );

        updateUserData({
          ...userData,
          avatar: result.assets[0],
        });

      }
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems="center">
        <Box safeArea py="2" maxW="320" w={"100%"}>
          <VStack space={3} alignItems="center">
            <Pressable onPress={onOpen}>
              <Box py="2" alignItems="center" justifyContent="center">
                {selectedImage ? (
                  <Avatar
                    bg="white"
                    mb="1"
                    size="lg"
                    source={{ uri: selectedImage.assets[0].uri }}
                  >
                    <Avatar.Badge
                      bg="white"
                      position="absolute"
                      top={0}
                      right={0}
                    >
                      <Ionicons name="settings-sharp" size={16} color="black" />
                    </Avatar.Badge>
                  </Avatar>
                ) : (
                  <Avatar
                    bg="white"
                    mb="1"
                    size="lg"
                    source={{ uri: userData.avatar.uri }}
                  >
                    <Avatar.Badge
                      bg="white"
                      position="absolute"
                      top={0}
                      right={0}
                    >
                      <Ionicons name="settings-sharp" size={16} color="black" />
                    </Avatar.Badge>
                  </Avatar>
                )}
                <Text fontFamily={"Regular"} fontSize="lg">
                  {userData.data.nickname}
                </Text>
              </Box>
            </Pressable>
            <Divider
              my="2"
              _light={{
                bg: "muted.800",
              }}
              _dark={{
                bg: "muted.50",
              }}
            />
            <Box py="2" w={"100%"} alignItems="center" justifyContent="center">
              <Text style={{ fontSize: 18, fontFamily: "Semi Bold" }}>
                Credits: {userData.data.credit}
              </Text>
              <View
                style={{
                  width: "90%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: "10%",
                  marginVertical: "10%",
                }}
              >
                <View>
                  <AntDesign
                    name="Trophy"
                    size={50}
                    color={medalColors["Gold"] || "#49a579"}
                  />
                  <Badge
                    colorScheme="coolGray" // or use any other color scheme if needed
                  >
                    <Text style={{ fontSize: 16 }}>
                      {
                        userData.data.medals.filter((item) => item == "Gold")
                          .length
                      }
                    </Text>
                  </Badge>
                </View>
                <View>
                  <AntDesign
                    name="Trophy"
                    size={50}
                    color={medalColors["Silver"] || "#49a579"}
                  />
                  <Badge
                    colorScheme="coolGray" // or use any other color scheme if needed
                  >
                    <Text style={{ fontSize: 16 }}>
                      {
                        userData.data.medals.filter((item) => item == "Silver")
                          .length
                      }
                    </Text>
                  </Badge>
                </View>
                <View>
                  <AntDesign
                    name="Trophy"
                    size={50}
                    color={medalColors["Bronze"] || "#49a579"}
                  />
                  <Badge
                    colorScheme="coolGray" // or use any other color scheme if needed
                  >
                    <Text style={{ fontSize: 16 }}>
                      {
                        userData.data.medals.filter((item) => item == "Bronze")
                          .length
                      }
                    </Text>
                  </Badge>
                </View>
              </View>
            </Box>
          </VStack>
        </Box>
      </Flex>
      <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
        <Actionsheet.Content>
          <Box
            w="100%"
            h={60}
            px={4}
            justifyContent="center"
            alignItems="center"
          >
            <Text
              fontSize="16"
              color="gray.500"
              _dark={{
                color: "gray.300",
              }}
            >
              Pick photo from
            </Text>
          </Box>
          <Actionsheet.Item
            onPress={handleTakePicture}
            alignItems="center"
            startIcon={<Icon as={MaterialIcons} size="6" name="camera-alt" />}
          >
            Take Photo
          </Actionsheet.Item>
          <Actionsheet.Item
            onPress={handleChooseImage}
            alignItems="center"
            startIcon={<Icon as={MaterialIcons} name="camera" size="6" />}
          >
            Photo Album
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </NativeBaseProvider>
  );
};

export default AccountScreen;
