import React, { useRef, useEffect,useCallback } from "react";
import { Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingScreen from "../screens/SettingPage";
import HomeScreen from "../screens/HomePage";
import FriendsScreen from "../screens/FriendsList";
import NotificationScreen from "../screens/Notifications";
import { useData } from "../context/DataContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getNoteUpdate
} from "../components/Endpoint";

const Tab = createBottomTabNavigator();

export default function AuthenticatedScreens() {
  const navigationRef = useRef();
  const { userData, updateUserData, note, updateNotes } = useData();
  // useFocusEffect(
  //   useCallback(() => {
  //     // This code runs when the tab comes into focus
  //     console.log('This is main tab, note is :',note );
  //     updateNote()
  //   }, [userData]) // Depend on `userInfo` to re-run the effect when it changes or the tab comes into focus
  // );

  const updateNote = async ()=>{
    const res=await getNoteUpdate(userData.token,userData.data.email)
    if(res>0){
      console.log("update note in main");
      updateNotes(res)
    }
 }
  const onPress = (value) => {
    if (value.target.includes("Home")) {
      navigationRef.current?.navigate("Home");
    }
    if (value.target.includes("MyCircle")) {
      navigationRef.current?.navigate("MyCircle");
    }
    if (value.target.includes("Setting")) {
      navigationRef.current?.navigate("Setting");
    }
    if (value.target.includes("Notifications")) {
      navigationRef.current?.navigate("Notifications");
    }
    if (value.target.includes("Upload")) {
      // console.log("Upload");
    }
  };

  return (
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
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: accessibilityState.selected ? "#e7e5e4":"#d6d3d1", // Change colors accordingly
              }}
            >
              <Feather name="home" size={30} color="black" />
            </TouchableOpacity>
          ),
          tabBarLabelStyle: { display: "none" },
          tabBarStyle: {
            backgroundColor: '#d6d3d1', // Dark background color
            borderTopColor: 'transparent', // Removes the border on the top
          },
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="MyCircle"
        component={FriendsScreen}
        listeners={{ tabPress: onPress }}
        options={{
          headerShown: false,
          tabBarButton: ({ accessibilityState, onPress }) => (
            <TouchableOpacity
              onPress={onPress}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: accessibilityState.selected ? "#e7e5e4":"#d6d3d1", // Change colors accordingly
              }}
            >
              <Feather name="link" size={30} color="black" />
            </TouchableOpacity>
          ),
          tabBarStyle: {
            backgroundColor: '#d6d3d1', // Dark background color
            borderTopColor: 'transparent', // Removes the border on the top
          },
          tabBarLabelStyle: { display: "none" },
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Upload"
        component={HomeScreen}
        listeners={{ tabPress: onPress }}
        options={{
          headerShown: false,
          tabBarButton: ({ accessibilityState, onPress }) => (
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
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        listeners={{ tabPress: onPress }}
        options={{
          headerShown: false,
          tabBarButton: ({ accessibilityState, onPress }) => (
            <TouchableOpacity
              onPress={onPress}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: accessibilityState.selected ? "#e7e5e4":"#d6d3d1", // Change colors accordingly
              }}
            >
              <MaterialCommunityIcons
              name="fruit-cherries"
              size={32}
              color={note>0?"red":"#191919"}
            />
            </TouchableOpacity>
          ),

            // <Image
            //   style={{ width: 26, height: 26 }}
            //   source={require("../assets/Buttonicons/ic_login.png")}
            // />
            tabBarStyle: {
                backgroundColor: '#d6d3d1', // Dark background color
                borderTopColor: 'transparent', // Removes the border on the top
              },
          tabBarLabelStyle: { display: "none" },
          tabBarShowLabel: false,
        }}
      />
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        listeners={{ tabPress: onPress }}
        options={{
          headerShown: false,
          tabBarButton: ({ accessibilityState, onPress }) => (
            <TouchableOpacity
              onPress={onPress}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: accessibilityState.selected ? "#e7e5e4":"#d6d3d1", // Change colors accordingly
              }}
            >
              <Feather name="settings" size={30} color="black" />
            </TouchableOpacity>
          ),
          tabBarStyle: {
            backgroundColor: '#d6d3d1', // Dark background color
            borderTopColor: 'transparent', // Removes the border on the top
          },
          tabBarLabelStyle: { display: "none" },
          tabBarShowLabel: false,
        }}
      />
    </Tab.Navigator>
  );
}
