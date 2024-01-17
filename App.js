import React, { useEffect } from 'react';
import { NativeBaseProvider, View } from 'native-base';
import AppContainer from './navigation/AppContainer';
import { DataProvider } from './context/DataContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Bold': require('./assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf'),
    'Semi Bold': require('./assets/fonts/Montserrat_Alternates/MontserratAlternates-SemiBoldItalic.ttf'),
    'Regular': require('./assets/fonts/Source_Sans_3/SourceSans3-VariableFont_wght.ttf'),
    'Regular Bold': require('./assets/fonts/Source_Sans_3/SourceSans3-Bold.ttf'),
    'Regular Semi Bold': require('./assets/fonts/Source_Sans_3/SourceSans3-SemiBold.ttf')
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