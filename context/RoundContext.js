import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRoundInfo,getRoundInvitation } from "../components/Endpoint";

const RoundContext = createContext();

export const useRound = () => {
  return useContext(RoundContext);
};

export const RoundProvider = ({ children }) => {
  const [roundData, setRoundData] = useState([]);
  const [roundInvitationData, setRoundInvitationData] = useState(null);


  // Load round data from AsyncStorage and fetch from endpoint on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedRoundData = await AsyncStorage.getItem("roundData");
        if (savedRoundData) {
          // console.log('Loaded from AsyncStorage:', JSON.parse(savedRoundData));
          setRoundData(JSON.parse(savedRoundData));
        } else {
          const fetchedRoundData = await getRoundInfo();
          // console.log('Fetched from Endpoint:', fetchedRoundData);
          setRoundData(fetchedRoundData);
          await AsyncStorage.setItem(
            "roundData",
            JSON.stringify(fetchedRoundData)
          );
        }
      } catch (error) {
        console.error("Error loading round data:", error);
      }
    };

    loadData();
  }, []);

  // insert new round
  const insertRoundData = (newRound) => {
    setRoundData((prevRoundData) => {
      if (prevRoundData && prevRoundData.data) {
        const updatedData = [...prevRoundData.data, newRound];
        return { ...prevRoundData, data: updatedData };
      } else {
        console.error(
          "Previous round data is undefined or does not contain data property"
        );
        return prevRoundData;
      }
    });
  };
  // update existing round
  const updateRoundData = (updatedRound) => {
    // console.log("Updating round data with", updatedRound);

    setRoundData((prevRoundData) => {
      if (prevRoundData && prevRoundData.data) {
        // console.log("round context previous Round Data", prevRoundData.data);
        const updatedData = prevRoundData.data.map((round) =>
          round._id === updatedRound._id ? { ...round, ...updatedRound } : round
        );
        // console.log("updateRoundData",updatedData);
        return { ...prevRoundData, data: updatedData };
      } else {
        console.error(
          "Previous round data is undefined or does not contain data property"
        );
        return prevRoundData; // Let's see if this will happen, I highly doubt this. As we hide the button from showing if there is no round.
      }
    });
  };
  //add new to the round friend list (existing round)
  const insertRoundFriendList = (roundId, newFriend) => {
    console.log("inser new friend in round context", newFriend);
    setRoundData((prevRoundData) => {
      if (prevRoundData && prevRoundData.data) {
        const updatedData = prevRoundData.data.map((round) => {
          if (round._id === roundId) {
            // Clone the round object and update roundFriends by appending newFriend
            const updatedRound = {
              ...round,
              roundFriends: [...round.roundFriends, newFriend],
            };
            return updatedRound;
          } else {
            return round;
          }
        });
        return { ...prevRoundData, data: updatedData };
      } else {
        console.error(
          "Previous round data is undefined or does not contain data property"
        );
        return prevRoundData;
      }
    });
  };

  // Update the entire roundData array
  const updateRounds = (newRounds) => {
    // console.log("round context",newRounds);
    setRoundData(newRounds);
  };

  // delete a round
  const deleteRoundData = (roundId) => {
    setRoundData((prevRoundData) => {
      if (prevRoundData && prevRoundData.data) {
        const updatedData = prevRoundData.data.filter(
          (round) => round._id !== roundId
        );
        AsyncStorage.setItem(
          "roundData",
          JSON.stringify({ ...prevRoundData, data: updatedData })
        );
        return { ...prevRoundData, data: updatedData };
      } else {
        console.error(
          "Previous round data is undefined or does not contain data property"
        );
        return prevRoundData;
      }
    });
  };
  // round invitation data
 // Fetch and set round invitation data
 const loadRoundInvitationData = async (token) => {
  try {
    const data = await getRoundInvitation(token);
    setRoundInvitationData(data);
  } catch (error) {
    console.error("Error loading round invitation data:", error);
  }
};
  return (
    <RoundContext.Provider
      value={{
        roundData,
        updateRoundData,
        updateRounds,
        insertRoundData,
        deleteRoundData,
        insertRoundFriendList,
        roundInvitationData,
        loadRoundInvitationData,

      }}
    >
      {children}
    </RoundContext.Provider>
  );
};
export default RoundContext;
