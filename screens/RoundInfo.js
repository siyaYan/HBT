import React from 'react';
import { Box, Text, Button, FlatList, VStack, Divider, Heading } from 'native-base';

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

  return (
    <Box flex={1} p={4}>
      <VStack space={4}>
        <Heading size="lg" color="coolGray.800">{roundData.roundName}</Heading>
        <Text fontSize="md">Level: {roundData.level}</Text>
        <Text fontSize="md">Start Date: {roundData.startDate}</Text>
        <Text fontSize="md">End Date: {roundData.endDate}</Text>
        <Divider my="2" />
        <Text fontSize="lg" bold>Friends List</Text>
        <FlatList
          data={friendsList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Text py="1" px="2" fontSize="md">{item.name}</Text>}
        />
        <Button onPress={inviteFriend} mt="5">Invite Friend</Button>
      </VStack>
    </Box>
  );
};

export default RoundInfoScreen;