import React from 'react';
import { Box, FlatList, Text, Button, VStack,NativeBaseProvider,Center } from 'native-base';
import Background from "../components/Background";

const RoundInviteFriendsScreen = ({ navigation }) => {
 // Dummy list of friends
 const friends = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Emily Johnson' },
    { id: '4', name: 'Michael Brown' }
    // Add more friends as needed
  ];
  // Navigate to Global add friend page
  const addFriend = () => {
    navigation.navigate('RoundStack', { screen: 'RoundConfig' });
  };

  return (
    <NativeBaseProvider>
    {/* <Center w="100%"> */}
      <Background />
      <Box flex={1} p={5}>
      <VStack space={4} flex={1}>
        <FlatList
          data={friends}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Text fontSize="md" py={2} px={3} borderBottomWidth="1" borderColor="coolGray.200">
              {item.name}
            </Text>
          )}
          showsVerticalScrollIndicator={true}
        />
        <Button
        onPress={addFriend}
          position="absolute"
          bottom="5"
          width="90%"
          alignSelf="center"
          mt="auto"
        >
          Add More Friends
        </Button>
      </VStack>
    </Box>
      {/* </Center> */}
    </NativeBaseProvider>
    
  );
};

export default RoundInviteFriendsScreen;