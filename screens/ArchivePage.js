import React, { useEffect, useCallback, useMemo, useState, memo } from 'react';
import { FlatList, TouchableOpacity } from 'react-native'; // Replace RNButton
import { Center, Flex, HStack, Text, Box } from 'native-base';
import * as Sentry from '@sentry/react-native';
import Background from '../components/Background'; // Adjust path as needed

const PAGE_SIZE = 20; // Render 20 items initially

// Memoized RoundItem component
const RoundItem = memo(({ item, userId, onPress }) => (
  <Box w="100%" minWidth="320" style={{ marginVertical: 15 }}>
    <TouchableOpacity
      onPress={() => onPress(item._id)}
      style={{
        borderRadius: 30,
        marginTop: 5,
        width: '100%',
        height: 100,
        borderWidth: 1,
        borderColor: '#49a579',
        backgroundColor: item.userId === userId ? '#49a579' : '#6666ff',
        justifyContent: 'center',
        padding: 10,
      }}
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
    </TouchableOpacity>
  </Box>
));

// Ensure unique keys for memo comparison
RoundItem.displayName = 'RoundItem';

const ArchivePage = ({ route }) => {
  const { roundData, userData, handleRoundPress } = route.params || {};
  const [page, setPage] = useState(1);
  const [archivedRounds, setArchivedRounds] = useState([]);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const calculateEndDate = (startDate, level) => {
    const start = new Date(startDate);
    start.setDate(start.getDate() + level);
    return formatDate(start);
  };

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

    return roundList;
  }, [roundData, page]);

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
        userId={userData.data._id}
        onPress={handleRoundPress}
      />
    ),
    [userData.data._id, handleRoundPress]
  );

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: 'Navigated to ArchivePage',
    });
    return () => {
      setArchivedRounds([]); // Clean up on unmount
    };
  }, []);

  return (
    <Center w="100%">
      <Background />
      <Flex direction="column" justifyContent="flex-start">
        {archivedRounds.length > 0 ? (
          <FlatList
            data={archivedRounds}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
            initialNumToRender={10}
            windowSize={5}
            removeClippedSubviews={true}
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