
import * as SecureStore from 'expo-secure-store';
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

const AccountScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  console.log(userData, 'inAccount');
  const [selectedImage, setSelectedImage] = useState(null);
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();

  // const handleAvatarPress = () => {
  //   // Navigate to another screen when the Avatar is pressed
  //   console.log('rese')
  //   navigation.navigate('Test');
  // };

  const deleteCredentials = async () => {
    try {
      await SecureStore.deleteItemAsync('userCredentials');
      updateUserData({
        token: '',
        userName: '',
        avatar: ''
      })
    } catch (error) {
      console.error('Failed to delete the credentials', error);
      // Handle the error, like showing an alert to the user
    }
  };
  const logout = async () => {
    try {
      await deleteCredentials()
      navigation.navigate('LoginStack', { screen: 'Login' });
    } catch (error) {
      // Error clearing the credentials
    }
  };

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
      userName: userData.userName,
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
      // console.log('Take Image Result:', result);
      handleUploadImage();
    }
    // console.log(selectedImage)

  };


  const handleUploadImage = async () => {
    // Implement image upload to backend here
    // You can use the 'selectedImage' state to get the image data
    console.log('getin')
    console.log(userData.avatar,'updated');
  };

  return (
    <NativeBaseProvider>
      <Flex direction="column" alignItems='center'>
        <OptionMenu />
        <Box safeArea py='2' w="100%" maxW="290">
          <VStack space={3} alignItems='center' >
            <Pressable onPress={onOpen}>
              <Box py='2' alignItems="center" justifyContent="center" >
                {selectedImage ?
                  (
                    <Avatar bg='white' mb='1' size="lg" source={{ uri: selectedImage.assets[0].uri }} >
                      {userData.userName}
                    </Avatar>) :
                  (
                    <Avatar bg='white' mb='1' size="lg" borderWidth={2}>
                      <AntDesign name="user" size={40} color="black" />
                      <Avatar.Badge
                        bg="white"
                        position="absolute"
                        top={0}
                        right={0}
                      >
                        <Ionicons name="settings-sharp" size={16} color="black" />
                      </Avatar.Badge>
                    </Avatar>)}
                {userData.userName}
              </Box>
            </Pressable>
            <Button
              onPress={logout} size='md' p='1'
            >  Log out  </Button>
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
