import {
  Center,
  Box,
  Text,
  View,
  AspectRatio,
  Image,
  Avatar,
  Badge,
  Modal,
  HStack,
  Icon,
} from "native-base";
import DraggableFAB from "../components/DraggableFAB";
import { SvgXml } from "react-native-svg"; // Import SvgXml to use custom SVGs

import { Fab, useDisclose } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import React, { useRef } from "react";
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";
import { Card, WingBlank } from "@ant-design/react-native";
import Background from "../components/Background";
import { Pressable, StyleSheet, ScrollView } from "react-native";
import {
  getForum,
  likeMessage,
  cancelLike,
  deleteMessage,
} from "../components/Endpoint";
import AddImage from "../components/AddImage";
import { useIsFocused } from "@react-navigation/native";
import ScoreBoardModal from "../components/ScoreBoard";

const ForumPage = ({ route, navigation }) => {
  const { userData } = useData();
  const { acceptRoundData, roundData } = useRound();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclose();
  const { id } = route.params;
  const [roundFriends, setRoundFriends] = useState(
    roundData?.data.filter((item) => item._id == id)[0]?.roundFriends
  );
  const scrollViewRef = useRef(null);
  const isFocused = useIsFocused();
  const roundActive =
    acceptRoundData?.data.filter((item) => item._id == id && item.status == "A")
      .length > 0
      ? true
      : false;

  const roundFinished = acceptRoundData?.data.filter(
    (item) => item._id == id && item.status == "F"
  )?.[0]?._id;

  const [scoreBoardOpen, setScoreBoardOpen] = useState(
    roundFinished ? true : false
  );

  useEffect(() => {
    const fetchForumMessages = async () => {
      await getForumMessages();
    };
    setRoundFriends(
      roundData?.data.filter((item) => item._id == id)[0]?.roundFriends
    );
    fetchForumMessages();
  }, [route.params]);

  const [post, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [habit, setHabit] = useState();
  const [score, setScore] = useState();
  const [contentHeight, setContentHeight] = useState(0);

  const getForumMessages = async () => {
    const res = await getForum(id, userData.token);
    if (res.status === "success") {
      const newPosts = res.data.map((item, index) =>
        generateItem(item, res.user[index])
      );
      setPosts(newPosts);
      // console.log(newPosts);
    }
  };
  const handleLikeMessage = async (messageId, like) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === messageId
          ? { ...post, like: !post.like, likes: (post.likes += like ? -1 : 1) }
          : post
      )
    );
    if (like) {
      const res = await cancelLike(id, messageId, userData.token);
      if (res.status === "success") {
        console.log(res);
      }
    } else {
      const res = await likeMessage(id, messageId, userData.token);
      if (res.status === "success") {
        console.log(res);
      }
    }
  };
  const handleDeleteMessage = async (messageId) => {
    const res = await deleteMessage(id, messageId, userData.token);
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== messageId));
  };
  const generateItem = (data, user) => {
    const postItem = {
      id: data._id,
      userId: data.userId,
      image: data.image,
      text: data.text,
      like: data.react.includes(userData.data._id),
      likes: data.react.length,
      date: formatDate(data.updatedAt),
      nickname: user.nickname,
      profileImageUrl: user.profileImageUrl,
    };
    return postItem;
    // setPosts(...post, postItem)
  };
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    // Format the date and time according to the local time zone
    const formattedDate = date.toLocaleDateString(); // Local date
    const formattedTime = date.toLocaleTimeString(); // Local time

    const result = `${formattedDate} ${formattedTime}`;
    return result;
  };

  const handleUpload = () => {
    setIsModalVisible(true);
    onOpen();
    console.log("open", isModalVisible);
  };
  const handleModal = (value) => {
    setShowModal(true);
    const friend = roundFriends.filter((item) => item.id == value)[0];
    console.log(friend);
    setHabit(friend.habit);
    setScore(friend.score);
  };
  const handleUploadClose = () => {
    onClose();
    setIsModalVisible(false);
  };

  const handleContentSizeChange = (width, height) => {
    setContentHeight(height);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: false });
    }
  };

  const handleClose = () => {
    setScoreBoardOpen(false);
    // console.log("isOpened", isOpened);
  };
  return (
    <Center w="100%">
      <Background />
      <Box
        height={"100%"}
        width={"100%"}
        alignItems={"center"}
        justifyContent={"flex-start"}
      >
        <View style={{ flex: 1 }}>
          {isModalVisible && (
            <View style={styles.modalContainer}>
              <AddImage
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={() => handleUploadClose()}
                navigation={navigation}
              />
            </View>
          )}
          <View style={{ flex: 1 }}>
            {isModalVisible && (
              <View style={styles.modalContainer}>
                <AddImage
                  isOpen={isOpen}
                  onOpen={onOpen}
                  onClose={() => handleUploadClose()}
                  navigation={navigation}
                />
              </View>
            )}
            <ScrollView
              ref={scrollViewRef}
              w={"100%"}
              h={"100%"}
              contentContainerStyle={{
                flexGrow: 1, // Ensures the content stretches to fill the screen
              }}
            >
              {post.length > 0 ? (
                post.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      marginVertical: 10, // Consistent gap between rows
                      paddingHorizontal: 10, // Optional: Add uniform horizontal padding
                    }}
                  >
                    <WingBlank>
                      <Badge
                        mb={-7}
                        mr={0}
                        zIndex={10}
                        variant="subtle"
                        alignSelf="flex-end"
                        _text={{
                          fontSize: 14,
                        }}
                      >
                        <Text>{item.date}</Text>
                      </Badge>
                      <Card
                        style={{
                          backgroundColor:
                            item.userId == userData.data._id
                              ? "#6666ff"
                              : "#f9f8f2",
                        }}
                      >
                        <Card.Body style={{ flexDirection: "row", padding: 8 }}>
                          <Card width="35%">
                            <View>
                              <AspectRatio w="100%" ratio={5 / 7}>
                                <View paddingY={5} alignItems={"center"}>
                                  <Pressable
                                    onPress={() =>
                                      roundActive && handleModal(item.userId)
                                    }
                                  >
                                    <Avatar
                                      bg="pink.600"
                                      alignSelf="center"
                                      size="xl"
                                      source={{
                                        uri: item.profileImageUrl,
                                      }}
                                    />
                                    <Text style={{ textAlign: "center" }}>
                                      {item.nickname}
                                    </Text>
                                  </Pressable>
                                </View>
                              </AspectRatio>
                            </View>
                          </Card>
                          <Card width="65%">
                            <View
                              style={{ alignSelf: "center", height: "30%" }}
                            >
                              <Image
                                source={{
                                  uri: item.image,
                                }}
                                style={{
                                  width: "100%",
                                  height: undefined,
                                  aspectRatio: 1.3,
                                }}
                                alt="Alternate Text"
                                resizeMode="cover"
                              />
                            </View>
                          </Card>
                        </Card.Body>
                        <Card.Footer
                          style={{
                            display: "flex",
                            alignItems: "center",
                            paddingVertical: 5,
                            paddingHorizontal: 20,
                          }}
                          content={
                            <View>
                              <Text
                                style={{
                                  color:
                                    item.userId == userData.data._id
                                      ? "#f9f8f2"
                                      : "#191919",
                                }}
                              >
                                {item.text || ""}
                              </Text>
                              <View style={{ height: 5 }} />
                            </View>
                          }
                        />
                      </Card>
                      <Badge
                        colorScheme="danger"
                        rounded="full"
                        mt={-5}
                        mr={5}
                        zIndex={2}
                        variant="outline"
                        alignSelf="flex-end"
                        _text={{
                          fontSize: 24,
                        }}
                        borderColor="transparent"
                        backgroundColor={"#f9f8f2"}
                      >
                        <HStack>
                          <Pressable
                            accessibilityLabel="Like button"
                            onPress={() => {
                              roundActive &&
                                handleLikeMessage(item.id, item.like);
                            }}
                          >
                            <SvgXml
                              xml={Support}
                              width={30}
                              height={30}
                              fill={item.like ? "#FFD700" : "lightgray"}
                            />
                          </Pressable>
                          <Text style={{ fontSize: 16, color: "#191919" }}>
                            {item.likes}
                          </Text>
                        </HStack>
                      </Badge>
                      {item.userId == userData.data._id && (
                        <Badge
                          colorScheme="danger"
                          rounded="full"
                          mt={-7}
                          mr={12}
                          zIndex={5}
                          alignSelf="flex-start"
                          _text={{
                            fontSize: 24,
                          }}
                          backgroundColor={"#f9f8f2"}
                        >
                          <Pressable
                            accessibilityLabel="Delete button"
                            onPress={() =>
                              roundActive && handleDeleteMessage(item.id)
                            }
                          >
                            <SvgXml xml={DeleteIndi} width={30} height={30} />
                          </Pressable>
                        </Badge>
                      )}
                    </WingBlank>
                  </View>
                ))
              ) : (
                <Text>No Post</Text>
              )}
            </ScrollView>
          </View>
        </View>

        {!isModalVisible &&
          (roundActive && isFocused ? (
              <DraggableFAB onUpload={handleUpload} />
          ) : (
            ""
          ))}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="300px">
            <Modal.CloseButton />
            <Modal.Header>User Info</Modal.Header>
            <Modal.Body>
              <Text>Habit:{habit}</Text>
              <Text>Score:{score}</Text>
            </Modal.Body>
          </Modal.Content>
        </Modal>

        {roundFinished && (
          <ScoreBoardModal
            scoreBoardOpen={scoreBoardOpen}
            handleClose={handleClose}
            roundId={roundFinished}
          />
        )}
      </Box>
    </Center>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    zIndex: 2,
    alignItems: "flex-end",
  },
});

