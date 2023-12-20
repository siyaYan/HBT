// DataContext.js
import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const useData = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const [userData, setUserData] = useState({ userName: '', token: '' });

  const updateUserData = (newUserData) => {
    setUserData(newUserData);
  };

  return (
    <DataContext.Provider value={{ userData, updateUserData }}>
      {children}
    </DataContext.Provider>
  );
};
