import { Icon, Box, Text, Actionsheet } from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
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
        const res={
          uri:result.assets[0].uri,
          type: result.assets[0].type,
          name: result.assets[0].fileName, 
        }
        // console.log(res)
        setSelectedImage(res);
        onClose()
        navigation.navigate("ForumStack", {screen: "ForumDraft", params: {res }});
      }
    } catch (e) {
      console.log(e.message);
    }
  };

    const handleTakePicture = async () => {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.6, // Reduce image quality
        allowsEditing: true,
      });
    
      try {
        if (!result.canceled) {
          // Compress the image before upload
          const compressedImage = await ImageManipulator.manipulateAsync(
            result.assets[0].uri,
            [{ resize: { width: 800 } }], // Reduce resolution
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress quality
          );
    
          setSelectedImage(compressedImage); // Update UI with compressed image
          onClose()
          navigation.navigate("ForumStack", {screen: "ForumDraft", params: {compressedImage }});
        }
      } catch (e) {
        console.log(e.message);
      }
    };
  // const handleTakePicture = async () => {
  //   const result = await ImagePicker.launchCameraAsync();

  //   try {
  //     if (!result.canceled) {
  //       setSelectedImage(result);
  //       onClose()
  //       navigation.navigate("ForumStack", {screen: "ForumDraft", params: {result }});
  //     }
  //   } catch (e) {
  //     console.log(e.message);
  //   }
  // };
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
