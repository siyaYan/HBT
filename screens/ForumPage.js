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
} from "native-base";
import { AntDesign } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import React, { useRef } from "react";
import { useData } from "../context/DataContext";
import { Card, WhiteSpace, WingBlank } from "@ant-design/react-native";
import Background from "../components/Background";
import { Pressable } from "react-native";
import { getForum } from "../components/Endpoint";
const ForumPage = ({ navigation }) => {
  const { userData, updateUserData } = useData();
  //TODO: getRoundId
  const id = "666ce364a375a4a199633315";
  useEffect(() => {
    const fetchForumMessages = async () => {
      await getForumMessages();
    };
    fetchForumMessages();
  }, [userData]);
  // let post=[]
  const [post, setPosts] = useState([]);
  const [react, setReact] = useState({});
  const getForumMessages = async () => {
    const res = await getForum(id, userData.token);
    if (res.status === "success") {
      const newPosts = res.data.map((item, index) =>
        generateItem(item, res.user[index])
      );
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      console.log(newPosts);
    }
    // console.log(res.data[0])
    // console.log(res.user[0])
  };
  const generateItem = (data, user) => {
    const postItem = {
      id: data._id,
      userId: data.userId,
      image: data.image,
      text: data.text,
      likes: data.react.length,
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
  // const handleLike = (id) => {

  // }
  return (
    <Center w="100%">
      <Background />
      <Box height={"100%"} width={"100%"} alignItems={"center"}>
        <View w="90%">
          <ScrollView w={"100%"} h="100%">
            {post.length > 0 ? (
              post.map((item, index) => (
                <WingBlank size="lg" key={index}>
                  <Card
                    style={{
                      marginVertical: 10,
                      backgroundColor:
                        item.userId == userData.data._id
                          ? "#6666ff"
                          : "#f9f8f2",
                    }}
                  >
                    <Card.Body style={{ flexDirection: "row", padding: 10 }}>
                      <Card width="35%">
                        <View>
                          <AspectRatio w="100%" ratio={5 / 7}>
                            <View paddingY={10} alignItems={"center"}>
                              <Avatar
                                bg="pink.600"
                                alignSelf="center"
                                size="xl"
                                source={{
                                  uri: item.profileImageUrl,
                                }}
                              ></Avatar>
                              <Pressable>
                                <Text>{item.nickname}</Text>
                              </Pressable>
                            </View>
                          </AspectRatio>
                        </View>
                      </Card>
                      <Card width="65%">
                      <View style={{ height: '35%' }}>
                          {/* <Text style={{ marginLeft: 16 }}>tttttt</Text>
                           */}
                          <Image
                            source={{
                              uri: item.image,
                            }}
                            style={{
                              zIndex:10,
                              width: "50%",
                              height: "50%",
                              marginTop:50,
                              
                              alignSelf: "center"
                            }}
                            alt="Alternate Text"
                            resizeMode="cover"
                          />
                        </View>
                        <Badge
                          mt={-6}
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
                      onPress={console.log("eeee")}
                      name="heart"
                      size={24}
                      color="red"
                    />
                  </Badge>
                </WingBlank>
              ))
            ) : (
              <Text>No Post</Text>
            )}
          </ScrollView>
        </View>
      </Box>
    </Center>
  );
};

export default ForumPage;
