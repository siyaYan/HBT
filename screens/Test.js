import React from "react";
import { Button, Actionsheet, useDisclose, Icon, Box, Text, Center, NativeBaseProvider } from "native-base";
import { Path } from "react-native-svg";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const Test = ({ navigation }) =>{
  const {
    isOpen,
    onOpen,
    onClose
  } = useDisclose();
  return (
    <NativeBaseProvider>
      <Center>
        <Button onPress={onOpen}>Actionsheet</Button>
        <Actionsheet isOpen={isOpen} onClose={onClose} size="full">
          <Actionsheet.Content>
            <Box w="100%" h={60} px={4} justifyContent="center">
              <Text fontSize="16" color="gray.500" _dark={{
                color: "gray.300"
              }}>
                {/* Albums */}
              </Text>
            </Box>
            <Actionsheet.Item startIcon={<Icon as={MaterialIcons} size="6" name="delete" />}>
              {/* Delete */}
            </Actionsheet.Item>
            <Actionsheet.Item startIcon={<Icon as={MaterialIcons} name="share" size="6" />}>
              {/* Share */}
            </Actionsheet.Item>
            <Actionsheet.Item startIcon={<Icon as={Ionicons} name="play-circle" size="6" />}>
              {/* Play */}
            </Actionsheet.Item>
            <Actionsheet.Item startIcon={<Icon as={MaterialIcons} size="6" name="favorite" />}>
              {/* Favourite */}
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
      </Center>;
    </NativeBaseProvider>
  )
}
export default Test;
