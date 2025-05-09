import { Box, View, Center, Image, Button } from "native-base";
import { TextArea } from "native-base";
import { useState, useEffect } from "react";
import React from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import Background from "../components/Background";
import { addPost } from "../components/Endpoint";
import { useData } from "../context/DataContext";
import { useRound } from "../context/RoundContext";
// import ForumPage from "../screens/ForumPage";

const ForumDraft = ({ navigation, route }) => {
  const { res } = route.params;
  const { userData } = useData();
  const { acceptRoundData } = useRound();
  const [post, setPost] = useState({ image: route.params.res, text: "" });
  useEffect(() => {
    console.log(res, "add new post");
  }, []);
  const handlePost = async () => {
    setPost({ ...post, image: res });
    const activeRound = acceptRoundData?.data.filter(
      (item) => item.status === "A"
    )[0];
    // console.log(activeRound)
    //get RoundId
    const id = activeRound._id;
    const res = await addPost(id, post, userData.token);

    if (res.status == "success") {
      navigation.navigate("ForumStack", {
        screen: "ForumPage",
        params: { id: id },
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Center w="100%">
        <Background />
        <Box height={"100%"} width={"100%"} alignItems={"center"}>
          <View w="85%" h={"32%"} marginTop={"10%"} alignItems={"center"}>
            <Image
              borderRadius={10}
              source={{
                uri: res.uri,
              }}
              alt="Alternate Text"
              width={"100%"}
              height={"100%"}
              resizeMode="cover"
            />
          </View>
          <View w="85%" h={"48%"} margin={"10%"}>
            <TextArea
              value={post.text}
              onChangeText={(value) => {
                setPost({ ...post, text: value });
              }}
              borderRadius={10}
              clearButtonMode="while-editing"
              style={{
                lineHeight: 25,
                fontSize: 20,
                fontFamily: "Regular Medium",
              }}
              numberOfLines={10}
              placeholder="Input your text."
              maxLength={150}
            />
            <Button
              onPress={handlePost}
              mt="15%"
              width="100%"
              size="lg"
              bg="#49a579"
              _text={{
                color: "#f9f8f2",
                fontFamily: "Regular Medium",
                fontSize: "lg",
              }}
              _pressed={{
                // below props will only be applied on button is pressed
                bg: "emerald.600",
                _text: {
                  color: "warmGray.50",
                },
              }}
            >
              Post
            </Button>
          </View>
        </Box>
      </Center>
    </TouchableWithoutFeedback>
  );
};

export default ForumDraft;
