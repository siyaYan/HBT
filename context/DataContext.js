// DataContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DataContext = createContext();

export const useData = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const [userData, setUserData] = useState({ data: '', token: '' });

  // Load data from AsyncStorage on component mount
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
        console.log(userData,'???')
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

  return (
    <DataContext.Provider value={{ userData, updateUserData }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
