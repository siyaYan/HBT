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
  const [acceptRoundData, setacceptRoundData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedRoundData = await AsyncStorage.getItem("roundData");
        console.log("FirstGetData:", savedRoundData);
        if (savedRoundData && savedRoundData.data?.length > 0) {
          setRoundData(JSON.parse(savedRoundData));
          updateacceptRoundData(JSON.parse(savedRoundData));
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

  const updateacceptRoundData = (newRounds, userId = userData.data._id) => {
    const res = newRounds.data.filter((round) =>
      isRoundAccepted(round, userId)
    );
    setacceptRoundData((prevRoundData) => {
      return { ...prevRoundData, data: res };
    });
  };

  // insert new round
  const insertRoundData = (newRound) => {
  // Check if newRound already exists, update it; otherwise, append it
  const updatedData = roundData.data.map(round => 
    round._id === newRound._id ? newRound : round
  );

  // If newRound was not found, append it
  if (!updatedData.some(round => round._id === newRound._id)) {
    updatedData.push(newRound);
  }

  const newRoundList = { ...roundData, data: updatedData };
    console.log("Insert new round data", newRoundList);
    updateRounds(newRoundList);
  };
  

  // TODO: update partcially round data
  // const updateRoundData = (updatedRound) => {
  //   // console.log("Updating round data with", updatedRound);
  //   setRoundData((prevRoundData) => {
  //     if (prevRoundData && prevRoundData.data) {
  //       // console.log("round context previous Round Data", prevRoundData.data);
  //       const updatedData = [...prevRoundData.data, updatedRound];
  //       setacceptRoundData(
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
    console.log("Insert or update friend in round context", newFriend);

    let updatedData;

    // Update roundData with the new or updated friend
    setRoundData((prevRoundData) => {
      if (prevRoundData && prevRoundData.data) {
        updatedData = prevRoundData.data.map((round) => {
          if (round._id === roundId) {
            // Check if the friend is already in the round
            const friendExists = round.roundFriends.some(
              (friend) => friend._id === newFriend._id
            );

            // Clone the round object and update or insert the friend
            const updatedRound = {
              ...round,
              roundFriends: friendExists
                ? round.roundFriends.map((friend) =>
                    friend._id === newFriend._id ? newFriend : friend
                  ) // Update friend if they exist
                : [...round.roundFriends, newFriend], // Insert new friend if they don't exist
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

    // Immediately update acceptRoundData after roundData has been updated
    setacceptRoundData((prevacceptRoundData) => {
      const updatedActiveRounds = prevacceptRoundData.data.map((round) => {
        if (round._id === roundId) {
          // Check if the friend is already in the round
          const friendExists = round.roundFriends.some(
            (friend) => friend._id === newFriend._id
          );

          return {
            ...round,
            roundFriends: friendExists
              ? round.roundFriends.map((friend) =>
                  friend._id === newFriend._id ? newFriend : friend
                ) // Update friend if they exist
              : [...round.roundFriends, newFriend], // Insert new friend if they don't exist
          };
        }
        return round;
      });

      return { ...prevacceptRoundData, data: updatedActiveRounds };
    });

    console.log("Updated roundData:", updatedData);
  };
  

  // Update the entire roundData array
  const updateRounds = (newRounds) => {
    // console.log("round context------", newRounds);
    setRoundData(newRounds);
    updateacceptRoundData(newRounds);
  };

  // delete a round
  const deleteRoundData = (roundIdToDelete) => {
    // Step 1: Filter out the round with the matching _id
    const updatedData = roundData.data.filter(
      (round) => round._id !== roundIdToDelete
    );

    // Step 2: Create the new round data structure after deletion
    const newRoundList = { ...roundData, data: updatedData };

    console.log("After delete round data:", newRoundList);

    // Step 3: Update active round data
    updateacceptRoundData(newRoundList);

    // Step 4: Set the new round data state
    setRoundData(newRoundList);

    // Step 5: Save the updated round data to AsyncStorage
    const saveData = async () => {
      try {
        await AsyncStorage.setItem("roundData", JSON.stringify(newRoundList));
        console.log("Round data after deletion saved successfully");
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
        // setacceptRoundData(roundData.data.filter(round => isRoundAccepted(round,userData.data._id)));

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
        acceptRoundData,
        setacceptRoundData,
        updateacceptRoundData,
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
