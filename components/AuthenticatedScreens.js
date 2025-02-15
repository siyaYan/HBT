import React, { useRef, useState, useEffect, useCallback } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingScreen from "../screens/SettingPage";
import HomeScreen from "../screens/HomePage";
import FriendsScreen from "../screens/FriendsList";
import NotificationScreen from "../screens/Notifications";
import AddImage from "../components/AddImage";
import { useData } from "../context/DataContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";
import { getNoteUpdate } from "../components/Endpoint";
import { Button, useDisclose } from "native-base";
import { useRound } from "../context/RoundContext";
import { SvgXml } from "react-native-svg";

const Tab = createBottomTabNavigator();

export default function AuthenticatedScreens({ navigation }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { userData, updateUserData, note, updateNotes } = useData();
  const { isOpen, onOpen, onClose } = useDisclose();
  const { acceptRoundData } = useRound();
  const activeRound = acceptRoundData?.data.filter(
    (item) => item.status === "A"
  )[0];
  const updateNote = async () => {
    const res = await getNoteUpdate(userData.token, userData.data.email);
    if (res > 0) {
      console.log("update note in main");
      updateNotes(res);
    }
  };
  useEffect(() => {
    console.log("This is main tab, note is :", note);
    updateNote();
  }, [updateNotes]);

  const onPress = (value) => {
    if (value.target.includes("Upload") && activeRound) {
      setIsModalVisible(true);
      onOpen();
    } else {
      setIsModalVisible(false);
    }
    console.log("open", isModalVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      {isModalVisible && (
        <View style={styles.modalContainer}>
          <AddImage
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            navigation={navigation}
          />
        </View>
      )}

      <Tab.Navigator>
        {/* Home Tab */}
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarButton: ({ accessibilityState, onPress }) => (
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  onPress();
                }}
                style={styles.tabButton(accessibilityState.selected)}
              >
                <SvgXml
                  xml={homeSvg(
                    accessibilityState.selected ? "#49a579" : "#191919"
                  )}
                  width={28}
                  height={28}
                />
                <Text style={styles.tabLabel(accessibilityState.selected)}>
                  Home
                </Text>
              </TouchableOpacity>
            ),
            tabBarLabelStyle: { display: "none" },
            tabBarStyle: styles.tabBarStyle,
            tabBarShowLabel: false,
          }}
        />

        {/* MyCircle Tab */}
        <Tab.Screen
          name="MyCircle"
          component={FriendsScreen}
          options={{
            headerShown: false,
            tabBarButton: ({ accessibilityState, onPress }) => (
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  onPress();
                }}
                style={styles.tabButton(accessibilityState.selected)}
              >
                <SvgXml
                  xml={circleSvg(
                    accessibilityState.selected ? "#49a579" : "#191919"
                  )}
                  width={28}
                  height={28}
                  top={0}
                />
                <Text style={styles.tabLabel(accessibilityState.selected)}>
                  Circle
                </Text>
              </TouchableOpacity>
            ),
            tabBarLabelStyle: { display: "none" },
            tabBarStyle: styles.tabBarStyle,
            tabBarShowLabel: false,
          }}
        />
        {/* Upload Tab */}
        <Tab.Screen
          name="Upload"
          component={HomeScreen}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              onPress(e);
            },
          }}
          options={{
            headerShown: false,
            tabBarButton: ({ accessibilityState, onPress }) =>
              activeRound ? (
                <TouchableOpacity
                  onPress={onPress}
                  style={styles.tabButton(accessibilityState.selected)}
                >
                  <SvgXml
                    xml={uploadSvg(
                      accessibilityState.selected ? "#49a579" : "#191919"
                    )}
                    width={28}
                    height={28}
                    top={0}
                  />
                  <Text style={styles.tabLabel(accessibilityState.selected)}>
                    Upload
                  </Text>
                </TouchableOpacity>
              ) : (
                <Button disabled style={styles.tabButton(true)}>
                  <SvgXml
                    xml={uploadSvg("rgba(25, 25, 25, 0.1)")}
                    width={40}
                    height={40}
                    top={0}
                  />
                </Button>
              ),

            tabBarStyle: styles.tabBarStyle,
            tabBarLabelStyle: { display: "none" },
            tabBarShowLabel: false,
            tabBarIcon: () => null, // Hide the icon for this tab
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
                }}
              >
                {/* <MaterialCommunityIcons
                  name="fruit-cherries"
                  size={32}
                  color={note > 0 ? "#49a579" : "#191919"}
                /> */}

                <SvgXml
                  xml={notificationSvg(note > 0 ? "#ff061e" : "#606060")}
                  width={28}
                  height={28}
                />
                <Text
                  style={styles.tabLabelUpdates(
                    accessibilityState.selected ? "#49a579" : "#191919"
                  )}
                >
                  Activity
                </Text>
              </TouchableOpacity>
            ),
            tabBarLabelStyle: { display: "none" },
            tabBarStyle: styles.tabBarStyle,
            tabBarShowLabel: false,
          }}
        />
        {/* Settings Tab */}
        <Tab.Screen
          name="Setting"
          component={SettingScreen}
          options={{
            headerShown: false,
            tabBarButton: ({ accessibilityState, onPress }) => (
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  onPress();
                }}
                style={styles.tabButton(accessibilityState.selected)}
              >
                <SvgXml
                  xml={settingsSvg(
                    accessibilityState.selected ? "#49a579" : "#191919"
                  )}
                  width={28}
                  height={28}
                  top={0}
                />
                <Text style={styles.tabLabel(accessibilityState.selected)}>
                  Setting
                </Text>
              </TouchableOpacity>
            ),
            tabBarLabelStyle: { display: "none" },
            tabBarStyle: styles.tabBarStyle,
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
    alignItems: "abolute",
  },
  tabButton: (isSelected) => ({
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  }),

  tabBarStyle: {
    backgroundColor: "#f9f8f2",
    borderTopColor: "transparent",
    // borderTopLeftRadius: 10, // Rounds the top-left corner
    // borderTopRightRadius: 10s, // Rounds the top-right corner
    height: 90, // Optional height adjustment
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0, // Keep the bottom at 0 so it stays at the bottom
    shadowColor: "#191919", // Shadow properties (iOS)
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabLabel: (isSelected) => ({
    color: isSelected ? "#49a579" : "#191919",
    fontSize: 12,
    marginTop: 4,
  }),
  tabLabelUpdates: (isSelected) => ({
    color: isSelected ? "#191919" : "#191919",
    fontSize: 12,
    marginTop: 4,
  }),
});

