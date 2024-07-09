import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "native-base";
import ForumPage from "../screens/ForumPage";
import ForumDraft from "../screens/ForumDraft";

const Stack = createStackNavigator();

export default function ForumStackNavigator({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ForumDraft"
        component={ForumDraft}
        options={{
          headerBackTitleVisible: false,
          title: "",
          // headerStyle: {
          //   backgForumColor: "rgba(255,255,255,0)",
          // },
          headerLeft: () => (
            <IconButton
              ml={3}
              marginY={0}
              icon={<Ionicons name="arrow-back" size={28} color="black" />}
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ForumPage"
        component={ForumPage}
        options={{
          headerBackTitleVisible: false,
          title: "",
          // headerStyle: {
          //   backgForumColor: "rgba(255,255,255,0)",
          // },
          headerLeft: () => (
            <IconButton
              ml={3}
              marginY={0}
              icon={<Ionicons name="arrow-back" size={28} color="black" />}
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}