import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  Box,
  Text,
  Button,
  NativeBaseProvider,
  Flex,
  Avatar,
  Modal,
  HStack,
  VStack,
} from "native-base";
import {
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useData } from "../context/DataContext";
import OptionMenu from "../components/OptionMenu";
import Background from "../components/Background";
import {
  getRoundInfo,
  getRoundInvitation,
  reactRoundRequest,
  updateRoundStatus,
} from "../components/Endpoint";
import { useRound } from "../context/RoundContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScoreBoardModal from "../components/ScoreBoard";
import { SvgXml } from "react-native-svg";
import Svg, { Circle } from "react-native-svg"; // Added for circular progress

// add on
const RoundInvitationNewMessage = `
<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">

<path fill="#93D8C5" d="M20.77,34.47c10.28-8.8,20.57-17.61,30.94-26.48c0.37-0.32,0.92-0.32,1.29,0l31.01,26.55
	c0.44,0.37,0.57,0.97,0.34,1.45c-0.22,0.45-0.81,0.6-1.04,0.65c-1.91,0.44-21.73,0.08-25.17,0.02c-12.21,0-24.41-0.01-36.62-0.01
	c-0.46-0.01-0.88-0.25-1.09-0.64C20.19,35.5,20.31,34.87,20.77,34.47z"/>

<path fill="#FF061E" d="M61.76,42.01c-3.71-2.69-9.13-3.49-11.33-1.88c-0.22,0.16-0.71,0.57-1.49,0.96
	c-0.33-1.7-2.84-12.21-14.14-14.99c0.4-0.87,1.02-1.62,1.98-2.06c0.46-0.21,0.66-0.75,0.46-1.21c-0.21-0.46-0.76-0.66-1.21-0.46
	c-4.91,2.23-3.56,9.4-3.5,9.71c0.09,0.44,0.47,0.74,0.9,0.74c0.06,0,0.12-0.01,0.18-0.02c0.5-0.1,0.82-0.58,0.72-1.08
	c-0.01-0.03-0.36-1.92-0.04-3.87c11.09,2.67,12.82,13.27,12.89,13.74c0.01,0.04,0.02,0.08,0.03,0.12c-0.99,0.23-1.74,0.2-2.02,0.22
	c-2.85,0.14-8.37,7.34-6.66,14.49c1.53,6.4,8.23,10.21,14.25,10.04c7.46-0.21,14.13-6.54,14.35-13.64
	C67.25,48.77,65.25,44.55,61.76,42.01z"/>

<path fill="#93D8C5" d="M87.38,45.47c0-2.32,0-4.63,0-6.95c0-0.31-0.03-0.61-0.06-1.05c-4.96,1.39-11.42,3.74-18.36,7.82
c-7.39,4.34-12.83,9.18-16.55,13.02c-4.22-4.09-10.15-9.03-17.98-13.46c-6.29-3.56-12.17-5.87-17.03-7.39c0,9.51,0,19.02,0,28.54
c-0.22,3.05-0.13,5.5,0,7.22c0.09,1.15,0.22,2.24,1.03,3.04c0.67,0.67,1.67,1.01,3,1.01c20.66,0,41.32,0,61.97,0
c2.6,0,3.98-1.38,3.98-3.98c0-2.4,0-4.8,0-7.2c0,0,0,0,0-0.01C87.42,63.8,87.44,56.2,87.38,45.47z"/>
</svg>
`;