const homeSvg = (color) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="${color}">
  <path class="cls-1" d="M42.87,10.7c-.98-1.72-2.49-2.5-3.3-2.8-.5-.19-1.06.06-1.25.56-.19.5.06,1.06.56,1.25.32.12.97.43,1.58,1.02-1.13.58-3.91,2.34-5.88,6.24-.18.41-.37.82-.55,1.23l1.29.69c1.92-4.79,5.2-6.59,6-6.96.4.83.46,1.62.43,2.16-.03.54.38.99.92,1.02.08,0,.16,0,.23-.01.43-.08.77-.45.79-.9.05-.86-.06-2.17-.82-3.51Z"/><path class="cls-2" d="M29.05,33.95h-8.28c0,.19,0,.36,0,.53,0,3.17,0,6.33,0,9.5,0,1.54-.81,2.35-2.36,2.35-3.26,0-6.52,0-9.79,0-1.48,0-2.32-.83-2.32-2.3,0-6.59,0-13.18,0-19.77,0-.82.3-1.46.95-1.96,5.42-4.21,10.83-8.42,16.25-12.63.96-.74,1.87-.75,2.82,0,5.42,4.21,10.83,8.43,16.25,12.63.65.5.95,1.13.95,1.96,0,6.61,0,13.21,0,19.82,0,1.41-.85,2.26-2.26,2.26-3.31,0-6.62,0-9.93,0-1.43,0-2.26-.82-2.27-2.25,0-3.18,0-6.36,0-9.55,0-.19,0-.38,0-.59Z"/>