export default ForumPage;

const DeleteIndi = `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#000;stroke-width:0px;}</style></defs><path class="cls-1" d="M37.01,15.62c0,3.38,0,6.62,0,9.86,0,4.89,0,9.78,0,14.67,0,2.66-.94,3.61-3.53,3.62-5.77.01-11.54.02-17.31,0-2.14,0-3.26-1.03-3.26-3.06-.03-8.08-.01-16.15,0-24.23,0-.26.06-.52.1-.85h24ZM17.18,29.81c0,2.25,0,4.49,0,6.74,0,1.17.31,2.17,1.67,2.14,1.26-.03,1.57-1,1.57-2.09,0-4.6,0-9.21,0-13.81,0-1.16-.29-2.16-1.68-2.13-1.28.03-1.56.98-1.56,2.08,0,2.36,0,4.71,0,7.07ZM23.38,29.64c0,2.36,0,4.73,0,7.09,0,1.07.36,1.91,1.52,1.96,1.28.05,1.66-.85,1.65-1.98,0-4.67,0-9.35,0-14.02,0-1.11-.3-2.05-1.6-2.03-1.29.01-1.58.95-1.57,2.06.01,2.31,0,4.62,0,6.93ZM32.73,29.65c0-2.35,0-4.71,0-7.06,0-1.06-.34-1.9-1.52-1.94-1.29-.04-1.65.85-1.65,1.97,0,4.71,0,9.42,0,14.13,0,1.05.33,1.92,1.51,1.94,1.26.03,1.66-.83,1.65-1.97-.01-2.35,0-4.71,0-7.06Z"/><path class="cls-1" d="M29.24,9.65c1.26,0,2.56,0,3.87,0q2.62,0,3.15,2.41,2.55.43,2.51,1.96H11.36q-.29-1.51,2.35-1.97c.42-2.35.47-2.4,2.97-2.4,1.31,0,2.62,0,3.49,0,3.02,0,6.05,0,9.07,0ZM26.12,6.91"/><path class="cls-1" d="M24.62,6.22c-1.89,0-3.42,1.53-3.42,3.42h1.56c0-1.03.83-1.86,1.86-1.86s1.86.83,1.86,1.86h1.56c0-1.89-1.53-3.42-3.42-3.42Z"/></svg>`;
const Support = `<?xml version="1.0" encoding="utf-8"?>
<!-- Generator: Adobe Illustrator 28.3.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
<style type="text/css">
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
<path d="M35.4,44.3l-7.19-5.11c-1.51-1.07-3.54-1.05-5.02,0.05l-7.08,5.26c-2.28,1.69-5.4-0.52-4.55-3.23l2.63-8.42
	c0.55-1.77-0.09-3.69-1.6-4.76L5.39,23c-2.32-1.64-1.17-5.29,1.67-5.32l8.82-0.1c1.85-0.02,3.48-1.23,4.03-2.99l2.63-8.42
	c0.85-2.71,4.67-2.75,5.58-0.06l2.82,8.36c0.59,1.75,2.24,2.93,4.09,2.91l8.82-0.1c2.84-0.03,4.06,3.59,1.78,5.28l-7.08,5.26
	c-1.48,1.1-2.09,3.04-1.5,4.79l2.82,8.36C40.78,43.66,37.71,45.94,35.4,44.3z"/>
</svg>`;

