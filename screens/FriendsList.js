import { useState, useEffect } from "react";
import { Box, Heading, IconButton,Text, Pressable, Button, NativeBaseProvider, Flex } from 'native-base';
import { Avatar } from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { useData } from '../context/DataContext';
import OptionMenu from "../components/OptionMenu";
import Background from "../components/Background";

// TODO: change the layout to match the new ios version
const FriendsScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  // console.log(userData, 'inHome');

  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems='center'>
        <OptionMenu  navigation={navigation}/>
        <Box safeArea w="100%" maxW="300" alignItems="center">
            <Text fontFamily={'Bold'} fontSize={"3xl"} style={{ marginTop:'50%',}} >Friends Page</Text>
        </Box >
      </Flex>

    </NativeBaseProvider>
  );
};

export default FriendsScreen;