</svg>`;

const circleSvg = (color) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="${color}">
<path class="cls-1" d="M32.64,21.65c-.31-.98-.71-1.92-1.21-2.81-.28-.51-.72-.8-1.31-.82-1.19-.05-1.94,1.2-1.39,2.29.26.5.52,1.01.71,1.54.67,1.8.94,3.57.81,5.31,0,.04-.02.07-.03.11-.07.56-.13,1.13-.26,1.67-.11.47-.24.92-.39,1.36-.01.04-.03.07-.04.11-.12.33-.25.64-.38.95-.16.35-.33.7-.53,1.05-.01.02-.02.05-.04.07-.15.26-.31.51-.47.76-.08.11-.15.22-.23.33-.12.17-.25.33-.37.49-1.08,1.32-2.44,2.41-4.11,3.26-.24.12-.49.23-.73.33-.18.07-.35.15-.53.21-.01,0-.03,0-.04.01-1.18.42-2.35.65-3.51.72-.06,0-.13,0-.19.01-.21,0-.42,0-.63,0-.91-.02-1.83-.14-2.76-.37-.25-.06-.49-.14-.74-.22-.59-.19-1.18-.42-1.76-.7-1.13-.55-2.11-1.23-2.97-2.02-.85-.81-1.6-1.75-2.23-2.84-.14-.24-.26-.49-.38-.73-.27-.55-.51-1.12-.71-1.73-.32-1-.51-2-.57-3,0-.01,0-.02,0-.04-.02-.26-.01-.52-.01-.78,0-.17,0-.34.02-.51,0-.16.02-.32.03-.49.03-.29.07-.58.12-.87.01-.08.02-.17.04-.25.06-.3.13-.6.21-.9.11-.4.23-.8.37-1.19.56-1.51,1.37-2.84,2.41-3.98.05-.06.1-.12.16-.17.13-.14.27-.28.41-.41.12-.12.24-.23.37-.34.1-.09.2-.17.3-.25.18-.15.35-.29.54-.43.08-.06.16-.12.24-.17.2-.14.41-.28.61-.41.06-.03.11-.07.17-.1,1.92-1.17,4.04-1.75,6.33-1.76.37,0,.73.04,1.1.04.85,0,1.5-.64,1.54-1.5.03-.8-.59-1.51-1.41-1.56-.56-.04-1.12-.06-1.68-.05-2.8.09-5.4.88-7.77,2.37-.1.07-.2.14-.3.21-.12.08-.24.16-.36.24-.06.04-.11.08-.17.13-.17.13-.35.26-.51.39-.14.11-.28.23-.42.35-.15.13-.31.26-.45.39-.28.25-.54.51-.8.79-.04.04-.08.09-.12.14-.23.25-.46.52-.67.78-.03.04-.06.07-.09.1-.07.09-.13.19-.2.28-.09.12-.18.24-.27.37-.16.23-.32.47-.47.7,0,.01-.02.03-.03.04-.83,1.33-1.45,2.76-1.83,4.28,0,.04-.02.08-.03.11-.08.32-.14.64-.2.96-.03.19-.06.37-.09.56-.01.08-.03.16-.04.24,0,.07,0,.15-.02.22-.02.17-.05.35-.06.52-.02.19-.02.38-.03.57,0,.06,0,.12,0,.17-.01.44-.02.87,0,1.3,0,0,0,.02,0,.02.02.39.06.78.11,1.17.03.2.06.39.09.58.03.17.06.35.1.52.05.24.1.49.17.73.02.07.04.13.06.2.25.92.59,1.81,1.03,2.69.01.02.02.05.03.07,0,.02.02.03.02.04.18.36.38.72.59,1.07.05.08.1.16.15.24.09.14.16.28.25.42.19.28.38.55.57.83.31.37.62.73.94,1.1.16.15.32.31.48.46,0,0,.01,0,.02.01.73.72,1.53,1.37,2.4,1.93.97.64,1.99,1.14,3.05,1.53.12.05.24.1.37.15.16.05.32.09.49.14.15.04.3.09.45.13.15.04.3.09.45.13.21.04.42.08.63.11.43.08.88.14,1.33.18.11.01.22.03.33.04.17.01.35.01.52.02.42.02.83.04,1.24.03.36,0,.73-.03,1.08-.06.21-.02.42-.05.63-.08.25-.03.5-.07.75-.12.18-.03.35-.07.52-.11.38-.09.76-.19,1.13-.3.04-.01.08-.02.12-.03.47-.15.93-.33,1.38-.53.02,0,.04-.02.07-.03.9-.4,1.78-.88,2.62-1.45.27-.19.54-.38.81-.57.27-.23.55-.47.82-.7.03-.04.07-.07.1-.11,1.67-1.54,2.94-3.41,3.82-5.57.12-.31.24-.62.35-.92.1-.35.2-.69.3-1.04.01-.09.02-.18.04-.26.03-.13.05-.26.07-.4.04-.18.07-.37.1-.55.06-.36.11-.73.14-1.1,0-.06.02-.11.02-.17,0-.01,0-.03,0-.04.01-.14.03-.29.04-.43.09-1.85-.14-3.65-.69-5.41Z"/><path class="cls-1" d="M17.23,30.47c.28.99.66,1.94,1.13,2.85.27.52.7.82,1.29.86,1.19.08,1.97-1.15,1.45-2.25-.24-.51-.49-1.02-.67-1.56-.61-1.82-.83-3.6-.66-5.33,0-.04.03-.07.03-.11.08-.56.16-1.12.31-1.67.12-.46.27-.91.43-1.35.01-.04.03-.07.04-.11.12-.32.27-.64.41-.94.17-.35.35-.69.56-1.03.01-.02.03-.05.04-.07.16-.26.33-.5.5-.74.08-.11.16-.22.24-.33.13-.17.26-.33.39-.48,1.11-1.29,2.51-2.34,4.2-3.13.25-.11.49-.21.74-.31.18-.07.35-.14.54-.2.01,0,.03,0,.04-.01,1.19-.38,2.37-.59,3.53-.62.06,0,.13,0,.19,0,.21,0,.42.01.63.02.91.05,1.82.19,2.75.45.25.07.49.16.73.24.59.21,1.17.45,1.74.75,1.11.58,2.07,1.29,2.91,2.11.83.83,1.55,1.8,2.15,2.9.13.25.24.49.36.74.25.56.48,1.13.66,1.75.29,1.01.46,2.01.49,3.01,0,.01,0,.02,0,.04,0,.26,0,.52-.01.78,0,.17-.02.34-.03.51-.01.16-.03.32-.05.49-.04.29-.08.57-.14.86-.02.08-.03.17-.05.25-.06.3-.15.6-.24.89-.12.4-.25.79-.41,1.18-.6,1.5-1.45,2.8-2.52,3.9-.05.06-.11.11-.16.17-.14.14-.28.27-.43.4-.12.11-.25.22-.38.33-.1.08-.2.16-.3.24-.18.14-.36.28-.55.41-.08.06-.16.11-.24.16-.21.14-.41.27-.62.39-.06.03-.11.07-.17.1-1.95,1.11-4.09,1.63-6.38,1.58-.37,0-.73-.06-1.1-.07-.85-.03-1.52.6-1.58,1.45-.06.8.55,1.53,1.37,1.6.56.05,1.12.09,1.67.09,2.81,0,5.42-.72,7.84-2.15.11-.06.2-.13.31-.2.12-.08.25-.15.37-.23.06-.04.11-.08.17-.12.18-.12.35-.25.52-.37.15-.11.29-.22.43-.33.16-.13.31-.25.47-.38.28-.25.56-.5.82-.76.04-.04.08-.09.13-.13.24-.25.47-.5.69-.76.03-.03.06-.07.09-.1.07-.09.14-.18.21-.27.09-.12.19-.24.28-.36.17-.23.33-.46.49-.69,0-.01.02-.03.03-.04.87-1.31,1.52-2.72,1.95-4.23.01-.04.02-.07.03-.11.09-.31.16-.63.23-.96.04-.18.07-.37.1-.56.01-.08.03-.16.04-.24.01-.07.01-.15.02-.22.03-.17.06-.34.08-.52.02-.19.03-.38.04-.57,0-.06,0-.12.01-.17.03-.44.04-.87.03-1.3,0,0,0-.02,0-.02,0-.39-.04-.78-.08-1.17-.02-.2-.05-.39-.08-.59-.02-.17-.05-.35-.08-.52-.04-.25-.09-.49-.15-.74-.02-.07-.04-.14-.05-.2-.23-.92-.54-1.83-.95-2.71-.01-.02-.02-.05-.03-.07,0-.02-.02-.03-.02-.04-.17-.36-.36-.73-.56-1.08-.05-.08-.09-.17-.14-.25-.08-.14-.15-.29-.24-.43-.18-.29-.36-.56-.55-.85-.3-.38-.6-.75-.9-1.13-.15-.16-.31-.32-.46-.47,0,0-.01,0-.02-.01-.71-.74-1.49-1.41-2.35-2-.95-.67-1.95-1.2-3.01-1.62-.12-.05-.24-.11-.36-.16-.16-.05-.32-.1-.48-.15-.15-.05-.29-.1-.44-.14-.15-.05-.3-.1-.45-.14-.21-.04-.42-.09-.63-.13-.43-.09-.87-.16-1.32-.22-.11-.01-.22-.04-.33-.05-.17-.02-.35-.02-.52-.04-.42-.04-.83-.06-1.24-.06-.36,0-.73,0-1.08.03-.21.01-.42.04-.63.06-.25.03-.5.06-.75.1-.18.03-.35.06-.53.09-.38.08-.76.16-1.14.27-.04.01-.08.02-.12.03-.47.14-.93.3-1.39.49-.02,0-.04.02-.07.03-.91.37-1.8.82-2.66,1.38-.28.18-.55.37-.82.55-.28.23-.56.45-.84.68-.04.04-.07.07-.11.11-1.72,1.49-3.04,3.32-3.98,5.46-.13.3-.25.61-.38.91-.11.34-.22.69-.33,1.03-.02.09-.02.18-.05.26-.03.13-.05.26-.09.39-.04.18-.08.37-.12.55-.07.36-.13.73-.17,1.09,0,.06-.02.11-.03.17,0,.01,0,.03,0,.04-.02.14-.04.29-.05.43-.15,1.84.04,3.65.53,5.43Z"/>
</svg>`;

