import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import debounce from 'lodash.debounce'; // Install: npm install lodash

const DataContext = createContext();

export const useData = () => useContext(DataContext);

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
// const saveToStorage = async (key, value) => {
//   try {
//     const existing = await AsyncStorage.getItem(key);
//     if (existing) {
//       const existingData = JSON.parse(existing);
//       const mergedData = { ...existingData, ...value };
//       await AsyncStorage.setItem(key, JSON.stringify(mergedData));
//     } else {
//       await AsyncStorage.setItem(key, JSON.stringify(value));
//     }
//   } catch (error) {
//     Sentry.captureException(error);
//   }
// };

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

export const DataProvider = ({ children }) => {
  const [userData, setUserData] = useState({ data: '', token: '' });
  const [note, setNotes] = useState(0);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const savedUserData = await loadFromStorage('userData', { data: '', token: '' });
      setUserData(savedUserData);
      console.log('Loaded userData:', savedUserData); // Debug log
    };
    loadData();
  }, []);

  // Debounced save to AsyncStorage
  const debouncedSave = useMemo(
    () =>
      debounce((data) => {
        saveToStorage('userData', data);
      }, 2000),
    []
  );

  useEffect(() => {
    debouncedSave(userData);
    return () => debouncedSave.cancel(); // Cleanup on unmount
  }, [userData, debouncedSave]);

  // Memoized updateUserData
  const updateUserData = useCallback((newUserData) => {
    setUserData((prevUserData) => {
      const updated = { ...prevUserData, ...newUserData };
      // Only update if data has changed
      if (JSON.stringify(prevUserData) === JSON.stringify(updated)) {
        return prevUserData;
      }
      console.log('Updated userData:', updated); // Debug log
      Sentry.addBreadcrumb({
        category: 'data',
        message: 'Updated userData',
        data: { userId: updated.data?._id },
      });
      return updated;
    });
  }, []);

  // Memoized updateNotes
  const updateNotes = useCallback((newNote) => {
    setNotes((prevNote) => {
      if (prevNote === newNote) {
        return prevNote;
      }
      console.log('Updated note:', newNote); // Debug log
      Sentry.addBreadcrumb({
        category: 'data',
        message: 'Updated note',
        data: { note: newNote },
      });
      return newNote;
    });
  }, []);

  // Memoized context value
  const contextValue = useMemo(
    () => ({
      userData,
      updateUserData,
      note,
      updateNotes,
    }),
    [userData, updateUserData, note, updateNotes]
  );

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

export default DataContext;