// SVG constants defined at the top
const RoundInvitationBefore = `<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
<path fill="#93D8C5"  d="M15.01,35.39c4.84,4.13,9.47,8.07,14.09,12.02c6.07,5.18,12.14,10.36,18.21,15.53c1.95,1.66,3.5,1.62,5.53-0.12
	c10.38-8.88,20.76-17.76,31.14-26.64c0.27-0.23,0.55-0.45,0.95-0.77c0.03,0.44,0.06,0.74,0.06,1.05c0,11.59,0,23.17,0,34.76
	c0,2.6-1.38,3.98-3.98,3.98c-20.66,0-41.32,0-61.97,0c-2.66,0-4.02-1.37-4.02-4.05c0-11.51,0-23.03,0-34.54
	C15.01,36.29,15.01,35.97,15.01,35.39z"/>
<path fill="#93D8C5"   d="M81.59,33.64c-10.28,8.8-20.57,17.61-30.94,26.48c-0.37,0.32-0.92,0.32-1.29,0L18.35,33.57
	c-0.44-0.37-0.57-0.97-0.34-1.45c0.22-0.45,0.81-0.6,1.04-0.65c1.91-0.44,21.73-0.08,25.17-0.02c12.21,0,24.41,0.01,36.62,0.01
	c0.46,0.01,0.88,0.25,1.09,0.64C82.17,32.6,82.04,33.24,81.59,33.64z"/>
<path fill="#FF061E" d="M53.59,57.18c-1.75-1.27-4.3-1.65-5.34-0.88c-0.1,0.07-0.34,0.27-0.7,0.45c-0.16-0.8-1.34-5.75-6.66-7.06
	c0.19-0.41,0.48-0.76,0.93-0.97c0.22-0.1,0.31-0.35,0.21-0.57c-0.1-0.22-0.36-0.31-0.57-0.21c-2.31,1.05-1.68,4.43-1.65,4.57
	c0.04,0.21,0.22,0.35,0.42,0.35c0.03,0,0.06,0,0.08-0.01c0.23-0.05,0.39-0.27,0.34-0.51c0-0.02-0.17-0.91-0.02-1.82
	c5.23,1.26,6.04,6.25,6.07,6.47c0,0.02,0.01,0.04,0.01,0.06c-0.46,0.11-0.82,0.09-0.95,0.10c-1.34,0.07-3.94,3.46-3.14,6.83
	c0.72,3.02,3.88,4.81,6.71,4.73c3.52-0.1,6.66-3.08,6.76-6.42C56.18,60.36,55.24,58.37,53.59,57.18z"/>
</svg>`;

const RoundInvitationAfter = `<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve">
<path fill="#93D8C5" d="M15.01,35.39c4.84,4.13,9.47,8.07,14.09,12.02c6.07,5.18,12.14,10.36,18.21,15.53c1.95,1.66,3.5,1.62,5.53-0.12
    c10.38-8.88,20.76-17.76,31.14-26.64c0.27-0.23,0.55-0.45,0.95-0.77c0.03,0.44,0.06,0.74,0.06,1.05c0,11.59,0,23.17,0,34.76
    c0,2.6-1.38,3.98-3.98,3.98c-20.66,0-41.32,0-61.97,0c-2.66,0-4.02-1.37-4.02-4.05c0-11.51,0-23.03,0-34.54
    C15.01,36.29,15.01,35.97,15.01,35.39z"/>
<path fill="#93D8C5" d="M81.59,33.64c-10.28,8.8-20.57,17.61-30.94,26.48c-0.37,0.32-0.92,0.32-1.29,0L18.35,33.57
    c-0.44-0.37-0.57-0.97-0.34-1.45c0.22-0.45,0.81-0.6,1.04-0.65c1.91-0.44,21.73-0.08,25.17-0.02c12.21,0,24.41,0.01,36.62,0.01
    c0.46,0.01,0.88,0.25,1.09,0.64C82.17,32.6,82.04,33.24,81.59,33.64z"/>
<path fill="gray" d="M53.59,57.18c-1.75-1.27-4.3-1.65-5.34-0.88c-0.1,0.07-0.34,0.27-0.7,0.45c-0.16-0.8-1.34-5.75-6.66-7.06
    c0.19-0.41,0.48-0.76,0.93-0.97c0.22-0.1,0.31-0.35,0.21-0.57c-0.1-0.22-0.36-0.31-0.57-0.21c-2.31,1.05-1.68,4.43-1.65,4.57
    c0.04,0.21,0.22,0.35,0.42,0.35c0.03,0,0.06,0,0.08-0.01c0.23-0.05,0.39-0.27,0.34-0.51c0-0.02-0.17-0.91-0.02-1.82
    c5.23,1.26,6.04,6.25,6.07,6.47c0,0.02,0.01,0.04,0.01,0.06c-0.46,0.11-0.82,0.09-0.95,0.10c-1.34,0.07-3.94,3.46-3.14,6.83
    c0.72,3.02,3.88,4.81,6.71,4.73c3.52-0.1,6.66-3.08,6.76-6.42C56.18,60.36,55.24,58.37,53.59,57.18z"/>
</svg>`;

