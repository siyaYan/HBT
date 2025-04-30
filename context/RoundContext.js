import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useData } from '../context/DataContext';
import * as Sentry from '@sentry/react-native';
import debounce from 'lodash.debounce'; // Install: npm install lodash

const RoundContext = createContext();

export const useRound = () => useContext(RoundContext);

// Utility functions
const saveToStorage = async (key, value) => {
  try {
    Sentry.addBreadcrumb({
      category: 'storage',
      message: `Saving ${key} to AsyncStorage`,
      data: { size: JSON.stringify(value).length },
    });
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
    Sentry.captureException(error);
  }
};

const loadFromStorage = async (key, defaultValue = null) => {
  try {
    const storedValue = await AsyncStorage.getItem(key);
    const result = storedValue ? JSON.parse(storedValue) : defaultValue;
    Sentry.addBreadcrumb({
      category: 'storage',
      message: `Loaded ${key} from AsyncStorage`,
      data: { hasValue: !!storedValue },
    });
    return result;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    Sentry.captureException(error);
    return defaultValue;
  }
};

const isRoundAccepted = (round, currentUserId) => {
  return (
    round.userId === currentUserId ||
    round.roundFriends?.some(
      (friend) => friend.id === currentUserId && friend.status === 'A'
    )
  );
};

export const RoundProvider = ({ children }) => {
  const { userData } = useData();
  const [roundData, setRoundData] = useState({ data: [] });
  const [acceptRoundData, setAcceptRoundData] = useState({ data: [] });

  // Load rounds on mount
  useEffect(() => {
    const loadRounds = async () => {
      const storedRounds = await loadFromStorage('roundData', { data: [] });
      setRoundData(storedRounds);
      console.log('Loaded roundData:', storedRounds); // Debug log
    };
    loadRounds();
  }, []);

  // Debounced save to AsyncStorage
  const debouncedSave = useMemo(
    () =>
      debounce((data) => {
        saveToStorage('roundData', data);
      }, 2000),
    []
  );

  useEffect(() => {
    debouncedSave(roundData);
    return () => debouncedSave.cancel(); // Cleanup on unmount
  }, [roundData, debouncedSave]);

  // Memoized accepted rounds computation
  const updateAcceptRoundData = useCallback(
    (newRounds) => {
      if (!userData?.data?._id) {
        console.warn('No userId available for acceptRoundData'); // Debug log
        return;
      }
      const acceptedRounds = newRounds.data.filter((round) =>
        isRoundAccepted(round, userData.data._id)
      );
      setAcceptRoundData({ data: acceptedRounds });
      console.log('Updated acceptRoundData:', acceptedRounds); // Debug log
      Sentry.addBreadcrumb({
        category: 'data',
        message: 'Updated acceptRoundData',
        data: { acceptedRoundsCount: acceptedRounds.length },
      });
    },
    [userData?.data?._id]
  );
  
  useEffect(() => {
    updateAcceptRoundData(roundData);
  }, [roundData, userData, updateAcceptRoundData]);

  // Update rounds and accepted rounds
  const updateRounds = useCallback(
    (newRounds) => {
      setRoundData(newRounds);
      updateAcceptRoundData(newRounds);
    },
    [updateAcceptRoundData]
  );

  // Insert or update a single round
  const insertRoundData = useCallback(
    (newRound) => {
      setRoundData((prev) => {
        const exists = prev.data.some((round) => round._id === newRound._id);
        const updatedData = exists
          ? prev.data.map((round) =>
              round._id === newRound._id ? newRound : round
            )
          : [...prev.data, newRound];
        const newState = { ...prev, data: updatedData };
        updateAcceptRoundData(newState);
        console.log('Inserted round:', newRound._id); // Debug log
        return newState;
      });
    },
    [updateAcceptRoundData]
  );

  // Insert or update a friend in a round
  const insertRoundFriendList = useCallback(
    (roundId, newFriend) => {
      setRoundData((prev) => {
        const updatedData = prev.data.map((round) => {
          if (round._id === roundId) {
            const friendExists = round.roundFriends.some(
              (f) => f._id === newFriend._id
            );
            return {
              ...round,
              roundFriends: friendExists
                ? round.roundFriends.map((f) =>
                    f._id === newFriend._id ? newFriend : f
                  )
                : [...round.roundFriends, newFriend],
            };
          }
          return round;
        });
        const newState = { ...prev, data: updatedData };
        updateAcceptRoundData(newState);
        console.log('Inserted friend to round:', roundId); // Debug log
        return newState;
      });
    },
    [updateAcceptRoundData]
  );

  // Delete a round
  const deleteRoundData = useCallback(
    (roundId) => {
      setRoundData((prev) => {
        const updatedData = prev.data.filter((round) => round._id !== roundId);
        const newState = { ...prev, data: updatedData };
        updateAcceptRoundData(newState);
        console.log('Deleted round:', roundId); // Debug log
        return newState;
      });
    },
    [updateAcceptRoundData]
  );

  // Delete a friend from a round
  const deleteRoundFriend = useCallback(
    (roundId, friendId) => {
      setRoundData((prev) => {
        const updatedData = prev.data.map((round) => {
          if (round._id === roundId) {
            return {
              ...round,
              roundFriends: round.roundFriends.filter(
                (friend) => friend.id !== friendId
              ),
            };
          }
          return round;
        });
        const newState = { ...prev, data: updatedData };
        updateAcceptRoundData(newState);
        console.log('Deleted friend from round:', { roundId, friendId }); // Debug log
        return newState;
      });
    },
    [updateAcceptRoundData]
  );

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      roundData,
      acceptRoundData,
      updateRounds,
      updateAcceptRoundData,
      insertRoundData,
      deleteRoundData,
      deleteRoundFriend,
      insertRoundFriendList,
    }),
    [
      roundData,
      acceptRoundData,
      updateRounds,
      updateAcceptRoundData,
      insertRoundData,
      deleteRoundData,
      deleteRoundFriend,
      insertRoundFriendList,
    ]
  );

  return <RoundContext.Provider value={contextValue}>{children}</RoundContext.Provider>;
};

export default RoundContext;