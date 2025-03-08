import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useData } from "../context/DataContext";

const RoundContext = createContext();

export const useRound = () => useContext(RoundContext);

const saveToStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

const loadFromStorage = async (key, defaultValue = null) => {
  try {
    const storedValue = await AsyncStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return defaultValue;
  }
};

const isRoundAccepted = (round, currentUserId) => {
  return (
    round.userId === currentUserId ||
    round.roundFriends.some(
      (friend) => friend.id === currentUserId && friend.status === "A"
    )
  );
};

export const RoundProvider = ({ children }) => {
  const { userData } = useData();
  const [roundData, setRoundData] = useState([]);
  const [acceptRoundData, setAcceptRoundData] = useState([]);

  useEffect(() => {
    const loadRounds = async () => {
      const storedRounds = await loadFromStorage("roundData", { data: [] });
      setRoundData(storedRounds);
      updateAcceptRoundData(storedRounds);
    };
    loadRounds();
  }, []);

  // Save to storage every 2 seconds (debounced)
  useEffect(() => {
    const saveToStorage = setTimeout(() => {
      AsyncStorage.setItem("roundData", JSON.stringify(roundData));
    }, 2000); // Adjust timing as needed

    return () => clearTimeout(saveToStorage);
  }, [roundData]);

  const updateAcceptRoundData = (newRounds) => {
    const acceptedRounds = newRounds.data.filter((round) =>
      isRoundAccepted(round, userData.data._id)
    );
    setAcceptRoundData({ data: acceptedRounds });
  };

  const updateRounds = (newRounds) => {
    setRoundData(newRounds);
    updateAcceptRoundData(newRounds);
  };

  const insertRoundData = (newRound) => {
    setRoundData((prev) => {
      const updatedData = prev.data.map((round) =>
        round._id === newRound._id ? newRound : round
      );
      if (!updatedData.some((round) => round._id === newRound._id)) {
        updatedData.push(newRound);
      }
      return { ...prev, data: updatedData };
    });
  };

  const insertRoundFriendList = (roundId, newFriend) => {
    setRoundData((prev) => {
      const updatedData = prev.data.map((round) => {
        if (round._id === roundId) {
          return {
            ...round,
            roundFriends: round.roundFriends.some(
              (f) => f._id === newFriend._id
            )
              ? round.roundFriends.map((f) =>
                  f._id === newFriend._id ? newFriend : f
                )
              : [...round.roundFriends, newFriend],
          };
        }
        return round;
      });
      return { ...prev, data: updatedData };
    });
  };

  const deleteRoundData = (roundId) => {
    setRoundData((prev) => {
      const updatedData = prev.data.filter((round) => round._id !== roundId);
      return { ...prev, data: updatedData };
    });
  };

  const deleteRoundFriend = (roundId, friendId) => {
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
      return { ...prev, data: updatedData };
    });
  };

  return (
    <RoundContext.Provider
      value={{
        roundData,
        acceptRoundData,
        insertRoundData,
        deleteRoundData,
        deleteRoundFriend,
        insertRoundFriendList,
      }}
    >
      {children}
    </RoundContext.Provider>
  );
};

export default RoundContext;
