import React, { useRef, useState, useEffect, useCallback } from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingScreen from "../screens/SettingPage";
import HomeScreen from "../screens/HomePage";
import FriendsScreen from "../screens/FriendsList";
import NotificationScreen from "../screens/Notifications";
import EmptyPage from "./EmptyPage";
import { useData } from "../context/DataContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getNoteUpdate } from "../components/Endpoint";

const Tab = createBottomTabNavigator();
const DummyScreen = () => null;

export default function AuthenticatedScreens() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userData, updateUserData, note, updateNotes } = useData();
  const onOpen = () => {
    console.log("onOpen called");
  };
  // const onPress = (value) => {
  //     console.log("open");
  //     // if (navigationRef.current) {
  //       navigationRef.current?.navigate("ModalTrigger",{ onOpen })
  //     //   // navigationRef.current?.navigate("Home");
  //     // }
  // };

  return (
    <View style={{ flex: 1 }}>
      {isModalVisible ? (
        // Render the modal
        <EmptyPage/>
      ) : (
        <Tab.Navigator>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
              tabBarButton: ({ accessibilityState, onPress }) => (
                <TouchableOpacity
                  onPress={onPress}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: accessibilityState.selected
                      ? "#e7e5e4"
                      : "#d6d3d1", // Change colors accordingly
                  }}
                >
                  <Feather name="home" size={30} color="black" />
                </TouchableOpacity>
              ),
              tabBarLabelStyle: { display: "none" },
              tabBarStyle: {
                backgroundColor: "#d6d3d1", // Dark background color
                borderTopColor: "transparent", // Removes the border on the top
              },
              tabBarShowLabel: false,
            }}
          />
          <Tab.Screen
            name="Friends"
            component={FriendsScreen}
            options={{
              headerShown: false,
              tabBarButton: ({ accessibilityState, onPress }) => (
                <TouchableOpacity
                  onPress={onPress}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: accessibilityState.selected
                      ? "#e7e5e4"
                      : "#d6d3d1", // Change colors accordingly
                  }}
                >
                  <Feather name="link" size={30} color="black" />
                </TouchableOpacity>
              ),
              tabBarStyle: {
                backgroundColor: "#d6d3d1", // Dark background color
                borderTopColor: "transparent", // Removes the border on the top
              },
              tabBarLabelStyle: { display: "none" },
              tabBarShowLabel: false,
            }}
          />
          <Tab.Screen
            name="ModalTrigger"
            component={DummyScreen}
            options={{
              headerShown: false,
              tabBarButton: ({ accessibilityState, onPress }) => (
                <TouchableOpacity
                  onPress={() => setIsModalVisible(true)}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: accessibilityState.selected
                      ? "#e7e5e4"
                      : "#d6d3d1", // Change colors accordingly
                  }}
                >
                  <Feather name="plus-circle" size={30} color="black" />
                </TouchableOpacity>
              ),
              tabBarStyle: {
                backgroundColor: "#d6d3d1", // Dark background color
                borderTopColor: "transparent", // Removes the border on the top
              },
              tabBarLabelStyle: { display: "none" },
              tabBarShowLabel: false,
              tabBarIcon: ({ color, size }) => null, // Hide icon for this tab
            }}
          />
          {/* <Tab.Screen
        name="Canmera"
        component={HomeScreen}
        listeners={{
          tabPress: e => {
            e.preventDefault(); // Prevent default action
            onCanmeraPress(e); // Call your custom onPress function
          },
        }}
        options={{
          headerShown: false,
          tabBarButton: ({ accessibilityState, onPress: onPress }) => (
            <TouchableOpacity
              onPress={onPress}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: accessibilityState.selected ? "#e7e5e4":"#d6d3d1", // Change colors accordingly
              }}
            >
              <Feather name="camera" size={30} color="black" />
            </TouchableOpacity>
          ),
          tabBarStyle: {
            backgroundColor: '#d6d3d1', // Dark background color
            borderTopColor: 'transparent', // Removes the border on the top
          },
          tabBarLabelStyle: { display: "none" },
          tabBarShowLabel: false,
        }}
      /> */}
          <Tab.Screen
            name="Notifications"
            component={NotificationScreen}
            options={{
              headerShown: false,
              tabBarButton: ({ accessibilityState, onPress }) => (
                <TouchableOpacity
                  onPress={onPress}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: accessibilityState.selected
                      ? "#e7e5e4"
                      : "#d6d3d1", // Change colors accordingly
                  }}
                >
                  <MaterialCommunityIcons
                    name="fruit-cherries"
                    size={32}
                    color={note > 0 ? "red" : "#191919"}
                  />
                </TouchableOpacity>
              ),

              // <Image
              //   style={{ width: 26, height: 26 }}
              //   source={require("../assets/Buttonicons/ic_login.png")}
              // />
              tabBarStyle: {
                backgroundColor: "#d6d3d1", // Dark background color
                borderTopColor: "transparent", // Removes the border on the top
              },
              tabBarLabelStyle: { display: "none" },
              tabBarShowLabel: false,
            }}
          />
          <Tab.Screen
            name="Setting"
            component={SettingScreen}
            options={{
              headerShown: false,
              tabBarButton: ({ accessibilityState, onPress }) => (
                <TouchableOpacity
                  onPress={onPress}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: accessibilityState.selected
                      ? "#e7e5e4"
                      : "#d6d3d1", // Change colors accordingly
                  }}
                >
                  <Feather name="settings" size={30} color="black" />
                </TouchableOpacity>
              ),
              tabBarStyle: {
                backgroundColor: "#d6d3d1", // Dark background color
                borderTopColor: "transparent", // Removes the border on the top
              },
              tabBarLabelStyle: { display: "none" },
              tabBarShowLabel: false,
            }}
          />
        </Tab.Navigator>
      )}
    </View>
  );
}
