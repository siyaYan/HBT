import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRoundInfo } from "../components/Endpoint";
import { useData } from "../context/DataContext";

const RoundContext = createContext();

export const useRound = () => {
  return useContext(RoundContext);
};
// Function to check if round is accepted/owned by the current user
function isRoundAccepted(round, currentUserId) {
  if (round.userId === currentUserId) {
    return true;
  } else {
    const hasId =
      round.roundFriends.find(
        (item) => item.id === currentUserId && item.status === "A"
      ) !== undefined;
    if (hasId) {
      return true;
    } else {
      return false;
    }
  }
}

export const RoundProvider = ({ children }) => {
  const { userData } = useData();

  const [roundData, setRoundData] = useState([]);
  const [activeRoundData, setActiveRoundData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedRoundData = await AsyncStorage.getItem("roundData");
        console.log('FirstGetData:',savedRoundData)
        if (savedRoundData && savedRoundData.data?.length > 0) {
          setRoundData(JSON.parse(savedRoundData));
          updateActiveRoundData(JSON.parse(savedRoundData))
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    loadData();
  }, []);

  // Save data to AsyncStorage whenever userData changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("roundData", JSON.stringify(roundData));
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    };

    saveData();
  }, [roundData]);

  const updateActiveRoundData = (newRounds, userId=userData.data._id) => {
    const res = newRounds.data.filter((round) =>
      isRoundAccepted(round, userId)
    );
    setActiveRoundData((prevRoundData) => {
      return { ...prevRoundData, data: res };
    });
  };

  // insert new round
  const insertRoundData = (newRound) => {
    const updatedData = [...roundData.data, newRound];
    const newRoundList = { ...roundData, data: updatedData };
    console.log("Insert new round data", newRoundList);
    updateRounds(newRoundList)
  };
  

  // TODO: update partcially round data
  // const updateRoundData = (updatedRound) => {
  //   // console.log("Updating round data with", updatedRound);
  //   setRoundData((prevRoundData) => {
  //     if (prevRoundData && prevRoundData.data) {
  //       // console.log("round context previous Round Data", prevRoundData.data);
  //       const updatedData = [...prevRoundData.data, updatedRound];
  //       setActiveRoundData(
  //         updatedRound.data.filter((round) =>
  //           isRoundAccepted(round, userData.data._id)
  //         )
  //       );
  //       return { ...prevRoundData, data: updatedData };
  //     } else {
  //       console.error(
  //         "Previous round data is undefined or does not contain data property"
  //       );
  //       return prevRoundData; // Let's see if this will happen, I highly doubt this. As we hide the button from showing if there is no round.
  //     }
  //   });
  // };

  //add new to the round friend list (existing round)
  const insertRoundFriendList = (roundId, newFriend) => {
    console.log("Insert new friend in round context", newFriend);
    
    let updatedData;
  
    // Update roundData with the new friend added
    setRoundData((prevRoundData) => {
      if (prevRoundData && prevRoundData.data) {
        updatedData = prevRoundData.data.map((round) => {
          if (round._id === roundId) {
            // Clone the round object and append the new friend to roundFriends
            const updatedRound = {
              ...round,
              roundFriends: [...round.roundFriends, newFriend],
            };
            return updatedRound;
          } else {
            return round;
          }
        });
        // Return updated roundData
        return { ...prevRoundData, data: updatedData };
      } else {
        console.error(
          "Previous round data is undefined or does not contain data property"
        );
        return prevRoundData;
      }
    });
  
    // Immediately update activeRoundData after roundData has been updated
    setActiveRoundData((prevActiveRoundData) => {
      const updatedActiveRounds = prevActiveRoundData.data.map((round) => {
        if (round._id === roundId) {
          return { ...round, roundFriends: [...round.roundFriends, newFriend] };
        }
        return round;
      });
  
      return { ...prevActiveRoundData, data: updatedActiveRounds };
    });
  
    console.log("Updated roundData:", updatedData);
  };
  

  // Update the entire roundData array
  const updateRounds = (newRounds) => {
    // console.log("round context------", newRounds);
    setRoundData(newRounds);
    updateActiveRoundData(newRounds);
  };

  // delete a round
  const deleteRoundData = (roundIdToDelete) => {
    // Step 1: Filter out the round with the matching _id
    const updatedData = roundData.data.filter((round) => round._id !== roundIdToDelete);
  
    // Step 2: Create the new round data structure after deletion
    const newRoundList = { ...roundData, data: updatedData };
  
    console.log("After delete round data:", newRoundList);
  
    // Step 3: Update active round data
    updateActiveRoundData(newRoundList);
  
    // Step 4: Set the new round data state
    setRoundData(newRoundList);
  
    // Step 5: Save the updated round data to AsyncStorage
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("roundData", JSON.stringify(newRoundList));
        console.log('Round data after deletion saved successfully');
      } catch (error) {
        console.error("Error saving updated round data:", error);
      }
    };
  
    saveData();
  };
  
  // delete round friend/leave round
  const deleteRoundFriend = async (roundId, friendIdToRemove) => {
    setRoundData((prevRoundData) => {
      if (prevRoundData && prevRoundData.data) {
        const updatedData = prevRoundData.data.map((round) => {
          if (round._id === roundId) {
            const updatedRound = {
              ...round,
              roundFriends: round.roundFriends.filter(
                (friend) => friend.id !== friendIdToRemove
              ),
            };
            console.log(
              "round context updatedRound",
              updatedRound.roundFriends
            );
            // return updatedRound;
          }
          // else {
          //   return round;
          // }
        });
        const updatedRoundData = { ...prevRoundData, data: updatedData };
        // Update the state with the modified data
        updatedRoundData.data.map((round) => {
          if (round._id === roundId) {
            console.log(
              "roundId",
              round._id,
              "round context on round context after update: ",
              round.roundFriends
            );
          }
        });
        console.log("round context updated before return", updatedRoundData);
        // setActiveRoundData(roundData.data.filter(round => isRoundAccepted(round,userData.data._id)));

        return updatedRoundData;
      } else {
        console.error(
          "Previous round data is undefined or does not contain data property"
        );
        return prevRoundData;
      }
    });

    //   // Update AsyncStorage outside the state update function
    //   AsyncStorage.setItem("roundData", JSON.stringify(roundData))
    //       .then(() => {
    //           console.log("Round data updated in AsyncStorage");
    //       })
    //       .catch(error => {
    //           console.error("Error updating round data in AsyncStorage:", error);
    //       });
  };

  return (
    <RoundContext.Provider
      value={{
        roundData,
        activeRoundData,
        setActiveRoundData,
        updateActiveRoundData,
        updateRounds,
        insertRoundData,
        deleteRoundData,
        deleteRoundFriend,
        insertRoundFriendList,
      }}
    >
      {children}
    </RoundContext.Provider>
  );
};
export default RoundContext;