const UploadPost = `<?xml version="1.0" encoding="UTF-8"?><svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><style>.cls-1{fill:#000;stroke-width:0px;}</style></defs><path class="cls-1" d="M46.62,31.09c0-5.63-3.58-10.43-8.57-12.28-.52-6.75-6.17-12.08-13.05-12.08s-12.53,5.33-13.05,12.08c-5,1.85-8.57,6.65-8.57,12.28,0,.01,0,.03,0,.04h0v.85c0,1.56,1.27,2.83,2.83,2.83h10.47c1.02,0,1.84-.82,1.84-1.84s-.82-1.84-1.84-1.84H7.06s0-.03,0-.04c0-3.66,2.11-6.84,5.17-8.39,1.08-.55,2.28-.89,3.54-.99-.12-.61-.19-1.23-.19-1.88s.06-1.22.18-1.8c.84-4.33,4.67-7.62,9.24-7.62s8.4,3.28,9.24,7.62c.11.58.18,1.19.18,1.8s-.07,1.27-.19,1.88c1.27.09,2.46.44,3.54.99,3.06,1.56,5.17,4.73,5.17,8.39,0,.01,0,.03,0,.04h-9.62c-1.02,0-1.84.82-1.84,1.84s.82,1.84,1.84,1.84h10.47c1.56,0,2.83-1.27,2.83-2.83v-.85h0s0-.03,0-.04Z"/><path class="cls-1" d="M32.64,27.81c.79-.64.9-1.8.26-2.59l-6.76-8.24c-.36-.44-.9-.69-1.46-.67-.56.01-1.09.28-1.43.73l-6.2,8.24c-.61.81-.45,1.97.36,2.58.33.25.72.37,1.1.37.56,0,1.11-.25,1.47-.73l3.17-4.21v17.2c0,1.02.82,1.84,1.84,1.84s1.84-.82,1.84-1.84v-16.84l3.21,3.92c.64.79,1.8.9,2.59.26Z"/></svg>`;
