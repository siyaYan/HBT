import React, { useEffect } from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import AppContainer from "./navigation/AppContainer";
import { DataProvider } from "./context/DataContext";
import { RoundProvider } from "./context/RoundContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { messaging } from "./firebaseConfig";
import { onMessage } from "firebase/messaging";

// async function subscribeToTopic() {
//   const fcmToken = await getToken(messaging);

//   await fetch("https://iid.googleapis.com/iid/v1/" + fcmToken + "/rel/topics/all-users", {
//     method: "POST",
//     headers: {
//       "Authorization": "key=YOUR_SERVER_KEY",
//       "Content-Type": "application/json",
//     },
//   });

//   console.log("Subscribed to topic!");
// }
const registerForPushNotifications = async () => {
  try {
    // Request notification permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("Notification permissions not granted");
      return;
    }

  } catch (error) {
    console.error("Error push permission:", error);
  }
};

async function prepare() {
  await SplashScreen.preventAutoHideAsync();
}

export default function App() {
  useEffect(() => {
    prepare();
    registerForPushNotifications();
    // Handle foreground notifications
    const unsubscribe = onMessage(messaging, (message) => {
      console.log("Foreground notification received:", message);
      Notifications.scheduleNotificationAsync({
        content: {
          title: message.notification?.title || "No title",
          body: message.notification?.body || "No body",
        },
        trigger: null,
      });
    });

    return () => unsubscribe();
  }, []);

  const [fontsLoaded] = useFonts({
    Bold: require("./assets/fonts/Montserrat_Alternates/MontserratAlternates-Bold.ttf"),
    "Semi Bold": require("./assets/fonts/Montserrat_Alternates/MontserratAlternates-SemiBoldItalic.ttf"),
    Regular: require("./assets/fonts/Source_Sans_3/SourceSans3-VariableFont_wght.ttf"),
    "Regular Bold": require("./assets/fonts/Source_Sans_3/SourceSans3-Bold.ttf"),
    "Regular Semi Bold": require("./assets/fonts/Source_Sans_3/SourceSans3-SemiBold.ttf"),
    "Regular Medium": require("./assets/fonts/Source_Sans_3/SourceSans3-Medium.ttf"),
  });

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
