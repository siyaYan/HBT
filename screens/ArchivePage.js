import React, { useEffect, useCallback, useMemo, useState, memo } from 'react';
import { FlatList, Platform } from 'react-native';
import { Center, Flex, HStack, Text, Box, Button } from 'native-base';
import * as Sentry from '@sentry/react-native';
import { useData } from '../context/DataContext';
import { useRound } from '../context/RoundContext';
import Background from './Background'; // Adjust path

const PAGE_SIZE = 20;

const RoundItem = memo(({ item, userId, onPress }) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'render',
      message: `Rendered RoundItem: ${item._id}`,
    });
  }, [item._id]);

  return (
    <Box w="100%" minWidth="320" style={{ marginVertical: 15 }}>
      <Button
        onPress={() => onPress(item._id)}
        rounded="30"
        mt="5"
        width="100%"
        height="100"
        size="lg"
        style={{
          borderWidth: 1,
          borderColor: '#49a579',
        }}
        backgroundColor={item.userId === userId ? '#49a579' : '#6666ff'}
      >
        <HStack justifyContent="space-between" marginY={2}>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Regular Semi Bold',
              fontSize: 20,
              alignSelf: 'center',
              paddingHorizontal: 10,
            }}
          >
            {item.name}
          </Text>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Regular Semi Bold',
              fontSize: 20,
              alignSelf: 'center',
            }}
          >
            Num: {item.num}
          </Text>
        </HStack>
        <Text
          style={{
            color: '#FFFFFF',
            fontFamily: 'Regular Semi Bold',
            fontSize: 20,
          }}
        >
          {item.startData} ---- {item.timeframe}
        </Text>
      </Button>
    </Box>
  );
});

RoundItem.displayName = 'RoundItem';

const ArchivePage = () => {
  const { userData } = useData();
  const { roundData } = useRound(); // Use roundData from RoundProvider
  const [page, setPage] = useState(1);
  const [archivedRounds, setArchivedRounds] = useState([]);

  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleDateString();
  }, []);

  const calculateEndDate = useCallback((startDate, level) => {
    return startDate; // Adjust as needed
  }, []);

  const handleRoundPress = useCallback(
    (roundId) => {
      Sentry.addBreadcrumb({
        category: 'interaction',
        message: `Pressed round: ${roundId}`,
      });
      console.log(`Pressed round: ${roundId}`);
      navigation.navigate("ForumStack", {
        screen: "ForumPage",
        params: { id: roundId },
      });
    },
    [navigation]
  );

  const generateCards = useCallback(() => {
    Sentry.addBreadcrumb({
      category: 'data',
      message: 'Generating archived rounds',
      data: { roundDataLength: roundData?.data?.length || 0 },
    });
    if (!roundData?.data) {
      Sentry.addBreadcrumb({
        category: 'data',
        message: 'No roundData available',
      });
      console.warn('No roundData available');
      return [];
    }

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const finishedRound = roundData.data
      .filter((item) => item.status === 'F')
      .slice(start, end);

    Sentry.addBreadcrumb({
      category: 'data',
      message: 'Filtered finished rounds',
      data: { filteredLength: finishedRound.length },
    });

    const roundList = finishedRound.map((item) => ({
      _id: item._id,
      name: item.name,
      userId: item.userId,
      startData: formatDate(item.startDate),
      num: item.roundFriends?.filter((people) => people.status === 'A').length || 0,
      timeframe: calculateEndDate(item.startDate, item.level),
    }));

    Sentry.addBreadcrumb({
      category: 'data',
      message: 'Generated roundList',
      data: { roundListLength: roundList.length },
    });

    console.log('Generated roundList:', roundList);
    return roundList;
  }, [roundData, page, formatDate, calculateEndDate]);

  const roundList = useMemo(() => generateCards(), [generateCards]);

  useEffect(() => {
    setArchivedRounds((prev) => [...prev, ...roundList]);
  }, [roundList]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const renderItem = useCallback(
    ({ item }) => (
      <RoundItem
        item={item}
        userId={userData?.data?._id}
        onPress={handleRoundPress}
      />
    ),
    [userData?.data?._id, handleRoundPress]
  );

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'Navigated to ArchivePage',
    });
    console.log('ArchivePage data:', { roundData, userData });
    return () => {
      setArchivedRounds([]);
    };
  }, [roundData, userData]);

  return (
    <Center w="100%">
      <Background />
      <Flex direction="column" justifyContent="flex-start">
        <Button
          title="Try!"
          onPress={() => {
            Sentry.captureException(new Error('Test error in development'));
            console.log('Sentry test error triggered');
          }}
        />
        {archivedRounds.length > 0 ? (
          <FlatList
            data={archivedRounds}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
            initialNumToRender={10}
            windowSize={5}
            removeClippedSubviews={Platform.OS === 'ios'}
            maxToRenderPerBatch={10}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            contentContainerStyle={{ flexGrow: 1, marginVertical: 5 }}
          />
        ) : (
          <Text>No Round History</Text>
        )}
      </Flex>
    </Center>
  );
};

export default ArchivePage;