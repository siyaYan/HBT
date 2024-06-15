import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRoundInfo } from "../components/Endpoint";

const RoundContext = createContext();

export const useRound = () => {
  return useContext(RoundContext);
};

export const RoundProvider = ({ children }) => {
  const [roundData, setRoundData] = useState([]);

  // Load round data from AsyncStorage and fetch from endpoint on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedRoundData = await AsyncStorage.getItem('roundData');
        if (savedRoundData) {
          console.log('Loaded from AsyncStorage:', JSON.parse(savedRoundData));
          setRoundData(JSON.parse(savedRoundData));
        } else {
          const fetchedRoundData = await getRoundInfo();
          console.log('Fetched from Endpoint:', fetchedRoundData);
          setRoundData(fetchedRoundData);
          await AsyncStorage.setItem('roundData', JSON.stringify(fetchedRoundData));
        }
      } catch (error) {
        console.error('Error loading round data:', error);
      }
    };
  
    loadData();
  }, []);

  // Save round data to AsyncStorage whenever roundData changes
  // useEffect(() => {
  //   const saveData = async () => {
  //     try {
  //       await AsyncStorage.setItem('roundData', JSON.stringify(roundData));
  //     } catch (error) {
  //       console.error('Error saving round data:', error);
  //     }
  //   };

  //   saveData();
  // }, [roundData]);

  const updateRoundData = (updatedRound) => {
    console.log("Updating round data with", updatedRound);
  
    setRoundData((prevRoundData) => {
      if (prevRoundData && prevRoundData.data) {
        console.log("round context previous Round Data", prevRoundData.data);
        const updatedData = prevRoundData.data.map((round) =>
          round._id === updatedRound._id ? { ...round, ...updatedRound } : round
        );
        return { ...prevRoundData, data: updatedData };
      } else {
        console.error("Previous round data is undefined or does not contain data property");
        return prevRoundData; // Let's see if this will happen, I highly doubt this. As we hide the button from showing if there is no round.
      }
    });
  };

// const updateRoundData = (updatedRound) => {
//   console.log("Updating round data with", updatedRound);

//   setRoundData((prevRoundData) => {
//     console.log("round context previous Round Data", prevRoundData);
//     return prevRoundData.data.map((round) => 
//       round._id === updatedRound._id ? { ...round, ...updatedRound } : round
//     );
//   });
// };
// Update the entire roundData array
const updateRounds = (newRounds) => {
  console.log("round context",newRounds);
  setRoundData(newRounds);
};

  return (
    <RoundContext.Provider value={{ roundData, updateRoundData,updateRounds }}>
      {children}
    </RoundContext.Provider>
  );
};
export default RoundContext;