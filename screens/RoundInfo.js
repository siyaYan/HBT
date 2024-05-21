import React from 'react';
import { Box, Text, Button, FlatList, VStack, HStack, Divider, Heading,NativeBaseProvider } from 'native-base';
import Background from "../components/Background";
import Icon from 'react-native-vector-icons/Ionicons';

const RoundInfoScreen = ({ navigation }) => {
  // Dummy data for the round info and friends list
  const roundData = {
    roundName: "Champions League",
    level: "Advanced",
    startDate: "2024-04-01",
    endDate: "2024-04-30"
  };

  const friendsList = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'William Johnson' },
    // Add more friends as needed
  ];

  // Navigate to invite friend page
  const inviteFriend = () => {
    navigation.navigate('RoundStack',{screen:'RoundInviteFriend'})
  };
  // Navigate to Round Config page
  const goRoundConfig = () => {
    navigation.navigate('RoundStack', { screen: 'RoundConfig' });
  };

  return (
    <NativeBaseProvider>
    {/* <Center w="100%"> */}
      <Background />
      <Box flex={1} p={4}>
      <VStack space={4}>
        <HStack>
        <Heading size="lg" color="coolGray.800">{roundData.roundName}</Heading>
        {/* Edit round, which leads to Round Config page */}
        <Box alignItems="center" justifyContent="center">
              <Button p={0} variant="unstyled" onPress={goRoundConfig}>
              <Icon name="pencil" size={24} color="#000" />  {/* Pen icon */}
              </Button>
        </Box>
        </HStack>
        <Text fontSize="md">Level: {roundData.level}</Text>
        <Text fontSize="md">Start Date: {roundData.startDate}</Text>
        <Text fontSize="md">End Date: {roundData.endDate}</Text>
        <Divider my="2" />

        {/* Friend list dummy data */}
        <Text fontSize="lg" bold>Friends List</Text>
        <FlatList
          data={friendsList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Text py="1" px="2" fontSize="md">{item.name}</Text>}
        />
        <Button onPress={inviteFriend} mt="5">Invite Friend</Button>
      </VStack>
    </Box>
    </NativeBaseProvider>
  );
};

export default RoundInfoScreen;