const Decline = `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#000;stroke-width:0px;}</style></defs><path class="cls-1" d="M25,45.47c-11.29,0-20.47-9.18-20.47-20.47S13.71,4.53,25,4.53s20.47,9.18,20.47,20.47-9.18,20.47-20.47,20.47ZM25,8.53c-9.08,0-16.47,7.39-16.47,16.47s7.39,16.47,16.47,16.47,16.47-7.39,16.47-16.47-7.39-16.47-16.47-16.47Z"/><rect class="cls-1" x="14.7" y="22.97" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(24.81 60.35) rotate(-134.69)"/><rect class="cls-1" x="14.7" y="22.9" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(60.31 25.08) rotate(135.31)"/></svg>`;
const ReadAllNoti = `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#000;stroke-width:0px;}</style></defs><path class="cls-1" d="M25,45.47c-11.29,0-20.47-9.18-20.47-20.47S13.71,4.53,25,4.53s20.47,9.18,20.47,20.47-9.18,20.47-20.47,20.47ZM25,8.53c-9.08,0-16.47,7.39-16.47,16.47s7.39,16.47,16.47,16.47,16.47-7.39,16.47-16.47-7.39-16.47-16.47-16.47Z"/><rect class="cls-1" x="13.98" y="26.52" width="11.88" height="4.07" rx="2.03" ry="2.03" transform="translate(28.16 -5.28) rotate(48.58)"/><rect class="cls-1" x="17.29" y="22.97" width="20.6" height="4.07" rx="2.03" ry="2.03" transform="translate(64.26 18.56) rotate(127.86)"/></svg>`;
const infoSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
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
        c-0.75-0.39-1.19-0.98-1.32-1.78c-0.14-0.8,0.12-1.84,0.78-3.1c0.16-0.30,0.29-0.53,0.39-0.69l3.57-4.95
        c1.57-2.23,2.55-3.58,2.92-4.07c0.23-0.24,0.50-0.39,0.82-0.45c0.32-0.05,0.62-0.01,0.91,0.14c0.26,0.13,0.43,0.32,0.52,0.57
        c0.09,0.24,0.09,0.46,0.01,0.66c-1.48,2.01-3.62,4.99-6.43,8.96c-0.11,0.18-0.25,0.42-0.41,0.73c-0.34,0.65-0.49,1.17-0.44,1.56
        s0.26,0.67,0.63,0.86c0.64,0.34,1.52,0.36,2.61,0.08c1.09-0.28,2.22-0.75,3.38-1.42s2.17-1.39,3.04-2.2
        C26.91,34.21,26.91,34.52,26.74,34.84z M26.11,22.99c-1.17,0-2.11-0.95-2.11-2.11c0-1.17,0.95-2.11,2.11-2.11
        c1.17,0,2.11,0.95,2.11,2.11C28.22,22.04,27.27,22.99,26.11,22.99z"/>
    </svg>`;

// Function to add days to a date
function calculateEndDate(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function shouldRedirectToScoreBoard(startDate, level) {
  const start = new Date(startDate);
  const today = new Date();
  const duration = parseInt(level, 10);

  const halfwayDate = new Date(start.getTime() + (duration / 2) * 24 * 60 * 60 * 1000);
  const endDate = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
  const oneWeekBeforeEndDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

  const isMonday = today.getDay() === 1;
  const isHalfway = today.toDateString() === halfwayDate.toDateString();
  const isOneWeekLeft = today.toDateString() === oneWeekBeforeEndDate.toDateString();

  return isMonday || isHalfway || isOneWeekLeft;
}

const HomeScreen = ({ navigation }) => {
  const [isOpened, setIsOpened] = useState(false);
  const [scoreBoardOpen, setScoreBoardOpen] = useState(false);
  const [showRoundDetails, setShowRoundDetails] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState({ filtered: [], filteredRound: [] });
  const [showRoundValidation, setShowRoundValidation] = useState(false);
  const [showRoundValidationDate, setShowRoundValidationDate] = useState(false);
  const [showRoundCompleteValidation, setShowRoundCompleteValidation] = useState(false);
  const [pendingReceived, setPendingReceived] = useState([]);
  const [processedRounds, setProcessedRounds] = useState([]);
  const [showRoundFriendValidation, setShowRoundFriendValidation] = useState(false);
  const [show10PerRoundValidation, setShow10PerRoundValidation] = useState(false);

  const handleCloseRoundFriendValidation = () => setShowRoundFriendValidation(false);
  const { userData } = useData();
  const { acceptRoundData, updateRounds } = useRound();

  const { width, height } = Dimensions.get("window");
  const [showFinalScore, setShowFinalScore] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getRoundInvitationData();
      getRoundData();
    }, [userData])
  );

  useEffect(() => {
    if (acceptRoundData?.data) {
      const processing = processRounds(acceptRoundData.data, new Date());
      const sortedRounds = filterAndSortRounds(processing);
      setProcessedRounds(sortedRounds);
    }
  }, [acceptRoundData]);

  const filterAndSortRounds = (rounds) => {
    const priorityRounds = rounds.filter((round) => round.round.status !== "F");
    const sortedPriorityRounds = priorityRounds.sort((a, b) => {
      const statusPriority = { A: 1, P: 2 }; // Prioritize active rounds (A) first
      const statusA = statusPriority[a.round.status] || 3;
      const statusB = statusPriority[b.round.status] || 3;

      if (statusA !== statusB) return statusA - statusB;
      return new Date(a.startDate) - new Date(b.startDate);
    });

    if (sortedPriorityRounds.length < 2) {
      const fallbackRounds = rounds.filter((round) => round.round.status === "F");
      sortedPriorityRounds.push(...fallbackRounds.slice(0, 2 - sortedPriorityRounds.length));
    }
    return sortedPriorityRounds.slice(0, 2);
  };

  const getRoundInvitationData = async () => {
    try {
      const res = await getRoundInvitation(userData.token);
      const pending = res?.data.filter((invitation) => invitation.status === "P");
      setPendingReceived(pending || []);
    } catch (error) {
      console.error("Error fetching round invitations:", error);
    }
  };

  const getRoundData = async () => {
    try {
      const res = await getRoundInfo(userData.token, userData.data._id);
      updateRounds(res);
    } catch (error) {
      console.error("Error fetching round data:", error);
    }
  };

  const handle10PerRoundValidationClose = () => setShow10PerRoundValidation(false);
  const handleCloseRoundCompleteValidation = () => setShowRoundCompleteValidation(false);
  const handleAvatarPress = () => navigation.navigate("AccountStack", { screen: "Account" });
  const startRound = () => {
    navigation.navigate("RoundStack", {
      screen: "RoundConfig",
      params: { emptyState: true, source: "home", roundId: 0 },
    });
  };

  const handleRoundPress = async (roundId, status, startDate, level) => {
    try {
      const today = new Date().toDateString();
      const lastCheckedDate = await AsyncStorage.getItem(`lastCheck_1${roundId}`);

      if (
        shouldRedirectToScoreBoard(startDate, level) &&
        lastCheckedDate !== today &&
        (status === "A" || status === "F")
      ) {
        await AsyncStorage.setItem(`lastCheck_1${roundId}`, today);
        navigation.navigate("RoundStack", { screen: "RoundScore", params: { id: roundId, isFromHome: true } });
      } else if (status === "A" || status === "F") {
        navigation.navigate("ForumStack", { screen: "ForumPage", params: { id: roundId, isFromHome: true } });
      } else {
        navigation.navigate("RoundStack", { screen: "RoundInfo", params: { id: roundId } });
      }
    } catch (error) {
      console.error("Error handling round press:", error);
    }
  };

  const handlePress = async () => {
    try {
      const filteredRound = [];
      const filteredUsersList = [];
      await Promise.all(
        pendingReceived.map(async (invitation) => {
          const round = await fetchRoundInfo(invitation.roundId);
          filteredRound.push(round);
          filteredUsersList.push(
            round.data[0].roundFriends?.find((user) => user.id === invitation.senderId)
          );
        })
      );
      setFilteredUsers({ filtered: filteredUsersList, filteredRound });
      setIsOpened(true);
    } catch (error) {
      console.error("Error fetching round invitations:", error);
    }
  };

  const handleClose = () => {
    setIsOpened(false);
    setScoreBoardOpen(false);
  };

  const handleRoundValidationClose = () => setShowRoundValidation(false);
  const handleRoundValidationDateClose = () => setShowRoundValidationDate(false);
  const handleRoundInfoClose = () => setShowRoundDetails(false);

  useEffect(() => {
    console.log(pendingReceived.length > 0 ? "update the envelope open" : "update the envelope close");
    if (pendingReceived.length === 0) setIsOpened(false);
  }, [pendingReceived]);

  const fetchRoundInfo = async (roundId) => {
    try {
      return await getRoundInfo(userData.token, roundId);
    } catch (error) {
      console.error("Error fetching round info:", error);
      return { data: [] };
    }
  };

  const openRoundInvitationInfo = () => setShowRoundDetails(true);

  const acceptRoundFriend = async (index, thisRoundInfo) => {
    if (thisRoundInfo.data[0].status === "F") {
      setShowRoundCompleteValidation(true);
      rejectRoundFriend(index);
      return;
    }

    const thisRoundStartDate = new Date(thisRoundInfo.data[0].startDate);
    const thisRoundLevelInt = parseInt(thisRoundInfo.data[0].level, 10);
    const endDate10Percent = new Date(
      thisRoundStartDate.getTime() + thisRoundLevelInt * 24 * 60 * 60 * 1000 * 0.1
    );
    const today = new Date();

    if (today > endDate10Percent) {
      setShow10PerRoundValidation(true);
      rejectRoundFriend(index);
      return;
    }

    const unFinishedRound = acceptRoundData?.data.filter(
      (item) => item.status === "A" || item.status === "P"
    ) || [];
    if (unFinishedRound.length >= 2) {
      setShowRoundValidation(true);
      return;
    }

    if (unFinishedRound.length === 1) {
      const acceptRound = unFinishedRound[0];
      const levelInt = parseInt(acceptRound.level, 10);
      const startDate = new Date(acceptRound.startDate);
      const endDate = new Date(startDate.getTime() + levelInt * 24 * 60 * 60 * 1000);
      if (thisRoundStartDate < endDate) {
        setShowRoundValidationDate(true);
        return;
      }
    }

    setFilteredUsers((current) => ({
      filtered: current.filtered.filter((_, i) => i !== index),
      filteredRound: current.filteredRound.filter((_, i) => i !== index),
    }));
    setPendingReceived((current) => current.filter((_, i) => i !== index));

    const id = pendingReceived[index]._id;
    const res = await reactRequest(id, "A");
    if (res) {
      const RoundInfoList = await getRoundInfo(userData.token, userData.data._id);
      updateRounds(RoundInfoList);
    }
  };

  const rejectRoundFriend = (index) => {
    setFilteredUsers((current) => ({
      filtered: current.filtered.filter((_, i) => i !== index),
      filteredRound: current.filteredRound.filter((_, i) => i !== index),
    }));
    setPendingReceived((current) => current.filter((_, i) => i !== index));
    const id = pendingReceived[index]._id;
    reactRequest(id, "R");
  };

  const reactRequest = async (id, react) => {
    try {
      const response = await reactRoundRequest(userData.token, id, react);
      if (response.status === "success") {
        console.log("react request success:", response);
        return true;
      } else {
        console.error("react request was unsuccessful:", response.message);
        return false;
      }
    } catch (error) {
      console.error("Error in react request:", error);
      return false;
    }
  };

  const updateStatusAndDate = async (roundId, newStatus) => {
    try {
      const response = await updateRoundStatus(userData.token, roundId, newStatus);
      if (newStatus === "F") {
        setShowFinalScore(roundId);
        setScoreBoardOpen(true);
      }
      console.log("Status updated successfully:", response);
    } catch (error) {
      console.error("Error updating status and date:", error);
    }
  };

  const processRounds = (rounds, today) => {
    return rounds.map((round, index) => {
      const startDate = new Date(round.startDate);
      const timeDifference = startDate - today;
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      const endDate = calculateEndDate(startDate, parseInt(round.level, 10));
      const endTimeDifference = Math.ceil((endDate - today) / (1000 * 3600 * 24));

      if (endTimeDifference <= 0 && round.status === "A" && round.status !== "F" && round.status !== "C") {
        updateStatusAndDate(round._id, "F");
      } else if (daysDifference <= 0 && endTimeDifference > 0 && round.status !== "A") {
        const activeFriend = round.roundFriends.filter(
          (item) => item.id !== round.userId && item.status === "A"
        ).length;
        if (activeFriend === 0) setShowRoundFriendValidation(true);
        updateStatusAndDate(round._id, "A");
      }

      const prefix = timeDifference > 0 ? "D-" : "D+";
      const formattedDifference = `${prefix}${Math.abs(daysDifference)} days`;
      return { round, index, startDate, formattedDifference };
    });
  };

  return (
    <NativeBaseProvider>
      <Background />
      <Flex direction="column" alignItems="center">
        <OptionMenu navigation={navigation} />
        <Pressable onPress={handleAvatarPress}>
          <Box py="5" px="2" alignItems="center" justifyContent="center">
            {userData.avatar && userData.avatar.uri ? (
              <Avatar bg="white" mb="1" size="md" source={{ uri: userData.avatar.uri }} />
            ) : (
              <Avatar bg="white" mb="1" size="md" borderWidth={2}>
                <AntDesign name="user" size={30} color="black" />
              </Avatar>
            )}
            <Text fontFamily="Regular" fontSize="lg">{userData.data.nickname}</Text>
          </Box>
        </Pressable>
        {processedRounds.map(({ round, index, startDate, formattedDifference }) => {
          const today = new Date();
          const start = new Date(startDate);
          const level = parseInt(round.level, 10) || 1;
          const daysElapsed = Math.max(0, Math.min(Math.floor((today - start) / (1000 * 60 * 60 * 24)), level));
          const progress = daysElapsed / level;

          // Determine if this is an active round
          const isActive = round.status === "A";

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleRoundPress(round._id, round.status, round.startDate, round.level)}
              style={{
                width: isActive ? 120 : "80%", // Circular for active, rectangular for others
                height: 120,
                marginTop: 20,
                borderRadius: isActive ? 60 : 20, // Circular shape for active
                borderWidth: 1,
                borderColor: "#49a579",
                backgroundColor: isActive
                  ? "transparent" // Transparent background for active
                  : round.status === "P"
                  ? "#606060"
                  : round.status === "R"
                  ? "#6666ff"
                  : round.status === "F"
                  ? "rgba(0,0,0,0.4)"
                  : "rgba(250,250,250,0.2)",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: isActive ? 0 : 100,
                paddingRight: isActive ? 0 : 10,
              }}
              activeOpacity={0.7}
            >
              {isActive ? (
                // Circular progress ring for active rounds
                <>
                  <Svg
                    height="120"
                    width="120"
                    style={{ position: "absolute" }}
                  >
                    {/* Background circle (gray ring) */}
                    <Circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#606060"
                      strokeWidth="10"
                      fill="none"
                    />
                    {/* Progress circle (green ring) */}
                    <Circle
                      cx="60"
                      cy="60"
                      r="50"
                      stroke="#49a579"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${progress * 314} 314`} // 314 is the circumference (2 * π * 50)
                      strokeDashoffset="0"
                      transform="rotate(-90, 60, 60)" // Start from the top
                    />
                  </Svg>
                  <VStack alignItems="center" justifyContent="center">
                    <Text
                      style={{
                        color: "#191919",
                        fontFamily: "Regular Semi Bold",
                        fontSize: 16,
                        textAlign: "center",
                      }}
                    >
                      {round?.name}
                    </Text>
                    <Text
                      style={{
                        color: "#191919",
                        fontFamily: "Regular Semi Bold",
                        fontSize: 14,
                        textAlign: "center",
                      }}
                    >
                      Day {daysElapsed}
                    </Text>
                  </VStack>
                </>
              ) : (
                // Existing rectangular style for non-active rounds
                <>
                  <View
                    style={{
                      position: "absolute",
                      left: 10,
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      left: 10,
                      width: 80,
                      height: 80,
                      borderRadius: 40,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        position: "absolute",
                        bottom: 0,
                        width: "100%",
                        height: `${progress * 100}%`,
                        backgroundColor: "rgba(255, 255, 255, 0.5)",
                      }}
                    />
                  </View>
                  <VStack flex={1} alignItems="center">
                    <Text
                      style={{
                        color: "#FFFFFF",
                        fontFamily: "Regular Semi Bold",
                        fontSize: 20,
                        textAlign: "center",
                      }}
                    >
                      {round?.name} (Rounded)
                    </Text>
                    {(round.status === "P" || round.status === "R") && (
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontFamily: "Regular Semi Bold",
                          fontSize: 15,
                          textAlign: "center",
                        }}
                      >
                        {formattedDifference} (
                        {start.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })})
                      </Text>
                    )}
                    {round.status === "A" && (
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontFamily: "Regular Semi Bold",
                          fontSize: 15,
                          textAlign: "center",
                        }}
                      >
                        {daysElapsed} / {level} days
                      </Text>
                    )}
                  </VStack>
                </>
              )}
            </TouchableOpacity>
          );
        })}

        {(!acceptRoundData ||
          acceptRoundData?.data.filter((item) => item.status === "A" || item.status === "P").length < 2) && (
          <Button
            onPress={startRound}
            rounded="30"
            mt="5"
            width="80%"
            size="lg"
            style={{ borderWidth: 1, borderColor: "#49a579" }}
            backgroundColor="rgba(250,250,250,0.2)"
            _text={{ color: "#191919", fontFamily: "Regular Semi Bold", fontSize: "lg" }}
            _pressed={{ bg: "#e5f5e5" }}
          >
            {acceptRoundData?.data.filter((item) => item.status === "A" || item.status === "P").length === 1
              ? "Plan the next round"
              : "Start a round"}
          </Button>
        )}
      </Flex>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.button, { position: "absolute", top: height - 420, left: width / 2 - 175 }]}
      >
        {isOpened ? (
          <SvgXml xml={RoundInvitationNewMessage} opacity="0.5" width={350} height={350} />
        ) : (
          <SvgXml
            xml={pendingReceived.length > 0 ? RoundInvitationBefore : RoundInvitationAfter}
            opacity={pendingReceived.length > 0 ? 1 : 0.8}
            width={350}
            height={350}
          />
        )}
      </TouchableOpacity>

      <Modal isOpen={isOpened} onClose={handleClose}>
        <Modal.Content maxWidth="400px" width="90%">
          <Modal.CloseButton />
          <Modal.Header>Round Invitations</Modal.Header>
          <Modal.Body>
            {filteredUsers.filtered.length > 0 ? (
              <Box w="95%">
                {filteredUsers.filtered.map((item, index) => (
                  <HStack
                    w="100%"
                    alignItems="center"
                    justifyContent="space-between"
                    m={1}
                    key={index}
                  >
                    <HStack alignItems="center" space={6} p={2}>
                      {item.avatar ? (
                        <Avatar bg="white" mb="1" size="md" source={{ uri: item.avatar }} />
                      ) : (
                        <SvgXml xml={Decline} width={30} height={30} />
                      )}
                      <VStack>
                        <Text fontSize="lg" fontWeight="bold">{item.nickname}</Text>
                        <Text fontSize="sm" color="gray.500">@{item.username}</Text>
                      </VStack>
                    </HStack>
                    <HStack space="3">
                      <Pressable onPress={openRoundInvitationInfo}>
                        <SvgXml xml={infoSVG} width={30} height={30} />
                      </Pressable>
                      <Modal isOpen={showRoundDetails} onClose={handleRoundInfoClose}>
                        <Modal.Content maxWidth="400px">
                          <Modal.CloseButton />
                          <Modal.Body style={{ marginHorizontal: 10, marginVertical: 20 }}>
                            {filteredUsers.filteredRound[index] && filteredUsers.filteredRound[index].data && (
                              <>
                                <Text fontSize="md">Round name: {filteredUsers.filteredRound[index].data[0]?.name}</Text>
                                <Text fontSize="md">
                                  Start date: {new Date(filteredUsers.filteredRound[index].data[0]?.startDate).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </Text>
                                <Text fontSize="md">Level: {filteredUsers.filteredRound[index].data[0]?.level}</Text>
                                <Text fontSize="md">Maximum capacity: {filteredUsers.filteredRound[index].data[0]?.maximum}</Text>
                              </>
                            )}
                          </Modal.Body>
                        </Modal.Content>
                      </Modal>
                      <Modal isOpen={showRoundValidation} onClose={handleRoundValidationClose}>
                        <Modal.Content maxWidth="400px">
                          <Modal.CloseButton />
                          <Modal.Header>Warning</Modal.Header>
                          <Modal.Body>
                            <Text fontSize="md">You already have two active rounds. Unable to accept another.</Text>
                          </Modal.Body>
                        </Modal.Content>
                      </Modal>
                      <Modal isOpen={showRoundValidationDate} onClose={handleRoundValidationDateClose}>
                        <Modal.Content maxWidth="400px">
                          <Modal.CloseButton />
                          <Modal.Header>Warning</Modal.Header>
                          <Modal.Body>
                            <Text fontSize="md">You cannot join a round that overlaps with your current active round.</Text>
                          </Modal.Body>
                        </Modal.Content>
                      </Modal>
                      <TouchableOpacity onPress={() => acceptRoundFriend(index, filteredUsers.filteredRound[index])}>
                        <SvgXml xml={ReadAllNoti} width={30} height={30} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => rejectRoundFriend(index)}>
                        <SvgXml xml={Decline} width={30} height={30} />
                      </TouchableOpacity>
                    </HStack>
                  </HStack>
                ))}
              </Box>
            ) : (
              <Text marginTop="25%" fontFamily="Regular" fontSize="lg" textAlign="center" marginBottom="25%">
                No round invitation yet :)
              </Text>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal>
      {showFinalScore && (
        <ScoreBoardModal scoreBoardOpen={scoreBoardOpen} handleClose={handleClose} roundId={showFinalScore} />
      )}
      <Modal isOpen={show10PerRoundValidation} onClose={handle10PerRoundValidationClose}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Warning</Modal.Header>
          <Modal.Body>
            <Text fontSize="md">The round is already 10% complete. You are no longer allowed to join.</Text>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={showRoundFriendValidation} onClose={handleCloseRoundFriendValidation}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Warning</Modal.Header>
          <Modal.Body>
            <Text fontSize="md">
              Your friend has not accepted the invitation yet. Remind them to keep the round active or it may be deleted.
            </Text>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal isOpen={showRoundCompleteValidation} onClose={handleCloseRoundCompleteValidation}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Warning</Modal.Header>
          <Modal.Body>
            <Text fontSize="md">This round has already been completed.</Text>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  envelopeContainer: { alignItems: "center" },
  modalContent: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white", padding: 20, borderRadius: 10 },
  background: { flex: 1, width: "100%", justifyContent: "center", height: "100%" },
  topThreeContainer: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  placementContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(102, 102, 255)",
    fontSize: 20,
    paddingHorizontal: "10%",
    paddingVertical: "8%",
    borderRadius: 10,
  },
  stageContainer: { flex: 1, alignItems: "center", backgroundColor: "rgba(205, 200, 200, 0.2)", paddingVertical: 20 },
  stage: { width: 110, height: 110, justifyContent: "center", alignItems: "center", borderRadius: 60, fontSize: 16 },
  firstPlace: { backgroundColor: "rgba(255, 215, 0, 0.2)" },
  secondPlace: { backgroundColor: "rgba(192, 192, 192,0.2)" },
  thirdPlace: { backgroundColor: "rgba(205, 127, 50,0.2)" },
  restPlcae: { backgroundColor: "rgba(73, 165, 121,0.2)" },
  rankText: { fontWeight: "bold", fontSize: 16 },
  listContainer: { marginVertical: 20, height: "70%", borderRadius: 10, flex: 1, backgroundColor: "rgba(200, 200, 200, 0.2)" },
  playerItem: {
    borderRadius: 10,
    backgroundColor: "rgba(147, 216, 197, 0.5)",
    fontSize: 20,
    flexDirection: "row",
    paddingHorizontal: "10%",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 5,
    paddingVertical: 15,
  },
});

export default HomeScreen;