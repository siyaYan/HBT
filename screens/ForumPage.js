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
  ScrollView,
  Modal
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import React, { useRef } from "react";
import { useData } from "../context/DataContext";
import { Card, WhiteSpace, WingBlank } from "@ant-design/react-native";
import Background from "../components/Background";
import { Pressable } from "react-native";
import {
  getForum,
  likeMessage,
  cancelLike,
  deleteMessage,
} from "../components/Endpoint";
const ForumPage = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  const { roundData, updateRoundData } = useState({
    roundId: "667f56c8829aba44891d7615",
    messageId: "",
  });
  const id = "667f56c8829aba44891d7615";
  const roundFriends= 
    {
      id: "66400d74143e6d92f7ba6260",
      nickname: "Linda1234!",
      username: "Linda1234",
      habit: "my habit 1",
      status: "A"
    };
  //TODO: getRoundId
  useEffect(() => {
    const fetchForumMessages = async () => {
      await getForumMessages();
    };
    fetchForumMessages();
  }, [userData]);
  // let post=[]
  const [post, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const getForumMessages = async () => {
    const res = await getForum(id, userData.token);
    if (res.status === "success") {
      const newPosts = res.data.map((item, index) =>
        generateItem(item, res.user[index])
      );
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      console.log(newPosts, "______________");
    }
    // console.log(res.data[0])
    // console.log(res.user[0])
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
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.id!== messageId)
    );
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

  return (
    <Center w="100%">
      <Background />
      <Box height={"100%"} width={"100%"} alignItems={"center"}>
        <ScrollView w={"90%"} h={"100%"} contentInset={{ bottom: 200 }}>
          {post.length > 0 ? (
            post.map((item, index) => (
              <View key={index} >
              <WingBlank  >
                <Card
                  style={{
                    marginVertical:10,
                    backgroundColor:
                      item.userId == userData.data._id ? "#6666ff" : "#f9f8f2",
                  }}
                >
                  <Card.Body style={{ flexDirection: "row", padding: 8 }}>
                    <Card width="35%">
                      <View>
                        <AspectRatio w="100%" ratio={5 / 7}>
                          <View paddingY={5} alignItems={"center"}>
                            <Pressable onPress={() => setShowModal(true)}>
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
                      <Badge
                        mt={-12}
                        mr={0}
                        zIndex={999}
                        variant="subtle"
                        alignSelf="flex-end"
                        _text={{
                          fontSize: 14,
                        }}
                      >
                        <Text>{item.date}</Text>
                      </Badge>
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
              <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>User Info</Modal.Header>
                    <Modal.Body>
                        <Text>Habit:{roundFriends.habit}</Text>
                        <Text>Score:</Text>
                    </Modal.Body>
                </Modal.Content>
          </Modal>
              </View>       
            ))
          ) : (
            <Text>No Post</Text>
          )}
        </ScrollView>

      </Box>
    </Center>
  );
};

export default ForumPage;
