import {
  Center,
  Box,
  Text,
  View,
  AspectRatio,
  Image,
  Avatar,
  Badge,
  Button,
  Modal,
  Icon,
} from "native-base";
import { Fab, useDisclose } from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import React, { useRef } from "react";
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";
import { Card, WhiteSpace, WingBlank } from "@ant-design/react-native";
import Background from "../components/Background";
import { Pressable, StyleSheet, ScrollView } from "react-native";
import {
  getForum,
  likeMessage,
  cancelLike,
  deleteMessage,
} from "../components/Endpoint";
import AddImage from "../components/AddImage";

const ForumPage = ({ route, navigation }) => {
  const { userData } = useData();
  const { activeRoundData } = useRound();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclose();
  const { id } = route.params;
  const roundFriends = activeRoundData?.data.filter((item) => (item._id = id))[0]
    .roundFriends;
  const scrollViewRef = useRef(null);
  useEffect(() => {
    const fetchForumMessages = async () => {
      await getForumMessages();
    };
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
        post.id === messageId ? { ...post, like: !post.like } : post
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
      date: formatDate(data.updatedAt),
      nickname: user.nickname,
      profileImageUrl: user.profileImageUrl,
    };
    return postItem;
    // setPosts(...post, postItem)
  };

  const formatDate = (timestamp) => {
    // console.log(timestamp)
    const date = new Date(timestamp);
    const formattedDate = date.toISOString().split("T")[0];
    const formattedTime = date.toISOString().split("T")[1].substring(0, 8);
    const result = `${formattedDate} ${formattedTime}`;
    // console.log(result)
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
          <ScrollView
            ref={scrollViewRef}
            w={"100%"}
            h={"100%"}
            contentContainerStyle={{ flexGrow: 1 }}
            onContentSizeChange={handleContentSizeChange}
          >
            {post.length > 0 ? (
              post.map((item, index) => (
                <View
                  key={index}
                  style={{ flex: 1, marginVertical: 15, marginHorizontal: 10 }}
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
                                  onPress={() => handleModal(item.userId)}
                                >
                                  <Avatar
                                    bg="pink.600"
                                    alignSelf="center"
                                    size="xl"
                                    source={{
                                      uri: item.profileImageUrl,
                                    }}
                                  ></Avatar>
                                  <Text style={{ textAlign: "center" }}>
                                    {item.nickname}
                                  </Text>
                                </Pressable>
                              </View>
                            </AspectRatio>
                          </View>
                        </Card>
                        <Card width="65%">
                          <View style={{ alignSelf: "center", height: "30%" }}>
                            <Image
                              source={{
                                uri: item.image,
                              }}
                              style={{
                                width: "100%", // or any specific width
                                height: undefined,
                                aspectRatio: 1.3, // adjust this value to match the aspect ratio of your image
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
                          <Text
                            style={{
                              color:
                                item.userId == userData.data._id
                                  ? "#f9f8f2"
                                  : "#191919",
                            }}
                          >
                            {item.text}
                          </Text>
                        }
                      />
                    </Card>
                    <Badge
                      colorScheme="danger"
                      rounded="full"
                      mt={-5}
                      mr={-2}
                      zIndex={2}
                      variant="outline"
                      alignSelf="flex-end"
                      _text={{
                        fontSize: 24,
                      }}
                    >
                      <AntDesign
                        style={{ display: "flex", alignSelf: "flex-end" }}
                        onPress={() => {
                          handleLikeMessage(item.id, item.like);
                        }}
                        name="heart"
                        size={24}
                        color={item.like ? "red" : "lightgray"}
                      />
                    </Badge>
                    <Badge
                      colorScheme="danger"
                      rounded="full"
                      mt={-7}
                      mr={12}
                      zIndex={5}
                      alignSelf="flex-end"
                      _text={{
                        fontSize: 24,
                      }}
                    >
                      <AntDesign
                        style={{ display: "flex", alignSelf: "flex-end" }}
                        onPress={() => handleDeleteMessage(item.id)}
                        name="delete"
                        size={24}
                        color="red"
                      />
                    </Badge>
                  </WingBlank>
                </View>
              ))
            ) : (
              <Text>No Post</Text>
            )}
          </ScrollView>
        </View>
        {!isModalVisible &&
          (activeRoundData?.data.filter(
            (item) => item._id == id && item.status == "A"
          ).length > 0 ? (
            <Fab
              onPress={() => handleUpload()}
              m={6}
              bg={"#6666ff"}
              size="75"
              icon={<Icon color="white" size={35} as={AntDesign} name="plus" />}
            />
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
