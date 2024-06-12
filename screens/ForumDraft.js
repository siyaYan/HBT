import { Icon, Box, View, Text, Center, Image } from "native-base";
import { TextareaItem, Button } from "@ant-design/react-native";

import { useState, useEffect } from "react";
import React, { useRef } from "react";
import Background from "../components/Background";

const ForumDraft = ({ navigation, route }) => {
  const { res } = route.params;
  useEffect(() => {
    console.log(res, "---------------");
  }, []);
  return (
    <Center w="100%">
      <Background />
      <Box height={"100%"} width={"100%"} alignItems={"center"}>
        <View
          style={{
            height: "40%",
          }}
        >
          <Image
            
            source={{
              uri: res,
            }}
            alt="Alternate Text"
            size="xl"
          />
        </View>
        <View w="85%">
          <TextareaItem
            clear={true}
            style={{ fontFamily: "Bold" }}
            rows={10}
            placeholder="Input yout text."
            count={200}
          />
          {/* <Button></Button> */}
          <Button type="primary">default</Button>
        </View>
      </Box>
    </Center>
  );
};

export default ForumDraft;
