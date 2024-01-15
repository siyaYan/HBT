import React, { useEffect } from 'react';
import { NativeBaseProvider, View } from 'native-base';
import AppContainer from './navigation/AppContainer';
import { DataProvider } from './context/DataContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Black': require('./assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf'),
  });
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  },[])

  if (!fontsLoaded ) {
    return null;
  }else{
    SplashScreen.hideAsync();
  }


  return (    
    <NativeBaseProvider>
      <DataProvider>
        <AppContainer />
      </DataProvider>
    </NativeBaseProvider>
  );
};