const uploadSvg = (color) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="${color}">
<path class="cls-1" d="M46.62,31.09c0-5.63-3.58-10.43-8.57-12.28-.52-6.75-6.17-12.08-13.05-12.08s-12.53,5.33-13.05,12.08c-5,1.85-8.57,6.65-8.57,12.28,0,.01,0,.03,0,.04h0v.85c0,1.56,1.27,2.83,2.83,2.83h10.47c1.02,0,1.84-.82,1.84-1.84s-.82-1.84-1.84-1.84H7.06s0-.03,0-.04c0-3.66,2.11-6.84,5.17-8.39,1.08-.55,2.28-.89,3.54-.99-.12-.61-.19-1.23-.19-1.88s.06-1.22.18-1.8c.84-4.33,4.67-7.62,9.24-7.62s8.4,3.28,9.24,7.62c.11.58.18,1.19.18,1.8s-.07,1.27-.19,1.88c1.27.09,2.46.44,3.54.99,3.06,1.56,5.17,4.73,5.17,8.39,0,.01,0,.03,0,.04h-9.62c-1.02,0-1.84.82-1.84,1.84s.82,1.84,1.84,1.84h10.47c1.56,0,2.83-1.27,2.83-2.83v-.85h0s0-.03,0-.04Z"/><path class="cls-1" d="M32.64,27.81c.79-.64.9-1.8.26-2.59l-6.76-8.24c-.36-.44-.9-.69-1.46-.67-.56.01-1.09.28-1.43.73l-6.2,8.24c-.61.81-.45,1.97.36,2.58.33.25.72.37,1.1.37.56,0,1.11-.25,1.47-.73l3.17-4.21v17.2c0,1.02.82,1.84,1.84,1.84s1.84-.82,1.84-1.84v-16.84l3.21,3.92c.64.79,1.8.9,2.59.26Z"/></svg>
</svg>`;

const notificationSvg = (color) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="${color}">
<path class="cls-1" d="M39.96,25.14c-2.76-2.48-7.05-3.58-8.96-2.47-.19.11-.62.4-1.28.65-.11-1.25-1.06-8.38-7.7-12.13,1.34.03,2.67-.3,3.83-1,2.19-1.32,3.44-3.74,3.26-6.29-2.49-1.52-5.61-1.52-7.94-.02-1.91,1.24-2.66,3.07-2.94,4.4-2.11-.4-4.3.08-5.95,1.39-2.99,2.37-2.56,6.1-2.53,6.35,2.52,1.33,5.58,1.12,7.79-.51,1.01-.75,1.77-1.75,2.23-2.87,4.08,6.79.38,13.39.2,13.69-.02.03-.03.06-.04.09-.74-.35-1.2-.75-1.39-.88-1.87-1.35-9,.42-11.53,5.81-2.26,4.82.06,10.61,3.95,13.54,4.83,3.64,12.24,2.99,15.96-1.39.07-.08.13-.18.2-.27,1.97-2.5,2.77-6.03,1.87-9.28-.99-3.57-4.01-6.82-6.22-6.9-.12,0-.34,0-.63-.03-.23-.02-.49-.05-.79-.11.58-1.12,3.65-7.65.07-14.38.49.28.94.58,1.37.89,5.11,3.81,5.45,9.85,5.47,10.16,0,.03,0,.07.01.1-.81.1-1.42.01-1.64,0-1-.06-2.51.92-3.84,2.51h.04c2.65.1,5.92,3.62,7,7.53.93,3.37.21,7.06-1.85,9.81.89.28,1.79.47,2.69.53,6.02.46,11.93-4.07,12.7-9.76.44-3.26-.8-6.83-3.4-9.16Z"/></svg>
</svg>`;

