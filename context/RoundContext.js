import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRoundInfo, getRoundInvitation } from "../components/Endpoint";
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
  const [roundInvitationData, setRoundInvitationData] = useState(null);
  const [activeRoundData, setActiveRoundData] = useState([]);

  // Load round data from AsyncStorage and fetch from endpoint on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedRoundData = await AsyncStorage.getItem("roundData");
        if (savedRoundData) {
          // console.log('Loaded from AsyncStorage:', JSON.parse(savedRoundData));
          setRoundData(JSON.parse(savedRoundData));
        } else {
          const fetchedRoundData = await getRoundInfo();
          // console.log('Fetched from Endpoint:', fetchedRoundData);
          setRoundData(fetchedRoundData);
          await AsyncStorage.setItem(
            "roundData",
            JSON.stringify(fetchedRoundData)
          );
        }
        // filter active rounds
        setActiveRoundData(
          roundData.data?.filter((round) =>
            isRoundAccepted(round, userData.data._id)
          )
        );
      } catch (error) {
        console.error("Error loading round data:", error);
      }
    };

    loadData();
  }, []);

  // insert new round
  const insertRoundData = (newRound) => {
    setRoundData((prevRoundData) => {
      if (prevRoundData && prevRoundData.data) {
        const updatedData = [...prevRoundData.data, newRound];
        setActiveRoundData(
          roundData.data.filter((round) =>
            isRoundAccepted(round, userData.data._id)
          )
        );

        return { ...prevRoundData, data: updatedData };
      } else {
        console.error(
          "Previous round data is undefined or does not contain data property"
        );
        return prevRoundData;
      }
    });
  };
  // update existing round
  const updateRoundData = (updatedRound) => {
    // console.log("Updating round data with", updatedRound);

    setRoundData((prevRoundData) => {
      if (prevRoundData && prevRoundData.data) {
        // console.log("round context previous Round Data", prevRoundData.data);
        const updatedData = prevRoundData.data.map((round) =>
          round._id === updatedRound._id ? { ...round, ...updatedRound } : round
        );
        console.log("updateRoundData", updatedRound);
        setActiveRoundData(roundData.data.filter(round => isRoundAccepted(round,userData.data._id)));
        return { ...prevRoundData, data: updatedData };
      } else {
        console.error(
          "Previous round data is undefined or does not contain data property"
        );
        return prevRoundData; // Let's see if this will happen, I highly doubt this. As we hide the button from showing if there is no round.
      }
    });
  };
  //add new to the round friend list (existing round)
  const insertRoundFriendList = (roundId, newFriend) => {
    console.log("insert new friend in round context", newFriend);
    setRoundData((prevRoundData) => {
      if (prevRoundData && prevRoundData.data) {
        const updatedData = prevRoundData.data.map((round) => {
          if (round._id === roundId) {
            // Clone the round object and update roundFriends by appending newFriend
            const updatedRound = {
              ...round,
              roundFriends: [...round.roundFriends, newFriend],
            };
            setActiveRoundData(roundData.data.filter(round => isRoundAccepted(round,userData.data._id)));
            return updatedRound;
          } else {
            return round;
          }
        });
        setActiveRoundData(roundData.data.filter(round => isRoundAccepted(round,userData.data._id)));
        return { ...prevRoundData, data: updatedData };
      } else {
        console.error(
          "Previous round data is undefined or does not contain data property"
        );
        return prevRoundData;
      }
    });
  };

  // Update the entire roundData array
  const updateRounds = (newRounds) => {
    console.log("round context------", newRounds);
    setRoundData(newRounds);
   setActiveRoundData(newRounds.data.filter(round => isRoundAccepted(round,userData.data._id)));

  };

  // delete a round
  const deleteRoundData = async (roundId) => {
    try {
      console.log('-----------',roundId)
      const newData = roundData.data.filter((round) => round._id !== roundId);
      console.log("delete round data-------", newData);
      await AsyncStorage.setItem(
        "roundData",
        JSON.stringify({ ...roundData, data: newData })
      );
      // setRoundData({ ...roundData, data: newData });
      setRoundData((preRoundData)=>{return{...preRoundData, data: newData }});
      //setActiveRoundData(roundData.data.filter(round => isRoundAccepted(round,userData.data._id)));
    } catch (error) {
      console.error("Error deleting round data:", error);
    }
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
  // round invitation data
  // Fetch and set round invitation data
  const loadRoundInvitationData = async (token) => {
    try {
      const data = await getRoundInvitation(token);
      setRoundInvitationData(data);
    } catch (error) {
      console.error("Error loading round invitation data:", error);
    }
  };
  return (
    <RoundContext.Provider
      value={{
        roundData,
        activeRoundData,
        updateRoundData,
        updateRounds,
        insertRoundData,
        deleteRoundData,
        deleteRoundFriend,
        insertRoundFriendList,
        roundInvitationData,
        loadRoundInvitationData,
      }}
    >
      {children}
    </RoundContext.Provider>
  );
};
export default RoundContext;
