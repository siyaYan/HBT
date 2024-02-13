
import { useState, useEffect } from "react";
import { Center, Box, VStack, Pressable, IconButton, Icon, Text, Actionsheet, useDisclose, Button, NativeBaseProvider, Flex } from 'native-base';
import { Avatar } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import OptionMenu from '../components/OptionMenu';
// import ImagePicker from 'react-native-image-picker';
// import { Camera } from 'react-native-camera';
import * as ImagePicker from 'expo-image-picker';
import Background from "../components/Background";
import { updateAvatar } from '../components/Endpoint';

const AccountScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  console.log(userData, 'inAccount');
  const [selectedImage, setSelectedImage] = useState(null);
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();


  useEffect(() => {
    (async () => {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraPermission.status !== 'granted' || mediaLibraryPermission.status !== 'granted') {
        alert('Permission to access camera and media library is required!');
      }
    })();
  }, []);

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setSelectedImage(result);
      console.log('Captured Image Result:', result);
      updateUserData({
      token: userData.token,
      data: userData.data,
      avatar: result.assets[0].uri
    })
      handleUploadImage();
    }
    // console.log(selectedImage)

  };

  const handleTakePicture = async () => {
    const result = await ImagePicker.launchCameraAsync();

    if (!result.canceled) {
      setSelectedImage(result);
      console.log('Take Image Result:', result);
      updateUserData({
        token: userData.token,
        data: userData.data,
        avatar: result.assets[0].uri
      })
      // console.log('Take Image Result:', result);
      handleUploadImage();
    }
    // console.log(selectedImage)

  };


  const handleUploadImage = async () => {
    // Implement image upload to backend here
    // You can use the 'selectedImage' state to get the image data
    const response = await updateAvatar(userData.token,userData.data.email,userData.avatar);
    if(response.data){
      console.log(response.data,"got")
      const newData = userData.data;
      newData.profileImageUrl = response.data.profileImageUrl;
      updateUserData({
        ...userData,
        data:newData
      })
    }
  };

  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems='center'>
        <OptionMenu />
        <Box safeArea py='2' w="100%" maxW="290">
          <VStack space={3} alignItems='center' >
            <Pressable onPress={onOpen}>
              <Box py='2' alignItems="center" justifyContent="center" >
                {selectedImage ?
                  (
                    <Avatar bg='white' mb='1' size="lg" source={{ uri: selectedImage.assets[0].uri }} >
                      
                      <Avatar.Badge
                        bg="white"
                        position="absolute"
                        top={0}
                        right={0}
                      >
                        <Ionicons name="settings-sharp" size={16} color="black" />
                      </Avatar.Badge>
                    </Avatar>
                    ) :
                  (
                    <Avatar bg='white' mb='1' size="lg" source={{ uri:userData.avatar}}>
                      <Avatar.Badge
                        bg="white"
                        position="absolute"
                        top={0}
                        right={0}
                      >
                        <Ionicons name="settings-sharp" size={16} color="black" />
                      </Avatar.Badge>
                    </Avatar>)}
                {userData.data.nickname}
              </Box>
            </Pressable>
          </VStack>
        </Box>
      </Flex>
      <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
        <Actionsheet.Content>
          <Box w="100%" h={60} px={4} justifyContent="center" alignItems='center'>
            <Text fontSize="16" color="gray.500" _dark={{
              color: "gray.300"
            }}>
              Pick photo from
            </Text>
          </Box>
          <Actionsheet.Item onPress={handleTakePicture} alignItems='center' startIcon={<Icon as={MaterialIcons} size="6" name="camera-alt" />}>
            Take Photo
          </Actionsheet.Item>
          <Actionsheet.Item onPress={handleChooseImage} alignItems='center' startIcon={<Icon as={MaterialIcons} name="camera" size="6" />}>
            Photo Album
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </NativeBaseProvider>
  );
};

export default AccountScreen;
