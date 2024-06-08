// DataContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DataContext = createContext();

export const useData = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  {/* User Info */}
  const [userData, setUserData] = useState({ data: '', token: '' });

  // Load user data from AsyncStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedUserData = await AsyncStorage.getItem('userData');
        if (savedUserData) {
          setUserData(JSON.parse(savedUserData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadData();
  }, []);

  // Save data to AsyncStorage whenever userData changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        console.log('FirstGetData:',userData)
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    };

    saveData();
  }, [userData]);

  // const updateUserData = (newUserData) => {
  //   setUserData(newUserData);
  // };
  const updateUserData = (newUserData) => {
    setUserData((prevUserData) => ({ ...prevUserData, ...newUserData }));
  };
{/* Round Info */}
  const [rounds,setRounds] = useState([]);

  // Function to fetch round information
  const fetchRounds = async () => {
    try {
      // Replace this with your actual fetch call
      // const response = await fetch('API_ENDPOINT_FOR_ROUNDS');
    //   const data = await response.json();
    //   setRounds(data);
    // } catch (error) {
    //   console.error('Error fetching round information:', error);
    // Simulate fetching data from an API
    const dummyRounds = [
      { id: 1, roundName: 'Round 1', level: '21', startDate: '2024-05-14T17:00:00Z', maxCapacity: 20, allowOthers: true, status:'active',endDate: '2024-06-14T17:00:00Z'},
      // { id: 2, name: 'Round 2', level: '35', startDate: '2024-08-14T17:00:00Z', maxCapacity: 15, allowOthers: false, status:'pending' },
    ];
    setRounds(dummyRounds);
  } catch (error) {
    console.error('Error fetching round information:', error);
    }
  };  

  return (
    <DataContext.Provider value={{ userData, updateUserData, rounds, fetchRounds }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
