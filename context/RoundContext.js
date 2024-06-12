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
//   useEffect(() => {
//     const loadData = async () => {
//       try {
//         const savedRoundData = await AsyncStorage.getItem('roundData');
//         if (savedRoundData) {
//           setRoundData(JSON.parse(savedRoundData));
//         } else {
//           const fetchedRoundData = await getRoundInfo();
//           setRoundData(fetchedRoundData);
//           await AsyncStorage.setItem('roundData', JSON.stringify(fetchedRoundData));
//         }
//       } catch (error) {
//         console.error('Error loading round data:', error);
//       }
//     };

//     loadData();
//   }, []);

  // Save round data to AsyncStorage whenever roundData changes
//   useEffect(() => {
//     const saveData = async () => {
//       try {
//         await AsyncStorage.setItem('roundData', JSON.stringify(roundData));
//       } catch (error) {
//         console.error('Error saving round data:', error);
//       }
//     };

//     saveData();
//   }, [roundData]);

const updateRoundData = (updatedRound) => {
  setRoundData((prevRoundData) => 
    prevRoundData.map((round) => 
      round._id === updatedRound._id ? { ...round, ...updatedRound } : round
    )
  );
};

  return (
    <RoundContext.Provider value={{ roundData, updateRoundData }}>
      {children}
    </RoundContext.Provider>
  );
};
export default RoundContext;