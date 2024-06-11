import { Icon, Box, Text ,Center} from "native-base";

import { useState, useEffect } from "react";
import React, { useRef } from "react";
import Background from "../components/Background";

const ForumDraft = ({ navigation, route}) => {
  const { result } = route.params;
  useEffect(() => {
    console.log(result,"---------------")
  }, []);
  return (
    <Center w="100%">
    <Background />
    <Text>1111</Text>
    </Center>

  );
};

export default ForumDraft;
