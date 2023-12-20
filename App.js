import React from 'react';
import { NativeBaseProvider } from 'native-base';
import AppContainer from './navigation/AppContainer';
import { DataProvider } from './context/DataContext';

export default function App() {

  return (
    <NativeBaseProvider>
      <DataProvider>
        <AppContainer />
      </DataProvider>
    </NativeBaseProvider>
  );
};