import React, { useRef, useState, useEffect, useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingScreen from "../screens/SettingPage";
import HomeScreen from "../screens/HomePage";
import FriendsScreen from "../screens/FriendsList";
import NotificationScreen from "../screens/Notifications";
import AddImage from "../components/AddImage";
import { useData } from "../context/DataContext";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getNoteUpdate } from "../components/Endpoint";
import { Box, ZStack } from "native-base";
import { navigationRef } from "../navigation/AppContainer";
import { useDisclose } from "native-base";

const Tab = createBottomTabNavigator();
const DummyScreen = () => null;

export default function AuthenticatedScreens({navigation}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userData, updateUserData, note, updateNotes } = useData();
  const { isOpen, onOpen, onClose } = useDisclose();
  useFocusEffect(
    useCallback(() => {
      // This code runs when the tab comes into focus
      console.log('This is main tab, note is :',note );
      updateNote()
    }, [updateNotes]) // Depend on `userInfo` to re-run the effect when it changes or the tab comes into focus
  );

  const updateNote = async ()=>{
    const res=await getNoteUpdate(userData.token,userData.data.email)
    // if(res>0){
      console.log("update note in main");
      updateNotes(res)
    // }
 }
  const onPress = (value) => {
    if (value.target.includes("Upload")) {
      setIsModalVisible(true);
      onOpen()
      // navigationRef.current?.navigate("Home");
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
        {/* <Tab.Screen
        name="Upload"
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
                            onPress={() => {
                setIsModalVisible(false); // Reset showModal to false
                onPress(); // Call the original onPress handler
              }}
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
  // tabButton: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // tabBarStyle: {
  //   backgroundColor: "#d6d3d1",
  //   borderTopColor: "transparent",
  // },
  modalContainer: {
    position: "absolute",
    zIndex: 1000,
    alignItems: "flex-end",
  },
});
