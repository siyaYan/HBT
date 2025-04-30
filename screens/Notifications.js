import { useState, useCallback } from "react";
import {
  Box,
  Text,
  NativeBaseProvider,
  Flex,
  VStack,
  Divider,
  HStack,
  Image,
  ScrollView,
  Badge,
  Pressable,
  Avatar,
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import Background2 from "../components/Background2";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { getRoundInvitation } from "../components/Endpoint";
import { SvgXml } from "react-native-svg";

// Ensure these SVG constants are defined or imported from your assets
const Decline = `
<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
  <defs>
    <style>.cls-1{fill:#000;stroke-width:0px;}</style>
  </defs>
  <path class="cls-1" d="M25,45.47c-11.29,0-20.47-9.18-20.47-20.47S13.71,4.53,25,4.53s20.47,9.18,20.47,20.47-9.18,20.47-20.47,20.47ZM25,8.53c-9.08,0-16.47,7.39-16.47,16.47s7.39,16.47,16.47,16.47,16.47-7.39,16.47-16.47-7.39-16.47-16.47-16.47Z"/>
  <rect class="cls-1" x="14.7" y="22.97" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(24.81 60.35) rotate(-134.69)"/>
  <rect class="cls-1" x="14.7" y="22.9" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(60.31 25.08) rotate(135.31)"/>
</svg>
`;

const ReadAllNoti = `
<?xml version="1.0" encoding="UTF-8"?>
<svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
  <defs>
    <style>.cls-1{fill:#000;stroke-width:0px;}</style>
  </defs>
  <path class="cls-1" d="M25,45.47c-11.29,0-20.47-9.18-20.47-20.47S13.71,4.53,25,4.53s20.47,9.18,20.47,20.47-9.18,20.47-20.47,20.47ZM25,8.53c-9.08,0-16.47,7.39-16.47,16.47s7.39,16.47,16.47,16.47,16.47-7.39,16.47-16.47-7.39-16.47-16.47-16.47Z"/>
  <rect class="cls-1" x="13.98" y="26.52" width="11.88" height="4.07" rx="2.03" ry="2.03" transform="translate(28.16 -5.28) rotate(48.58)"/>
  <rect class="cls-1" x="17.29" y="22.97" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(64.26 18.56) rotate(127.86)"/>
</svg>
`;

const infoSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
  <defs>
    <style>
      .st0{fill:#93D8C5;}
      .st1{fill:none;stroke:#93D8C5;stroke-width:2;stroke-miterlimit:10;}
      .st2{fill:none;stroke:#231F20;stroke-miterlimit:10;}
      .st3{fill:#231F20;}
      .st4{fill:#FFFFFF;}
      .st5{fill:none;stroke:#000000;stroke-width:2;stroke-miterlimit:10;}
      .st6{stroke:#000000;stroke-miterlimit:10;}
      .st7{fill:#FF061E;}
      .st8{fill:#BDDB6B;}
      .st9{fill:#49A579;}
      .st10{fill:#6666FF;}
      .st11{fill:#191919;}
      .st12{fill:#F9F8F2;}
    </style>
  </defs>
  <path d="M47.26,6.77c-1.04-2.06-9.12-0.63-15.46,1.95C20.48,13.31,7.26,24.67,8.95,35.21c0.46,2.89,2.28,7.13,5.88,8.54
    c3.03,1.18,6.04-0.13,8.45-1.17c4.69-2.04,9.52-6.36,10.98-11.33c0.25-0.85,0.84-2.96,1.85-6.27c0.28-0.94,0.66-2.03,1.22-3.4
    c0.66-1.63,1.61-3.45,3.09-5.59C44.36,10.28,48.01,8.27,47.26,6.77z M26.74,34.84c-0.12,0.24-0.28,0.45-0.48,0.67
    c-0.19,0.21-0.31,0.35-0.37,0.41c-0.86,0.89-1.93,1.66-3.22,2.3c-1.29,0.65-2.57,1.04-3.84,1.2c-1.27,0.16-2.3,0.03-3.09-0.38
    c-0.75-0.39-1.19-0.98-1.32-1.78c-0.14-0.8,0.12-1.84,0.78-3.1c0.16-0.3,0.29-0.53,0.39-0.69l3.57-4.95
    c1.57-2.23,2.55-3.58,2.92-4.07c0.23-0.24,0.5-0.39,0.82-0.45c0.32-0.05,0.62-0.01,0.91,0.14c0.26,0.13,0.43,0.32,0.52,0.57
    c0.09,0.24,0.09,0.46,0.01,0.66c-1.48,2.01-3.62,4.99-6.43,8.96c-0.11,0.18-0.25,0.42-0.41,0.73c-0.34,0.65-0.49,1.17-0.44,1.56
    s0.26,0.67,0.63,0.86c0.64,0.34,1.52,0.36,2.61,0.08c1.09-0.28,2.22-0.75,3.38-1.42s2.17-1.39,3.04-2.2
    C26.91,34.21,26.91,34.52,26.74,34.84z M26.11,22.99c-1.17,0-2.11-0.95-2.11-2.11c0-1.17,0.95-2.11,2.11-2.11
    c1.17,0,2.11,0.95,2.11,2.11C28.22,22.04,27.27,22.99,26.11,22.99z"/>
</svg>
`;

const NotificationScreen = ({ navigation }) => {
  const { userData, updateNotes } = useData();
  const [invitations, setInvitations] = useState([]);

  const updateNote = async () => {
    const res = await getRoundInvitation(userData.token);
    if (res && res.data && res.data.length > 0) {
      setInvitations(res.data);
      updateNotes(res.data);
    } else {
      setInvitations([]);
      updateNotes([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      updateNote();
    }, [userData])
  );

  return (
    <NativeBaseProvider>
    <Background2 />
    <Flex direction="column" alignItems="center">
      <OptionMenu navigation={navigation} />
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Round Invitations
        </Text>
        <ScrollView>
          {invitations.length > 0 ? (
            invitations.map((invitation, index) => (
              <HStack
                key={index}
                alignItems="center"
                justifyContent="space-between"
                mb={3}
                p={2}
                borderWidth={1}
                borderColor="gray.300"
                borderRadius="md"
              >
                <HStack alignItems="center" space={3}>
                  {invitation.senderAvatar ? (
                    <Avatar size="md" source={{ uri: invitation.senderAvatar }} />
                  ) : (
                    <Avatar size="md">
                      <AntDesign name="user" size={24} color="black" />
                    </Avatar>
                  )}
                  <VStack>
                    <Text fontSize="lg" fontWeight="bold">
                      {invitation.senderName || "Unknown"}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      @{invitation.senderUsername || "unknown"}
                    </Text>
                  </VStack>
                </HStack>
                <HStack space={3}>
                  <Pressable onPress={() => {
                    // Navigate to invitation details if needed
                    navigation.navigate("RoundInvitationDetails", {
                      invitationId: invitation._id,
                    });
                  }}>
                    <SvgXml xml={infoSVG} width={30} height={30} />
                  </Pressable>
                  <Pressable onPress={() => {
                    // Accept invitation logic here
                  }}>
                    <SvgXml xml={ReadAllNoti} width={30} height={30} />
                  </Pressable>
                  <Pressable onPress={() => {
                    // Decline invitation logic here
                  }}>
                    <SvgXml xml={Decline} width={30} height={30} />
                  </Pressable>
                </HStack>
              </HStack>
            ))
          ) : (
            <Text textAlign="center" mt={10} fontSize="lg">
              No round invitations yet
            </Text>
          )}
        </ScrollView>
        </Flex>
      
    </NativeBaseProvider>
  );
};

export default NotificationScreen;
