import { Icon, Box, Text, Actionsheet } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import React, { useRef } from "react";

const AddImage = ({ isOpen, onOpen, onClose, navigation}) => {
  const [selectedImage, setSelectedImage] = useState(null);
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
        const res=result.assets[0].uri
        setSelectedImage(res);
        onClose()
        navigation.navigate("ForumStack", {screen: "ForumDraft", params: {res }});
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleTakePicture = async () => {
    const result = await ImagePicker.launchCameraAsync();

    try {
      if (!result.canceled) {
        setSelectedImage(result);

      }
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
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
  );
};

export default AddImage;
