import { useState, useEffect } from "react";
import { Text } from 'react-native';
import { Box, Heading, IconButton, Pressable, Button, NativeBaseProvider, Flex } from 'native-base';
import { Avatar } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import OptionMenu from "../components/OptionMenu";
// import { useFonts } from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';

// TODO: change the layout to match the new ios version
const HomeScreen = ({ navigation, route }) => {
  // const [fontsLoaded] = useFonts({
  //   'Inter-Black': require('./assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf'),
  // });
  // useEffect(() => {
  //   async function prepare() {
  //     await SplashScreen.preventAutoHideAsync();
  //   }
  //   prepare();
  // },[])

  // if (!fontsLoaded ) {
  //   return null;
  // }else{
  //   SplashScreen.hideAsync();
  // }
  const { userData, updateUserData } = useData();
  console.log(userData, 'inHome');
  // const avatar=route.params;
  // console.log(avatar);

  const handleAvatarPress = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate('MainStack', { screen: 'Account' });
  };
  useEffect(() => {
    // Fetch or update avatar dynamically
    // userData=useData().useData
    console.log(userData, 'inHome');
  }, [userData]);

  return (
    <NativeBaseProvider>
      <Flex direction="column" alignItems='center'>
        <OptionMenu />
        <Pressable onPress={handleAvatarPress}>
          <Box py='5' px='2' alignItems="center" justifyContent="center">
            {userData.avatar ?
              (<Avatar bg='white' mb='1' size="md" source={{ uri: userData.avatar }} />) : (
                <Avatar bg='white' mb='1' size="md" borderWidth={2}>
                  <AntDesign name="user" size={30} color="black" />
                </Avatar>)}
                <Text  style={{ fontFamily: 'Inter-Black', fontSize: 30 }} >
                  {userData.data.nickname}
                  </Text>
          </Box>
        </Pressable>
        <Box py='5' px='2' safeArea w="100%" maxW="290" alignItems="center">
          
          {!userData ? <Button onPress={() => { navigation.navigate('LoginStack', { screen: 'Login' }) }}>Login</Button>: <Heading mt='140' size="lg" fontWeight="600" color="coolGray.300" _dark={{
            color: "Gray.50"
          }}>
            Home Page
          </Heading>}
          
        </Box >
      </Flex>

    </NativeBaseProvider>
  );
};

export default HomeScreen;
