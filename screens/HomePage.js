import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Heading,
  IconButton,
  Text,
  Pressable,
  Button,
  NativeBaseProvider,
  Flex,
  View,
  ScrollView,
} from "native-base";
import { Avatar } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import OptionMenu from "../components/OptionMenu";
import Background from "../components/Background";
import { useFocusEffect } from "@react-navigation/native";
import { useRound } from "../context/RoundContext";
// import { getRoundInfo } from "../components/Endpoint";

// TODO: change the layout to match the new ios version @Siya

const HomeScreen = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  useFocusEffect(
    useCallback(() => {
      // This code runs when the tab comes into focus
      // console.log('Tab is in focus, userInfo:', userData);
    }, [userData]) // Depend on `userInfo` to re-run the effect when it changes or the tab comes into focus
  );
  const handleAvatarPress = () => {
    // Navigate to another screen when the Avatar is pressed
    navigation.navigate("AccountStack", { screen: "Account" });
  };

  {
    /* Round */
  }
  //Navigation
  const startRound = () => {
    // Navigate to round configuration when pressed
    navigation.navigate("RoundStack", { screen: "RoundConfig" });
  };

  const handleRoundPress = (round) => {
    // console.log('function, roundinfo:', round);
    navigation.navigate("RoundStack", {
      screen: "RoundInfo",
      params: { round: round },
    });
  };
  // const { roundData, updateRoundData } = useRound();
  // const [loading, setLoading] = useState(true);
  // //Get round information
  // useEffect(() => {
  //   const fetchRoundInfo = async () => {
  //     try {
  //       // console.log('userdata:',userData.token)
  //       // console.log('userID',userData.data._id)
  //       const data = await getRoundInfo(userData.token, userData.data._id);
  //       console.log("round data loading", data);
  //       // if(data.token){
  //       //   updateRoundData(data);}
        
  //     } catch (error) {
  //       console.error("Error fetching round info:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRoundInfo();
  // }, [updateRoundData]);
  // if (loading) {
  //   return <View></View>;
  // }
  const { roundData, setRoundData } = useRound();

  useEffect(() => {
    console.log('Loaded round data:', roundData);
  }, [roundData]);
  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems="center">
        <OptionMenu navigation={navigation} />
        <Pressable onPress={handleAvatarPress}>
          <Box py="5" px="2" alignItems="center" justifyContent="center">
            {userData.avatar && userData.avatar.uri ? (
              <Avatar
                bg="white"
                mb="1"
                size="md"
                source={{ uri: userData.avatar.uri }}
              />
            ) : (
              <Avatar bg="white" mb="1" size="md" borderWidth={2}>
                <AntDesign name="user" size={30} color="black" />
              </Avatar>
            )}
            <Text fontFamily={"Regular"} fontSize="lg">
              {userData.data.nickname}
            </Text>
          </Box>
        </Pressable>
        {/* Linda Sprint 4 */}
        {roundData.length < 2 && (
          <Button
            // onPress={()=>navigation.navigate('RoundConfig')}
            onPress={startRound}
            rounded="30"
            // shadow="1"
            mt="5"
            width="80%"
            size="lg"
            style={{
              borderWidth: 1, // This sets the width of the border
              borderColor: "#49a579", // This sets the color of the border
            }}
            backgroundColor={"rgba(250,250,250,0.2)"}
            _text={{
              color: "#191919",
              fontFamily: "Regular Semi Bold",
              fontSize: "lg",
            }}
            _pressed={{
              // below props will only be applied on button is pressed
              bg: "#e5f5e5",
              // _text: {
              //   color: "warmGray.50",
              // },
            }}
          >
            Start a round
          </Button>
        )}
      </Flex>
      {/* <View>
      <Text>{roundData.data.length}</Text>
      {roundData.data.map((round, index) => (
        <View key={index}>
          <Text>{round.name}</Text>
          <Text>{round.level}</Text>
          <Text>{new Date(round.startDate).toLocaleDateString()}</Text>
        </View>
      ))}
      <Button title="Refresh" onPress={async () => {
        const fetchedRoundData = await getRoundInfo();
        setRoundData(fetchedRoundData);
      }} />
    </View> */}
      <ScrollView>
        {/* <Text>{roundData.data.length}</Text> */}
        {roundData.data.map((round, index) => (
           <View key={round._id} style={{ margin: 10 }}>
            <Button
              // onPress={()=>navigation.navigate('RoundConfig')}
              key={index}
              title={"Round ${index+1}"}
              onPress={() => {
                // console.log("Roundinfo on homepage:", round),
                  handleRoundPress(round);
              }}
              // onPress={() => {handleRoundPress(round)}}
              rounded="30"
              // shadow="1"
              mt="5"
              width="80%"
              size="lg"
              style={{
                borderWidth: 1, // This sets the width of the border
                borderColor: "#49a579", // This sets the color of the border
              }}
              backgroundColor={"rgba(250,250,250,0.2)"}
              _text={{
                color: "#191919",
                fontFamily: "Regular Semi Bold",
                fontSize: "lg",
              }}
              _pressed={{
                // below props will only be applied on button is pressed
                bg: "#e5f5e5",
                // _text: {
                //   color: "warmGray.50",
                // },
              }}
            >
              {round.name}
            </Button>
            {/* <Text>Level: {round.level}</Text>
            <Text>Start Date: {round.startDate}</Text>
            <Text>Max Capacity: {round.maxCapacity}</Text>
            <Text>Allow Others: {round.allowOthers ? "Yes" : "No"}</Text>
            <Text>Status:{round.status}</Text> */}
          </View> 
        ))}  
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default HomeScreen;
