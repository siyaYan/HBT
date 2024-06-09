import React, { useEffect } from "react";
import { NativeBaseProvider, View, extendTheme } from "native-base";
import AppContainer from "./navigation/AppContainer";
import { DataProvider } from "./context/DataContext";
import { RoundProvider } from "./context/RoundContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
  const [fontsLoaded] = useFonts({
    Bold: require("./assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf"),
    "Semi Bold": require("./assets/fonts/Montserrat_Alternates/MontserratAlternates-SemiBoldItalic.ttf"),
    Regular: require("./assets/fonts/Source_Sans_3/SourceSans3-VariableFont_wght.ttf"),
    "Regular Bold": require("./assets/fonts/Source_Sans_3/SourceSans3-Bold.ttf"),
    "Regular Semi Bold": require("./assets/fonts/Source_Sans_3/SourceSans3-SemiBold.ttf"),
    "Regular Medium": require("./assets/fonts/Source_Sans_3/SourceSans3-Medium.ttf"),
  });
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return null;
  } else {
    SplashScreen.hideAsync();
  }

  const theme = extendTheme({
    components: {
      Button: {
        // Can simply pass default props to change default behaviour of components.
        baseStyle: {
          rounded: 30,
          shadow: "6",
          // color: "#49a579",
          bg: "#49a579",
        },
      },
      Input: {
        baseStyle: {
          borderColor: "#49a579",
          _focus: {
            borderColor: "#49a579",
          },
          rounded: 30,
          fontFamily: "Regular Medium",
        },
      },
      Text: {
        baseStyle: {
          fontFamily: "Regular Medium",
        },
      },
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <DataProvider>
        <RoundProvider>
          <AppContainer />
        </RoundProvider>
      </DataProvider>
    </NativeBaseProvider>
  );
}
