import React, { useRef, useState, useEffect, useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingScreen from "../screens/SettingPage";
import HomeScreen from "../screens/HomePage";
import FriendsScreen from "../screens/FriendsList";
import NotificationScreen from "../screens/Notifications";
import AddImage from "../components/AddImage";
import { useData } from "../context/DataContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getNoteUpdate } from "../components/Endpoint";
import { useDisclose } from "native-base";

const Tab = createBottomTabNavigator();

export default function AuthenticatedScreens({navigation}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userData, updateUserData, note, updateNotes } = useData();
  const { isOpen, onOpen, onClose } = useDisclose();

  const updateNote = async ()=>{
    const res=await getNoteUpdate(userData.token,userData.data.email)
    if(res>0){
      console.log("update note in main");
      updateNotes(res)
    }
 }
  useEffect(() => {
    // Fetch or update avatar dynamically
    // userData=useData().useData
    // console.log(userData.notes, "tab-----");
    console.log('This is main tab, note is :',note );
    updateNote()
  }, [updateNotes]);

  
  const onPress = (value) => {
    if (value.target.includes("Upload")) {
      setIsModalVisible(true);
      onOpen()
    } else {
      setIsModalVisible(false);
    }
    console.log("open", isModalVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      {isModalVisible && (
        <View style={styles.modalContainer}>
          <AddImage isOpen={isOpen} onOpen={onOpen} onClose={onClose} navigation={navigation}/>
        </View>
      )}

      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarButton: ({ accessibilityState, onPress }) => (
              <TouchableOpacity
              onPress={() => {
                setIsModalVisible(false); // Reset showModal to false
                onPress(); // Call the original onPress handler
              }}
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
          name="MyCircle"
          component={FriendsScreen}
          options={{
            headerShown: false,
            tabBarButton: ({ accessibilityState, onPress }) => (
              <TouchableOpacity
                              onPress={() => {
                setIsModalVisible(false); // Reset showModal to false
                onPress(); // Call the original onPress handler
              }}
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
          name="Upload"
          component={HomeScreen}
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); // Prevent default action
              onPress(e); // Call your custom onPress function
            },
          }}
          options={{
            headerShown: false,
            tabBarButton: ({ accessibilityState, onPress: onTabPress }) => (
              <TouchableOpacity
                onPress={onTabPress}
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

        <Tab.Screen
          name="Notifications"
          component={NotificationScreen}
          options={{
            headerShown: false,
            tabBarButton: ({ accessibilityState, onPress }) => (
              <TouchableOpacity
                onPress={() => {
                setIsModalVisible(false); // Reset showModal to false
                onPress(); // Call the original onPress handler
              }}
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
                              onPress={() => {
                setIsModalVisible(false); // Reset showModal to false
                onPress(); // Call the original onPress handler
              }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    zIndex: 1000,
    alignItems: "flex-end",
  },
});