const settingsSvg = (color) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="${color}">
<path class="cls-1" d="M18.17,44.71c-.91,0-1.84-.2-2.74-.6-2.77-1.25-4.26-4.11-3.73-7.1l.27-1.51h-1.53c-3.04,0-5.58-1.98-6.32-4.92s.55-5.89,3.23-7.34l1.35-.73-.96-1.2c-1.89-2.37-1.93-5.6-.09-8.01,1.84-2.42,4.95-3.24,7.75-2.05l1.41.6.34-1.5c.68-2.96,3.17-5,6.21-5.07,3.05-.05,5.62,1.85,6.44,4.78l.41,1.48,1.38-.67c2.74-1.32,5.89-.64,7.83,1.69,1.95,2.33,2.06,5.55.28,8.01l-.9,1.24,1.38.67c2.74,1.32,4.17,4.2,3.56,7.18-.61,2.98-3.05,5.07-6.09,5.21l-1.53.07.34,1.49c.68,2.96-.69,5.88-3.39,7.26-2.71,1.38-5.87.77-7.87-1.51l-1.01-1.15-.96,1.2c-1.28,1.61-3.13,2.47-5.06,2.47ZM12.79,14.56c-.91,0-1.63.5-2.08,1.08-.61.8-.92,2.08.04,3.28l3.83,4.8-5.4,2.92c-1.35.73-1.57,2.03-1.32,3.01.25.98,1.06,2.02,2.59,2.02h6.14l-1.09,6.04c-.27,1.51.61,2.49,1.53,2.91.92.42,2.24.43,3.19-.77l3.83-4.8,4.04,4.62c1.01,1.15,2.33,1.08,3.23.62.9-.46,1.73-1.48,1.39-2.98l-1.37-5.98,6.13-.28c1.53-.07,2.29-1.15,2.5-2.14s-.08-2.28-1.46-2.94l-5.53-2.66,3.6-4.97c.9-1.24.53-2.51-.11-3.28-.65-.77-1.83-1.36-3.21-.69l-5.53,2.66-1.64-5.91c-.41-1.48-1.63-1.99-2.64-1.96-1.01.02-2.2.58-2.54,2.08l-1.37,5.98-5.65-2.4c-.39-.17-.76-.24-1.1-.24Z"/>
<circle class="cls-1" cx="23.89" cy="25" r="3.41" fill="${color}"/>
</svg>`;
